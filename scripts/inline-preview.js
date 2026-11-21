import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
let html = await readFile(resolve(dist, 'index.html'), 'utf8');

const cssPath = html.match(/href="([^"]+\.css)"/)?.[1];
const jsPath = html.match(/src="([^"]+\.js)"/)?.[1];

if (!cssPath || !jsPath) throw new Error('Could not locate built CSS/JS assets');

const css = await readFile(resolve(dist, cssPath.replace(/^\//, '')), 'utf8');
const js = await readFile(resolve(dist, jsPath.replace(/^\//, '')), 'utf8');

html = html
  .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, `<style>${css}</style>`)
  .replace(/<script type="module" crossorigin src="[^"]+"><\/script>/, `<script type="module">${js}<\/script>`)
  .replace(/\s*<link rel="manifest"[^>]+>/, '')
  .replace(/<title>[^<]+<\/title>/, '<title>喵游 · Europe Trip 交互预览</title>');

await writeFile(resolve(root, 'preview/index.html'), html);
console.log('Wrote self-contained preview/index.html');
