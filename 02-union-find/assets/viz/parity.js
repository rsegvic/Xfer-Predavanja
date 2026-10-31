/* Union-find s paritetom: svaki čvor pamti paritet puta do roditelja. Brid (u, v) traži različit paritet;
   ako su u i v već u istom skupu s jednakim paritetom, nastaje neparni ciklus — graf nije bipartitan. */
Viz.register('parity', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 8;
  const rand = Viz.rng(+opts.seed || 31);
  const W = 360, H = 320, cx0 = 180, cy0 = 160, R = 118, NR = 20;
  let link, par, edges, sel, log, bad;
  const pic = svg(W, H);
  const panel = h('div', { style: { flex: '1 1 260px' } });
  const status = h('div', { class: 'status' });
  const sEdges = h('b'), sSets = h('b');
  const list = h('div', { class: 'perm-list' });
  const pos = i => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx0 + R * Math.cos(a), cy0 + R * Math.sin(a)]; };

  function reset() { link = Viz.range(n); par = Array(n).fill(0); edges = []; sel = null; bad = false; log = 'Klikni dva čvora da dodaš brid. Boja čvora = paritet unutar njegove komponente.'; draw(); }
  function find(x) { // vraća [predstavnik, paritet od x do predstavnika], s kompresijom
    if (link[x] === x) return [x, 0];
    const [r, p] = find(link[x]); link[x] = r; par[x] ^= p; return [r, par[x]];
  }
  function addEdge(u, v) {
    if (u === v) return;
    const [ru, pu] = find(u), [rv, pv] = find(v);
    let ok = true;
    if (ru === rv) { ok = pu !== pv; }
    else { link[rv] = ru; par[rv] = pu ^ pv ^ 1; }
    edges.push({ u, v, ok });
    if (!ok) { bad = true; log = `Brid (${u}, ${v}): oba su u skupu s predstavnikom ${ru} i imaju ISTI paritet (${pu}) → neparni ciklus. Graf nije bipartitan.`; }
    else if (ru === rv) log = `Brid (${u}, ${v}): već u istom skupu, pariteti ${pu} i ${pv} su različiti — u redu, brid zatvara parni ciklus.`;
    else log = `Brid (${u}, ${v}): spajam skupove; par[${rv}] = ${pu} ⊕ ${pv} ⊕ 1 = ${par[rv]} tako da ${u} i ${v} dobiju različit paritet.`;
    draw();
  }
  function preset(kind) {
    reset();
    if (kind === 'bip') { const side = Viz.range(n).map(i => i % 2); let cnt = 0; while (cnt < n + 1) { const u = Math.floor(rand() * n), v = Math.floor(rand() * n); if (u !== v && side[u] !== side[v] && !edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) { addEdge(u, v); cnt++; } } log = 'Slučajan bipartitan graf: parni i neparni vrhovi su dvije strane. Dodaj brid između dva iste boje!'; }
    else if (kind === 'odd') { addEdge(0, 1); addEdge(1, 2); addEdge(2, 0); }
    draw();
  }
  function draw() {
    clear(pic);
    for (const e of edges) {
      const [x1, y1] = pos(e.u), [x2, y2] = pos(e.v);
      pic.appendChild(s('line', { x1, y1, x2, y2, stroke: e.ok ? C.ink2 : C.red, 'stroke-width': e.ok ? 2 : 4, 'stroke-dasharray': e.ok ? null : '6 4' }));
    }
    const roots = new Set();
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i), [r, p] = find(i); roots.add(r);
      const g = s('g', { style: { cursor: 'pointer' } });
      g.addEventListener('click', () => { if (sel == null) { sel = i; log = `Odabran ${i}; klikni drugi čvor.`; draw(); } else if (sel === i) { sel = null; draw(); } else { const a = sel; sel = null; addEdge(a, i); } });
      const alone = link[i] === i && !edges.some(e => e.u === i || e.v === i);
      g.appendChild(s('circle', { cx: x, cy: y, r: NR, fill: alone ? C.surface2 : p === 0 ? C.blueSoft : C.orangeSoft, stroke: sel === i ? C.yellow : alone ? C.gray : p === 0 ? C.blue : C.orange, 'stroke-width': sel === i ? 4 : 2 }));
      g.appendChild(text(x, y - 4, i, { 'font-size': 14, 'font-weight': 700, style: { pointerEvents: 'none' } }));
      g.appendChild(text(x, y + 9, alone ? '' : 'p=' + p, { 'font-size': 9, fill: C.ink2, style: { pointerEvents: 'none' } }));
      pic.appendChild(g);
    }
    sEdges.textContent = edges.length; sSets.textContent = roots.size;
    list.replaceChildren(...edges.map(e => h('span', { style: { background: e.ok ? C.surface2 : C.redSoft } }, [`(${e.u}, ${e.v})` + (e.ok ? '' : ' ✗')])));
    status.className = bad ? 'status' : 'status ok'; status.textContent = log;
    if (!bad && edges.length) status.className = 'status';
  }
  panel.append(h('div', { class: 'stats' }, [stat('bridova:', sEdges), stat('skupova:', sSets)]), h('div', { class: 'hint', style: { marginTop: '6px' } }, ['Dodani bridovi:']), list, status);
  root.append(
    h('div', { class: 'bar' }, [button('Slučajan bipartitan graf', () => preset('bip')), button('Dodaj trokut 0-1-2', () => preset('odd')), button('Ispočetka', () => reset())]),
    h('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' } }, [h('div', { style: { flex: '0 0 42%', maxWidth: '380px' } }, [pic]), panel]),
    Viz.legend([{ label: 'paritet 0', color: C.blueSoft }, { label: 'paritet 1', color: C.orangeSoft }, { label: 'brid koji ruši bipartitnost', color: C.red }])
  );
  reset();
});
