/* Naivni pristup: polje oznaka. find = pogledaj oznaku (1 korak); unite = prepiši sve oznake jednog skupa (n koraka). */
Viz.register('labels', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 12;
  const rand = Viz.rng(+opts.seed || 5);
  const PAL = [C.blue, C.orange, C.aqua, C.yellow, C.violet, C.red, C.magenta, C.green];
  const SOFT = [C.blueSoft, C.orangeSoft, C.aquaSoft, C.yellowSoft, C.violetSoft, C.redSoft, '#f9dde8', '#cde9cd'];
  let label, writes, ops, log, changed;
  const W = 720, H = 96;
  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const sOps = h('b'), sWrites = h('b'), sSets = h('b');
  const inA = h('input', { type: 'number', value: 2, min: 0, max: n - 1 }), inB = h('input', { type: 'number', value: 5, min: 0, max: n - 1 });

  function reset() { label = Viz.range(n); writes = 0; ops = 0; changed = new Set(); log = 'Svaki element ima svoju oznaku: n skupova.'; draw(); }
  function unite(a, b) {
    if (isNaN(a) || isNaN(b) || a < 0 || b < 0 || a >= n || b >= n) return;
    ops++; changed = new Set();
    const la = label[a], lb = label[b];
    if (la === lb) { log = `unite(${a}, ${b}): već u istom skupu (oznaka ${la}). 0 zapisa, ali svejedno moramo provjeriti.`; draw(); return; }
    for (let i = 0; i < n; i++) if (label[i] === lb) { label[i] = la; changed.add(i); }
    writes += changed.size;
    log = `unite(${a}, ${b}): svaku oznaku ${lb} prepisujem u ${la} — pregledano ${n} polja, promijenjeno ${changed.size}.`;
    draw();
  }
  function draw() {
    clear(pic);
    const cw = (W - 16) / n, y0 = 30, ch = 44;
    for (let i = 0; i < n; i++) {
      const x = 8 + i * cw, k = label[i] % PAL.length;
      pic.appendChild(s('rect', { x: x + 3, y: y0, width: cw - 6, height: ch, rx: 7, fill: SOFT[k], stroke: changed.has(i) ? C.ink : PAL[k], 'stroke-width': changed.has(i) ? 3 : 1.5 }));
      pic.appendChild(text(x + cw / 2, y0 + ch / 2, label[i], { 'font-size': 17, 'font-weight': 700 }));
      pic.appendChild(text(x + cw / 2, y0 - 12, 'i = ' + i, { 'font-size': 11, fill: C.muted }));
    }
    pic.appendChild(text(8, y0 + ch + 14, 'oznaka[i]', { 'font-size': 11, fill: C.muted, 'text-anchor': 'start' }));
    sOps.textContent = ops; sWrites.textContent = writes; sSets.textContent = new Set(label).size;
    status.textContent = log;
  }
  root.append(
    h('div', { class: 'bar' }, [
      h('label', {}, ['unite(']), inA, h('label', {}, [',']), inB, h('label', {}, [')']),
      button('Spoji', () => unite(+inA.value, +inB.value), 'primary'),
      button('Slučajna unija', () => { const a = Math.floor(rand() * n), b = Math.floor(rand() * n); inA.value = a; inB.value = b; unite(a, b); }),
      button('Ispočetka', () => reset()),
      h('span', { class: 'sep' }), stat('unija:', sOps), stat('zapisa u polje:', sWrites), stat('skupova:', sSets)
    ]),
    pic, status
  );
  reset();
});
