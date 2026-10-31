# Predavanje 2: Union-find

Materijali predavanja su **web-stranica koja se koristi kao prezentacija** (reveal.js) s interaktivnim vizualizacijama. Otvorite `index.html` u pregledniku; internet nije potreban. Upute za potpune početnike: [UPUTE.md](../UPUTE.md).

Tipke: `→` sljedeće poglavlje, `↓` sljedeći slajd u poglavlju, `Space` redom kroz sve, `Esc` pregled svih slajdova, `S` prozor za predavača s bilješkama, `F` cijeli zaslon.

## Sadržaj

1. **Problem dinamičke povezanosti** — zadatak za zagrijavanje (ABROADS), polje oznaka, šuma stabala
2. **Struktura** — predstavnici, `find`/`unite`/`same`, unija po veličini i dokaz granice log₂ n, unija po rangu
3. **Kompresija puta** — rekurzivna i iterativna izvedba, prepolavljanje puta, tablica složenosti
4. **Koliko to zapravo košta?** — amortizirana složenost, mjerenje u pregledniku, skica dokaza O((m + n) log* n), inverzna Ackermannova funkcija, optimalnost (Fredman–Saks)
5. **Primjene** — komponente i ciklusi, Kruskalov algoritam (s dokazom), brisanje unatrag, rješenje ABROADS-a, trik „sljedeći slobodni”
6. **Proširenja** — podaci po skupu, union-find s paritetom (bipartitnost) i s težinama, malo u veliko, vraćanje operacija
7. **Zadaci** — 37 zadataka s Codeforcesa i AtCodera s natuknicama (popis je i u [zadaci.md](zadaci.md)), literatura

Poglavlja 2 i 5 prate materijale [NatPro — X.FER](https://materijali.xfer.hr/docs/algoritmi-nad-grafovima-1/union-find-struktura) (autorica Maja Milas); ostalo su proširenja.

## Struktura mape

```
index.html            svi slajdovi (HTML)
zadaci.md             popis zadataka za vježbu s natuknicama
assets/theme.css      izgled prezentacije i vizualizacija (isti kao u predavanju 1)
assets/main.js        pokretanje reveal.js-a i vizualizacija
assets/viz/common.js  pomoćne funkcije za vizualizacije
assets/viz/*.js       jedna vizualizacija po datoteci (vidi tablicu)
vendor/reveal/        reveal.js 5.1.0 (MIT) i dodaci: highlight, notes, zoom
```

| Vizualizacija | Datoteka | Slajd |
|---|---|---|
| polje oznaka (naivni pristup) | `labels.js` | 1 · Pristup 1 |
| šuma stabala s opcijama (unija po veličini, kompresija puta), predlošci lanac/binomno/slučajno | `dsu.js` | 1 · Pristup 2, 2 · Unija po veličini, 3 · Ideja |
| mjerenje broja koraka po `find`-u za četiri kombinacije heuristika | `bench.js` | 4 · Mjerenje |
| Kruskalov algoritam na slučajnom grafu | `kruskal.js` | 5 · Kruskal |
| brisanje bridova unatrag s tablicom odgovora | `offline.js` | 5 · Brisanje unatrag |
| union-find s paritetom (bipartitnost) | `parity.js` | 6 · Paritet |

Parametri vizualizacija zadaju se atributima `data-n`, `data-seed`, `data-bysize`, `data-compress`, `data-preset` i opisani su na vrhu svake datoteke.
