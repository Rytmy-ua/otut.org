// Post-build guard: fails the build if an internal link or image points nowhere.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } })(DIST);

const exists = (url) => {
  const p = decodeURIComponent(url.split(/[?#]/)[0]);
  if (p === '/') return existsSync(join(DIST, 'index.html'));
  return existsSync(join(DIST, p)) || existsSync(join(DIST, p + '.html')) || existsSync(join(DIST, p, 'index.html'));
};

const broken = new Set();
let pages = 0;
for (const f of files.filter((f) => f.endsWith('.html'))) {
  pages++;
  const html = readFileSync(f, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) if (!exists(url)) broken.add(`${f.replace(DIST, '/')} → ${url}`);
}
if (broken.size) { console.error(`Broken internal links (${broken.size}):\n` + [...broken].join('\n')); process.exit(1); }
console.log(`check-build: ${pages} pages, all internal links and images resolve.`);
