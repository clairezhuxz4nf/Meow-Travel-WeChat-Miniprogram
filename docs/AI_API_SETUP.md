# Gemini screenshot recognition

The browser compresses the screenshot before sending it to a small server-side proxy. The proxy calls Gemini 3.5 Flash-Lite and returns a structured place list. The browser then verifies every result with OpenStreetMap before it can be added to the trip.

The Gemini API key must never be placed in browser JavaScript, a `VITE_` variable, or GitHub.

## Create the API key

1. Open [Google AI Studio API Keys](https://aistudio.google.com/api-keys).
2. Sign in and create a Gemini API key in a Google Cloud project.
3. Copy it once and store it as a server-side secret named `GEMINI_API_KEY`.

Gemini 3.5 Flash-Lite has a free tier. Google states that free-tier content may be used to improve its products, so avoid uploading screenshots that contain private chats, booking codes, passport details, or payment information. Paid-tier content is not used for product improvement according to the current pricing page.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `GEMINI_API_KEY` in `.env.local`.
3. Keep `GEMINI_MODEL=gemini-3.5-flash-lite`.
4. Run `npm run dev`.

Vite exposes `/api/ai/places` locally and keeps the key on the Node side of the dev server.

## Cloudflare Worker

The deployable Worker is in `server/`.

```sh
cd server
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

Set `ALLOWED_ORIGIN` in `server/wrangler.toml` to the exact deployed web-app origin before publishing. Build the frontend with `VITE_AI_PLACES_ENDPOINT` pointing to the resulting Worker URL.

The model can be changed later with the server-side `GEMINI_MODEL` environment variable without changing frontend code.

## Cost and privacy

Prices checked against the official Gemini pricing page on 2026-11-21:

- Free tier: input and output are free of charge, subject to rate limits; submitted content may be used to improve Google's products.
- Paid tier: $0.30 / 1M input tokens for text, images, video, or audio; $2.50 / 1M output tokens; submitted content is not used to improve Google's products.

Official references:

- Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite
- Gemini 3.5 Flash-Lite: https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite
- Image understanding: https://ai.google.dev/gemini-api/docs/image-understanding
- Structured output: https://ai.google.dev/gemini-api/docs/structured-output

## Why not an on-device model

An open model can avoid per-request API fees, but it is not operationally free: users must download model weights (often hundreds of megabytes or more), the app must host those files, and inference consumes device memory, storage, and battery. Browser and WeChat WebView compatibility also varies.

For Chinese social-media screenshots, a small on-device vision model is currently less reliable than Gemini and would make the prototype much heavier. The project therefore uses Gemini's free tier for now. On-device inference can be reconsidered later for an installed native app with strict offline or privacy requirements.
