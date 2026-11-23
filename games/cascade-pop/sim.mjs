// Balance simulator: node games/cascade-pop/sim.mjs
// Plays many games with a greedy bot per color count and prints score percentiles and win rates per level.
import './core.js';
const C = globalThis.CascadeCore;

function play(colors, moves, seed) {
  const rnd = C.rng(seed), b = C.createBoard(colors, rnd); let score = 0;
  for (let m = 0; m < moves; m++) {
    const mv = C.bestMove(b); if (!mv) { C.shuffle(b, colors, rnd); m--; continue; }
    score += C.applyTap(b, mv.c, mv.r, colors, rnd).gain;
    if (!C.hasMoves(b)) C.shuffle(b, colors, rnd);
  }
  return score;
}
const N = 2000;
for (const colors of [4, 5, 6]) {
  const s = Array.from({ length: N }, (_, i) => play(colors, 20, i * 7919 + colors)).sort((a, b) => a - b);
  const p = q => s[Math.floor(q * (N - 1))];
  console.log(`colors=${colors}  p10=${p(.1)}  p30=${p(.3)}  median=${p(.5)}  p70=${p(.7)}  p90=${p(.9)}`);
}
console.log('\nlevel  colors  target  botWin%');
for (let L = 1; L <= 28; L++) {
  const { colors, moves, target } = C.levelParams(L); let w = 0;
  for (let i = 0; i < 500; i++) if (play(colors, moves, 99991 * L + i) >= target) w++;
  console.log(String(L).padStart(5), String(colors).padStart(7), String(target).padStart(7), String((w / 5).toFixed(0)).padStart(8));
}
