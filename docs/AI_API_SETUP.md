# AI screenshot recognition

The browser sends a compressed screenshot to a small server-side proxy. The proxy calls OpenAI, returns a structured place list, and the browser verifies every result with OpenStreetMap before it can be added to the trip.

The API key must never be placed in browser JavaScript, a `VITE_` variable, or GitHub.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` in `.env.local`.
3. Run `npm run dev`.

Vite exposes `/api/ai/places` locally and keeps the key on the Node side of the dev server.

## Cloudflare Worker

The deployable Worker is in `server/`.

```sh
cd server
npx wrangler secret put OPENAI_API_KEY
npx wrangler deploy
```

Set `ALLOWED_ORIGIN` in `server/wrangler.toml` to the exact web app origin before deploying. Build the frontend with `VITE_AI_PLACES_ENDPOINT` pointing to the resulting Worker URL.

The model defaults to `gpt-6-luna`; it can be replaced with the `OPENAI_MODEL` environment variable without changing frontend code.

## Why this model

Prices checked against the official provider pages on 2026-11-21:

- OpenAI GPT-6 Luna: $0.10 / 1M input tokens and $0.50 / 1M output tokens.
- Google Gemini 3.5 Flash-Lite: $0.30 / 1M input tokens and $2.50 / 1M output tokens; a free tier is available.
- Anthropic Claude Haiku 4.5: $1 / 1M input tokens and $5 / 1M output tokens.

GPT-6 Luna therefore has the lowest paid token price of the compared image-capable models. Gemini can still be cheaper for a small personal prototype while it remains inside its free-tier quota.

- OpenAI pricing: https://platform.openai.com/docs/pricing
- OpenAI GPT-6 Luna model: https://developers.openai.com/api/docs/models/gpt-6-luna
- Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing
- Anthropic pricing: https://www.anthropic.com/pricing
