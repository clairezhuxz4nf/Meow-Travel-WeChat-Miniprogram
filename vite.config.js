import { defineConfig } from 'vite';
import { handleAIPlacesRequest } from './server/ai-places.js';

function localAIProxy() {
  return {
    name: 'miaoyou-local-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai/places', async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = new Request('http://localhost/api/ai/places', {
          method: req.method,
          headers: { 'content-type': req.headers['content-type'] || 'application/json' },
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks)
        });
        const response = await handleAIPlacesRequest(request, {
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || 'gpt-6-luna'
        });
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    }
  };
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Meow-Travel-WeChat-Miniprogram/' : '/',
  plugins: [localAIProxy()],
  build: { outDir: 'dist', sourcemap: true, assetsInlineLimit: 2_000_000 }
});
