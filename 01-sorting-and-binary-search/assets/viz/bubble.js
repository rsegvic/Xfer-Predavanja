/* Bubble sort — stupci, korak po korak, s brojanjem usporedbi i zamjena. */
Viz.register('bubble', function (root, opts) {
  const { C, h, s, svg, clear, text, button, stat } = Viz;
  const n = +opts.n || 10;
  const W = 560, H = 230, padX = 8, baseY = 196, maxH = 170;
  const rand = Viz.rng(+opts.seed || 11);

  let a, i, j, comparisons, swaps, done, cur, swapped;
  const pic = svg(W, H);
  const status = h('div', { class: 'status' });
  const sComp = h('b'), sSwap = h('b');

  function newArray() { a = Viz.shuffle(Viz.range(n).map(k => k + 1), rand); start(); }
  function start() { i = 0; j = 0; comparisons = 0; swaps = 0; done = false; cur = null; swapped = false; draw(); }

  function step() {
    if (done) return false;
    comparisons++; cur = [j, j + 1]; swapped = false;
    if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; swapped = true; }
    j++;
    if (j >= n - 1 - i) { j = 0; i++; if (i >= n - 1) { done = true; cur = null; } }
    draw();
    return !done;
  }

  function draw() {
    clear(pic);
    const bw = (W - 2 * padX) / n;
    for (let k = 0; k < n; k++) {
      const hh = (a[k] / n) * maxH;
      let fill = C.blue;
      if (k >= n - i) fill = C.aqua;              // već na svom mjestu
      if (cur && (k === cur[0] || k === cur[1])) fill = swapped ? C.orange : C.yellow;
      if (done) fill = C.aqua;
      pic.appendChild(s('rect', { x: padX + k * bw + 3, y: baseY - hh, width: bw - 6, height: hh, rx: 4, fill }));
      pic.appendChild(text(padX + k * bw + bw / 2, baseY - hh - 10, a[k], { 'font-size': 13, fill: C.ink2 }));
    }
    pic.appendChild(s('line', { x1: padX, y1: baseY + 1, x2: W - padX, y2: baseY + 1, stroke: C.gray }));
    if (cur) {
      const x = padX + cur[0] * bw + bw, y = baseY + 16;
      pic.appendChild(text(x, y, swapped ? 'zamjena' : 'u redu', { 'font-size': 12, fill: swapped ? C.orange : C.ink2 }));
    }
    sComp.textContent = comparisons; sSwap.textContent = swaps;
    if (done) {
      status.className = 'status ok';
      status.textContent = `Sortirano. Ukupno ${comparisons} usporedbi = n(n−1)/2 za n = ${n}.`;
    } else {
      status.className = 'status';
      status.textContent = cur
        ? `Prolaz ${i + 1}: uspoređujem ${a[cur[0]]} i ${a[cur[1]]} → ${swapped ? 'nisu u poretku, zamijenio sam ih' : 'u poretku su'}.`
        : 'Pritisni „Korak” ili „Pokreni”.';
    }
  }

  const play = Viz.player(step, 350, running => { btnPlay.textContent = running ? 'Stani' : 'Pokreni'; });
  const btnPlay = button('Pokreni', () => play.toggle(), 'primary');
  root.append(
    h('div', { class: 'bar' }, [
      button('Korak', () => { play.stop(); step(); }), btnPlay,
      button('Ispočetka', () => { play.stop(); newArray(); }),
      h('span', { class: 'sep' }), stat('usporedbi:', sComp), stat('zamjena:', sSwap)
    ]),
    pic, status,
    Viz.legend([{ label: 'nesortirano', color: C.blue }, { label: 'trenutna usporedba', color: C.yellow }, { label: 'zamjena', color: C.orange }, { label: 'na svom mjestu', color: C.aqua }])
  );
  newArray();
});
