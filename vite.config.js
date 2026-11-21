import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Meow-Travel-WeChat-Miniprogram/' : '/',
  build: { outDir: 'dist', sourcemap: true }
});
