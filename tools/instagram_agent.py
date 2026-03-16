#!/usr/bin/env python3
"""
Crafted Horizons — Instagram Deal Post Agent
─────────────────────────────────────────────
Takes a deal in any text format (supplier copy, WhatsApp message, proposal export),
uses Claude to extract the key info and write an engaging Instagram caption,
lets you review and edit, then publishes to Instagram via the Graph API.

Requirements:
    pip install anthropic requests

Environment variables:
    ANTHROPIC_API_KEY   — your Anthropic API key
    IG_ACCESS_TOKEN     — Meta long-lived Page access token
    IG_USER_ID          — your Instagram Business/Creator user ID

Usage:
    python instagram_agent.py                        # paste deal interactively
    python instagram_agent.py --file deal.txt        # read deal from file
    python instagram_agent.py --text "🌴 Mykonos…"  # inline deal text
    python instagram_agent.py --dry-run              # preview only, no publish
"""

import os
import sys
import json
import argparse
import textwrap
import time

try:
    import requests
except ImportError:
    print("Missing dependency: pip install requests")
    sys.exit(1)

try:
    import anthropic
except ImportError:
    print("Missing dependency: pip install anthropic")
    sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
IG_ACCESS_TOKEN   = os.environ.get("IG_ACCESS_TOKEN", "")
IG_USER_ID        = os.environ.get("IG_USER_ID", "")

IG_GRAPH_URL = "https://graph.facebook.com/v19.0"

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


# ─────────────────────────────────────────────────────────────────────────────
# Step 1 — Extract structured deal data from any input format
# ─────────────────────────────────────────────────────────────────────────────

EXTRACT_SYSTEM = """You are a travel deal data extractor for Crafted Horizons, a boutique UK travel agency.
Your job is to parse deal text in any format — supplier emails, WhatsApp messages, social media posts,
proposal exports — and extract the key facts into structured JSON.

Return ONLY valid JSON, no markdown, no explanation."""

EXTRACT_PROMPT = """Extract the deal information from the text below. Return JSON with these fields
(use null for anything not mentioned):

{
  "destination": "city and country",
  "hotel": "hotel name",
  "starRating": 4,
  "boardBasis": "Bed & Breakfast",
  "nights": 7,
  "departures": [
    {"date": "18 Apr 2026", "airport": "Manchester", "totalPriceCouple": 1492, "pricePerPerson": 746},
    {"date": "22 Apr 2026", "airport": "Gatwick", "totalPriceCouple": 1455, "pricePerPerson": 727}
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


def extract_deal(raw_text: str) -> dict:
    print("\n  Extracting deal info with Claude...", end=" ", flush=True)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=EXTRACT_SYSTEM,
        messages=[{"role": "user", "content": EXTRACT_PROMPT + raw_text}],
    )

    text = response.content[0].text.strip()

    # Strip markdown fences if Claude added them
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1].lstrip("json").strip() if len(parts) > 1 else text

    print("done.")
    return json.loads(text)


# ─────────────────────────────────────────────────────────────────────────────
# Step 2 — Generate Instagram caption
# ─────────────────────────────────────────────────────────────────────────────

CAPTION_SYSTEM = """You write Instagram captions for Crafted Horizons, a boutique UK travel agency
run by Aditi, a ABTA-accredited travel advisor. Aditi personally researches every deal.

Voice: warm, personal, trusted-advisor. Never salesy or pushy.
Format rules:
- Start with destination name and a short hook (1 sentence)
- Hotel name + star rating + board basis on the next line
- Nights and departure options (if multiple, list each with airport + price)
- 2–3 bullet points of what's included (use ✓)
- 1–2 destination highlights (use ✨)
- If there's a locally-payable amount, mention it briefly so there are no surprises
- End with: "DM me or drop a comment and I'll get you the details 📩"
- Add a blank line, then 6–8 relevant hashtags

Keep it under 280 words. Use 2–3 emojis max (excluding bullets and hashtags)."""

CAPTION_PROMPT = """Write an Instagram post caption for this deal. Follow the format rules exactly.

Deal data:
"""


def generate_caption(deal: dict) -> str:
    print("  Writing Instagram caption...", end=" ", flush=True)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=700,
        system=CAPTION_SYSTEM,
        messages=[{"role": "user", "content": CAPTION_PROMPT + json.dumps(deal, indent=2)}],
    )

    print("done.")
    return response.content[0].text.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Step 3 — Publish to Instagram
# ─────────────────────────────────────────────────────────────────────────────

def publish_to_instagram(image_url: str, caption: str) -> str:
    """
    Creates a media container, waits for it to be ready, then publishes.
    Returns the published post ID.
    """
    base = f"{IG_GRAPH_URL}/{IG_USER_ID}"
    params = {"access_token": IG_ACCESS_TOKEN}

    # 1. Create media container
    print("  Creating media container...", end=" ", flush=True)
    r = requests.post(f"{base}/media", params=params, json={
        "image_url": image_url,
        "caption": caption,
    })
    if not r.ok:
        raise RuntimeError(f"Instagram API error: {r.status_code} {r.text}")
    container_id = r.json()["id"]
    print(f"done (container: {container_id})")

    # 2. Wait for container status to be FINISHED
    print("  Waiting for media to process...", end=" ", flush=True)
    for _ in range(10):
        time.sleep(2)
        status_r = requests.get(
            f"{IG_GRAPH_URL}/{container_id}",
            params={**params, "fields": "status_code"},
        )
        status = status_r.json().get("status_code", "")
        if status == "FINISHED":
            break
        if status == "ERROR":
            raise RuntimeError("Instagram media container processing failed.")
    print("done.")

    # 3. Publish
    print("  Publishing post...", end=" ", flush=True)
    r = requests.post(f"{base}/media_publish", params=params, json={
        "creation_id": container_id,
    })
    if not r.ok:
        raise RuntimeError(f"Publish error: {r.status_code} {r.text}")
    post_id = r.json()["id"]
    print(f"done (post: {post_id})")

    return post_id


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

DIVIDER = "─" * 58

def hr():
    print(DIVIDER)

def read_multiline_input(prompt: str) -> str:
    print(prompt)
    lines = []
    blank_streak = 0
    while blank_streak < 2:
        line = input()
        if line == "":
            blank_streak += 1
        else:
            blank_streak = 0
        lines.append(line)
    return "\n".join(lines).strip()


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Crafted Horizons — Instagram Deal Post Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--file", metavar="PATH", help="Path to a text file with the deal")
    parser.add_argument("--text", metavar="TEXT", help="Deal text directly as an argument")
    parser.add_argument("--dry-run", action="store_true", help="Preview only — do not publish")
    args = parser.parse_args()

    print()
    hr()
    print("  Crafted Horizons — Instagram Post Agent")
    hr()

    # ── 1. Get raw deal text ──────────────────────────────────────────────────
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            raw_text = f.read()
        print(f"\n  Loaded deal from {args.file}")
    elif args.text:
        raw_text = args.text
    else:
        raw_text = read_multiline_input(
            "\nPaste the deal text below, then press Enter twice:\n"
        )

    if not raw_text.strip():
        print("No deal text provided. Exiting.")
        sys.exit(1)

    # ── 2. Extract structured data ────────────────────────────────────────────
    print()
    try:
        deal = extract_deal(raw_text)
    except (json.JSONDecodeError, KeyError) as e:
        print(f"\nFailed to parse deal data: {e}")
        sys.exit(1)

    print()
    hr()
    print("  Extracted deal")
    hr()
    print(json.dumps(deal, indent=2))

    # Allow editing the extracted data before generating caption
    edit_data = input("\nEdit extracted data? [y/N] → ").strip().lower()
    if edit_data == "y":
        print("Paste updated JSON (blank line x2 to finish):\n")
        raw_json = read_multiline_input("")
        try:
            deal = json.loads(raw_json)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e}. Using original data.")

    # ── 3. Generate caption ───────────────────────────────────────────────────
    print()
    caption = generate_caption(deal)

    # ── 4. Review loop ────────────────────────────────────────────────────────
    while True:
        print()
        hr()
        print("  Draft caption")
        hr()
        print(caption)
        print()

        if args.dry_run:
            print("  [dry-run mode — not publishing]")
            break

        choice = input(
            "  [p] publish   [r] regenerate   [e] edit   [q] quit\n  → "
        ).strip().lower()

        if choice == "q":
            print("\nExiting without publishing.")
            sys.exit(0)

        elif choice == "r":
            print()
            caption = generate_caption(deal)

        elif choice == "e":
            caption = read_multiline_input(
                "\nEdit the caption below (blank line x2 to finish):\n"
            )

        elif choice == "p":
            # Check credentials
            if not IG_ACCESS_TOKEN or not IG_USER_ID:
                print(
                    "\n  IG_ACCESS_TOKEN and IG_USER_ID must be set as environment variables.\n"
                    "  See the setup guide in tools/SETUP.md"
                )
                sys.exit(1)

            print()
            image_url = input(
                "  Image URL (publicly accessible JPG/PNG, min 1080×1080px recommended):\n  → "
            ).strip()

            if not image_url:
                print("  An image URL is required. Try again or press [e] to edit caption.")
                continue

            print()
            hr()
            print("  Publishing to Instagram")
            hr()
            try:
                post_id = publish_to_instagram(image_url, caption)
                print()
                hr()
                print(f"  Published! Post ID: {post_id}")
                print(f"  View at: https://www.instagram.com/craftedhorizons/")
                hr()
            except RuntimeError as e:
                print(f"\n  Error: {e}")
                print("  Check your access token and image URL, then try again.")
            break


if __name__ == "__main__":
    main()
