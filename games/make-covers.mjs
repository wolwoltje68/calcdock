// Renders cover images for a game into release/. Usage: node games/make-covers.mjs
import fs from 'node:fs'; import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const COLORS = ['#ff5a6e', '#ffb627', '#2ec4b6', '#3a86ff', '#b15cff', '#7ad94a'], GLYPH = ['●', '◆', '▲', '■', '★', '⬢'];
const html = (w, h) => {
  const s = Math.round(Math.min(w, h) / 6.2); let tiles = '', seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let y = -1; y < h / s + 1; y++) for (let x = -1; x < w / s + 1; x++) { const i = Math.floor(rnd() * 6), c = COLORS[i], bomb = rnd() < .04;
    tiles += `<div class="t" style="left:${x * s}px;top:${y * s}px;width:${s * .9}px;height:${s * .9}px;${bomb ? 'background:radial-gradient(circle at 40% 40%,#5a6080,#151826);border-radius:50%' : `background:linear-gradient(${c}ee,${c}aa)`};font-size:${s * .32}px">${bomb ? '' : GLYPH[i]}</div>`; }
  return `<html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#141826;font-family:system-ui,sans-serif">
  <style>.t{position:absolute;border-radius:22%;display:flex;align-items:center;justify-content:center;color:#fffc;box-shadow:inset 0 ${s * .08}px 0 #fff3}</style>
  <div style="position:absolute;inset:-10%;transform:rotate(-8deg);opacity:.9">${tiles}</div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,#141826ee 0%,#14182688 45%,transparent 75%)"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div style="font-weight:900;font-size:${Math.min(w / 6.5, h / 4.2)}px;line-height:1;letter-spacing:-.02em;background:linear-gradient(90deg,#ff7a59,#ffcf4a,#5ee0d6);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 #0008)">Cascade<br>Pop</div>
  </div></body></html>`;
};
const b = await chromium.launch(); fs.mkdirSync('release', { recursive: true });
for (const [w, h] of [[1920, 1080], [800, 1200], [800, 800]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html(w, h)); await p.screenshot({ path: `release/cascade-pop-cover-${w}x${h}.png` }); await p.close();
}
await b.close(); console.log(fs.readdirSync('release'));
