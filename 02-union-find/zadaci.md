# Zadaci za vježbu — Union-find

Ocjene su Codeforces *rating*; AtCoder zadaci su navedeni po poziciji u natjecanju (ABC C ≈ 1000, D ≈ 1300, E ≈ 1600, F ≈ 1900 po Codeforcesovoj ljestvici, okvirno).

Zadatak iz izvornih materijala: [ABROADS](https://www.codechef.com/problems/ABROADS) (CodeChef) — rješenje je na slajdu „Rješenje zadatka s početka”.

## Komponente, brojanje, osnovne unije

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 284 C — Count Connected Components](https://atcoder.jp/contests/abc284/tasks/abc284_c) | ABC C | Spoji krajeve svih bridova; broj komponenti = broj predstavnika. |
| [Ice Skating](https://codeforces.com/problemset/problem/217/A) | 1200 | Spoji snježne nanose u istom retku ili stupcu; odgovor je broj komponenti − 1. |
| [DZY Loves Chemistry](https://codeforces.com/problemset/problem/445/B) | 1200 | Svaka uspješna unija udvostručuje opasnost: 2^n − komponenti. |
| [Rumor](https://codeforces.com/problemset/problem/893/C) | 1300 | Po skupu pamti najjeftinijeg; odgovor je zbroj minimuma po komponentama. |
| [ABC 177 D — Friends](https://atcoder.jp/contests/abc177/tasks/abc177_d) | ABC D | Odgovor je veličina najveće komponente (svaki par prijatelja mora u različite grupe). |
| [News Distribution](https://codeforces.com/problemset/problem/1167/C) | 1400 | Za svakog korisnika ispiši veličinu njegove komponente. |
| [Secret Passwords](https://codeforces.com/problemset/problem/1263/D) | 1400 | Union-find nad 26 slova: spoji slova iste lozinke; odgovor je broj komponenti među korištenim slovima. |
| [ABC 206 D — KAIBUNsyo](https://atcoder.jp/contests/abc206/tasks/abc206_d) | ABC D | Spoji A_i i A_n+1−i (vrijednosti!); broj promjena = ∑ (veličina − 1). |
| [ABC 097 D — Equals](https://atcoder.jp/contests/abc097/tasks/arc097_b) | ABC D | Zamjene su bridovi; i je u redu ako su i i p_i u istoj komponenti. |

## Ciklusi i stabla

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [Cthulhu](https://codeforces.com/problemset/problem/103/B) | 1500 | Povezan graf s točno n bridova (jedan ciklus); provjeri obje stvari union-findom. |
| [Cyclic Components](https://codeforces.com/problemset/problem/977/E) | 1500 | Komponenta je ciklus ⇔ svi stupnjevi su 2 i broj bridova = broj vrhova. |
| [ABC 292 D — Unicyclic Components](https://atcoder.jp/contests/abc292/tasks/abc292_d) | ABC D | Po skupu brojač bridova; uvjet: bridova = vrhova u svakoj komponenti. |
| [Bear and Friendship Condition](https://codeforces.com/problemset/problem/771/A) | 1500 | Svaka komponenta mora biti klika: bridova = k(k − 1)/2. Pazi na 64-bitne brojeve. |
| [Mr. Kitayuta's Colorful Graph](https://codeforces.com/problemset/problem/505/B) | 1400 | Za svaku boju zasebna union-find struktura; za upit (u, v) prebroji boje u kojima su spojeni. |
| [Hongcow Builds A Nation](https://codeforces.com/problemset/problem/744/A) | 1500 | Komponente s vladom su klike; sve ostale pripoji najvećoj vladinoj komponenti. |

## Podaci po skupu i više struktura

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 157 D — Friend Suggestions](https://atcoder.jp/contests/abc157/tasks/abc157_d) | ABC D | Kandidati = veličina komponente − 1 − prijatelji − blokirani u istoj komponenti. |
| [ABC 049 D — Connectivity](https://atcoder.jp/contests/abc049/tasks/arc065_b) | ABC D | Dvije strukture (ceste, pruge); grupiraj gradove po paru predstavnika (map). |
| [ABC 259 D — Circumferences](https://atcoder.jp/contests/abc259/tasks/abc259_d) | ABC D | Vrhovi su kružnice; spoji one koje se sijeku ili dodiruju (usporedi udaljenost središta s r₁ ± r₂). |
| [ABC 304 E — Good Graph](https://atcoder.jp/contests/abc304/tasks/abc304_e) | ABC E | Zabranjeni parovi → parovi predstavnika u setu; upit je dobar ako par predstavnika nije zabranjen. |
| [Learning Languages](https://codeforces.com/problemset/problem/277/A) | 1600 | Spoji zaposlenike preko zajedničkog jezika; odgovor je komponenti − 1 (posebno: nitko ne zna jezik). |
| [Arpa's weak amphitheater and Mehrdad's valuable Hoses](https://codeforces.com/problemset/problem/741/B) | 1600 | Komponente → grupe; u svakoj biraš cijelu grupu ili jednog člana; knapsack po grupama. |

## Kruskal i sortirani bridovi

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 214 D — Sum of Maximum Weights](https://atcoder.jp/contests/abc214/tasks/abc214_d) | ABC D | Bridove dodaj od najlakšeg; brid težine w doprinosi w · |A| · |B| parova koje upravo spaja. |
| [Path Queries](https://codeforces.com/problemset/problem/1213/G) | 1700 | Sortiraj bridove i upite; za upit q dodaj sve bridove ≤ q i broji parove ∑ C(veličina, 2). |
| [ABC 235 E — MST + 1](https://atcoder.jp/contests/abc235/tasks/abc235_e) | ABC E | Upite obradi zajedno s bridovima u sortiranom redu; upit je u MST-u ⇔ krajevi još nisu spojeni. |
| [ABC 218 E — Destruction](https://atcoder.jp/contests/abc218/tasks/abc218_e) | ABC E | Kruskal po rastućoj nagradi: brid s negativnom nagradom uvijek zadrži; pozitivan ukloni ako ne treba za povezanost. |
| [Spanning Tree with Maximum Degree](https://codeforces.com/problemset/problem/1133/F1) | 1600 | Prvo spoji sve bridove vrha najvećeg stupnja, zatim Kruskal po ostalima. |
| [Cow and Snacks](https://codeforces.com/problemset/problem/1209/D) | 1700 | Gost = brid između dvije grickalice; gost ostaje gladan ⇔ brid zatvara ciklus. |

## Brisanje unatrag

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 120 D — Decayed Bridges](https://atcoder.jp/contests/abc120/tasks/abc120_d) | ABC D | Unatrag dodaj mostove; neudobnost pada za |A| · |B| pri svakom spajanju. |
| [Destroying Array](https://codeforces.com/problemset/problem/722/C) | 1600 | Unatrag vraćaj elemente, spajaj sa susjedima i drži zbroj po segmentu; odgovor je najveći zbroj. |
| [ABC 264 E — Blackout 2](https://atcoder.jp/contests/abc264/tasks/abc264_e) | ABC E | Sve elektrane spoji u jedan super-vrh; unatrag dodaj vodove i prati veličinu super-komponente. |

## Paritet i težine

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 282 D — Make Bipartite 2](https://atcoder.jp/contests/abc282/tasks/abc282_d) | ABC D | Provjeri bipartitnost po komponenti (paritet); prebroji parove različite boje i parove iz različitih komponenti, oduzmi M. |
| [ABC 087 D — People on a Line](https://atcoder.jp/contests/abc087/tasks/arc090_b) | ABC D | Težinski union-find: uvjet x_R − x_L = D; nekonzistentan uvjet = NE. |
| [ABC 328 F — Good Set Query](https://atcoder.jp/contests/abc328/tasks/abc328_f) | ABC F | Isto kao gore: dodaj uvjet ako je konzistentan s dosadašnjima. |

## Izazovi

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 183 F — Confluence](https://atcoder.jp/contests/abc183/tasks/abc183_f) | ABC F | Po predstavniku map razred → broj; pri uniji manji map prelij u veći (malo u veliko). |
| [Roads not only in Berland](https://codeforces.com/problemset/problem/25/D) | 1900 | Bridovi koji zatvaraju ciklus su višak; svaki od njih premjesti tako da spoji dvije komponente. |
| [Shichikuji and Power Grid](https://codeforces.com/problemset/problem/1245/D) | 1900 | Dodaj virtualni vrh „elektrana” s bridovima cijene c_i; Kruskal na svim bridovima. |
| [Imbalanced Array](https://codeforces.com/problemset/problem/817/D) | 1900 | Obradi vrijednosti rastuće: svaki element spaja susjedne već aktivne segmente; doprinos = vrijednost · broj podnizova s tim maksimumom. Isto za minimum. |
