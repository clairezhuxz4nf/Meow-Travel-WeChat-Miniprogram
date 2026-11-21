import { handleAIPlacesRequest } from './ai-places.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/ai/places') return new Response('Not found', { status: 404 });
    return handleAIPlacesRequest(request, {
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL || 'gpt-6-luna',
      allowedOrigin: env.ALLOWED_ORIGIN || ''
    });
  }
};
