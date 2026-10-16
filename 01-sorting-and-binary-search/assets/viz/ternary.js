/* Ternarno pretraživanje maksimuma unimodalne funkcije na realnom intervalu. */
Viz.register('ternary', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat, fmt } = Viz;
  const W = 640, H = 300, px = 40, py = 16, pw = W - px - 16, ph = H - py - 40;
  const X0 = 0, X1 = 10, EPS = 0.05;
  let seed = 9, rand = Viz.rng(seed);

  const presets = {
    parabola: { label: 'parabola', make: () => { const a = 2 + rand() * 6; return x => 8 - 0.35 * (x - a) * (x - a); } },
    asim: { label: 'asimetrična (unimodalna)', make: () => { const a = 2 + rand() * 6; return x => 8 - (x < a ? 0.9 * Math.pow(a - x, 1.3) : 1.6 * Math.pow(x - a, 1.1)); } },
    dva: { label: 'dva vrha (NIJE unimodalna)', make: () => { return x => 4.5 * Math.exp(-(x - 2.5) * (x - 2.5) / 1.2) + 6.5 * Math.exp(-(x - 7.6) * (x - 7.6) / 1.4) + 0.5; } }
  };
  let presetKey = opts.preset || 'asim', f, l, r, m1, m2, iters, phase, trueMax;

  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const sIter = h('b');
  const sx = x => px + (x - X0) / (X1 - X0) * pw;
  const sy = y => py + ph - (y / 9) * ph;

  function reset() {
    f = presets[presetKey].make(); l = X0; r = X1; m1 = m2 = null; iters = 0; phase = 'start';
    let best = X0; for (let x = X0; x <= X1; x += 0.002) if (f(x) > f(best)) best = x; trueMax = best;
    draw();
  }
  function step() {
    if (phase === 'done') return false;
    if (r - l < EPS) { phase = 'done'; draw(); return false; }
    m1 = l + (r - l) / 3; m2 = r - (r - l) / 3; iters++;
    if (f(m1) < f(m2)) l = m1; else r = m2;   // f(m1) = f(m2): maksimum je između, bilo koji odabir je ispravan
    if (r - l < EPS) phase = 'done'; else phase = 'run';
    draw();
    return phase !== 'done';
  }

  function draw() {
    clear(pic);
    // osi
    pic.appendChild(s('line', { x1: px, y1: py + ph, x2: px + pw, y2: py + ph, stroke: C.gray }));
    pic.appendChild(s('line', { x1: px, y1: py, x2: px, y2: py + ph, stroke: C.gray }));
    for (let x = 0; x <= 10; x += 2) pic.appendChild(text(sx(x), py + ph + 14, x, { 'font-size': 11, fill: C.muted }));
    pic.appendChild(text(px + pw, py + ph + 28, 'x', { 'font-size': 12, fill: C.muted, 'text-anchor': 'end' }));
    pic.appendChild(text(px - 8, py + 4, 'f(x)', { 'font-size': 12, fill: C.muted, 'text-anchor': 'end' }));
    // odbačeni dijelovi i aktivni interval
    pic.appendChild(s('rect', { x: sx(X0), y: py, width: sx(l) - sx(X0), height: ph, fill: C.graySoft, opacity: 0.9 }));
    pic.appendChild(s('rect', { x: sx(r), y: py, width: sx(X1) - sx(r), height: ph, fill: C.graySoft, opacity: 0.9 }));
    pic.appendChild(s('rect', { x: sx(l), y: py, width: Math.max(1, sx(r) - sx(l)), height: ph, fill: C.blueSoft, opacity: 0.55 }));
    // krivulja
    let d = '';
    for (let i = 0; i <= 300; i++) { const x = X0 + (X1 - X0) * i / 300; d += (i ? 'L' : 'M') + fmtp(sx(x)) + ' ' + fmtp(sy(f(x))); }
    pic.appendChild(s('path', { d, fill: 'none', stroke: C.ink2, 'stroke-width': 2.2 }));
    // m1, m2
    if (m1 != null && phase !== 'done') {
      const v1 = f(m1), v2 = f(m2), left = v1 < v2;
      [[m1, v1, 'm₁', left ? C.red : C.aqua], [m2, v2, 'm₂', left ? C.aqua : C.red]].forEach(([m, v, lab, col]) => {
        pic.appendChild(s('line', { x1: sx(m), y1: py + ph, x2: sx(m), y2: sy(v), stroke: col, 'stroke-dasharray': '4 3', 'stroke-width': 1.5 }));
        pic.appendChild(s('circle', { cx: sx(m), cy: sy(v), r: 5, fill: col }));
        pic.appendChild(text(sx(m), py - 6, lab, { 'font-size': 13, fill: col, 'font-weight': 700 }));
        pic.appendChild(text(sx(m), sy(v) - 14, fmt(v, 2), { 'font-size': 11, fill: col }));
      });
    }
    if (phase === 'done') {
      const xs = (l + r) / 2;
      pic.appendChild(s('line', { x1: sx(xs), y1: py + ph, x2: sx(xs), y2: sy(f(xs)), stroke: C.green, 'stroke-width': 2 }));
      pic.appendChild(s('circle', { cx: sx(xs), cy: sy(f(xs)), r: 6, fill: C.green }));
      pic.appendChild(s('circle', { cx: sx(trueMax), cy: sy(f(trueMax)), r: 9, fill: 'none', stroke: C.orange, 'stroke-width': 2 }));
    }
    sIter.textContent = iters;
    if (phase === 'done') {
      const xs = (l + r) / 2, good = Math.abs(xs - trueMax) < 0.1;
      status.className = good ? 'status ok' : 'status';
      status.textContent = `Rezultat x ≈ ${fmt(xs, 2)}, f(x) ≈ ${fmt(f(xs), 2)} nakon ${iters} koraka. ` + (good ? 'To je pravi maksimum (narančasti krug).' : `Pravi maksimum je kod x ≈ ${fmt(trueMax, 2)} (narančasti krug) — funkcija nije unimodalna, pa smo odbacili pogrešnu trećinu!`);
    } else {
      status.className = 'status';
      status.textContent = m1 == null ? `Interval [${fmt(l, 2)}, ${fmt(r, 2)}]. Svaki korak odbacuje jednu trećinu.` :
        `Korak ${iters}: f(m₁) = ${fmt(f(m1), 2)} ${f(m1) < f(m2) ? '<' : '≥'} f(m₂) = ${fmt(f(m2), 2)} → ${f(m1) < f(m2) ? 'maksimum nije lijevo od m₁, l = m₁' : 'maksimum nije desno od m₂, r = m₂'}. Interval [${fmt(l, 2)}, ${fmt(r, 2)}].`;
    }
  }
  function fmtp(v) { return Math.round(v * 10) / 10; }

  const play = Viz.player(step, 700, running => { btnPlay.textContent = running ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  root.append(
    h('div', { class: 'bar' }, [
      h('label', {}, ['funkcija: ']),
      Viz.select(Object.entries(presets).map(([k, p]) => ({ value: k, label: p.label })), presetKey, v => { presetKey = v; play.stop(); reset(); }),
      button('Korak', () => { play.stop(); step(); }), btnPlay,
      button('Novi primjer', () => { play.stop(); reset(); }),
      h('span', { class: 'sep' }), stat('koraka:', sIter)
    ]),
    pic, status
  );
  reset();
});
