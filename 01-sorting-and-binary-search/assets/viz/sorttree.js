/* Stablo odluke za sortiranje tri elementa: 6 listova (poredaka), dubina 3 = ⌈log₂ 6⌉. */
Viz.register('sorttree', function (root) {
  const { C, h, s, svg, clear, text } = Viz;
  const W = 760, H = 250;
  const pic = svg(W, H);
  const tree = { q: 'a < b?',
    yes: { q: 'b < c?', yes: { leaf: 'a < b < c' }, no: { q: 'a < c?', yes: { leaf: 'a < c < b' }, no: { leaf: 'c < a < b' } } },
    no: { q: 'a < c?', yes: { leaf: 'b < a < c' }, no: { q: 'b < c?', yes: { leaf: 'b < c < a' }, no: { leaf: 'c < b < a' } } } };
  const leaves = [];
  (function collect(t) { if (t.leaf) leaves.push(t); else { collect(t.yes); collect(t.no); } })(tree);
  leaves.forEach((lf, i) => { lf.x = 70 + i * (W - 140) / (leaves.length - 1); });
  let depthMax = 0;
  (function depth(t, d) { t.d = d; depthMax = Math.max(depthMax, d); if (!t.leaf) { depth(t.yes, d + 1); depth(t.no, d + 1); } })(tree, 0);
  const levelH = (H - 60) / depthMax;
  (function layout(t) { if (t.leaf) { t.y = 24 + t.d * levelH; return t.x; } const a = layout(t.yes), b = layout(t.no); t.x = (a + b) / 2; t.y = 24 + t.d * levelH; return t.x; })(tree);
  (function draw(t) {
    if (t.leaf) {
      pic.appendChild(s('rect', { x: t.x - 44, y: t.y - 12, width: 88, height: 24, rx: 6, fill: C.aquaSoft, stroke: C.aqua, 'stroke-width': 1.5 }));
      pic.appendChild(text(t.x, t.y, t.leaf, { 'font-size': 12.5, 'font-weight': 600 }));
      return;
    }
    for (const [child, lbl] of [[t.yes, 'da'], [t.no, 'ne']]) {
      pic.appendChild(s('line', { x1: t.x, y1: t.y, x2: child.x, y2: child.y, stroke: C.gray, 'stroke-width': 1.5 }));
      const mx = (t.x + child.x) / 2, my = (t.y + child.y) / 2;
      pic.appendChild(s('rect', { x: mx - 12, y: my - 8, width: 24, height: 16, rx: 8, fill: C.surface }));
      pic.appendChild(text(mx, my, lbl, { 'font-size': 10.5, fill: C.muted }));
      draw(child);
    }
    pic.appendChild(s('rect', { x: t.x - 32, y: t.y - 12, width: 64, height: 24, rx: 12, fill: C.surface2, stroke: C.gray, 'stroke-width': 1.5 }));
    pic.appendChild(text(t.x, t.y, t.q, { 'font-size': 12 }));
  })(tree);
  root.append(pic);
});
