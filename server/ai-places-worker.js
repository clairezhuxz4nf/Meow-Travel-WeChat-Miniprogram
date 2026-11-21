import { handleAIPlacesRequest } from './ai-places.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/ai/places') return new Response('Not found', { status: 404 });
    return handleAIPlacesRequest(request, {
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      allowedOrigin: env.ALLOWED_ORIGIN || ''
    });
  }
};
