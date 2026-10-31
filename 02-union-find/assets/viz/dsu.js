/* Union-find kao šuma stabala. Klik na dva čvora = unite, u načinu „find” klik na jedan čvor = find.
   Opcije: unija po veličini i kompresija puta. Predlošci: lanac, binomno stablo, slučajno. */
Viz.register('dsu', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  let n = +opts.n || 12;
  const rand = Viz.rng(+opts.seed || 7);
  let bySize = opts.bysize !== '0', compress = opts.compress === '1';
  let link, size, mode = 'union', sel = null, ops, steps, lastPath, lastCompressed, lastLinked, log;
  const W = +opts.w || 760, H = +opts.h || 300, compact = opts.compact === '1';
  let R = 14;
  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const sOps = h('b'), sSteps = h('b'), sDepth = h('b'), sSets = h('b');
  const inA = h('input', { type: 'number', value: 0, min: 0 }), inB = h('input', { type: 'number', value: 1, min: 0 });

  function reset(quiet) { link = Viz.range(n); size = Array(n).fill(1); ops = 0; steps = 0; sel = null; lastPath = []; lastCompressed = []; lastLinked = null; log = 'Svaki element je sam svoj predstavnik (link[x] = x).'; if (!quiet) draw(); }
  function pathOf(x) { const p = [x]; while (link[x] !== x) { x = link[x]; p.push(x); } return p; }
  function find(x) {
    const p = pathOf(x), r = p[p.length - 1];
    steps += p.length - 1; lastPath = p; lastCompressed = [];
    if (compress) for (const v of p) if (v !== r && link[v] !== r) { link[v] = r; lastCompressed.push(v); }
    return r;
  }
  function unite(a, b, quiet) {
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a >= n || b >= n) return false;
    ops++;
    const ra = find(a), pa = lastPath, ca = lastCompressed;
    const rb = find(b);
    lastPath = pa.concat(lastPath); lastCompressed = ca.concat(lastCompressed); lastLinked = null;
    if (ra === rb) { log = `unite(${a}, ${b}): find(${a}) = find(${b}) = ${ra} — već u istom skupu.`; if (!quiet) draw(); return false; }
    let x = ra, y = rb;
    if (bySize && size[x] < size[y]) [x, y] = [y, x];
    const sx = size[x], sy = size[y];
    link[y] = x; size[x] += size[y]; lastLinked = [y, x];
    log = `unite(${a}, ${b}): predstavnici ${ra} i ${rb}; ` + (bySize ? `manji skup (${sy}, predstavnik ${y}) vješam pod veći (${sx}, predstavnik ${x}).` : `${y} vješam pod ${x} (bez heuristike: drugi pod prvi).`);
    if (!quiet) draw(); return true;
  }
  function doFind(x) {
    if (isNaN(x) || x < 0 || x >= n) return;
    ops++;
    const before = pathOf(x);
    const r = find(x);
    log = `find(${x}): ${before.join(' → ')} — ${before.length - 1} korak${before.length - 1 === 1 ? '' : 'a'}, predstavnik ${r}.` + (compress ? (lastCompressed.length ? ` Kompresija: ${lastCompressed.join(', ')} sad pokazuju izravno na ${r}.` : ' Kompresija: nema što skratiti.') : '');
    draw();
  }
  function preset(kind) {
    reset(true);
    if (kind === 'chain') { for (let k = 1; k < n; k++) unite(k, k - 1, true); log = `Lanac: unite(1,0), unite(2,1), …, unite(${n - 1},${n - 2}). ` + (bySize ? 'Unija po veličini od toga pravi zvijezdu.' : 'Bez heuristike nastaje lanac dubine n − 1.'); }
    else if (kind === 'binom') { for (let st = 1; st < n; st *= 2) for (let i = 0; i + st < n; i += 2 * st) unite(i, i + st, true); log = 'Spajanje jednako velikih skupova: unije po parovima, pa po četvorkama, … Dubina je log₂ n — najgori slučaj za uniju po veličini.'; }
    else { let c = n; while (c > 3) { if (unite(Math.floor(rand() * n), Math.floor(rand() * n), true)) c--; } log = 'Slučajne unije do 3 skupa.'; }
    lastPath = []; lastCompressed = []; lastLinked = null; draw();
  }
  function layout() {
    const children = Viz.range(n).map(() => []); const roots = [];
    for (let i = 0; i < n; i++) { if (link[i] === i) roots.push(i); else children[link[i]].push(i); }
    const depth = Viz.range(n).map(i => pathOf(i).length - 1), maxDepth = Math.max(...depth);
    const pos = {}; let cursor = 0;
    const leaves = i => children[i].length ? children[i].reduce((t, c) => t + leaves(c), 0) : 1;
    function place(i, d) { if (!children[i].length) { pos[i] = { x: cursor++, d }; return; } const start = cursor; children[i].forEach(c => place(c, d + 1)); pos[i] = { x: (start + cursor - 1) / 2, d }; }
    roots.forEach(r => { place(r, 0); cursor += 0.6; });
    const total = cursor - 0.6, unit = Math.min(60, (W - 60) / Math.max(1, total)), levelH = Math.min(52, (H - 56) / Math.max(1, maxDepth));
    R = Math.max(8, Math.min(14, levelH / 2 - 2, unit / 2 - 2));
    const xOff = (W - total * unit) / 2;
    for (const i in pos) pos[i] = { x: xOff + pos[i].x * unit, y: 26 + pos[i].d * levelH };
    return { pos, roots, maxDepth };
  }
  function draw() {
    clear(pic);
    const { pos, roots, maxDepth } = layout();
    const onPath = new Set(lastPath);
    for (let i = 0; i < n; i++) {
      if (link[i] === i) continue;
      const a = pos[i], b = pos[link[i]];
      let col = C.gray, w = 1.5, dash = null;
      if (lastCompressed.includes(i)) { col = C.violet; w = 2.5; dash = '5 3'; }
      else if (lastLinked && lastLinked[0] === i) { col = C.aqua; w = 3; }
      else if (onPath.has(i) && onPath.has(link[i]) && !compress) { col = C.orange; w = 3; }
      pic.appendChild(s('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: col, 'stroke-width': w, 'stroke-dasharray': dash }));
    }
    for (let i = 0; i < n; i++) {
      const p = pos[i], g = s('g', { style: { cursor: 'pointer' } });
      const isRoot = link[i] === i;
      let fill = isRoot ? C.blueSoft : C.surface, stroke = isRoot ? C.blue : C.gray, sw = isRoot ? 2.5 : 1.5;
      if (onPath.has(i)) { fill = C.orangeSoft; stroke = C.orange; sw = 2.5; }
      if (sel === i) { fill = C.yellowSoft; stroke = C.yellow; sw = 3; }
      g.addEventListener('click', () => {
        if (mode === 'find') { doFind(i); return; }
        if (sel == null) { sel = i; log = `Odabran ${i}; klikni drugi čvor za unite(${i}, ·).`; draw(); }
        else if (sel === i) { sel = null; draw(); }
        else { const a = sel; sel = null; inA.value = a; inB.value = i; unite(a, i); }
      });
      g.appendChild(s('circle', { cx: p.x, cy: p.y, r: R, fill, stroke, 'stroke-width': sw }));
      g.appendChild(text(p.x, p.y, i, { 'font-size': R < 11 ? 9 : 13, 'font-weight': 700, style: { pointerEvents: 'none' } }));
      if (isRoot) g.appendChild(text(p.x, p.y + R + 10, 'vel. ' + size[i], { 'font-size': 10, fill: C.ink2 }));
      pic.appendChild(g);
    }
    sOps.textContent = ops; sSteps.textContent = steps; sDepth.textContent = maxDepth; sSets.textContent = roots.length;
    status.textContent = log;
    btnSize.textContent = 'unija po veličini: ' + (bySize ? 'DA' : 'NE'); btnSize.classList.toggle('active', bySize);
    btnComp.textContent = 'kompresija puta: ' + (compress ? 'DA' : 'NE'); btnComp.classList.toggle('active', compress);
    btnModeU.classList.toggle('active', mode === 'union'); btnModeF.classList.toggle('active', mode === 'find');
  }
  const btnSize = button('', () => { bySize = !bySize; draw(); });
  const btnComp = button('', () => { compress = !compress; draw(); });
  const btnModeU = button('klik: unite', () => { mode = 'union'; sel = null; draw(); });
  const btnModeF = button('klik: find', () => { mode = 'find'; sel = null; draw(); });
  root.append(
    h('div', { class: 'bar' }, [
      btnSize, btnComp, h('span', { class: 'sep' }), btnModeU, btnModeF, h('span', { class: 'sep' }),
      ...(compact ? [] : [h('label', {}, ['a = ']), inA, h('label', {}, ['b = ']), inB,
        button('unite(a, b)', () => unite(+inA.value, +inB.value), 'primary'), button('find(a)', () => doFind(+inA.value)), h('span', { class: 'sep' })]),
      button('Lanac', () => preset('chain')), button('Binomno', () => preset('binom')), button('Slučajno', () => preset('random')), button('Ispočetka', () => reset()),
      ...(compact ? [] : [h('label', {}, [' n = ']), Viz.select([8, 12, 16].map(v => ({ value: v, label: v })), n, v => { n = +v; inA.max = n - 1; inB.max = n - 1; reset(); })])
    ]),
    pic,
    h('div', { class: 'stats' }, [stat('operacija:', sOps), stat('koraka u find-u:', sSteps), stat('najveća dubina:', sDepth), stat('skupova:', sSets),
      Viz.legend([{ label: 'predstavnik', color: C.blueSoft }, { label: 'put find-a', color: C.orange }, { label: 'nova veza', color: C.aqua }, { label: 'prevezano', color: C.violet }])]),
    status
  );
  reset();
  if (opts.preset) preset(opts.preset);
});
