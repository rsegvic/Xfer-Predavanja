/* Pokretanje prezentacije i vizualizacija. */
document.addEventListener('DOMContentLoaded', function () {
  Viz.initAll();
  Reveal.initialize({
    width: 1280, height: 720, margin: 0.04, minScale: 0.2, maxScale: 2.5,
    hash: true,                // svaki slajd ima svoj URL (#/poglavlje/slajd)
    center: false,             // sadržaj poravnat uz vrh
    slideNumber: 'c/t',
    controls: true, progress: true,
    transition: 'fade', transitionSpeed: 'fast',
    keyboard: true, overview: true,
    plugins: [RevealHighlight, RevealNotes, RevealZoom],
    highlight: { highlightOnLoad: true }
  });
});
