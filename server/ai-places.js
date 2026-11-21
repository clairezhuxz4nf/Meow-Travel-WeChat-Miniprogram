const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const placeSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['places'],
  properties: {
    places: {
      type: 'array',
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'query', 'type', 'note'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 80 },
          query: { type: 'string', minLength: 2, maxLength: 140 },
          type: { type: 'string', enum: ['sight', 'food', 'shopping', 'hotel', 'transport'] },
          note: { type: 'string', maxLength: 120 }
        }
      }
    }
  }
};

function json(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers }
  });
}

function allowedOrigins(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function originIsAllowed(request, allowedOrigin = '') {
  const origin = request.headers.get('origin') || '';
  const allowList = allowedOrigins(allowedOrigin);
  const localOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return !origin || localOrigin || !allowList.length || allowList.includes(origin);
}

function corsHeaders(request, allowedOrigin = '') {
  const origin = request.headers.get('origin') || '';
  const permitted = originIsAllowed(request, allowedOrigin);
  return {
    'access-control-allow-origin': permitted ? (origin || '*') : 'null',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin'
  };
}

function extractAssistantText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map((item) => item?.text || '').join('');
  return '';
}

export async function handleAIPlacesRequest(request, options = {}) {
  const headers = corsHeaders(request, options.allowedOrigin);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, headers);
  if (!originIsAllowed(request, options.allowedOrigin)) return json({ error: 'Origin not allowed' }, 403, headers);
  if (!options.apiKey) return json({ error: 'AI_SERVICE_NOT_CONFIGURED' }, 503, headers);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, headers);
  }

  const imageDataUrl = String(input.imageDataUrl || '');
  if (!/^data:image\/(png|jpeg|webp);base64,/i.test(imageDataUrl)) {
    return json({ error: 'A PNG, JPEG, or WebP image is required' }, 400, headers);
  }
  if (imageDataUrl.length > MAX_IMAGE_BYTES * 1.4) {
    return json({ error: 'Image is too large' }, 413, headers);
  }

  const cityName = String(input.cityName || '').slice(0, 80);
  const countryCode = String(input.countryCode || '').slice(0, 2).toUpperCase();
  const prompt = [
    'You extract travel places from social-media screenshots and itinerary images.',
    'Return only concrete, visitable places that are visibly mentioned: attractions, restaurants, cafes, shops, hotels, stations, or airports.',
    'Ignore headings, dates, travel times, generic city names, marketing copy, and duplicate mentions.',
    'Preserve the most recognizable public name in `name`.',
    'In `query`, provide the best map-search query, adding the city, region, or country shown in the image when helpful.',
    'Choose the closest type. Write a short Chinese note using only facts visible in the image; use an empty string if there is no useful note.',
    cityName ? `The user is currently planning around ${cityName}${countryCode ? `, ${countryCode}` : ''}. This is context, not a place to add.` : ''
  ].filter(Boolean).join('\n');

  let upstream;
  try {
    upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${options.apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-6-luna',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageDataUrl, detail: 'high' } }
          ]
        }],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'travel_places', strict: true, schema: placeSchema }
        },
        max_completion_tokens: 1200
      })
    });
  } catch {
    return json({ error: 'AI service is temporarily unreachable' }, 502, headers);
  }

  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    const message = payload?.error?.message || `OpenAI API returned ${upstream.status}`;
    return json({ error: message }, upstream.status, headers);
  }

  try {
    const parsed = JSON.parse(extractAssistantText(payload));
    const places = Array.isArray(parsed.places) ? parsed.places.slice(0, 12) : [];
    return json({ places, model: options.model || 'gpt-6-luna' }, 200, headers);
  } catch {
    return json({ error: 'AI returned an unreadable result' }, 502, headers);
  }
}
