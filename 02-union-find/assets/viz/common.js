/* ==========================================================================
   Zajednički alati za vizualizacije (čisti JavaScript, bez ovisnosti).
   Svaka vizualizacija se registrira s Viz.register('ime', (root, opts) => {...})
   i u HTML-u se poziva s <div class="viz" data-viz="ime" data-n="16"></div>.
   ========================================================================== */
window.Viz = (function () {
  const registry = new Map();
  const SVG = 'http://www.w3.org/2000/svg';

  // Boje (iste kao u theme.css)
  const C = {
    blue: '#2a78d6', blueSoft: '#cde2fb', orange: '#eb6834', orangeSoft: '#fbd9cc',
    aqua: '#1baf7a', aquaSoft: '#c9efe0', yellow: '#eda100', yellowSoft: '#fde8b3',
    violet: '#6250d6', violetSoft: '#ddd8f7', red: '#e34948', redSoft: '#f9d4d3',
    green: '#008300', magenta: '#e87ba4', ink: '#0b0b0b', ink2: '#52514e', muted: '#898781',
    grid: '#e1e0d9', gray: '#c3c2b7', graySoft: '#ecebe6', surface: '#ffffff', surface2: '#f3f2ee'
  };

  function setAttrs(node, attrs) {
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    return node;
  }
  function append(node, children) {
    for (const c of [].concat(children || [])) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return node;
  }
  /** HTML element */
  function h(tag, attrs, children) { return append(setAttrs(document.createElement(tag), attrs), children); }
  /** SVG element */
  function s(tag, attrs, children) { return append(setAttrs(document.createElementNS(SVG, tag), attrs), children); }
  /** SVG korijen s viewBoxom (širina/visina se skaliraju CSS-om) */
  function svg(w, hgt, attrs) {
    return s('svg', Object.assign({ viewBox: `0 0 ${w} ${hgt}`, preserveAspectRatio: 'xMidYMid meet',
      style: { aspectRatio: `${w} / ${hgt}` } }, attrs || {}));
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  function text(x, y, str, attrs) {
    return s('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-size': 14, fill: C.ink }, attrs || {}), [String(str)]);
  }
  function line(x1, y1, x2, y2, attrs) {
    return s('line', Object.assign({ x1, y1, x2, y2, stroke: C.gray, 'stroke-width': 1.5 }, attrs || {}));
  }
  function rect(x, y, w, hgt, attrs) {
    return s('rect', Object.assign({ x, y, width: w, height: hgt, rx: 4, fill: C.blueSoft }, attrs || {}));
  }
  function button(label, onClick, cls) {
    const b = h('button', { type: 'button', class: cls || '' }, [label]);
    b.addEventListener('click', (e) => { onClick(e, b); b.blur(); });
    return b;
  }
  function select(options, value, onChange) {
    const sel = h('select', {}, options.map(o => h('option', { value: o.value, selected: String(o.value) === String(value) ? 'selected' : null }, [o.label])));
    sel.addEventListener('change', () => { onChange(sel.value); sel.blur(); });
    return sel;
  }
  function stat(label, valueNode) {
    const v = typeof valueNode === 'string' ? h('b', {}, [valueNode]) : valueNode;
    return h('span', { class: 'stat' }, [label + ' ', v]);
  }
  function legend(items) { // [{label, color}]
    return h('div', { class: 'legend' }, items.map(it => { const sp = h('span', {}, [it.label]); sp.style.setProperty('--sw', it.color); return sp; }));
  }

  // Deterministični generator slučajnih brojeva (mulberry32), da slajdovi izgledaju isto pri svakom otvaranju.
  function rng(seed) {
    let t = (seed >>> 0) || 1;
    return function () {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function range(n) { return Array.from({ length: n }, (_, i) => i); }
  function log2(x) { return Math.log(x) / Math.LN2; }
  function factorial(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
  function fmt(x, d) { return (+x).toFixed(d == null ? 2 : d).replace('.', ','); } // hrvatski decimalni zarez

  /** Jednostavan automatski izvođač: stepFn vraća false kad je gotovo. */
  function player(stepFn, intervalMs, onChange) {
    let timer = null;
    const p = {
      get running() { return !!timer; },
      start() { if (timer) return; timer = setInterval(() => { if (!stepFn()) p.stop(); }, intervalMs); onChange && onChange(true); },
      stop() { if (!timer) return; clearInterval(timer); timer = null; onChange && onChange(false); },
      toggle() { timer ? p.stop() : p.start(); }
    };
    return p;
  }

  function register(name, fn) { registry.set(name, fn); }
  function initAll() {
    document.querySelectorAll('[data-viz]').forEach(node => {
      if (node.dataset.vizReady) return;
      const fn = registry.get(node.dataset.viz);
      if (!fn) { console.warn('Nepoznata vizualizacija:', node.dataset.viz); return; }
      try { fn(node, node.dataset); node.dataset.vizReady = '1'; }
      catch (err) { console.error('Greška u vizualizaciji ' + node.dataset.viz, err); node.textContent = 'Greška u vizualizaciji: ' + err.message; }
    });
  }

  return { C, h, s, svg, clear, text, line, rect, button, select, stat, legend, rng, shuffle, range, log2, factorial, fmt, player, register, initAll };
})();
