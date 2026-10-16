/* Binarno pretraživanje rješenja: monoton uvjet NE…NE DA…DA, tražimo prvi DA. */
Viz.register('predicate', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 16;
  const rand = Viz.rng(+opts.seed || 3);
  const W = 720, H = 120;

  let t, l, r, mid, checks, evaluated, phase;
  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const sChecks = h('b');

  function reset() {
    t = 2 + Math.floor(rand() * (n - 3));        // prvi d koji zadovoljava uvjet (1-indeksirano)
    l = 1; r = n; mid = null; checks = 0; evaluated = new Map(); phase = 'start'; draw();
  }
  const ok = d => d >= t;

  function step() {
    if (phase === 'done') return false;
    if (l >= r) { phase = 'done'; draw(); return false; }
    mid = Math.floor((l + r) / 2); checks++;
    const res = ok(mid); evaluated.set(mid, res);
    if (res) r = mid; else l = mid + 1;
    phase = l >= r ? 'done' : 'run';
    draw();
    return phase !== 'done';
  }

  function draw() {
    clear(pic);
    const cw = (W - 20) / n, y0 = 30, ch = 46;
    for (let d = 1; d <= n; d++) {
      const cx = 10 + (d - 1) * cw;
      const inside = d >= l && d <= r;
      let fill = inside ? C.blueSoft : C.graySoft, stroke = inside ? C.blue : C.gray, label = '?', col = inside ? C.ink2 : C.muted;
      if (evaluated.has(d)) {
        const res = evaluated.get(d);
        fill = res ? C.aquaSoft : C.redSoft; stroke = res ? C.aqua : C.red; label = res ? 'DA' : 'NE'; col = res ? C.green : C.red;
      }
      if (phase === 'done' && d === l) { stroke = C.ink; }
      pic.appendChild(s('rect', { x: cx + 2, y: y0, width: cw - 4, height: ch, rx: 6, fill, stroke, 'stroke-width': phase === 'done' && d === l ? 3 : 1.5 }));
      pic.appendChild(text(cx + cw / 2, y0 + ch / 2, label, { 'font-size': 15, fill: col, 'font-weight': 700 }));
      pic.appendChild(text(cx + cw / 2, y0 - 12, 'd=' + d, { 'font-size': 11, fill: C.muted }));
    }
    const labels = {};
    const add = (d, lab) => { (labels[d] = labels[d] || []).push(lab); };
    if (phase !== 'done') { add(l, 'l'); if (r !== l) add(r, 'r'); if (mid) add(mid, 'mid'); } else add(l, 'odgovor');
    for (const [d, labs] of Object.entries(labels)) {
      const cx = 10 + (d - 1) * cw + cw / 2, color = phase === 'done' ? C.ink : labs.includes('mid') ? C.orange : C.blue;
      pic.appendChild(s('path', { d: `M${cx} ${y0 + ch + 3} l-6 9 h12 z`, fill: color }));
      pic.appendChild(text(cx, y0 + ch + 24, labs.join('='), { 'font-size': 13, fill: color, 'font-weight': 700 }));
    }
    sChecks.textContent = checks;
    if (phase === 'done') {
      status.className = 'status ok';
      status.textContent = `Najmanji d koji zadovoljava uvjet: d = ${l}. Uvjet smo provjerili ${checks} puta umjesto ${l} puta redom.`;
    } else {
      status.className = 'status';
      status.textContent = mid ? `provjeri(d = ${mid}) → ${evaluated.get(mid) ? 'DA, pa r = ' + r : 'NE, pa l = ' + l}` : `Tražim najmanji d u [${l}, ${r}] za koji vrijedi uvjet. Znamo: d = ${n} sigurno zadovoljava.`;
    }
  }

  const play = Viz.player(step, 800, running => { btnPlay.textContent = running ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  root.append(
    h('div', { class: 'bar' }, [button('Korak', () => { play.stop(); step(); }), btnPlay, button('Novi primjer', () => { play.stop(); reset(); }),
      h('span', { class: 'sep' }), stat('provjera uvjeta:', sChecks)]),
    pic, status,
    Viz.legend([{ label: 'još moguće', color: C.blueSoft }, { label: 'provjereno: NE', color: C.redSoft }, { label: 'provjereno: DA', color: C.aquaSoft }, { label: 'isključeno', color: C.graySoft }])
  );
  reset();
});
