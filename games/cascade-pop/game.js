// Cascade Pop – rendering, input, sound, progression and platform (CrazyGames SDK v3) hooks.
(() => {
  const C = window.CascadeCore;
  const COLORS = ['#ff5a6e', '#ffb627', '#2ec4b6', '#3a86ff', '#b15cff', '#7ad94a'];
  const $ = id => document.getElementById(id);
  const cv = $('board'), ctx = cv.getContext('2d');

  // ---------- platform adapter (no-op outside CrazyGames) ----------
  const P = {
    sdk: null,
    async init() { try { if (window.CrazyGames && window.CrazyGames.SDK) { await window.CrazyGames.SDK.init(); this.sdk = window.CrazyGames.SDK; } } catch (e) { this.sdk = null; } },
    call(fn) { try { fn(this.sdk); } catch (e) { } },
    loadingStop() { this.sdk && this.call(s => s.game.loadingStop()); },
    gameplayStart() { this.sdk && this.call(s => s.game.gameplayStart()); },
    gameplayStop() { this.sdk && this.call(s => s.game.gameplayStop()); },
    happytime() { this.sdk && this.call(s => s.game.happytime()); },
    midgame(done) {
      if (!this.sdk) return done();
      let finished = false; const fin = () => { if (finished) return; finished = true; audio.suspended = false; done(); };
      try { this.sdk.ad.requestAd('midgame', { adStarted: () => { audio.suspended = true; }, adFinished: fin, adError: fin }); } catch (e) { fin(); }
    },
  };

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cascadepop.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cascadepop.' + k, JSON.stringify(v)); } catch (e) { } },
  };

  // ---------- audio ----------
  const audio = {
    ctx: null, muted: store.get('muted', false), suspended: false,
    ensure() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
    tone(freq, dur = 0.12, type = 'sine', vol = 0.15, delay = 0) {
      if (this.muted || this.suspended || !this.ctx) return;
      const t = this.ctx.currentTime + delay, o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + dur);
    },
    pop(n) { const base = 330 + Math.min(n, 12) * 40; this.tone(base, 0.12, 'triangle'); if (n >= 5) this.tone(base * 1.5, 0.15, 'sine', 0.1, 0.06); },
    boom() { this.tone(90, 0.35, 'sawtooth', 0.18); this.tone(140, 0.25, 'square', 0.06, 0.05); },
    bad() { this.tone(140, 0.1, 'square', 0.07); },
    win() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.2, 'triangle', 0.14, i * 0.11)); },
    lose() { [392, 330, 262].forEach((f, i) => this.tone(f, 0.25, 'sine', 0.12, i * 0.15)); },
  };

  // ---------- state ----------
  let rnd = C.rng((Date.now() ^ (Math.random() * 1e9)) >>> 0);
  let level = store.get('level', 1), best = store.get('stars', {});
  let board, params, score = 0, shown = 0, movesLeft = 0, phase = 'title', busy = false;
  const pos = new Map(); // tile id -> {y, vy}
  let ghosts = [], parts = [], floats = [], wiggle = null, flash = 0;

  // ---------- layout ----------
  let cell = 40, dpr = 1;
  function resize() {
    const r = $('area').getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cell = Math.max(24, Math.floor(Math.min(r.width / C.COLS, r.height / C.ROWS)));
    cv.style.width = cell * C.COLS + 'px'; cv.style.height = cell * C.ROWS + 'px';
    cv.width = cell * C.COLS * dpr; cv.height = cell * C.ROWS * dpr;
  }
  window.addEventListener('resize', resize);

  // ---------- drawing ----------
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function shade(hex, f) { const n = parseInt(hex.slice(1), 16); const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f))); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; }
  function glyph(i, cx, cy, s) {
    ctx.beginPath();
    if (i === 0) ctx.arc(cx, cy, s, 0, 7);
    else if (i === 1) { ctx.moveTo(cx, cy - s * 1.2); ctx.lineTo(cx + s, cy); ctx.lineTo(cx, cy + s * 1.2); ctx.lineTo(cx - s, cy); }
    else if (i === 2) { ctx.moveTo(cx, cy - s * 1.1); ctx.lineTo(cx + s * 1.1, cy + s * 0.8); ctx.lineTo(cx - s * 1.1, cy + s * 0.8); }
    else if (i === 3) ctx.rect(cx - s * 0.85, cy - s * 0.85, s * 1.7, s * 1.7);
    else if (i === 4) { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? s * 0.5 : s * 1.2; ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } }
    else { for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.lineTo(cx + Math.cos(a) * s * 1.05, cy + Math.sin(a) * s * 1.05); } }
    ctx.closePath(); ctx.fill();
  }
  function drawTile(t, x, y, s, alpha = 1, t0 = 0) {
    const pad = s * 0.06, w = s - pad * 2;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(x + s / 2, y + s / 2); ctx.scale(s / cell, s / cell); ctx.translate(-cell / 2, -cell / 2);
    const W = cell - pad * 2 * cell / s, p = pad * cell / s;
    if (t.sp === C.SP_BOMB) {
      const g = ctx.createRadialGradient(cell * .4, cell * .4, 2, cell / 2, cell / 2, cell * .5); g.addColorStop(0, '#5a6080'); g.addColorStop(1, '#151826');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cell / 2, cell / 2 + cell * .04, W * .42, 0, 7); ctx.fill();
      ctx.strokeStyle = '#ffb627'; ctx.lineWidth = cell * .05; ctx.beginPath(); ctx.moveTo(cell * .62, cell * .22); ctx.quadraticCurveTo(cell * .72, cell * .08, cell * .82, cell * .14); ctx.stroke();
      ctx.fillStyle = (Math.floor(t0 * 8) % 2) ? '#fff2a8' : '#ff7a2f'; ctx.beginPath(); ctx.arc(cell * .83, cell * .14, cell * .07, 0, 7); ctx.fill();
    } else if (t.sp === C.SP_LINE) {
      const g = ctx.createLinearGradient(0, p, 0, p + W); g.addColorStop(0, '#fffbe6'); g.addColorStop(1, '#ffcf4a');
      ctx.fillStyle = g; rr(p, p, W, W, W * .24); ctx.fill();
      ctx.fillStyle = '#c86b00'; const a = W * .14, m = cell / 2;
      ctx.fillRect(p + W * .12, m - a / 2, W * .76, a); ctx.fillRect(m - a / 2, p + W * .12, a, W * .76);
      ctx.beginPath(); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { ctx.moveTo(m + dx * W * .46, m + dy * W * .46); ctx.lineTo(m + dx * W * .3 - dy * a, m + dy * W * .3 + dx * a); ctx.lineTo(m + dx * W * .3 + dy * a, m + dy * W * .3 - dx * a); } ctx.fill();
    } else {
      const col = COLORS[t.color];
      const g = ctx.createLinearGradient(0, p, 0, p + W); g.addColorStop(0, shade(col, 1.25)); g.addColorStop(1, shade(col, 0.8));
      ctx.fillStyle = g; rr(p, p, W, W, W * .26); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.25)'; rr(p + W * .1, p + W * .06, W * .8, W * .3, W * .15); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.88)'; glyph(t.color, cell / 2, cell / 2 + W * .04, W * .16);
    }
    ctx.restore();
  }

  let time = 0;
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cell * C.COLS, cell * C.ROWS);
    ctx.fillStyle = 'rgba(255,255,255,.035)';
    for (let c = 0; c < C.COLS; c++) for (let r = 0; r < C.ROWS; r++) if ((c + r) % 2 === 0) ctx.fillRect(c * cell, r * cell, cell, cell);
    if (board) for (let c = 0; c < C.COLS; c++) for (let r = 0; r < C.ROWS; r++) {
      const t = board[c][r]; const p = pos.get(t.id); const y = (p ? p.y : r) * cell;
      let dx = 0; if (wiggle && wiggle.id === t.id) dx = Math.sin(wiggle.t * 60) * cell * .08 * (1 - wiggle.t / .3);
      if (y > -cell) drawTile(t, c * cell + dx, y, cell, 1, time);
    }
    for (const g of ghosts) { const k = 1 - g.t / .2; drawTile(g, g.c * cell + cell * (1 - k) / 2, g.r * cell + cell * (1 - k) / 2, cell * Math.max(.01, k), k, time); }
    for (const p of parts) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }
    ctx.globalAlpha = 1;
    if (flash > 0) { ctx.fillStyle = `rgba(255,240,200,${flash * .5})`; ctx.fillRect(0, 0, cell * C.COLS, cell * C.ROWS); }
    ctx.textAlign = 'center'; ctx.font = `900 ${Math.round(cell * .45)}px system-ui,sans-serif`;
    for (const f of floats) { ctx.globalAlpha = Math.max(0, 1 - f.t / .9); ctx.fillStyle = '#000a'; ctx.fillText(f.text, f.x + 2, f.y - f.t * cell + 2); ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y - f.t * cell); }
    ctx.globalAlpha = 1;
  }

  // ---------- simulation ----------
  function syncPositions(spawnRow) {
    const live = new Set();
    for (let c = 0; c < C.COLS; c++) {
      let fresh = 0; for (let r = 0; r < C.ROWS; r++) if (!pos.has(board[c][r].id) && !board[c][r].sp) fresh++;
      for (let r = 0; r < C.ROWS; r++) {
        const t = board[c][r]; live.add(t.id);
        if (!pos.has(t.id)) pos.set(t.id, { y: t.sp && spawnRow != null ? Math.min(r, spawnRow) : r - fresh - .4, vy: 0 });
      }
    }
    for (const id of [...pos.keys()]) if (!live.has(id)) pos.delete(id);
  }
  function settled() {
    if (ghosts.length) return false;
    for (let c = 0; c < C.COLS; c++) for (let r = 0; r < C.ROWS; r++) { const p = pos.get(board[c][r].id); if (p && p.y !== r) return false; }
    return true;
  }
  function update(dt) {
    time += dt;
    if (board) for (let c = 0; c < C.COLS; c++) for (let r = 0; r < C.ROWS; r++) {
      const p = pos.get(board[c][r].id); if (!p || p.y === r) continue;
      p.vy += 55 * dt; p.y += p.vy * dt; if (p.y >= r) { p.y = r; p.vy = 0; }
    }
    ghosts = ghosts.filter(g => (g.t += dt) < .2);
    parts = parts.filter(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 900 * dt; p.life -= dt * 1.6; return p.life > 0; });
    floats = floats.filter(f => (f.t += dt) < .9);
    if (wiggle && (wiggle.t += dt) > .3) wiggle = null;
    flash = Math.max(0, flash - dt * 3);
    if (shown < score) { shown = Math.min(score, shown + Math.max(10, (score - shown) * dt * 8)); hud(); }
    if (busy && settled()) { busy = false; afterMove(); }
  }
  let last = performance.now();
  function frame(now) { const dt = Math.min(.05, (now - last) / 1000); last = now; update(dt); draw(); requestAnimationFrame(frame); }

  // ---------- gameplay ----------
  function hud() {
    $('lvl').textContent = level; $('moves').textContent = movesLeft;
    const pct = params ? Math.min(100, shown / params.target * 100) : 0;
    $('fill').style.width = pct + '%'; $('bartext').textContent = params ? `${Math.floor(shown).toLocaleString()} / ${params.target.toLocaleString()}` : '';
  }
  function toast(text) { const t = $('toast'); t.textContent = text; t.style.opacity = 1; clearTimeout(toast.h); toast.h = setTimeout(() => t.style.opacity = 0, 1100); }

  function startLevel(n) {
    level = n; params = C.levelParams(level); score = 0; shown = 0; movesLeft = params.moves;
    board = C.createBoard(params.colors, rnd); pos.clear(); syncPositions();
    for (const p of pos.values()) p.y -= C.ROWS + 1; // drop-in
    busy = true; phase = 'play'; hud(); hide();
    P.gameplayStart();
  }

  function tap(e) {
    audio.ensure();
    if (phase !== 'play' || busy) return;
    const rect = cv.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / rect.width * C.COLS), r = Math.floor((e.clientY - rect.top) / rect.height * C.ROWS);
    if (c < 0 || r < 0 || c >= C.COLS || r >= C.ROWS) return;
    const tappedId = board[c][r].id;
    const res = C.applyTap(board, c, r, params.colors, rnd);
    if (!res) { wiggle = { id: tappedId, t: 0 }; audio.bad(); return; }
    movesLeft--; score += res.gain;
    for (const t of res.cleared) {
      ghosts.push({ ...t, t: 0 });
      const col = t.sp ? '#ffcf4a' : COLORS[t.color];
      for (let k = 0; k < 5; k++) parts.push({ x: (t.c + .5) * cell, y: (t.r + .5) * cell, vx: (Math.random() - .5) * cell * 9, vy: -Math.random() * cell * 9, life: 1, s: cell * (.08 + Math.random() * .1), color: col });
    }
    floats.push({ x: (c + .5) * cell, y: (r + .5) * cell, text: '+' + res.gain, t: 0, color: res.combo ? '#ffcf4a' : '#fff' });
    if (res.combo) { audio.boom(); flash = res.combo > 1 ? 1 : .6; if (res.combo > 1) toast(`Chain x${res.combo}!`); }
    else audio.pop(res.groupSize);
    if (res.spawned === C.SP_LINE) toast('Line Blast!'); else if (res.spawned === C.SP_BOMB) toast('Bomb!');
    syncPositions(r); busy = true; hud();
  }

  function afterMove() {
    if (phase !== 'play') return;
    if (score >= params.target) return win();
    if (movesLeft <= 0) return lose();
    if (!C.hasMoves(board)) { C.shuffle(board, params.colors, rnd); syncPositions(); busy = true; toast('Shuffle!'); }
  }

  function stars() { return movesLeft >= 5 ? 3 : movesLeft >= 2 ? 2 : 1; }
  function win() {
    phase = 'end'; P.gameplayStop(); P.happytime(); audio.win();
    const s = stars(), bonus = movesLeft * 100; score += bonus; shown = score; hud();
    best[level] = Math.max(best[level] || 0, s); store.set('stars', best); store.set('level', Math.max(store.get('level', 1), level + 1));
    show(`<h2>Level ${level} complete!</h2><div class="stars">${[1, 2, 3].map(i => `<span class="${i <= s ? '' : 'off'}">★</span>`).join('')}</div>
      <p>Score ${score.toLocaleString()}${bonus ? ` (incl. +${bonus} move bonus)` : ''}</p>
      <button class="btn" id="next">Next level ▶</button>`);
    $('next').onclick = () => P.midgame(() => startLevel(level + 1));
  }
  function lose() {
    phase = 'end'; P.gameplayStop(); audio.lose();
    show(`<h2>Out of moves</h2><p>You scored ${score.toLocaleString()} of ${params.target.toLocaleString()}.<br>So close – try again!</p>
      <button class="btn" id="retry">Retry level ${level}</button>${level > 1 ? `<button class="btn alt" id="prev">Play level ${level - 1}</button>` : ''}`);
    $('retry').onclick = () => P.midgame(() => startLevel(level));
    if ($('prev')) $('prev').onclick = () => P.midgame(() => startLevel(level - 1));
  }
  function show(html) { $('card').innerHTML = html; $('ov').hidden = false; }
  function hide() { $('ov').hidden = true; }
  function title() {
    const lv = store.get('level', 1);
    show(`<h1>Cascade Pop</h1><p>Tap groups of matching gems. Reach the target score before you run out of moves.</p>
      <div class="how"><b>2+</b><span>matching gems: pop them</span><b>5+</b><span>creates a 💣 bomb (clears 3×3)</span><b>8+</b><span>creates a ✚ line blast (row + column)</span><b>⚡</b><span>specials set each other off in chains</span></div>
      <button class="btn" id="play">${lv > 1 ? 'Continue – level ' + lv : 'Play'}</button>${lv > 1 ? '<button class="btn alt" id="restart">Start from level 1</button>' : ''}`);
    $('play').onclick = () => { audio.ensure(); startLevel(lv); };
    if ($('restart')) $('restart').onclick = () => { audio.ensure(); startLevel(1); };
  }

  $('mute').textContent = audio.muted ? '🔇' : '🔊';
  $('mute').onclick = () => { audio.muted = !audio.muted; store.set('muted', audio.muted); $('mute').textContent = audio.muted ? '🔇' : '🔊'; audio.ensure(); };
  cv.addEventListener('pointerdown', tap);
  document.addEventListener('contextmenu', e => e.preventDefault());

  (async () => {
    await P.init();
    resize(); params = C.levelParams(level); board = C.createBoard(params.colors, rnd); syncPositions(); hud();
    requestAnimationFrame(frame); title(); P.loadingStop();
    window.__cascade = { get state() { return { phase, level, score, movesLeft, busy, target: params.target }; }, board: () => board, tapCell: (c, r) => { const rect = cv.getBoundingClientRect(); tap({ clientX: rect.left + (c + .5) * rect.width / C.COLS, clientY: rect.top + (r + .5) * rect.height / C.ROWS }); } };
  })();
})();
