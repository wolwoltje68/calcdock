// Smoke test: serves dist/ under the configured base path and checks every page in Chromium.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright'); import cfg from './site.config.mjs';
const base = new URL(cfg.baseUrl).pathname.replace(/\/$/, '');
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (!p.startsWith(base)) { r.writeHead(404); return r.end(); }
  p = path.join('dist', p.slice(base.length)); if (p.endsWith('/') || !path.extname(p)) p = path.join(p, 'index.html');
  fs.readFile(p, (e, d) => { r.writeHead(e ? 404 : 200, { 'content-type': p.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain' }); r.end(e ? 'nf' : d); }); }).listen(8099);
const pages = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f === 'index.html' && pages.push('/' + path.relative('dist', path.dirname(p))); } })('dist');
const b = await chromium.launch(); const pg = await b.newPage(); let fail = 0;
for (const p of pages) { const errs = []; pg.removeAllListeners('pageerror'); pg.removeAllListeners('console');
  pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const res = await pg.goto(`http://localhost:8099${base}${p.replace(/\/$/, '')}/`.replace(/\/\/$/, '/'));
  const out = await pg.$eval('#res', e => e.innerText).catch(() => null);
  const ok = res.status() === 200 && !errs.length && (out === null || (out.trim() && !out.includes('NaN')));
  if (!ok) fail++; console.log(ok ? 'OK  ' : 'FAIL', p, errs.join('; '), out === null ? '' : '| ' + out.replace(/\s+/g, ' ').slice(0, 110)); }
if (process.argv[2]) { await pg.setViewportSize({ width: 1100, height: 900 }); await pg.goto(`http://localhost:8099${base}/${process.argv[2]}/`); await pg.screenshot({ path: process.argv[3], fullPage: false }); }
await b.close(); srv.close(); process.exit(fail ? 1 : 0);
