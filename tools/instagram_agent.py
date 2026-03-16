#!/usr/bin/env python3
"""
Crafted Horizons — Instagram Deal Post Agent
─────────────────────────────────────────────
Takes a deal in any text format (supplier copy, WhatsApp message, proposal export),
uses an AI model of your choice to extract the key info and write an Instagram
caption, lets you review and edit, then publishes via the Instagram Graph API.

Supported AI providers (mirrors the proposal builder selector):
    anthropic   — Claude (Haiku / Sonnet / Opus)
    openai      — GPT-4o / GPT-4o-mini
    groq        — Llama 3.3 70B (fast, generous free tier)
    openrouter  — Any model via openrouter.ai
    ollama      — Local models via Ollama (no key required)

Requirements:
    pip install requests

First-time setup:
    python3 tools/instagram_agent.py --setup

Usage:
    python3 tools/instagram_agent.py                        # paste deal interactively
    python3 tools/instagram_agent.py --file deal.txt        # read deal from a file
    python3 tools/instagram_agent.py --text "🌴 Mykonos…"  # inline deal text
    python3 tools/instagram_agent.py --dry-run              # preview only, no publish
    python3 tools/instagram_agent.py --provider groq        # override saved provider
    python3 tools/instagram_agent.py --model gpt-4o-mini    # override saved model
"""

import os
import sys
import json
import argparse
import time
import pathlib

try:
    import requests
except ImportError:
    print("Missing dependency:  pip install requests")
    sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# Supported providers  (same two as the proposal builder + more)
# ─────────────────────────────────────────────────────────────────────────────

PROVIDERS = {
    "anthropic": {
        "label":         "Anthropic (Claude)",
        "base_url":      "https://api.anthropic.com/v1",
        "default_model": "claude-haiku-4-5-20251001",
        "style":         "anthropic",   # own header format
        "key_hint":      "sk-ant-…",
    },
    "openai": {
        "label":         "OpenAI (GPT)",
        "base_url":      "https://api.openai.com/v1",
        "default_model": "gpt-4o-mini",
        "style":         "openai",
        "key_hint":      "sk-…",
    },
    "groq": {
        "label":         "Groq (Llama — fast, free tier)",
        "base_url":      "https://api.groq.com/openai/v1",
        "default_model": "llama-3.3-70b-versatile",
        "style":         "openai",
        "key_hint":      "gsk_…",
    },
    "openrouter": {
        "label":         "OpenRouter (multi-model)",
        "base_url":      "https://openrouter.ai/api/v1",
        "default_model": "meta-llama/llama-3.3-70b-instruct:free",
        "style":         "openai",
        "key_hint":      "sk-or-…",
    },
    "ollama": {
        "label":         "Ollama (local — no key needed)",
        "base_url":      "http://localhost:11434/v1",
        "default_model": "llama3.2",
        "style":         "openai",
        "no_key":        True,
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# Config file  (~/.craftedhorizons/config.json)
# ─────────────────────────────────────────────────────────────────────────────

CONFIG_DIR  = pathlib.Path.home() / ".craftedhorizons"
CONFIG_FILE = CONFIG_DIR / "config.json"


def load_config() -> dict:
    if CONFIG_FILE.exists():
        try:
            return json.loads(CONFIG_FILE.read_text())
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def save_config(cfg: dict):
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_FILE.write_text(json.dumps(cfg, indent=2))
    CONFIG_FILE.chmod(0o600)   # owner read/write only (contains API keys)


# ─────────────────────────────────────────────────────────────────────────────
# Interactive setup wizard  (python3 instagram_agent.py --setup)
# ─────────────────────────────────────────────────────────────────────────────

def run_setup():
    hr()
    print("  Crafted Horizons — Agent Setup")
    hr()
    print()

    cfg = load_config()

    # ── AI provider ──────────────────────────────────────────────────────────
    print("Choose your AI provider:\n")
    names = list(PROVIDERS.keys())
    for i, key in enumerate(names, 1):
        p = PROVIDERS[key]
        current = " (current)" if cfg.get("provider") == key else ""
        print(f"  {i}. {p['label']}{current}")

    choice = input("\n  Enter number (or press Enter to keep current): ").strip()
    if choice:
        idx = int(choice) - 1
        if 0 <= idx < len(names):
            cfg["provider"] = names[idx]

    provider_key = cfg.get("provider", "anthropic")
    provider     = PROVIDERS[provider_key]

    # ── Model ────────────────────────────────────────────────────────────────
    default_model = provider["default_model"]
    current_model = cfg.get("model", default_model)
    model = input(f"\n  Model [{current_model}]: ").strip()
    cfg["model"] = model if model else current_model

    # ── API key ──────────────────────────────────────────────────────────────
    if not provider.get("no_key"):
        hint = provider["key_hint"]
        existing = "●●●●●●●●" if cfg.get("ai_api_key") else "(none saved)"
        key = input(f"\n  {provider['label']} API key {hint} [{existing}]: ").strip()
        if key:
            cfg["ai_api_key"] = key

    # ── Instagram credentials ────────────────────────────────────────────────
    print("\n  Instagram credentials (leave blank to keep existing):\n")

    existing_token = "●●●●●●●●" if cfg.get("ig_access_token") else "(none)"
    token = input(f"  IG_ACCESS_TOKEN [{existing_token}]: ").strip()
    if token:
        cfg["ig_access_token"] = token

    existing_uid = cfg.get("ig_user_id", "(none)")
    uid = input(f"  IG_USER_ID [{existing_uid}]: ").strip()
    if uid:
        cfg["ig_user_id"] = uid

    save_config(cfg)

    print()
    hr()
    print(f"  Saved to {CONFIG_FILE}")
    print(f"  Provider : {PROVIDERS[cfg['provider']]['label']}")
    print(f"  Model    : {cfg['model']}")
    print(f"  IG user  : {cfg.get('ig_user_id', '(not set)')}")
    hr()
    print()


# ─────────────────────────────────────────────────────────────────────────────
# AI call  (single function, handles all providers)
# ─────────────────────────────────────────────────────────────────────────────

def call_ai(system_prompt: str, user_prompt: str, cfg: dict) -> str:
    provider_key = cfg.get("provider", "anthropic")
    provider     = PROVIDERS[provider_key]
    model        = cfg.get("model", provider["default_model"])
    api_key      = cfg.get("ai_api_key", "")
    base_url     = provider["base_url"]
    style        = provider["style"]

    if style == "anthropic":
        resp = requests.post(
            f"{base_url}/messages",
            headers={
                "content-type":           "application/json",
                "x-api-key":              api_key,
                "anthropic-version":      "2023-06-01",
            },
            json={
                "model":      model,
                "max_tokens": 1024,
                "system":     system_prompt,
                "messages":   [{"role": "user", "content": user_prompt}],
            },
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()["content"][0]["text"]

    else:  # openai-compatible  (openai / groq / openrouter / ollama)
        headers = {"content-type": "application/json"}
        if api_key:
            headers["authorization"] = f"Bearer {api_key}"

        resp = requests.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json={
                "model":      model,
                "max_tokens": 1024,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": user_prompt},
                ],
            },
            timeout=30,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


# ─────────────────────────────────────────────────────────────────────────────
# Step 1 — Extract structured deal data from any input format
# ─────────────────────────────────────────────────────────────────────────────

EXTRACT_SYSTEM = """You are a travel deal data extractor for Crafted Horizons, a boutique UK travel agency.
Parse deal text in any format — supplier emails, WhatsApp messages, social media posts,
proposal exports — and extract key facts into structured JSON.
Return ONLY valid JSON, no markdown, no explanation."""

EXTRACT_PROMPT = """Extract the deal from the text below. Return JSON with these fields
(use null for anything not mentioned):

{
  "destination": "city and country",
  "hotel": "hotel name",
  "starRating": 4,
  "boardBasis": "Bed & Breakfast",
  "nights": 7,
  "departures": [
    {"date": "18 Apr 2026", "airport": "Manchester", "totalPriceCouple": 1492, "pricePerPerson": 746},
    {"date": "22 Apr 2026", "airport": "Gatwick",    "totalPriceCouple": 1455, "pricePerPerson": 727}
  ],
  "includes": ["Flights from the UK", "Baggage", "Transfers"],
  "highlights": ["Relax by the pool", "Explore Mykonos Town"],
  "locallyPayable": 62,
  "supplier": "Olympic Holidays",
  "validityNote": "Prices correct at time of posting 14/03/2026",
  "isLateOffer": true
}

Deal text:
"""


def extract_deal(raw_text: str, cfg: dict) -> dict:
    print("  Extracting deal info...", end=" ", flush=True)
    raw = call_ai(EXTRACT_SYSTEM, EXTRACT_PROMPT + raw_text, cfg)

    # Strip markdown fences if the model added them
    text = raw.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1].lstrip("json").strip() if len(parts) > 1 else text

    # Pull out the first {...} block (some models add explanation after)
    import re
    match = re.search(r"\{[\s\S]+\}", text)
    if match:
        text = match.group()

    print("done.")
    return json.loads(text)


# ─────────────────────────────────────────────────────────────────────────────
# Step 2 — Generate Instagram caption
# ─────────────────────────────────────────────────────────────────────────────

CAPTION_SYSTEM = """You write Instagram captions for Crafted Horizons, a boutique UK travel agency
run by Aditi, an ABTA-accredited travel advisor who personally researches every deal.

Voice: warm, personal, trusted-advisor. Never salesy or pushy.
Format:
- Destination + short hook (1 sentence)
- Hotel name, star rating, board basis
- Nights and departure options (list each with airport + couple price if multiple)
- 2–3 inclusions using ✓
- 1–2 destination highlights using ✨
- Locally-payable note if applicable (no surprises policy)
- End with: "DM me or drop a comment and I'll get you the details 📩"
- Blank line then 6–8 relevant hashtags
Keep under 280 words. Max 2–3 emojis (not counting bullets/hashtags)."""

CAPTION_PROMPT = "Write an Instagram post caption for this deal. Follow the format rules exactly.\n\nDeal data:\n"


def generate_caption(deal: dict, cfg: dict) -> str:
    print("  Writing caption...", end=" ", flush=True)
    caption = call_ai(CAPTION_SYSTEM, CAPTION_PROMPT + json.dumps(deal, indent=2), cfg)
    print("done.")
    return caption.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Step 3 — Publish to Instagram
# ─────────────────────────────────────────────────────────────────────────────

IG_GRAPH_URL = "https://graph.facebook.com/v19.0"


def publish_to_instagram(image_url: str, caption: str, cfg: dict) -> str:
    token   = cfg.get("ig_access_token", "")
    user_id = cfg.get("ig_user_id", "")
    base    = f"{IG_GRAPH_URL}/{user_id}"
    params  = {"access_token": token}

    # 1. Create media container
    print("  Creating media container...", end=" ", flush=True)
    r = requests.post(f"{base}/media", params=params,
                      json={"image_url": image_url, "caption": caption}, timeout=20)
    if not r.ok:
        raise RuntimeError(f"Instagram API {r.status_code}: {r.text}")
    container_id = r.json()["id"]
    print(f"done ({container_id})")

    # 2. Wait for FINISHED status
    print("  Processing media...", end=" ", flush=True)
    for _ in range(12):
        time.sleep(2)
        s = requests.get(f"{IG_GRAPH_URL}/{container_id}",
                         params={**params, "fields": "status_code"}, timeout=10).json()
        if s.get("status_code") == "FINISHED":
            break
        if s.get("status_code") == "ERROR":
            raise RuntimeError("Media container processing failed.")
    print("done.")

    # 3. Publish
    print("  Publishing...", end=" ", flush=True)
    r = requests.post(f"{base}/media_publish", params=params,
                      json={"creation_id": container_id}, timeout=20)
    if not r.ok:
        raise RuntimeError(f"Publish error {r.status_code}: {r.text}")
    post_id = r.json()["id"]
    print(f"done ({post_id})")
    return post_id


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def hr():
    print("─" * 58)


def read_multiline(prompt: str) -> str:
    print(prompt)
    lines, blanks = [], 0
    while blanks < 2:
        line = input()
        blanks = blanks + 1 if line == "" else 0
        lines.append(line)
    return "\n".join(lines).strip()


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Crafted Horizons — Instagram Deal Post Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Run --setup first to configure your AI provider and Instagram credentials.",
    )
    parser.add_argument("--setup",    action="store_true", help="Configure provider, model, and API keys")
    parser.add_argument("--file",     metavar="PATH",      help="Text file containing the deal")
    parser.add_argument("--text",     metavar="TEXT",      help="Deal text as a CLI argument")
    parser.add_argument("--provider", metavar="NAME",      help=f"Override provider ({'/'.join(PROVIDERS)})")
    parser.add_argument("--model",    metavar="NAME",      help="Override model name")
    parser.add_argument("--dry-run",  action="store_true", help="Preview caption only — do not publish")
    args = parser.parse_args()

    if args.setup:
        run_setup()
        return

    # ── Load config, apply CLI overrides ─────────────────────────────────────
    cfg = load_config()

    # Fall back to env vars if config file has no keys (backward compat)
    if not cfg.get("ai_api_key"):
        cfg["ai_api_key"] = os.environ.get("ANTHROPIC_API_KEY", "") \
                         or os.environ.get("OPENAI_API_KEY", "")    \
                         or os.environ.get("GROQ_API_KEY", "")
    if not cfg.get("ig_access_token"):
        cfg["ig_access_token"] = os.environ.get("IG_ACCESS_TOKEN", "")
    if not cfg.get("ig_user_id"):
        cfg["ig_user_id"] = os.environ.get("IG_USER_ID", "")

    if args.provider:
        if args.provider not in PROVIDERS:
            print(f"Unknown provider '{args.provider}'. Choose from: {', '.join(PROVIDERS)}")
            sys.exit(1)
        cfg["provider"] = args.provider
    if args.model:
        cfg["model"] = args.model

    if not cfg.get("provider"):
        cfg["provider"] = "anthropic"

    provider_cfg = PROVIDERS[cfg["provider"]]
    if not cfg.get("model"):
        cfg["model"] = provider_cfg["default_model"]

    # Validate AI key
    if not provider_cfg.get("no_key") and not cfg.get("ai_api_key"):
        print(f"\nNo API key configured for {provider_cfg['label']}.")
        print("Run:  python3 tools/instagram_agent.py --setup\n")
        sys.exit(1)

    # ── Banner ────────────────────────────────────────────────────────────────
    print()
    hr()
    print("  Crafted Horizons — Instagram Post Agent")
    print(f"  AI: {provider_cfg['label']}  /  {cfg['model']}")
    hr()

    # ── Get raw deal text ─────────────────────────────────────────────────────
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            raw_text = f.read()
        print(f"\n  Loaded from {args.file}")
    elif args.text:
        raw_text = args.text
    else:
        raw_text = read_multiline("\nPaste the deal text (press Enter twice when done):\n")

    if not raw_text.strip():
        print("No deal text provided. Exiting.")
        sys.exit(1)

    # ── Extract ───────────────────────────────────────────────────────────────
    print()
    try:
        deal = extract_deal(raw_text, cfg)
    except Exception as e:
        print(f"\nFailed to extract deal: {e}")
        sys.exit(1)

    print()
    hr()
    print("  Extracted deal")
    hr()
    print(json.dumps(deal, indent=2))

    edit = input("\nEdit extracted data before generating caption? [y/N] → ").strip().lower()
    if edit == "y":
        raw_json = read_multiline("\nPaste updated JSON (blank line x2 to finish):\n")
        try:
            deal = json.loads(raw_json)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e} — using original data.")

    # ── Generate caption ──────────────────────────────────────────────────────
    print()
    caption = generate_caption(deal, cfg)

    # ── Review loop ───────────────────────────────────────────────────────────
    while True:
        print()
        hr()
        print("  Draft caption")
        hr()
        print(caption)
        print()

        if args.dry_run:
            print("  [dry-run — not publishing]")
            break

        choice = input("  [p] publish   [r] regenerate   [e] edit   [q] quit\n  → ").strip().lower()

        if choice == "q":
            print("\nExiting without publishing.")
            sys.exit(0)

        elif choice == "r":
            print()
            caption = generate_caption(deal, cfg)

        elif choice == "e":
            caption = read_multiline("\nEdit caption (blank line x2 to finish):\n")

        elif choice == "p":
            if not cfg.get("ig_access_token") or not cfg.get("ig_user_id"):
                print("\n  Instagram credentials not configured.")
                print("  Run:  python3 tools/instagram_agent.py --setup\n")
                continue

            print()
            image_url = input(
                "  Image URL (publicly accessible JPG/PNG, 1080×1080 recommended):\n  → "
            ).strip()

            if not image_url:
                print("  An image URL is required.")
                continue

            print()
            hr()
            print("  Publishing")
            hr()
            try:
                post_id = publish_to_instagram(image_url, caption, cfg)
                print()
                hr()
                print(f"  Published!  Post ID: {post_id}")
                print("  https://www.instagram.com/craftedhorizons/")
                hr()
            except RuntimeError as e:
                print(f"\n  Error: {e}")
                print("  Check your access token, image URL, and try again.")
            break


if __name__ == "__main__":
    main()
