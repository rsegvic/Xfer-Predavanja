# Upute: kako doći do prezentacije (i što su Git i GitHub)

Ove upute su za Windows i za nekoga tko nikad nije koristio Git ni GitHub. Ne trebate znati ništa unaprijed.

Imate dva puta:

- **Put A (5 minuta, bez instalacije):** skinite materijale kao ZIP i otvorite prezentaciju. Dovoljno za većinu ljudi.
- **Put B (preporučeno ako ćete materijale pratiti kroz semestar):** instalirajte jedan program koji skida materijale i kasnije ih **jednim klikom osvježi** kad se nešto promijeni.

Usput ćete, ako želite, naučiti osnovne pojmove. Dijelovi označeni s *(neobavezno)* mogu se preskočiti.

---

## Što je ovo uopće? *(neobavezno, 1 minuta)*

- **Git** je program koji pamti **sve verzije** skupa datoteka: tko je, kada i što promijenio. Zamislite „Prati promjene” u Wordu, ali za cijelu mapu i s mogućnošću povratka na bilo koju raniju verziju.
- **GitHub** je web-stranica na kojoj se takve mape (zovu se **repozitoriji**) čuvaju i dijele. Adresa ovog repozitorija je:
  **<https://github.com/rsegvic/Xfer-Predavanja>**
- **Repozitorij** `Xfer-Predavanja` je, dakle, obična mapa s materijalima za predavanja, plus cijela povijest njezinih promjena.
- Prezentacija je **web-stranica**: datoteka `index.html` koja se otvara u pregledniku (Edge, Chrome, Firefox). Ne treba internet, ne treba PowerPoint.

---

## Put A: skinite ZIP i otvorite prezentaciju

1. Otvorite u pregledniku: <https://github.com/rsegvic/Xfer-Predavanja>.
2. Kliknite zeleni gumb **`<> Code`** (gore desno, iznad popisa datoteka).
3. U izborniku koji se otvori kliknite **Download ZIP**. Preglednik skida datoteku `Xfer-Predavanja-….zip` (oko 1 MB) u mapu *Downloads* (*Preuzimanja*).
4. **Raspakirajte ZIP** (ovo je važno — iz samog ZIP-a prezentacija neće raditi):
   - otvorite mapu *Downloads*,
   - desni klik na `Xfer-Predavanja-….zip` → **Extract All…** (*Izdvoji sve…*) → **Extract**.
5. Otvorite raspakiranu mapu. U njoj je mapa čije ime počinje s `Xfer-Predavanja`, a u njoj mapa **`01-sorting-and-binary-search`**.
6. U toj mapi **dvokliknite `index.html`**. Otvara se preglednik s prvim slajdom.

To je sve. Prezentacija radi i bez interneta; možete je kopirati na USB.

### Kako se koristi prezentacija

| Tipka | Što radi |
|---|---|
| `→` / `←` | sljedeće / prethodno poglavlje |
| `↓` / `↑` | sljedeći / prethodni slajd unutar poglavlja |
| `Space` | sljedeći slajd, redom kroz sve |
| `Esc` | pregled svih slajdova (mapa predavanja); klik na slajd vodi na njega |
| `F` | cijeli zaslon (`Esc` za izlaz) |
| `S` | prozor za predavača s bilješkama (dopustite skočni prozor ako preglednik pita) |
| `Alt` + klik | uvećaj dio slajda |
| `?` | popis svih tipki |

Na mnogim slajdovima su **interaktivne vizualizacije**: gumbi *Korak*, *Pokreni*, *Novi primjer*… Slobodno klikajte, ništa se ne može pokvariti; *Ispočetka* ili *Novi primjer* vraća na početak.

### Kad se materijali promijene

Kod puta A nema automatskog osvježavanja: jednostavno ponovite korake 1–6 i obrišite staru mapu. Ako vam je to zamorno, prijeđite na put B.

---

## Put B: GitHub Desktop (osvježavanje jednim klikom)

**GitHub Desktop** je besplatan program koji skine repozitorij na vaše računalo i kasnije ga ažurira. Ne trebate račun na GitHubu za preuzimanje javnog repozitorija.

### Prvi put

1. Skinite i instalirajte GitHub Desktop: <https://desktop.github.com> (gumb *Download for Windows*; instalacija je obična, bez pitanja).
2. Pri prvom pokretanju program nudi prijavu na GitHub. Možete kliknuti **Skip this step** (preskoči); prijava nije potrebna.
3. U izborniku **File → Clone repository…** odaberite karticu **URL**.
4. U polje *Repository URL* zalijepite:
   ```
   https://github.com/rsegvic/Xfer-Predavanja
   ```
5. U polju *Local path* vidite gdje će mapa biti spremljena (obično `C:\Users\VašeIme\Documents\GitHub\Xfer-Predavanja`). Kliknite **Clone**.
6. Kad se preuzimanje završi, kliknite **Repository → Show in Explorer**. Otvara se mapa `Xfer-Predavanja`; uđite u `01-sorting-and-binary-search` i dvokliknite **`index.html`**.

> **Rječnik:** *clone* (klonirati) znači „skini cijeli repozitorij, s poviješću, na svoje računalo”. Radi se samo jednom.

### Svaki sljedeći put

1. Otvorite GitHub Desktop.
2. Gore, na traci, kliknite **Fetch origin**. Ako postoje nove promjene, gumb se mijenja u **Pull origin** — kliknite ga. Mapa na vašem računalu sada je identična onoj na GitHubu.
3. Otvorite `index.html` kao i prije (može ostati i otvoren u pregledniku — samo stisnite *F5* za osvježavanje).

> **Rječnik:** *fetch* = „provjeri ima li novosti”, *pull* = „povuci novosti k sebi”. *Origin* je samo ime za „onaj repozitorij na GitHubu s kojeg sam klonirao”.

Dok ništa ne mijenjate u mapi, ovo je sve što ćete ikad kliknuti.

### Ako ste nešto slučajno promijenili ili obrisali

GitHub Desktop u kartici **Changes** pokaže što se razlikuje od službene verzije. Desni klik na datoteku → **Discard changes** vraća je u izvorno stanje. Ništa što napravite lokalno ne može pokvariti materijale na GitHubu.

---

## Put B′: Git u naredbenom retku *(za one koji vole tipkati; neobavezno)*

1. Instalirajte **Git for Windows**: <https://git-scm.com/download/win>. U instalaciji ostavite sve ponuđene postavke.
2. Otvorite **Git Bash** (nalazi se u Start izborniku nakon instalacije) i utipkajte, red po red, s *Enter* nakon svakog:
   ```bash
   cd ~/Documents
   git clone https://github.com/rsegvic/Xfer-Predavanja.git
   cd Xfer-Predavanja
   start 01-sorting-and-binary-search/index.html
   ```
   Prva naredba prelazi u mapu *Documents*, druga skida repozitorij, treća ulazi u njega, četvrta otvara prezentaciju u pregledniku.
3. Kad želite novosti: u Git Bashu, unutar mape `Xfer-Predavanja`:
   ```bash
   git pull
   ```

---

## Što možete raditi na GitHubu u pregledniku *(neobavezno)*

Sve ovo radi bez računa:

- **Pregled datoteka.** Na glavnoj stranici repozitorija vidite mape i datoteke. Klik na `README.md` (prikazuje se automatski ispod popisa) daje opis repozitorija; klik na `01-sorting-and-binary-search` pa `zadaci.md` daje popis zadataka za vježbu s poveznicama.
- **Povijest promjena.** Klik na **Commits** (ili na ikonu sata, gore desno iznad datoteka) prikazuje popis svih promjena, od najnovije prema starijoj. Svaka stavka zove se **commit** (snimka) i ima kratak opis, autora i datum. Klik na commit pokazuje točno koje su se linije promijenile (crveno = obrisano, zeleno = dodano).
- **Grane (branches).** Padajući izbornik lijevo iznad datoteka pokazuje ime **grane**. Grana je neovisna „verzija” mape u kojoj se radi; vi uvijek gledate glavnu granu i o tome ne morate razmišljati.
- **Čitanje `.md` datoteka.** Datoteke s nastavkom `.md` (Markdown) GitHub prikazuje lijepo oblikovane — i ove upute su takva datoteka.

S besplatnim računom možete još:

- **Prijaviti grešku** (krivo slovo na slajdu, vizualizacija koja ne radi): kartica **Issues → New issue**, napišite na kojem je slajdu (broj slajda piše dolje, npr. *22 / 53*) i što nije u redu.
- **Pratiti repozitorij**: gumb **Watch** šalje obavijesti o promjenama, **Star** ga sprema u vaše favorite.

---

## Ako nešto ne radi

| Problem | Rješenje |
|---|---|
| Dvoklik na `index.html` prikaže prazan ekran ili samo tekst | Niste raspakirali ZIP (otvorili ste datoteku *unutar* ZIP-a). Napravite korak 4 iz puta A. |
| Otvorilo se u Internet Exploreru ili u programu za uređivanje | Desni klik na `index.html` → **Open with** (*Otvori pomoću*) → Edge, Chrome ili Firefox. |
| Slajdovi se vide, ali vizualizacije ne reagiraju | Provjerite da se uz `index.html` nalaze mape `assets` i `vendor`. Ako ste kopirali samo `index.html`, kopirajte cijelu mapu `01-sorting-and-binary-search`. |
| Tipka `S` ne otvara prozor za predavača | Preglednik je blokirao skočni prozor; kliknite obavijest u adresnoj traci i dopustite ga. |
| GitHub Desktop javlja da je mapa već zauzeta | Već ste jednom klonirali. Otvorite postojeći repozitorij kroz **File → Add local repository…** umjesto ponovnog kloniranja. |
| Slajd se čudno prelama ili je tekst premalen | Pritisnite `F` za cijeli zaslon; prezentacija se skalira na veličinu prozora. |

---

## Mali rječnik

| Pojam | Značenje |
|---|---|
| **Git** | program koji pamti verzije datoteka |
| **GitHub** | web-usluga na kojoj se Git repozitoriji čuvaju i dijele |
| **repozitorij (repo)** | mapa s datotekama i cijelom poviješću njihovih promjena |
| **commit** | jedna snimka (verzija) repozitorija s opisom promjene |
| **grana (branch)** | neovisna linija razvoja unutar repozitorija; obično gledate glavnu |
| **clone** | skidanje cijelog repozitorija na vlastito računalo (jednom) |
| **fetch / pull** | provjera / preuzimanje novih promjena s GitHuba |
| **push** | slanje vlastitih promjena na GitHub (vama neće trebati) |
| **origin** | ime za repozitorij na GitHubu s kojeg ste klonirali |
| **Markdown (.md)** | jednostavan tekstualni format koji GitHub prikazuje oblikovano |
