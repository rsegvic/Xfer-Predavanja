/* Koje usporedbe određuju poredak? Klikom na dva elementa usporedi ih; prati se broj poredaka
   koji su u skladu s dosadašnjim usporedbama (linearna proširenja), dobiveni bitovi,
   te koje su usporedbe nužne (susjedi u konačnom poretku), a koje suvišne. */
Viz.register('order', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat, fmt } = Viz;
  let n = +opts.n || 5;
  const rand = Viz.rng(+opts.seed || 33);
  const L = 'ABCDEFG';
  let value, comps, sel, perms, count, hintPair, showImplied = true, log;
  const W = 400, H = 330, cx0 = 200, cy0 = 150, R = 112, NR = 22;
  const pic = svg(W, H);
  const panel = h('div', { style: { flex: '1 1 300px', minWidth: '260px' } });
  const status = h('div', { class: 'status' });
  const sPerms = h('b'), sBits = h('b'), sComps = h('b'), sBound = h('b');
  const permList = h('div', { class: 'perm-list' });
  const uid = 'or' + Math.floor(Math.random() * 1e9);

  function allPerms(m) { const out = []; (function rec(cur, rest) { if (!rest.length) { out.push(cur); return; } rest.forEach((e, i) => rec(cur.concat(e), rest.filter((_, j) => j !== i))); })([], Viz.range(m)); return out; }
  function consistent(order, cs) { const pos = []; order.forEach((e, i) => pos[e] = i); return cs.every(c => pos[c.a] < pos[c.b]); }
  function countWith(cs) { let c = 0; for (const p of perms) if (consistent(p, cs)) c++; return c; }
  function closure() { // implied[a] = skup b takvih da a < b slijedi iz usporedbi
    const adj = Viz.range(n).map(() => []); comps.forEach(c => adj[c.a].push(c.b));
    return Viz.range(n).map(a => { const seen = new Set(); const st = [...adj[a]]; while (st.length) { const b = st.pop(); if (seen.has(b)) continue; seen.add(b); st.push(...adj[b]); } return seen; });
  }
  function reset() {
    value = Viz.shuffle(Viz.range(n), rand); perms = allPerms(n); comps = []; sel = null; hintPair = null; log = []; count = perms.length; draw();
  }
  function compare(a, b) {
    if (value[a] > value[b]) [a, b] = [b, a];      // a < b
    const before = count;
    const implied = closure()[a].has(b);
    comps.push({ a, b, redundant: implied });
    count = countWith(comps);
    log.push({ a, b, before, after: count, implied });
    sel = null; hintPair = null; draw();
  }
  function hint() {
    const cl = closure(); let best = null;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
      if (cl[a].has(b) || cl[b].has(a)) continue;
      const c1 = countWith(comps.concat({ a, b })), c2 = countWith(comps.concat({ a: b, b: a }));
      const bal = Math.min(c1, c2);
      if (!best || bal > best.bal) best = { a, b, c1, c2, bal };
    }
    hintPair = best; draw();
  }
  function pos(i) { const ang = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx0 + R * Math.cos(ang), cy0 + R * Math.sin(ang)]; }

  function draw() {
    clear(pic);
    pic.appendChild(s('defs', {}, [
      ['b', C.blue], ['g', C.gray], ['q', C.aqua], ['v', C.violet]].map(([id, col]) =>
      s('marker', { id: uid + id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, [s('path', { d: 'M0 0 L10 5 L0 10 z', fill: col })]))));
    const done = count === 1;
    const order = done ? perms.find(p => consistent(p, comps)) : null;
    const posIn = []; if (order) order.forEach((e, i) => posIn[e] = i);
    const arrow = (a, b, col, dash, w, mk) => {
      const [x1, y1] = pos(a), [x2, y2] = pos(b); const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
      pic.appendChild(s('line', { x1: x1 + ux * (NR + 2), y1: y1 + uy * (NR + 2), x2: x2 - ux * (NR + 4), y2: y2 - uy * (NR + 4), stroke: col, 'stroke-width': w, 'stroke-dasharray': dash || null, 'marker-end': `url(#${uid}${mk})` }));
    };
    // zaključene (tranzitivne) relacije
    if (showImplied && !done) {
      const cl = closure();
      for (let a = 0; a < n; a++) for (const b of cl[a]) if (!comps.some(c => c.a === a && c.b === b)) arrow(a, b, C.violet, '3 4', 1.2, 'v');
    }
    // izravne usporedbe
    for (const c of comps) {
      let col = C.blue, dash = null, w = 2.2, mk = 'b';
      if (done) { if (posIn[c.b] - posIn[c.a] === 1) { col = C.aqua; w = 3; mk = 'q'; } else { col = C.gray; dash = '5 4'; w = 1.5; mk = 'g'; } }
      else if (c.redundant) { col = C.gray; dash = '5 4'; w = 1.5; mk = 'g'; }
      arrow(c.a, c.b, col, dash, w, mk);
    }
    if (hintPair) { const [x1, y1] = pos(hintPair.a), [x2, y2] = pos(hintPair.b); pic.appendChild(s('line', { x1, y1, x2, y2, stroke: C.yellow, 'stroke-width': 6, opacity: 0.6 })); }
    // čvorovi
    for (let i = 0; i < n; i++) {
      const [x, y] = pos(i), g = s('g', { style: { cursor: done ? 'default' : 'pointer' } });
      g.addEventListener('click', () => { if (done) return; if (sel == null) sel = i; else if (sel === i) sel = null; else { compare(sel, i); return; } draw(); });
      g.appendChild(s('circle', { cx: x, cy: y, r: NR, fill: sel === i ? C.orangeSoft : (done ? C.aquaSoft : C.blueSoft), stroke: sel === i ? C.orange : (done ? C.aqua : C.blue), 'stroke-width': sel === i ? 3 : 1.5 }));
      g.appendChild(text(x, y, L[i], { 'font-size': 17, 'font-weight': 700, style: { pointerEvents: 'none' } }));
      if (done) g.appendChild(text(x, y + NR + 12, '#' + (posIn[i] + 1), { 'font-size': 11, fill: C.ink2 }));
      pic.appendChild(g);
    }
    // lanac na dnu
    if (done) {
      const y = H - 28, step = (W - 60) / (n - 1);
      order.forEach((e, i) => {
        const x = 30 + i * step;
        if (i) { pic.appendChild(s('line', { x1: x - step + 16, y1: y, x2: x - 16, y2: y, stroke: C.aqua, 'stroke-width': 2.5, 'marker-end': `url(#${uid}q)` })); pic.appendChild(text(x - step / 2, y - 11, '<', { 'font-size': 11, fill: C.ink2 })); }
        pic.appendChild(s('circle', { cx: x, cy: y, r: 13, fill: C.aquaSoft, stroke: C.aqua, 'stroke-width': 1.5 }));
        pic.appendChild(text(x, y, L[e], { 'font-size': 13, 'font-weight': 700 }));
      });
    }
    // panel
    sPerms.textContent = `${count} od ${perms.length}`; sBits.textContent = fmt(Viz.log2(count), 2); sComps.textContent = comps.length;
    sBound.textContent = Math.ceil(Viz.log2(perms.length));
    permList.replaceChildren(...(count <= 12 ? perms.filter(p => consistent(p, comps)).map(p => h('span', {}, [p.map(e => L[e]).join(' < ')])) : [h('span', { style: { background: 'none', color: C.muted } }, [`(${count} poredaka — previše za ispis)`])]));
    const last = log[log.length - 1];
    if (done) {
      const nec = comps.filter(c => posIn[c.b] - posIn[c.a] === 1).length;
      status.className = 'status ok';
      status.textContent = `Poredak je jednoznačno određen nakon ${comps.length} usporedbi: ${order.map(e => L[e]).join(' < ')}. Nužne usporedbe (susjedi u poretku): ${nec} = n − 1; suvišne: ${comps.length - nec}.`;
    } else if (hintPair) {
      status.className = 'status';
      status.textContent = `Savjet: usporedi ${L[hintPair.a]} i ${L[hintPair.b]} — dijeli preostale poretke na ${hintPair.c1} : ${hintPair.c2} (najuravnoteženije, ≈ ${fmt(Viz.log2(count / Math.max(hintPair.c1, hintPair.c2)), 2)} bita u gorem ishodu).`;
    } else if (last) {
      status.className = 'status';
      status.textContent = last.implied ? `${L[last.a]} < ${L[last.b]} — to smo već znali iz tranzitivnosti: 0 novih bitova, poredaka i dalje ${last.after}.`
        : `${L[last.a]} < ${L[last.b]}: poredaka ${last.before} → ${last.after}, dobiveno ${fmt(Viz.log2(last.before / last.after), 2)} bita.`;
    } else { status.className = 'status'; status.textContent = sel != null ? `Odabran ${L[sel]}; klikni drugi element za usporedbu.` : 'Klikni dva elementa da ih usporediš. Vrijednosti su skrivene — poznat je samo ishod usporedbe.'; }
    btnImplied.classList.toggle('active', showImplied);
  }

  const btnImplied = button('Zaključci', () => { showImplied = !showImplied; draw(); });
  panel.append(
    h('div', { class: 'stats' }, [stat('mogućih poredaka:', sPerms), stat('preostalo bitova:', sBits), stat('usporedbi:', sComps), stat('⌈log₂ n!⌉ =', sBound)]),
    h('div', { class: 'hint', style: { marginTop: '8px' } }, ['Poredci u skladu s usporedbama:']), permList, status
  );
  root.append(
    h('div', { class: 'bar' }, [
      button('Savjet', () => hint()), button('Natrag', () => { if (comps.length) { comps.pop(); log.pop(); count = countWith(comps); hintPair = null; sel = null; draw(); } }),
      btnImplied, button('Novi primjer', () => reset()),
      h('label', {}, [' n = ']), Viz.select([4, 5, 6, 7].map(v => ({ value: v, label: v })), n, v => { n = +v; reset(); })
    ]),
    h('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start', flexWrap: 'wrap' } }, [h('div', { style: { flex: '0 0 44%', maxWidth: '420px' } }, [pic]), panel]),
    Viz.legend([{ label: 'izravna usporedba', color: C.blue }, { label: 'zaključeno (tranzitivno)', color: C.violet }, { label: 'suvišna', color: C.gray }, { label: 'nužna (susjedi)', color: C.aqua }])
  );
  reset();
});
