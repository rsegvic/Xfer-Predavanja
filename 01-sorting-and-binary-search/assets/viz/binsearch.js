/* Binarno pretraživanje u sortiranom nizu — l, r, mid i prepolavljanje intervala. */
Viz.register('binsearch', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 15;
  const rand = Viz.rng(+opts.seed || 5);
  const W = 720, H = 150;

  // sortiran niz različitih vrijednosti
  let a = [];
  { let v = 2; for (let k = 0; k < n; k++) { v += 2 + Math.floor(rand() * 9); a.push(v); } }

  let x, l, r, mid, iter, phase, found, history;
  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const sIter = h('b'), sCand = h('b');
  const input = h('input', { type: 'number', value: a[7] });

  function setTarget(v) { x = v; input.value = v; l = 0; r = n - 1; mid = null; iter = 0; phase = 'start'; found = -1; history = []; draw(); }

  function step() {
    if (phase === 'done') return false;
    if (l > r) { phase = 'done'; draw(); return false; }
    mid = Math.floor((l + r) / 2); iter++;
    if (a[mid] === x) { found = mid; phase = 'done'; history.push(`a[${mid}] = ${a[mid]} = x → pronađen!`); }
    else if (a[mid] > x) { history.push(`a[${mid}] = ${a[mid]} > x → r = ${mid - 1}`); r = mid - 1; phase = 'run'; }
    else { history.push(`a[${mid}] = ${a[mid]} < x → l = ${mid + 1}`); l = mid + 1; phase = 'run'; }
    if (phase !== 'done' && l > r) { phase = 'done'; history.push('l > r → broja x nema u nizu'); }
    draw();
    return phase !== 'done';
  }

  function draw() {
    clear(pic);
    const cw = (W - 20) / n, y0 = 36, ch = 44;
    for (let k = 0; k < n; k++) {
      const cx = 10 + k * cw;
      const inside = k >= l && k <= r;
      let fill = inside ? C.blueSoft : C.graySoft, stroke = inside ? C.blue : C.gray, col = inside ? C.ink : C.muted;
      if (k === mid && phase !== 'start') { fill = C.orangeSoft; stroke = C.orange; }
      if (k === found) { fill = C.aquaSoft; stroke = C.aqua; }
      if (phase === 'done' && found < 0) { fill = C.graySoft; stroke = C.gray; col = C.muted; }
      pic.appendChild(s('rect', { x: cx + 2, y: y0, width: cw - 4, height: ch, rx: 6, fill, stroke, 'stroke-width': 1.5 }));
      pic.appendChild(text(cx + cw / 2, y0 + ch / 2, a[k], { 'font-size': 16, fill: col, 'font-weight': k === mid ? 700 : 400 }));
      pic.appendChild(text(cx + cw / 2, y0 - 12, k, { 'font-size': 11, fill: C.muted }));
    }
    const labels = {};
    const add = (k, lab) => { if (k < 0 || k >= n) return; (labels[k] = labels[k] || []).push(lab); };
    if (phase !== 'done' || found >= 0) { if (l <= r) { add(l, 'l'); if (r !== l) add(r, 'r'); } if (mid != null) add(mid, 'mid'); }
    for (const [k, labs] of Object.entries(labels)) {
      const cx = 10 + k * cw + cw / 2, color = labs.includes('mid') ? C.orange : C.blue;
      pic.appendChild(s('path', { d: `M${cx} ${y0 + ch + 3} l-6 9 h12 z`, fill: color }));
      pic.appendChild(text(cx, y0 + ch + 22, labs.join('='), { 'font-size': 13, fill: color, 'font-weight': 700 }));
    }
    const cand = Math.max(0, r - l + 1);
    sIter.textContent = iter; sCand.textContent = phase === 'done' ? (found >= 0 ? '1' : '0') : cand;
    const last = history[history.length - 1];
    if (phase === 'done') {
      status.className = found >= 0 ? 'status ok' : 'status';
      status.textContent = found >= 0 ? `Pronađeno: x = ${x} na poziciji ${found}, nakon ${iter} koraka (⌈log₂ ${n}⌉ = ${Math.ceil(Viz.log2(n))}).`
        : `Broja ${x} nema u nizu — zaključeno nakon ${iter} koraka.`;
    } else {
      status.className = 'status';
      status.textContent = last ? `Korak ${iter}: ${last}` : `Tražim x = ${x}. Interval [l, r] = [0, ${n - 1}].`;
    }
  }

  const play = Viz.player(step, 800, running => { btnPlay.textContent = running ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  input.addEventListener('change', () => { play.stop(); setTarget(+input.value); });
  root.append(
    h('div', { class: 'bar' }, [
      h('label', {}, ['x = ']), input,
      button('prisutan', () => { play.stop(); setTarget(a[Math.floor(rand() * n)]); }),
      button('odsutan', () => { play.stop(); let v; do { v = 1 + Math.floor(rand() * (a[n - 1] + 4)); } while (a.includes(v)); setTarget(v); }),
      h('span', { class: 'sep' }),
      button('Korak', () => { play.stop(); step(); }), btnPlay,
      button('Ispočetka', () => { play.stop(); setTarget(x); }),
      h('span', { class: 'sep' }), stat('koraka:', sIter), stat('kandidata:', sCand)
    ]),
    pic, status
  );
  setTarget(a[7]);
});
