# Instagram Agent — Setup Guide

## What it does

1. You paste (or supply) a deal in any format — supplier WhatsApp copy, an email, a proposal export
2. Claude extracts the key facts (destination, hotel, prices, departures, inclusions)
3. Claude writes a polished Instagram caption in your voice
4. You review, regenerate, or edit the caption
5. You provide a photo URL and the agent publishes the post to Instagram

---

## One-time setup

### 1. Install Python dependencies

```bash
pip install requests
```

### 2. Run the setup wizard

```bash
python3 tools/instagram_agent.py --setup
```

This walks you through choosing a provider, model, and saving your API keys to
`~/.craftedhorizons/config.json` (owner-readable only, never committed to git).

Supported providers (same as the proposal builder):

| Provider | Models | Key required |
|---|---|---|
| `anthropic` | claude-haiku / sonnet / opus | Yes — console.anthropic.com |
| `openai` | gpt-4o / gpt-4o-mini | Yes — platform.openai.com |
| `groq` | llama-3.3-70b-versatile | Yes (free tier) — console.groq.com |
| `openrouter` | Any model | Yes — openrouter.ai |
| `ollama` | llama3.2 / mistral / etc. | No — runs locally |

You can also override provider and model per-run without changing your config:

```bash
python3 tools/instagram_agent.py --provider groq --model llama-3.3-70b-versatile
python3 tools/instagram_agent.py --provider openai --model gpt-4o-mini
python3 tools/instagram_agent.py --provider ollama --model llama3.2
```

### 3. Get your Instagram credentials

You need an **Instagram Business or Creator** account linked to a **Facebook Page**.

#### Step A — Create a Meta Developer App

1. Go to https://developers.facebook.com/apps/
2. Click **Create App** → choose **Business** → follow the wizard
3. Add the **Instagram Graph API** product to your app

#### Step B — Generate a long-lived access token

1. In your app, go to **Tools → Graph API Explorer**
2. Select your app and your Facebook Page (not personal account)
3. Generate a **Page Access Token** with these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
4. Copy that short-lived token, then exchange it for a long-lived one (60 days):

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

5. Copy the `access_token` from the response.

#### Step C — Get your Instagram User ID

```bash
curl "https://graph.facebook.com/v19.0/me/accounts?access_token=YOUR_TOKEN"
```

From the result, find your Page ID, then:

```bash
curl "https://graph.facebook.com/v19.0/YOUR_PAGE_ID?fields=instagram_business_account&access_token=YOUR_TOKEN"
```

The `id` inside `instagram_business_account` is your `IG_USER_ID`.

### 4. Set environment variables

Add to your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export IG_ACCESS_TOKEN="EAABsb..."
export IG_USER_ID="17841..."
```

Then reload: `source ~/.zshrc`

---

## Using the agent

```bash
# Interactive — paste deal text when prompted
python tools/instagram_agent.py

# From a text file
python tools/instagram_agent.py --file deal.txt

# Inline text (good for quick tests)
python tools/instagram_agent.py --text "🌴 Mykonos Late Deal..."

# Preview only — generate caption without publishing
python tools/instagram_agent.py --dry-run
```

---

## Image requirements

Instagram requires a **publicly accessible image URL** (not a local file). Options:

- Upload to Google Drive → share publicly → use the direct image link
- Upload to Cloudinary (free tier) → use the Cloudinary URL
- Use any image already on your website (e.g. `https://crafted-horizons.com/img/...`)

Minimum recommended size: **1080 × 1080 px** (square), JPG or PNG.

---

## Workflow tip

1. Receive deal from supplier (WhatsApp, email, etc.)
2. Run `python tools/instagram_agent.py`
3. Paste the raw supplier text
4. Review the extracted data — edit if anything is wrong
5. Review the generated caption — regenerate or tweak as needed
6. Upload your photo to Cloudinary (or wherever), paste the URL
7. Press `p` to publish

The whole flow takes about 2 minutes once set up.

---

## Refreshing your token

Long-lived tokens last 60 days. To refresh:

```bash
curl "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_CURRENT_TOKEN"
```

Update `IG_ACCESS_TOKEN` in your shell profile with the new value.
