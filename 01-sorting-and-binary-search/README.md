# Predavanje 1: Sortiranje i pretraživanje

Materijali predavanja su **web-stranica koja se koristi kao prezentacija** (reveal.js) s interaktivnim vizualizacijama.

## Pokretanje

- Otvorite `index.html` u pregledniku (dvoklik). Sve je u ovoj mapi, internet nije potreban.
- Ili poslužite mapu lokalno, npr. `python3 -m http.server 8000` i otvorite `http://localhost:8000/`.
- Mapa se može objaviti i kao statična stranica (npr. GitHub Pages) bez ikakve izgradnje.

Tipke: `→` sljedeće poglavlje, `↓` sljedeći slajd u poglavlju, `Space` redom kroz sve, `Esc` pregled svih slajdova, `S` prozor za predavača s bilješkama, `F` cijeli zaslon, `Alt`+klik uvećanje.

## Sadržaj

1. **Sortiranje** — O(n²) i O(n log n) algoritmi, counting sort, `std::sort` i komparatori
2. **Binarno pretraživanje** — u nizu, `lower_bound`/`upper_bound`, pretraživanje rješenja, maksimum funkcije
3. **Pretraživanje kao postavljanje pitanja** — pitanja „je li traženi element u podskupu A?”, bitovi i donja granica ⌈log₂ n⌉, binarno pretraživanje kao kodiranje, binarna stabla, entropija
4. **Ternarno pretraživanje** — algoritam, usporedba s binarnim, realni interval, ekstremi unimodalnih funkcija
5. **Bitonično sortiranje** — mreže komparatora, bitonični nizovi, polučistač, cijela mreža, složenost
6. **Koje usporedbe određuju poredak?** — nužne usporedbe susjeda, minimalni skup, donja granica ⌈log₂ n!⌉
7. **Zaključak** — sažetak, zadaci za vježbu (33 zadatka s Codeforcesa i AtCodera, s natuknicama; popis je i u [zadaci.md](zadaci.md)), literatura

Poglavlja 1, 2 i 4 prate materijale [NatPro — X.FER](https://materijali.xfer.hr/docs/sortiranje-i-pretrazivanje/sortiranje) (autorica Maja Milas); poglavlja 3, 5 i 6 su proširenja.

## Struktura mape

```
index.html            svi slajdovi (HTML)
zadaci.md             popis zadataka za vježbu s natuknicama (isti kao na slajdovima)
assets/theme.css      izgled prezentacije i vizualizacija
assets/main.js        pokretanje reveal.js-a i vizualizacija
assets/viz/common.js  pomoćne funkcije za vizualizacije (SVG, boje, gumbi)
assets/viz/*.js       jedna vizualizacija po datoteci (vidi tablicu)
vendor/reveal/        reveal.js 5.1.0 (MIT) i dodaci: highlight, notes, zoom
```

| Vizualizacija | Datoteka | Slajd |
|---|---|---|
| bubble sort s brojanjem usporedbi | `bubble.js` | 1 · O(n²) algoritmi |
| binarno pretraživanje u nizu | `binsearch.js` | 2 · Binarno pretraživanje u sortiranom nizu |
| pretraživanje rješenja (monoton uvjet) | `predicate.js` | 2 · Primjena: pretraživanje rješenja |
| igra pitanja „je li u podskupu A?” | `questions.js` | 3 · Igra pitanja |
| stablo odluke i kodovi elemenata | `tree.js` | 3 · Binarno pretraživanje kao kodiranje |
| stabla pitanja i entropija | `entropy.js` | 3 · Nejednake vjerojatnosti |
| ternarno pretraživanje maksimuma | `ternary.js` | 4 · Lokalni ekstremi |
| bitonična mreža (spajanje i cijelo sortiranje) | `bitonic.js` | 5 · vizualizacije |
| usporedbe i broj mogućih poredaka | `order.js` | 6 · Pokus |
| stablo odluke za sortiranje n = 3 | `sorttree.js` | 6 · Stablo odluke |

## Uređivanje

- Slajdovi su obični HTML: `<section>` je poglavlje (vodoravno), ugniježđeni `<section>` je slajd (okomito). Bilješke za predavača idu u `<aside class="notes">`.
- Vizualizacija se umeće s `<div class="viz" data-viz="ime" data-n="16"></div>`; parametri (`data-n`, `data-seed`, `data-mode`, …) su opisani na vrhu svake datoteke u `assets/viz/`.
- Kod se ističe s `<pre><code class="language-cpp" data-trim>…</code></pre>`; znakove `<`, `>` i `&` u kodu treba zapisati kao `&lt;`, `&gt;`, `&amp;`.
