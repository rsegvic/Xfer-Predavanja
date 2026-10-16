/* Bitonično sortiranje: mreža komparatora (žice + komparatori) i stanje niza nakon svake razine. */
Viz.register('bitonic', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  let n = +opts.n || 8, mode = opts.mode || 'sort';
  const rand = Viz.rng(+opts.seed || 17);
  const W = 1200;
  let a, a0, stages, idx, swappedLast, cols;
  const net = svg(W, 300), bars = svg(W, 100);
  const status = h('div', { class: 'status' });
  const sPhase = h('b'), sLevel = h('b'), sComp = h('b');
  const uid = 'bt' + Math.floor(Math.random() * 1e9);

  function buildStages() {
    stages = [];
    const ks = []; if (mode === 'merge') ks.push(n); else for (let k = 2; k <= n; k *= 2) ks.push(k);
    for (const k of ks) for (let j = k / 2; j >= 1; j /= 2) {
      const pairs = [];
      for (let i = 0; i < n; i++) { const l = i ^ j; if (l > i) pairs.push({ i, l, asc: (i & k) === 0 }); }
      // raspored u stupce: komparatori koji se preklapaju idu u različite stupce
      const columns = [];
      for (const p of pairs) {
        let c = columns.findIndex(col => col.every(q => p.l < q.i || p.i > q.l));
        if (c < 0) { columns.push([]); c = columns.length - 1; }
        columns[c].push(p); p.col = c;
      }
      stages.push({ k, j, pairs, ncols: columns.length });
    }
    // x-koordinate
    const left = 70, right = W - 70, gapStage = 12, gapPhase = 22, cw0 = 56;
    let totalCols = stages.reduce((t, st) => t + st.ncols, 0);
    let gaps = 0; stages.forEach((st, i) => { if (i) gaps += st.k !== stages[i - 1].k ? gapPhase : gapStage; });
    const colW = Math.min(cw0, (right - left - gaps) / totalCols);
    let x = left;
    stages.forEach((st, i) => { if (i) x += st.k !== stages[i - 1].k ? gapPhase : gapStage; st.x0 = x; st.pairs.forEach(p => { p.x = x + (p.col + 0.5) * colW; }); x += st.ncols * colW; st.x1 = x; });
  }
  function newArray() {
    const perm = Viz.shuffle(Viz.range(n).map(k => k + 1), rand);
    if (mode === 'merge') { const f = perm.slice(0, n / 2).sort((p, q) => p - q), g = perm.slice(n / 2).sort((p, q) => q - p); a0 = f.concat(g); }
    else a0 = perm;
    buildStages(); restart();
  }
  function restart() { a = a0.slice(); idx = 0; swappedLast = new Set(); draw(); }
  function step() {
    if (idx >= stages.length) return false;
    const st = stages[idx]; swappedLast = new Set();
    for (const p of st.pairs) {
      const wrong = p.asc ? a[p.i] > a[p.l] : a[p.i] < a[p.l];
      if (wrong) { [a[p.i], a[p.l]] = [a[p.l], a[p.i]]; swappedLast.add(p); }
    }
    idx++; draw();
    return idx < stages.length;
  }

  function draw() {
    const Hn = n <= 8 ? 250 : 310, top = 22, dy = (Hn - 46) / (n - 1), wy = i => top + i * dy;
    net.setAttribute('viewBox', `0 0 ${W} ${Hn}`); net.style.aspectRatio = `${W} / ${Hn}`;
    clear(net);
    const mcol = { o: C.orange, k: C.ink, b: C.blue, d: C.ink2, g: C.gray };
    net.appendChild(s('defs', {}, Object.entries(mcol).map(([id, col]) => s('marker', { id: uid + id, viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 9, markerHeight: 9, markerUnits: 'userSpaceOnUse', orient: 'auto' }, [s('path', { d: 'M0 0 L10 5 L0 10 z', fill: col })]))));
    // faze (k) kao pozadinske trake
    let i0 = 0;
    stages.forEach((st, i) => {
      if (i === stages.length - 1 || stages[i + 1].k !== st.k) {
        const x0 = stages[i0].x0 - 6, x1 = st.x1 + 6;
        net.appendChild(s('rect', { x: x0, y: 4, width: x1 - x0, height: Hn - 8, rx: 8, fill: C.surface2 }));
        net.appendChild(text((x0 + x1) / 2, Hn - 10, mode === 'merge' ? 'bitonično spajanje, n = ' + n : 'k = ' + st.k, { 'font-size': 11, fill: C.muted }));
        i0 = i + 1;
      }
    });
    // žice
    for (let i = 0; i < n; i++) {
      net.appendChild(s('line', { x1: 40, y1: wy(i), x2: W - 40, y2: wy(i), stroke: C.gray, 'stroke-width': 1.5 }));
      net.appendChild(text(22, wy(i), a0[i], { 'font-size': 12, fill: C.muted }));
      net.appendChild(text(W - 20, wy(i), a[i], { 'font-size': 12, fill: idx >= stages.length ? C.green : C.ink, 'font-weight': idx >= stages.length ? 700 : 400 }));
    }
    // komparatori
    stages.forEach((st, si) => {
      const state = si < idx - 1 ? 'done' : si === idx - 1 ? 'last' : si === idx ? 'next' : 'pending';
      for (const p of st.pairs) {
        const mk = state === 'last' ? (swappedLast.has(p) ? 'o' : 'k') : state === 'next' ? 'b' : state === 'done' ? 'd' : 'g', col = mcol[mk];
        const w = state === 'last' || state === 'next' ? 2.5 : 1.5;
        const yMin = p.asc ? wy(p.i) : wy(p.l), yMax = p.asc ? wy(p.l) : wy(p.i); // strelica pokazuje kamo ide veći
        net.appendChild(s('line', { x1: p.x, y1: yMin, x2: p.x, y2: yMax, stroke: col, 'stroke-width': w, 'marker-end': `url(#${uid}${mk})` }));
        net.appendChild(s('circle', { cx: p.x, cy: yMin, r: 3.2, fill: col }));
      }
    });
    // položaj izvođenja i trenutne vrijednosti
    const px = idx === 0 ? 52 : stages[idx - 1].x1 + 3;
    net.appendChild(s('line', { x1: px, y1: 8, x2: px, y2: Hn - 20, stroke: C.violet, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }));
    const pillX = idx === 0 ? px + 3 : px - 27;   // pločice s vrijednostima stoje iznad već izvedene razine
    for (let i = 0; i < n; i++) {
      net.appendChild(s('rect', { x: pillX, y: wy(i) - 8, width: 22, height: 16, rx: 4, fill: C.violetSoft }));
      net.appendChild(text(pillX + 11, wy(i), a[i], { 'font-size': 11, fill: C.ink, 'font-weight': 600 }));
    }
    // stupci: stanje niza
    clear(bars);
    const kNow = idx === 0 ? (mode === 'merge' ? n : 1) : stages[idx - 1].k, bw = (W - 40) / n, base = 78, mh = 56;
    for (let i = 0; i < n; i++) {
      const block = Math.floor(i / kNow), asc = mode === 'merge' ? true : (block % 2 === 0);
      const fill = idx >= stages.length ? C.aqua : (kNow === 1 ? C.gray : (asc ? C.blue : C.orange));
      const hh = a[i] / n * mh;
      bars.appendChild(s('rect', { x: 20 + i * bw + 3, y: base - hh, width: bw - 6, height: hh, rx: 3, fill }));
      bars.appendChild(text(20 + i * bw + bw / 2, base - hh - 9, a[i], { 'font-size': 11, fill: C.ink2 }));
      if (i % kNow === 0 && kNow > 1 && kNow < n) bars.appendChild(s('line', { x1: 20 + i * bw, y1: 6, x2: 20 + i * bw, y2: base + 4, stroke: C.gray, 'stroke-dasharray': '3 3' }));
    }
    if (kNow > 1 && idx < stages.length) for (let b = 0; b < n / kNow; b++) {
      const asc = mode === 'merge' ? true : b % 2 === 0;
      bars.appendChild(text(20 + (b + 0.5) * kNow * bw, 10, (asc ? 'rastući' : 'padajući') + ' blok (' + kNow + ')', { 'font-size': 11, fill: asc ? C.blue : C.orange }));
    }
    bars.appendChild(s('line', { x1: 20, y1: base + 1, x2: W - 20, y2: base + 1, stroke: C.gray }));
    bars.appendChild(text(W / 2, base + 14, idx >= stages.length ? 'sortirano' : (idx === 0 ? 'ulazni niz' : `stanje nakon razine ${idx}`), { 'font-size': 11, fill: C.muted }));
    // statistika
    const totalC = stages.reduce((t, st) => t + st.pairs.length, 0), doneC = stages.slice(0, idx).reduce((t, st) => t + st.pairs.length, 0);
    sLevel.textContent = `${idx} / ${stages.length}`; sComp.textContent = `${doneC} / ${totalC}`;
    sPhase.textContent = idx === 0 ? '—' : `k = ${stages[idx - 1].k}, j = ${stages[idx - 1].j}`;
    if (idx >= stages.length) { status.className = 'status ok'; status.textContent = `Gotovo: ${stages.length} razina, ${totalC} komparatora. Svaka razina može se izvesti paralelno u jednom koraku.`; }
    else if (idx === 0) { status.className = 'status'; status.textContent = mode === 'merge' ? 'Ulaz je bitoničan niz (raste pa pada). Svaka razina uspoređuje parove na udaljenosti j; strelica pokazuje kamo ide veći element.' : 'Pritisni „Korak”: svaka razina usporedi parove na udaljenosti j i veći element pošalje u smjeru strelice.'; }
    else { const st = stages[idx - 1]; status.className = 'status'; status.textContent = `Razina ${idx}: blokovi veličine k = ${st.k}, parovi na udaljenosti j = ${st.j}. Zamijenjeno ${swappedLast.size} od ${st.pairs.length} parova (narančasto).`; }
  }

  const play = Viz.player(step, 900, running => { btnPlay.textContent = running ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  root.append(
    h('div', { class: 'bar' }, [
      button('Korak', () => { play.stop(); step(); }), btnPlay,
      button('Ispočetka', () => { play.stop(); restart(); }), button('Novi niz', () => { play.stop(); newArray(); }),
      h('span', { class: 'sep' }), h('label', {}, ['n = ']), Viz.select([[8, '8'], [16, '16']].map(([v, l]) => ({ value: v, label: l })), n, v => { n = +v; play.stop(); newArray(); }),
      h('label', {}, ['prikaz: ']), Viz.select([{ value: 'sort', label: 'sortiranje' }, { value: 'merge', label: 'spajanje bitoničnog niza' }], mode, v => { mode = v; play.stop(); newArray(); }),
      h('span', { class: 'sep' }), stat('faza:', sPhase), stat('razina:', sLevel), stat('kompar.:', sComp)
    ]),
    net, bars, status
  );
  newArray();
});
