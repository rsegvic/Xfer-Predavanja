/* Mjerenje u pregledniku: koliko koraka (praćenja link[x]) troši find uz različite heuristike. */
Viz.register('bench', function (root, opts) {
  const { C, h, button } = Viz;
  const status = h('div', { class: 'status' }, ['Pritisni „Pokreni mjerenje”. Traje oko sekundu.']);
  const tbl = h('table', {}, [h('tr', {}, [h('th', {}, ['heuristike']), h('th', { class: 'num' }, ['slučajno: najveća dubina']), h('th', { class: 'num' }, ['slučajno: koraka po find-u']), h('th', { class: 'num' }, ['lanac: najveća dubina']), h('th', { class: 'num' }, ['lanac: koraka po find-u'])])]);
  const configs = [['bez heuristika', false, false], ['unija po veličini', true, false], ['kompresija puta', false, true], ['oboje', true, true]];

  function run(n, unions, finds, bySize, compress) {
    const link = new Int32Array(n), size = new Int32Array(n).fill(1);
    for (let i = 0; i < n; i++) link[i] = i;
    let steps = 0;
    const find = x => {
      let r = x; while (link[r] !== r) { r = link[r]; steps++; }
      if (compress) while (link[x] !== r) { const nx = link[x]; link[x] = r; x = nx; }
      return r;
    };
    const unite = (a, b) => { let x = find(a), y = find(b); if (x === y) return; if (bySize && size[x] < size[y]) [x, y] = [y, x]; link[y] = x; size[x] += size[y]; };
    for (const [a, b] of unions) unite(a, b);
    let maxDepth = 0;
    for (let i = 0; i < n; i++) { let d = 0, x = i; while (link[x] !== x) { x = link[x]; d++; } if (d > maxDepth) maxDepth = d; }
    steps = 0;
    for (const x of finds) find(x);
    return { maxDepth, perFind: steps / finds.length };
  }
  function measure() {
    status.textContent = 'Mjerim…';
    setTimeout(() => {
      const rand = Viz.rng(101);
      const n1 = 20000, u1 = [], f1 = [];
      for (let i = 0; i < 30000; i++) u1.push([Math.floor(rand() * n1), Math.floor(rand() * n1)]);
      for (let i = 0; i < 20000; i++) f1.push(Math.floor(rand() * n1));
      const n2 = 10000, u2 = [], f2 = [];
      for (let k = 1; k < n2; k++) u2.push([k, k - 1]);
      for (let i = 0; i < 10000; i++) f2.push(Math.floor(rand() * n2));
      while (tbl.rows.length > 1) tbl.deleteRow(1);
      const t0 = performance.now();
      for (const [name, bySize, compress] of configs) {
        const a = run(n1, u1, f1, bySize, compress), b = run(n2, u2, f2, bySize, compress);
        tbl.appendChild(h('tr', {}, [h('td', {}, [name]), h('td', { class: 'num' }, [a.maxDepth]), h('td', { class: 'num' }, [Viz.fmt(a.perFind, 2)]), h('td', { class: 'num' }, [b.maxDepth]), h('td', { class: 'num' }, [Viz.fmt(b.perFind, 1)])]));
      }
      status.textContent = `Gotovo za ${Math.round(performance.now() - t0)} ms. Slučajno: n = 20 000, 30 000 slučajnih unija pa 20 000 find-ova. Lanac: n = 10 000, unite(k, k−1) za sve k, pa 10 000 slučajnih find-ova. Korak = jedno praćenje link[x].`;
    }, 20);
  }
  root.append(h('div', { class: 'bar' }, [button('Pokreni mjerenje', measure, 'primary')]), tbl, status);
});
