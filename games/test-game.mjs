// Plays Cascade Pop in Chromium with the greedy bot. Usage: node games/test-game.mjs <gameDir> [screenshotDir]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const dir = process.argv[2] || 'games/cascade-pop', shots = process.argv[3];
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const p = path.join(dir, q.url === '/' ? 'index.html' : q.url.split('?')[0]); fs.readFile(p, (e, d) => { r.writeHead(e ? 404 : 200, { 'content-type': types[path.extname(p)] || 'text/plain' }); r.end(e ? '' : d); }); }).listen(8098);
const b = await chromium.launch(); const errs = [];
const pg = await b.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2 });
pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
await pg.goto('http://localhost:8098/'); await pg.waitForTimeout(500);
if (shots) await pg.screenshot({ path: `${shots}/1-title.png` });
await pg.click('#play'); await pg.waitForTimeout(900);
let results = [];
for (let game = 0; game < 4; game++) {
  for (let i = 0; i < 40; i++) {
    const st = await pg.evaluate(() => window.__cascade.state);
    if (st.phase !== 'play') break;
    if (st.busy) { await pg.waitForTimeout(60); i--; continue; }
    const mv = await pg.evaluate(() => CascadeCore.bestMove(window.__cascade.board()));
    await pg.evaluate(([c, r]) => window.__cascade.tapCell(c, r), [mv.c, mv.r]);
    if (shots && game === 0 && i === 6) { await pg.waitForTimeout(80); await pg.screenshot({ path: `${shots}/2-play.png` }); }
  }
  await pg.waitForTimeout(400);
  const st = await pg.evaluate(() => window.__cascade.state); results.push(`L${st.level}: ${st.score}/${st.target} moves=${st.movesLeft}`);
  if (shots && game === 0) await pg.screenshot({ path: `${shots}/3-end.png` });
  await pg.click('#next, #retry'); await pg.waitForTimeout(900);
}
// landscape / desktop layout
await pg.setViewportSize({ width: 1280, height: 720 }); await pg.waitForTimeout(300);
if (shots) await pg.screenshot({ path: `${shots}/4-desktop.png` });
console.log(results.join('\n')); console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'No JS errors');
await b.close(); srv.close(); process.exit(errs.length ? 1 : 0);
