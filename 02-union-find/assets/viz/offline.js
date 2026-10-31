/* Brisanje bridova unatrag: upite „obriši brid” obrađujemo od zadnjeg prema prvom kao „dodaj brid”. */
Viz.register('offline', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 9;
  const rand = Viz.rng(+opts.seed || 23);
  const PAL = [C.blue, C.orange, C.aqua, C.yellow, C.violet, C.red, C.magenta, C.green, '#8a5a2b'];
  const W = 460, H = 280;
  let pts, edges, order, t, link, size, answers, lastEdge;
  const pic = svg(W, H);
  const tbl = h('table', { style: { flex: '0 0 auto' } });
  const status = h('div', { class: 'status' });
  const sT = h('b'), sComp = h('b'), sMax = h('b');
  const find = x => { while (link[x] !== x) x = link[x]; return x; };

  function newGraph() {
    pts = [];
    const cols = 3, rows = Math.ceil(n / cols);
    for (let i = 0; i < n; i++) pts.push([60 + (i % cols) * (W - 120) / (cols - 1) + (rand() - 0.5) * 40, 40 + Math.floor(i / cols) * (H - 80) / (rows - 1) + (rand() - 0.5) * 30]);
    const dist = (i, j) => Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
    const cand = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) cand.push([dist(i, j), i, j]);
    cand.sort((a, b) => a[0] - b[0]);
    edges = cand.slice(0, 13).map(([d, u, v]) => ({ u, v }));
    order = Viz.shuffle(Viz.range(edges.length), rand);   // order[k] = indeks brida koji se briše kao (k+1)-vi
    edges.forEach((e, i) => e.del = order.indexOf(i) + 1);
    restart();
  }
  function restart() {
    t = edges.length; link = Viz.range(n); size = Array(n).fill(1); answers = {}; lastEdge = null;
    record(); draw();
  }
  function record() { const roots = new Set(Viz.range(n).map(find)); answers[t] = { comp: roots.size, max: Math.max(...[...roots].map(r => size[r])) }; }
  function step() {
    if (t <= 0) return false;
    const e = edges[order[t - 1]]; lastEdge = e; t--;
    const a = find(e.u), b = find(e.v);
    if (a !== b) { link[a] = b; size[b] += size[a]; }
    record(); draw();
    return t > 0;
  }
  function draw() {
    clear(pic);
    for (const e of edges) {
      const [x1, y1] = pts[e.u], [x2, y2] = pts[e.v], present = e.del > t;
      pic.appendChild(s('line', { x1, y1, x2, y2, stroke: e === lastEdge ? C.aqua : present ? C.ink2 : C.gray, 'stroke-width': e === lastEdge ? 4 : present ? 2.5 : 1.2, 'stroke-dasharray': present ? null : '4 4', opacity: present ? 1 : 0.6 }));
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      pic.appendChild(s('circle', { cx: mx, cy: my, r: 8, fill: present ? C.surface : C.surface2, stroke: C.grid }));
      pic.appendChild(text(mx, my, e.del, { 'font-size': 9, fill: present ? C.ink : C.muted }));
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i];
      pic.appendChild(s('circle', { cx: x, cy: y, r: 13, fill: C.surface, stroke: PAL[find(i) % PAL.length], 'stroke-width': 3.5 }));
      pic.appendChild(text(x, y, i, { 'font-size': 12, 'font-weight': 700 }));
    }
    tbl.replaceChildren(h('tr', {}, [h('th', { class: 'num' }, ['t (obrisano)']), h('th', { class: 'num' }, ['komponenti']), h('th', { class: 'num' }, ['najveća'])]),
      ...Viz.range(edges.length + 1).map(k => { const a = answers[k]; return h('tr', { style: { background: k === t ? C.aquaSoft : null, color: a ? C.ink : C.muted } }, [h('td', { class: 'num' }, [k]), h('td', { class: 'num' }, [a ? a.comp : '?']), h('td', { class: 'num' }, [a ? a.max : '?'])]); }));
    const a = answers[t];
    sT.textContent = t; sComp.textContent = a.comp; sMax.textContent = a.max;
    if (t === 0) { status.className = 'status ok'; status.textContent = 'Svi odgovori su poznati. Čitamo ih od t = 0 prema t = m: to je odgovor nakon svakog brisanja redom.'; }
    else if (lastEdge) { status.className = 'status'; status.textContent = `Vraćam brid (${lastEdge.u}, ${lastEdge.v}) koji je bio obrisan kao ${lastEdge.del}. po redu → stanje nakon ${t} brisanja: ${a.comp} komponenti, najveća ${a.max}.`; }
    else { status.className = 'status'; status.textContent = `Krećemo od kraja: svih ${edges.length} bridova je obrisano (brojevi na bridovima = redoslijed brisanja). Svaki korak vraća zadnji obrisani brid.`; }
  }
  const play = Viz.player(step, 700, r => { btnPlay.textContent = r ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  root.append(
    h('div', { class: 'bar' }, [button('Korak unatrag', () => { play.stop(); step(); }), btnPlay, button('Ispočetka', () => { play.stop(); restart(); }), button('Novi primjer', () => { play.stop(); newGraph(); }),
      h('span', { class: 'sep' }), stat('t =', sT), stat('komponenti:', sComp), stat('najveća komponenta:', sMax)]),
    h('div', { style: { display: 'flex', gap: '16px', alignItems: 'flex-start' } }, [h('div', { style: { flex: '1 1 auto', minWidth: 0 } }, [pic]), tbl]),
    status
  );
  newGraph();
});
