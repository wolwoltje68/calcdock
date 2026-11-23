// Cascade Pop – pure game rules (no DOM). Used by the game and by the balance simulator.
(function (g) {
  const COLS = 7, ROWS = 9;
  const SP_NONE = 0, SP_BOMB = 1, SP_LINE = 2;
  let nextId = 1;

  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const tile = (color, sp = SP_NONE) => ({ id: nextId++, color, sp });
  const randTile = (colors, rnd) => tile(Math.floor(rnd() * colors));

  function levelParams(level) {
    const colors = level <= 2 ? 4 : level <= 7 ? 5 : 6;
    const moves = 20;
    // Targets tuned with sim.mjs (greedy bot): ~100% bot wins at L1, ~50% around L15, capped near p80.
    const target = colors === 4 ? 4000 + (level - 1) * 1000
      : colors === 5 ? 2700 + (level - 3) * 250
      : Math.min(3700, 1900 + (level - 8) * 100);
    return { colors, moves, target };
  }

  function createBoard(colors, rnd) {
    const b = [];
    for (let c = 0; c < COLS; c++) { b.push([]); for (let r = 0; r < ROWS; r++) b[c].push(randTile(colors, rnd)); }
    if (!hasMoves(b)) shuffle(b, colors, rnd);
    return b;
  }

  function findGroup(b, c, r) {
    const t = b[c][r]; if (!t || t.sp) return [];
    const seen = new Set([c * 100 + r]), out = [[c, r]], stack = [[c, r]];
    while (stack.length) {
      const [x, y] = stack.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = nx * 100 + ny;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || seen.has(k)) continue;
        const n = b[nx][ny]; if (n && !n.sp && n.color === t.color) { seen.add(k); out.push([nx, ny]); stack.push([nx, ny]); }
      }
    }
    return out;
  }

  function specialArea(sp, c, r) {
    const out = [];
    if (sp === SP_BOMB) { for (let x = c - 1; x <= c + 1; x++) for (let y = r - 1; y <= r + 1; y++) if (x >= 0 && y >= 0 && x < COLS && y < ROWS) out.push([x, y]); }
    else if (sp === SP_LINE) { for (let x = 0; x < COLS; x++) out.push([x, r]); for (let y = 0; y < ROWS; y++) if (y !== r) out.push([c, y]); }
    return out;
  }

  // Applies a tap. Returns null if the tap is not a valid move.
  // Otherwise mutates the board and returns { gain, cleared:[{c,r,color,sp}], groupSize, spawned, combo }.
  function applyTap(b, c, r, colors, rnd) {
    const t = b[c][r]; if (!t) return null;
    const clear = new Map(); let groupSize = 0, spawn = null, specials = 0;
    const add = (x, y) => { const k = x * 100 + y; if (!clear.has(k) && b[x][y]) clear.set(k, [x, y]); };
    const queue = [];
    if (t.sp) queue.push([c, r]);
    else {
      const grp = findGroup(b, c, r); if (grp.length < 2) return null;
      groupSize = grp.length; grp.forEach(([x, y]) => add(x, y));
      if (groupSize >= 8) spawn = SP_LINE; else if (groupSize >= 5) spawn = SP_BOMB;
    }
    const fired = new Set();
    while (queue.length) {
      const [x, y] = queue.shift(), k = x * 100 + y; if (fired.has(k)) continue; fired.add(k); specials++;
      add(x, y);
      for (const [ax, ay] of specialArea(b[x][y].sp, x, y)) { add(ax, ay); const n = b[ax][ay]; if (n && n.sp && !fired.has(ax * 100 + ay)) queue.push([ax, ay]); }
    }
    const cleared = [...clear.values()].map(([x, y]) => ({ c: x, r: y, color: b[x][y].color, sp: b[x][y].sp }));
    const specialTiles = cleared.length - groupSize;
    const gain = groupSize * groupSize * 10 + specialTiles * 25 * specials;
    for (const { c: x, r: y } of cleared) b[x][y] = null;
    if (spawn) b[c][r] = tile(-1, spawn);
    gravity(b, colors, rnd);
    return { gain, cleared, groupSize, spawned: spawn, combo: specials };
  }

  function gravity(b, colors, rnd) {
    for (let c = 0; c < COLS; c++) {
      const col = b[c].filter(Boolean);
      while (col.length < ROWS) col.unshift(randTile(colors, rnd));
      b[c] = col;
    }
  }

  function hasMoves(b) {
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      const t = b[c][r]; if (!t) continue; if (t.sp) return true;
      if (c + 1 < COLS && b[c + 1][r] && !b[c + 1][r].sp && b[c + 1][r].color === t.color) return true;
      if (r + 1 < ROWS && b[c][r + 1] && !b[c][r + 1].sp && b[c][r + 1].color === t.color) return true;
    }
    return false;
  }

  function shuffle(b, colors, rnd) {
    for (let tries = 0; tries < 50; tries++) {
      const normal = []; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (!b[c][r].sp) normal.push(b[c][r].color);
      for (let i = normal.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [normal[i], normal[j]] = [normal[j], normal[i]]; }
      let i = 0; for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) if (!b[c][r].sp) b[c][r] = tile(normal[i++]);
      if (hasMoves(b)) return;
    }
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) b[c][r] = randTile(colors, rnd);
    if (!hasMoves(b)) b[0][0] = tile(-1, SP_BOMB);
  }

  // Bot used for balancing: picks the move with the best immediate gain (+ bonus for creating specials).
  function bestMove(b) {
    let best = null, seen = new Set();
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      const t = b[c][r]; let score;
      if (t.sp) score = t.sp === SP_LINE ? 400 : 250;
      else { if (seen.has(c * 100 + r)) continue; const g2 = findGroup(b, c, r); g2.forEach(([x, y]) => seen.add(x * 100 + y)); if (g2.length < 2) continue; score = g2.length * g2.length * 10 + (g2.length >= 8 ? 300 : g2.length >= 5 ? 150 : 0); }
      if (!best || score > best.score) best = { c, r, score };
    }
    return best;
  }

  g.CascadeCore = { COLS, ROWS, SP_BOMB, SP_LINE, rng, levelParams, createBoard, findGroup, applyTap, hasMoves, shuffle, bestMove };
})(typeof window !== 'undefined' ? window : globalThis);
