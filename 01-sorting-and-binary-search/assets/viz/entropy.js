/* Dva stabla pitanja za četiri elementa: jednake vjerojatnosti vs. nejednake (½, ¼, ⅛, ⅛).
   Očekivani broj pitanja = očekivana duljina koda = entropija (za ove dvije razdiobe točno). */
Viz.register('entropy', function (root) {
  const { C, h, s, svg, clear, text } = Viz;
  const W = 760, H = 250;
  const pic = svg(W, H);

  // stablo: {q, yes, no} ili {leaf, p, pTxt}
  const uniform = { q: 'A ili B?', yes: { q: 'A?', yes: { leaf: 'A', p: 0.25, pTxt: '¼' }, no: { leaf: 'B', p: 0.25, pTxt: '¼' } },
    no: { q: 'C?', yes: { leaf: 'C', p: 0.25, pTxt: '¼' }, no: { leaf: 'D', p: 0.25, pTxt: '¼' } } };
  const skewed = { q: 'A?', yes: { leaf: 'A', p: 0.5, pTxt: '½' },
    no: { q: 'B?', yes: { leaf: 'B', p: 0.25, pTxt: '¼' }, no: { q: 'C?', yes: { leaf: 'C', p: 0.125, pTxt: '⅛' }, no: { leaf: 'D', p: 0.125, pTxt: '⅛' } } } };

  function drawTree(tree, x0, width, title) {
    const leaves = [];
    (function collect(t) { if (t.leaf) leaves.push(t); else { collect(t.yes); collect(t.no); } })(tree);
    leaves.forEach((lf, i) => { lf.x = x0 + 30 + i * (width - 60) / (leaves.length - 1); });
    let depthMax = 0;
    (function depth(t, d) { t.d = d; depthMax = Math.max(depthMax, d); if (!t.leaf) { depth(t.yes, d + 1); depth(t.no, d + 1); } })(tree, 0);
    const levelH = (H - 110) / depthMax;
    (function layout(t) { if (t.leaf) { t.y = 36 + t.d * levelH; return t.x; } const a = layout(t.yes), b = layout(t.no); t.x = (a + b) / 2; t.y = 36 + t.d * levelH; return t.x; })(tree);
    let expected = 0, entropy = 0;
    (function draw(t, code) {
      if (t.leaf) {
        t.code = code; expected += t.p * code.length; entropy += -t.p * Viz.log2(t.p);
        pic.appendChild(s('circle', { cx: t.x, cy: t.y, r: 14, fill: C.aquaSoft, stroke: C.aqua, 'stroke-width': 1.5 }));
        pic.appendChild(text(t.x, t.y, t.leaf, { 'font-size': 13, 'font-weight': 700 }));
        pic.appendChild(text(t.x, t.y + 26, 'p = ' + t.pTxt, { 'font-size': 11, fill: C.ink2 }));
        pic.appendChild(text(t.x, t.y + 41, code, { 'font-size': 11, fill: C.green, 'font-family': 'ui-monospace, Menlo, Consolas, monospace' }));
        return;
      }
      for (const [child, bit] of [[t.yes, '1'], [t.no, '0']]) {
        pic.appendChild(s('line', { x1: t.x, y1: t.y, x2: child.x, y2: child.y, stroke: C.gray, 'stroke-width': 1.5 }));
        const mx = (t.x + child.x) / 2, my = (t.y + child.y) / 2;
        pic.appendChild(s('rect', { x: mx - 16, y: my - 8, width: 32, height: 16, rx: 8, fill: C.surface }));
        pic.appendChild(text(mx, my, (bit === '1' ? 'da ' : 'ne ') + bit, { 'font-size': 10.5, fill: C.muted }));
        draw(child, code + bit);
      }
      pic.appendChild(s('rect', { x: t.x - 32, y: t.y - 12, width: 64, height: 24, rx: 12, fill: C.surface2, stroke: C.gray, 'stroke-width': 1.5 }));
      pic.appendChild(text(t.x, t.y, t.q, { 'font-size': 12 }));
    })(tree, '');
    pic.appendChild(text(x0 + width / 2, 12, title, { 'font-size': 13, 'font-weight': 700, fill: C.ink2 }));
    pic.appendChild(text(x0 + width / 2, H - 10, `očekivano pitanja = ${Viz.fmt(expected, 2)} bita   ·   entropija H = ${Viz.fmt(entropy, 2)} bita`, { 'font-size': 12.5, fill: C.ink }));
  }
  clear(pic);
  drawTree(uniform, 0, W / 2 - 10, 'jednake vjerojatnosti: p = ¼ za svaki element');
  pic.appendChild(s('line', { x1: W / 2, y1: 10, x2: W / 2, y2: H - 10, stroke: C.grid }));
  drawTree(skewed, W / 2 + 10, W / 2 - 10, 'nejednake vjerojatnosti: ½, ¼, ⅛, ⅛');
  root.append(pic);
});
