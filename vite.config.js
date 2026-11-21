import { defineConfig, loadEnv } from 'vite';
import { handleAIPlacesRequest } from './server/ai-places.js';

function localAIProxy(env) {
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
          apiKey: env.GEMINI_API_KEY,
          model: env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
        });
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: process.env.GITHUB_ACTIONS ? '/Meow-Travel-WeChat-Miniprogram/' : '/',
    plugins: [localAIProxy(env)],
    build: { outDir: 'dist', sourcemap: true, assetsInlineLimit: 2_000_000 }
  };
});
