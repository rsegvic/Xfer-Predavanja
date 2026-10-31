/* Kruskalov algoritam: bridovi sortirani po težini, union-find odlučuje stvara li brid ciklus. */
Viz.register('kruskal', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 10;
  const rand = Viz.rng(+opts.seed || 13);
  const PAL = [C.blue, C.orange, C.aqua, C.yellow, C.violet, C.red, C.magenta, C.green, '#8a5a2b', '#2b8a8a'];
  const W = 560, H = 300;
  let pts, edges, idx, link, total, last;
  const pic = svg(W, H);
  const list = h('div', { class: 'perm-list', style: { flexDirection: 'column', flexWrap: 'nowrap', gap: '2px', maxHeight: '330px', overflow: 'auto', flex: '0 0 150px' } });
  const status = h('div', { class: 'status' });
  const sTotal = h('b'), sAcc = h('b'), sRej = h('b');
  const find = x => { while (link[x] !== x) x = link[x]; return x; };

  function newGraph() {
    pts = [];
    while (pts.length < n) {
      const p = [40 + rand() * (W - 80), 30 + rand() * (H - 60)];
      if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 70)) pts.push(p);
    }
    const dist = (i, j) => Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
    const set = new Set(), add = (i, j) => set.add(i < j ? i + ',' + j : j + ',' + i);
    for (let i = 0; i < n; i++) { const near = Viz.range(n).filter(j => j !== i).sort((a, b) => dist(i, a) - dist(i, b)); near.slice(0, 2).forEach(j => add(i, j)); }
    // osiguraj povezanost: dodaj najkraće bridove koji spajaju komponente
    const all = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) all.push([dist(i, j), i, j]);
    all.sort((a, b) => a[0] - b[0]);
    const l2 = Viz.range(n); const f2 = x => { while (l2[x] !== x) x = l2[x]; return x; };
    for (const k of set) { const [i, j] = k.split(',').map(Number); const a = f2(i), b = f2(j); if (a !== b) l2[a] = b; }
    for (const [d, i, j] of all) { const a = f2(i), b = f2(j); if (a !== b) { l2[a] = b; add(i, j); } }
    edges = [...set].map(k => { const [i, j] = k.split(',').map(Number); return { u: i, v: j, w: Math.max(1, Math.round(dist(i, j) / 12)), st: 'pending' }; });
    edges.sort((a, b) => a.w - b.w || a.u - b.u);
    restart();
  }
  function restart() { link = Viz.range(n); idx = 0; total = 0; last = null; edges.forEach(e => e.st = 'pending'); draw(); }
  function step() {
    if (idx >= edges.length) return false;
    const e = edges[idx++]; last = e;
    const a = find(e.u), b = find(e.v);
    if (a === b) e.st = 'rejected'; else { link[a] = b; e.st = 'accepted'; total += e.w; }
    draw();
    return idx < edges.length;
  }
  function draw() {
    clear(pic);
    for (const e of edges) {
      const [x1, y1] = pts[e.u], [x2, y2] = pts[e.v];
      let col = C.gray, w = 1.5, dash = null, op = 1;
      if (e.st === 'accepted') { col = C.aqua; w = 4; } else if (e.st === 'rejected') { col = C.red; dash = '6 4'; op = 0.7; }
      if (e === last) { w = e.st === 'accepted' ? 5 : 3; col = e.st === 'rejected' ? C.red : C.orange; }
      pic.appendChild(s('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': w, 'stroke-dasharray': dash, opacity: op }));
    }
    for (const e of edges) {
      const [x1, y1] = pts[e.u], [x2, y2] = pts[e.v], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      pic.appendChild(s('rect', { x: mx - 10, y: my - 8, width: 20, height: 16, rx: 6, fill: C.surface, opacity: 0.92 }));
      pic.appendChild(text(mx, my, e.w, { 'font-size': 11, fill: e.st === 'rejected' ? C.muted : C.ink }));
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i], k = find(i) % PAL.length;
      pic.appendChild(s('circle', { cx: x, cy: y, r: 14, fill: C.surface, stroke: PAL[k], 'stroke-width': 3.5 }));
      pic.appendChild(text(x, y, i, { 'font-size': 12, 'font-weight': 700 }));
    }
    list.replaceChildren(...edges.map((e, i) => h('span', { style: { background: e === last ? C.orangeSoft : (e.st === 'accepted' ? C.aquaSoft : e.st === 'rejected' ? C.redSoft : C.surface2), color: C.ink, textDecoration: e.st === 'rejected' ? 'line-through' : 'none' } }, [`${String(e.w).padStart(2, ' ')}  (${e.u}, ${e.v})` + (e.st === 'accepted' ? ' ✓' : e.st === 'rejected' ? ' ✗' : '')])));
    sTotal.textContent = total; sAcc.textContent = edges.filter(e => e.st === 'accepted').length; sRej.textContent = edges.filter(e => e.st === 'rejected').length;
    if (idx >= edges.length) { status.className = 'status ok'; status.textContent = `Gotovo: razapinjuće stablo ima ${n - 1} bridova, ukupna težina ${total}.`; }
    else if (last) { status.className = 'status'; status.textContent = `Brid (${last.u}, ${last.v}) težine ${last.w}: ` + (last.st === 'accepted' ? `${last.u} i ${last.v} su u različitim skupovima → dodajem i spajam skupove.` : `${last.u} i ${last.v} su već u istom skupu → brid bi zatvorio ciklus, preskačem.`); }
    else { status.className = 'status'; status.textContent = 'Bridovi su sortirani po težini (popis desno). Boja oboda vrha = njegov skup u union-find strukturi.'; }
  }
  const play = Viz.player(step, 700, r => { btnPlay.textContent = r ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  root.append(
    h('div', { class: 'bar' }, [button('Korak', () => { play.stop(); step(); }), btnPlay, button('Ispočetka', () => { play.stop(); restart(); }), button('Novi graf', () => { play.stop(); newGraph(); }),
      h('span', { class: 'sep' }), stat('težina MST-a:', sTotal), stat('dodano:', sAcc), stat('odbačeno:', sRej)]),
    h('div', { style: { display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'center' } }, [h('div', { style: { flex: '0 1 640px', minWidth: 0 } }, [pic]), list]),
    status
  );
  newGraph();
});
