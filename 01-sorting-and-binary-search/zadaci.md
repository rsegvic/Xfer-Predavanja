# Zadaci za vježbu — Sortiranje i pretraživanje

Ocjene su Codeforces *rating*; AtCoder zadaci su navedeni po poziciji u natjecanju (ABC C ≈ 1000, D ≈ 1300, E ≈ 1600 po Codeforcesovoj ljestvici, okvirno).

Zadaci iz izvornih materijala (s uputama na slajdu „Zadaci za vježbu”): [Years](https://codeforces.com/problemset/problem/1424/G), [The Parade](https://codeforces.com/problemset/problem/1250/J), [Sorted Adjacent Differences](https://codeforces.com/problemset/problem/1339/B), [Worms](https://codeforces.com/problemset/problem/474/B).

## Sortiranje i komparatori

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [Sort the Array](https://codeforces.com/problemset/problem/451/B) | 1300 | Nađi prvi i zadnji indeks gdje niz nije rastući, okreni taj segment i provjeri je li sve sortirano. |
| [ABC 219 C — Neo-lexicographic Ordering](https://atcoder.jp/contests/abc219/tasks/abc219_c) | ABC C | Komparator koji slova uspoređuje po zadanom redoslijedu abecede (ili preslikaj slova pa običan `sort`). |
| [The Smallest String Concatenation](https://codeforces.com/problemset/problem/632/C) | 1700 | Sortiraj komparatorom `a + b < b + a`. Razmisli zašto je to valjan (tranzitivan) poredak. |
| [Kefa and Company](https://codeforces.com/problemset/problem/580/B) | 1500 | Sortiraj po novcu; najbolji prozor u kojem je razlika < d (dva pokazivača ili binarna pretraga + prefiksni zbroj). |

## Binarno pretraživanje u sortiranom nizu

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 077 C — Snuke Festival](https://atcoder.jp/contests/abc077/tasks/arc084_a) | ABC C | Sortiraj sva tri niza; za svaki srednji dio `lower_bound` daje broj manjih gornjih, `upper_bound` broj većih donjih. |
| [ABC 143 D — Triangles](https://atcoder.jp/contests/abc143/tasks/abc143_d) | ABC D | Sortiraj duljine; za svaki par (i, j) prebroji k > j s L_k < L_i + L_j binarnom pretragom. |
| [Number of Pairs](https://codeforces.com/problemset/problem/1538/C) | 1300 | Sortiraj; za svaki i binarnom pretragom prebroji j > i s l ≤ a_i + a_j ≤ r. |
| [Pair of Topics](https://codeforces.com/problemset/problem/1324/D) | 1400 | Uvedi c_i = a_i − b_i, sortiraj i prebroji parove s pozitivnim zbrojem. |

## Pretraživanje rješenja (monoton uvjet)

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 146 C — Buy an Integer](https://atcoder.jp/contests/abc146/tasks/abc146_c) | ABC C | Cijena raste s N; binarno traži najveći N ≤ 10^9 koji si možeš priuštiti. |
| [Poisoned Dagger](https://codeforces.com/problemset/problem/1613/C) | 1200 | Ukupna šteta raste s trajanjem otrova k; binarno po k, provjera u O(n). |
| [Chat Ban](https://codeforces.com/problemset/problem/1612/C) | 1300 | Broj emotikona u prvih x poruka je rastući; binarno po x. Pazi na 64-bitne brojeve. |
| [Maximum Median](https://codeforces.com/problemset/problem/1201/C) | 1400 | Binarno po vrijednosti medijana m; provjera: koliko operacija treba da svi od sredine nadalje budu ≥ m. |
| [ABC 174 E — Logs](https://atcoder.jp/contests/abc174/tasks/abc174_e) | ABC E | Binarno po najvećoj duljini X; trupac duljine A treba ⌈A / X⌉ − 1 rezova. |
| [Magic Powder - 2](https://codeforces.com/problemset/problem/670/D2) | 1500 | Binarno po broju kolačića; provjera u O(n), opet 64-bitni brojevi. |
| [Cellular Network](https://codeforces.com/problemset/problem/702/C) | 1600 | Dva pristupa: binarno po r, ili za svaki grad `lower_bound` najbližeg tornja. Usporedi ih. |
| [Balanced Stone Heaps](https://codeforces.com/problemset/problem/1623/C) | 1600 | Binarno po minimumu; provjera pohlepno zdesna nalijevo (prebacuj koliko smiješ). |
| [Keshi Is Throwing a Party](https://codeforces.com/problemset/problem/1610/C) | 1600 | Binarno po broju gostiju k; za fiksni k pohlepno prolazi redom i prima tko može. |
| [ABC 149 E — Handshake](https://atcoder.jp/contests/abc149/tasks/abc149_e) | ABC E | Binarno po pragu X: koliko parova ima zbroj ≥ X? Zatim zbroj doprinosa prefiksnim zbrojem. |

## Pitanja i bitovi (interaktivni zadaci)

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [Lost Numbers](https://codeforces.com/problemset/problem/1167/B) | 1300 (interaktivno) | 6! = 720 permutacija, 4 pitanja. Pitaj produkte susjeda a_1a_2, a_2a_3, a_3a_4, a_4a_5 i isprobaj sve permutacije. |
| [Guess the K-th Zero (Easy)](https://codeforces.com/problemset/problem/1520/F1) | 1600 (interaktivno) | Zbroj na prefiksu daje broj nula na prefiksu — monoton; binarno po položaju. |
| [ABC 269 E — Last Rook](https://atcoder.jp/contests/abc269/tasks/abc269_e) | ABC E (interaktivno) | Binarno po retku pa po stupcu: upit na polovici ploče kaže gdje je prazan redak. |
| [Guess Your Way Out!](https://codeforces.com/problemset/problem/507/C) | 1700 | Savršeno binarno stablo dubine h; simuliraj put i preskači cijela podstabla (2^k − 1 čvorova). |

## Ternarno pretraživanje i unimodalnost

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 279 D — Freefall](https://atcoder.jp/contests/abc279/tasks/abc279_d) | ABC D | f(x) = A/√(x+1) + Bx je konveksna: ternarno po cijelom x, ili binarno po uvjetu f(x+1) > f(x). |
| [Meeting on the Line](https://codeforces.com/problemset/problem/1730/B) | 1500 | Vrijeme okupljanja u točki x je max(t_i + |x − x_i|) — konveksno; ternarno po x ili binarno po vremenu. |
| [Searching Local Minimum](https://codeforces.com/problemset/problem/1479/A) | 1700 (interaktivno) | Binarna pretraga po „nagibu”: ako je a[mid] > a[mid+1], lokalni minimum sigurno postoji desno. |

## Poredak iz usporedbi

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [ABC 291 E — Find Permutation](https://atcoder.jp/contests/abc291/tasks/abc291_e) | ABC E | Relacije su graf. Permutacija je jedinstvena ⇔ topološki poredak jedinstven ⇔ u svakom koraku točno jedan vrh ulaznog stupnja 0 (Hamiltonov put). |

## Izazovi

| Zadatak | Ocjena | Natuknica |
|---|---|---|
| [Multiplication Table](https://codeforces.com/problemset/problem/448/D) | 1800 | Binarno po vrijednosti v; broj elemenata ≤ v u tablici je ∑ min(m, ⌊v / i⌋). |
| [Packmen](https://codeforces.com/problemset/problem/847/E) | 1800 | Binarno po vremenu T; pohlepno slijeva: svaki Packman pokupi što dulji segment zvjezdica (prvo lijevo pa desno ili obratno). |
| [Magic Ship](https://codeforces.com/problemset/problem/1117/C) | 1900 | Binarno po broju dana; pomak vjetra nakon t dana = cijeli ciklusi + ostatak; provjeri je li Manhattanova udaljenost ≤ t. |
