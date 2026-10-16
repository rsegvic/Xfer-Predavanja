/* Stablo odluke binarnog (i linearnog) pretraživanja: put do elementa = njegov kod. */
Viz.register('tree', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat, fmt } = Viz;
  let kind = opts.kind || 'bin8';      // bin8 | bin16 | lin8
  let target = opts.target != null ? +opts.target : 5;
  const W = 760, H = 255;
  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const bitsBox = h('span', { class: 'bits' });
  const sDepth = h('b'), sAvg = h('b'), sBound = h('b');
  let n, nodes, leaves, codes;

  function buildBinary(nn) {
    n = nn; nodes = []; leaves = []; codes = [];
    const depthMax = Math.ceil(Viz.log2(n));
    const leafX = i => 40 + i * (W - 80) / (n - 1);
    const levelH = (H - 80) / depthMax;
    function rec(l, r, depth, code) {
      if (l === r) { const node = { leaf: true, i: l, x: leafX(l), y: 30 + depthMax * levelH, code }; leaves.push(node); codes[l] = code; return node; }
      const mid = Math.floor((l + r) / 2);
      const L = rec(l, mid, depth + 1, code + '0'), R = rec(mid + 1, r, depth + 1, code + '1');
      const node = { leaf: false, mid, x: (L.x + R.x) / 2, y: 30 + depth * levelH, L, R, code };
      nodes.push(node); return node;
    }
    return rec(0, n - 1, 0, '');
  }
  function buildLinear(nn) {
    n = nn; nodes = []; leaves = []; codes = [];
    const dy = (H - 60) / (n - 1), x0 = 150, dx = 40;
    let prev = null, rootNode = null;
    for (let k = 0; k < n - 1; k++) {
      const node = { leaf: false, k, x: x0 + k * dx, y: 24 + k * dy, code: '0'.repeat(k) };
      const leaf = { leaf: true, i: k, x: x0 + k * dx + 170, y: 24 + k * dy + dy * 0.55, code: '0'.repeat(k) + '1' };
      node.R = leaf; leaves.push(leaf); codes[k] = leaf.code; nodes.push(node);
      if (prev) prev.L = node; else rootNode = node; prev = node;
    }
    const last = { leaf: true, i: n - 1, x: x0 + (n - 1) * dx, y: 24 + (n - 1) * dy, code: '0'.repeat(n - 1) };
    prev.L = last; leaves.push(last); codes[n - 1] = last.code;
    return rootNode;
  }
  function build() { return kind === 'lin8' ? buildLinear(8) : buildBinary(kind === 'bin16' ? 16 : 8); }

  function draw() {
    const rootNode = build();
    if (target >= n) target = n - 1;
    clear(pic);
    const path = new Set(); // čvorovi na putu do cilja
    (function walk(node) { if (!node) return false; if (node.leaf) { if (node.i === target) { path.add(node); return true; } return false; }
      if (walk(node.L) || walk(node.R)) { path.add(node); return true; } return false; })(rootNode);
    const lin = kind === 'lin8';
    // bridovi
    for (const nd of nodes) {
      for (const [child, bit] of [[nd.L, '0'], [nd.R, '1']]) {
        const on = path.has(nd) && path.has(child);
        pic.appendChild(s('line', { x1: nd.x, y1: nd.y, x2: child.x, y2: child.y, stroke: on ? C.orange : C.gray, 'stroke-width': on ? 3.5 : 1.5 }));
        const mx = (nd.x + child.x) / 2, my = (nd.y + child.y) / 2;
        const showLabel = lin || n === 8 || nd.code.length <= 1;
        if (showLabel) {
          const lbl = (bit === '0' ? 'ne' : 'da') + ' ' + bit;
          pic.appendChild(s('rect', { x: mx - 17, y: my - 8, width: 34, height: 16, rx: 8, fill: C.surface, opacity: 0.95 }));
          pic.appendChild(text(mx, my, lbl, { 'font-size': 10.5, fill: on ? C.orange : C.muted, 'font-weight': on ? 700 : 400 }));
        }
      }
    }
    // unutarnji čvorovi
    for (const nd of nodes) {
      const on = path.has(nd), w = lin ? 74 : (n === 16 ? 52 : 62);
      pic.appendChild(s('rect', { x: nd.x - w / 2, y: nd.y - 12, width: w, height: 24, rx: 12, fill: on ? C.orangeSoft : C.surface2, stroke: on ? C.orange : C.gray, 'stroke-width': 1.5 }));
      pic.appendChild(text(nd.x, nd.y, lin ? `x = a[${nd.k}]?` : `x > a[${nd.mid}]?`, { 'font-size': n === 16 ? 10.5 : 12, fill: C.ink }));
    }
    // listovi
    for (const lf of leaves) {
      const on = lf.i === target;
      const g = s('g', { style: { cursor: 'pointer' } });
      g.addEventListener('click', () => { target = lf.i; draw(); });
      g.appendChild(s('circle', { cx: lf.x, cy: lf.y, r: 13, fill: on ? C.aquaSoft : C.blueSoft, stroke: on ? C.aqua : C.blue, 'stroke-width': on ? 3 : 1.5 }));
      g.appendChild(text(lf.x, lf.y, lf.i, { 'font-size': 12, fill: C.ink, 'font-weight': 600 }));
      g.appendChild(text(lin ? lf.x + 22 : lf.x, lin ? lf.y : lf.y + 24, lf.code, { 'font-size': lin ? 12 : 11, fill: on ? C.green : C.ink2, 'font-family': 'ui-monospace, Menlo, Consolas, monospace', 'text-anchor': lin ? 'start' : 'middle' }));
      pic.appendChild(g);
    }
    const lens = codes.map(c => c.length);
    sDepth.textContent = Math.max(...lens); sAvg.textContent = fmt(lens.reduce((a, b) => a + b, 0) / n, 2); sBound.textContent = Math.ceil(Viz.log2(n));
    bitsBox.replaceChildren(...[...codes[target]].map(b => h('span', { class: b === '1' ? 'one' : 'zero' }, [b])));
    status.replaceChildren(`Element na poziciji ${target}: odgovori na putu od korijena do lista su `, bitsBox, ` — to je njegov kod od ${codes[target].length} bita. Klikni na list za drugi element.`);
    for (const [k, b] of Object.entries(kindBtns)) b.classList.toggle('active', k === kind);
  }
  const kindBtns = {
    bin8: button('binarno, n = 8', () => { kind = 'bin8'; draw(); }),
    bin16: button('binarno, n = 16', () => { kind = 'bin16'; draw(); }),
    lin8: button('linearno, n = 8', () => { kind = 'lin8'; draw(); })
  };
  root.append(
    h('div', { class: 'bar' }, [h('label', {}, ['pretraživanje: ']), kindBtns.bin8, kindBtns.bin16, kindBtns.lin8,
      h('span', { class: 'sep' }), stat('najdulji kod (dubina):', sDepth), stat('prosječna duljina koda:', sAvg), stat('⌈log₂ n⌉ =', sBound)]),
    pic, status
  );
  draw();
});
