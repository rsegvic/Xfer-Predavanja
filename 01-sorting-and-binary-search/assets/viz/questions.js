/* Igra pitanja: „Je li traženi element u podskupu A?” — linearno, polovljenjem ili po vlastitom izboru.
   Svaki odgovor je jedan bit; prikazuje se koliko je informacije doneseno. */
Viz.register('questions', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat, fmt } = Viz;
  let n = +opts.n || 16;
  const rand = Viz.rng(+opts.seed || 21);
  const perRow = 16, W = 720;
  let target, cand, selected, asked, bits, mode = opts.mode || 'half', revealed, lastA, note;

  const pic = svg(W, 60);
  const status = h('div', { class: 'status' });
  const bitsBox = h('span', { class: 'bits' });
  const sQ = h('b'), sCand = h('b'), sBits = h('b'), sBound = h('b');
  const hint = h('div', { class: 'hint' });

  function reset() {
    target = Math.floor(rand() * n); cand = new Set(Viz.range(n)); selected = new Set();
    asked = []; bits = ''; revealed = false; lastA = null; note = ''; draw();
  }
  function autoSubset() {
    const list = [...cand].sort((a, b) => a - b);
    if (mode === 'linear') return new Set([list[0]]);
    if (mode === 'half') return new Set(list.slice(Math.ceil(list.length / 2)));   // „gornja” polovica → kod = binarni zapis indeksa
    return new Set(selected);
  }
  function ask() {
    note = '';
    if (cand.size <= 1) { draw(); return; }
    const A = new Set([...autoSubset()].filter(i => cand.has(i)));
    if (!A.size || A.size === cand.size) {
      note = mode === 'free' ? 'Podskup A mora sadržavati bar jednog, ali ne sve preostale kandidate (klikni na plava polja).' : '';
      draw(); return;
    }
    const before = cand.size, yes = A.has(target);
    cand = yes ? A : new Set([...cand].filter(i => !A.has(i)));
    bits += yes ? '1' : '0';
    asked.push({ A, yes, before, after: cand.size, gain: Viz.log2(before / cand.size) });
    selected = new Set(); lastA = A; draw();
  }

  function draw() {
    clear(pic);
    const rows = Math.ceil(n / perRow), cw = (W - 8) / perRow, cs = cw - 5, rh = cw + 2;
    pic.setAttribute('viewBox', `0 0 ${W} ${rows * rh + 6}`); pic.style.aspectRatio = `${W} / ${rows * rh + 6}`;
    for (let i = 0; i < n; i++) {
      const x = 4 + (i % perRow) * cw + 2, y = 3 + Math.floor(i / perRow) * rh;
      const isCand = cand.has(i);
      let fill = isCand ? C.blueSoft : C.graySoft, stroke = isCand ? C.blue : C.gray, col = isCand ? C.ink : C.muted, sw = 1.5;
      if (mode === 'free' && selected.has(i)) { fill = C.orangeSoft; stroke = C.orange; sw = 2.5; }
      if (lastA && lastA.has(i) && isCand) { stroke = C.yellow; sw = 3; }
      if ((revealed || cand.size === 1) && i === target) { fill = C.aquaSoft; stroke = C.aqua; col = C.green; sw = 3; }
      const r = s('rect', { x, y, width: cs, height: cs, rx: 7, fill, stroke, 'stroke-width': sw, style: { cursor: mode === 'free' && isCand ? 'pointer' : 'default' } });
      if (mode === 'free' && isCand && cand.size > 1) r.addEventListener('click', () => { selected.has(i) ? selected.delete(i) : selected.add(i); note = ''; draw(); });
      pic.appendChild(r);
      const t = text(x + cs / 2, y + cs / 2, (revealed || cand.size === 1) && i === target ? '★' : i, { 'font-size': 15, fill: col, 'font-weight': isCand ? 600 : 400, style: { pointerEvents: 'none' } });
      pic.appendChild(t);
    }
    sQ.textContent = asked.length; sCand.textContent = cand.size;
    sBits.textContent = fmt(Viz.log2(cand.size), 2); sBound.textContent = Math.ceil(Viz.log2(n));
    bitsBox.replaceChildren(...[...bits].map(b => h('span', { class: b === '1' ? 'one' : 'zero' }, [b])), bits ? '' : h('span', { style: { color: C.muted } }, ['(još nema odgovora)']));
    const last = asked[asked.length - 1];
    if (note) { status.className = 'status'; status.textContent = note; }
    else if (cand.size === 1) {
      status.className = 'status ok';
      status.textContent = `Pronađeno: element ${[...cand][0]} nakon ${asked.length} pitanja. Donja granica za n = ${n} je ⌈log₂ ${n}⌉ = ${Math.ceil(Viz.log2(n))} pitanja.`;
    } else if (last) {
      status.className = 'status';
      const list = [...last.A].sort((a, b) => a - b);
      const desc = list.length <= 6 ? '{' + list.join(', ') + '}' : `označenom podskupu od ${list.length} polja`;
      status.textContent = `Pitanje ${asked.length}: „Je li traženi element u ${desc}?” → ${last.yes ? 'DA (1)' : 'NE (0)'}. Kandidata ${last.before} → ${last.after}, dobiveno ${fmt(last.gain, 2)} bita.`;
    } else { status.className = 'status'; status.textContent = `Zamislio sam jedan od ${n} elemenata. Pitaj me pitanja oblika „je li u podskupu A?”.`; }
    hint.textContent = mode === 'free' ? 'Klikni polja da sastaviš podskup A, zatim „Pitaj”. Pokušaj naći strategiju bolju od polovljenja!' :
      mode === 'half' ? 'Strategija: pitaj za polovicu preostalih kandidata — svaki odgovor donosi točno 1 bit.' :
        'Strategija: pitaj „je li to element i?” redom — odgovor NE donosi vrlo malo informacije.';
    for (const [k, b] of Object.entries(modeBtns)) b.classList.toggle('active', k === mode);
  }

  const modeBtns = {
    linear: button('Linearno', () => { mode = 'linear'; selected = new Set(); note = ''; draw(); }),
    half: button('Polovljenje', () => { mode = 'half'; selected = new Set(); note = ''; draw(); }),
    free: button('Sam biraj', () => { mode = 'free'; note = ''; draw(); })
  };
  root.append(
    h('div', { class: 'bar' }, [
      h('label', {}, ['strategija: ']), modeBtns.linear, modeBtns.half, modeBtns.free,
      h('span', { class: 'sep' }),
      button('Pitaj', () => ask(), 'primary'),
      button('Otkrij', () => { revealed = true; draw(); }),
      button('Novi element', () => reset()),
      h('label', {}, [' n = ']), Viz.select([8, 16, 32].map(v => ({ value: v, label: v })), n, v => { n = +v; reset(); })
    ]),
    pic,
    h('div', { class: 'stats' }, [stat('pitanja:', sQ), stat('kandidata:', sCand), stat('preostalo bitova log₂(kandidata) =', sBits), stat('⌈log₂ n⌉ =', sBound),
      h('span', { class: 'stat' }, ['odgovori: ', bitsBox])]),
    status, hint
  );
  reset();
});
