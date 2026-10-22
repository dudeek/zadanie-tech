# Analiza `products.csv`

## Metoda

Cel: uzyskać poprawne wartości kWh/W i wiedzieć, gdzie reguła się łamie, zanim powstanie parser.

- **Liczy skrypt, a nie oko.** Każde pytanie AI sprawdzało skryptem na wszystkich 150 wierszach
  i podawało liczby (Python: `csv`, `re`, `statistics`). Przy 150 wierszach model łatwo przeoczy
  wyjątek, a skrypt nie.
- **Pytania po etapach:** (1) struktura pliku, (2) kategorie i producenci, (3) jednostki
  w każdej kategorii osobno, (4) format liczb, (5) ceny i zakresy, (6) prototyp parsera uruchomiony
  na wszystkich wierszach: ile wyników poprawnych, ile brakujących, ile podejrzanych,
  (7) wpływ na produkt.
- **Pytania kontrolne do każdej odpowiedzi AI:** „Pokaż wiersze, na których to opierasz”, „Czy to wniosek
  ze skryptu, czy z przejrzenia kilku wierszy?”, „Jaki wiersz obaliłby ten wniosek? Poszukaj go.”
- **Każdy podejrzany wynik sprawdzony drugim skryptem**, zanim trafił do dokumentu.

Korekty w trakcie (materiał do README, pkt 6):

- Pierwszy pomiar „wartość W stoi w pierwszych 60 znakach opisu” był błędny: liczył pozycję liczby,
  która mogła być w nazwie. Po poprawce w 8 panelach W stoi dalej.
- Regex jednostki bez rozróżniania wielkości liter wziął „15, a scalable” za 15 A. Pierwsza wersja
  klasyfikacji złączy liczyła MC3 jako MC4.
- Przy podwójnych wartościach kWh AI wskazało „pierwszą wartość” bez uzasadnienia. Dopiero pytanie
  „która wartość dotyczy kupowanej sztuki?” wymusiło dowód z ceny za kWh (sekcja kWh/W).

## Struktura i jakość

- 150 wierszy, 5 kolumn: `name, manufacturer, price, description, category`. Każdy wiersz ma 5 pól.
- UTF-8 bez BOM, końce linii LF, tylko ASCII. Bez twardych spacji, tabulatorów i nowych linii w polach.
- 3 kategorie i 27 producentów, każdy w jednym zapisie (bez wariantów wielkości liter i interpunkcji).
- **Brak pustych pól, białych znaków na brzegach, duplikatów nazw i opisów** (także po zignorowaniu
  wielkości liter i spacji).
- **Brak kolumny `id`.** Nazwy są unikalne, więc mogą posłużyć za klucz albo źródło sluga.
- 92 opisy są w cudzysłowach (zawierają przecinki, np. „6,000 cycle”), więc potrzebny jest parser CSV
  zgodny z RFC 4180, a nie `split(',')`.

Krytycznych błędów w danych nie ma. Problemy są semantyczne (poniżej).

## Kategorie i producenci

| Kategoria | Produkty | Producenci | Ceny (min / mediana / max) |
|---|---|---|---|
| `battery` | 50 | 10 × 5 | 299.99 / 1235 / 1999 |
| `connector` | 50 | 7 (3 × 10, 4 × 5) | 6.99 / 20.99 / 220 |
| `solar panel` | 50 | 10 × 5 | 145 / 262.50 / 499 |

- **Każdy producent występuje w dokładnie jednej kategorii.** Wybór producenta jednoznacznie wyznacza
  kategorię.
- Każda nazwa zaczyna się od nazwy producenta (150/150). Schemat dla baterii i paneli:
  `producent + seria + parametr`. Seria nie zawsze jest równa producentowi: FusionPV ma Flex i Shingle,
  HelioTek ma Bifacial i Mono.
- `solar panel` zawiera spację (wartość w URL wymaga sluga albo kodowania).

## Ceny

- Format zawsze poprawny (`\d+(\.\d{1,2})?`): 113 cen całkowitych, 37 z groszami, w tym 12 z jedną cyfrą
  po kropce (`18.5`). Wyświetlanie wymaga formatowania do 2 miejsc.
- **Brak waluty.**
- **Zakresy cen kategorii nakładają się, a łącznie obejmują 6.99–1999** (prawie 300×). Jeden suwak ceny
  dla wszystkich kategorii będzie mało precyzyjny dla konektorów.
- Paczki (`10-pack`, `50-pack`, 6 produktów) mają cenę za całość, nie za sztukę.

## kWh / W

| Kategoria | Źródło w opisie | Zakres | Zgodność z liczbą w nazwie |
|---|---|---|---|
| `battery` | `<liczba>kWh` | 2.4–15 (23 wartości, część ułamkowa) | 50/50 |
| `solar panel` | `<liczba>W` | 300–600 (36 wartości, całkowite) | 50/50 |
| `connector` | brak | — | — |

Format liczb:

- Zawsze bez spacji między liczbą a jednostką, jedna pisownia (`kWh`, `W`). Nie występują `kW`, `Wp`,
  samo `Wh`, `kwh` ani `KWh`.
- Separator dziesiętny to kropka (`7.5`). Przecinek występuje tylko jako separator tysięcy, raz:
  `6,000 cycle`.
- Brak zakresów i przybliżeń przy kWh/W (`5–10 kWh`, `~400W`, `up to 450W`).
- Liczba bez jednostki na końcu nazwy to ta sama wartość (100/100 baterii i paneli). Mylące fragmenty
  z cyframi w nazwach: `MC3`, `MC4`, `H4`, `10A`–`30A`, `8AWG`–`12AWG`, `2-1`, `3-to-1`, `2-Way`,
  `5-pack`–`50-pack`, `3ft`.

### Przypadki, które nie pasują do prostej reguły

- **Jednostki są spójne w obrębie kategorii:** baterie mają tylko `kWh` (55 wystąpień), panele tylko `W`
  (50), konektory nie mają żadnej z tych jednostek. Nie trzeba przeliczać jednostek (np. `0.45kW`
  na `450W`).
- **5 baterii ma w opisie dwie wartości kWh.** Potrzebna jest wartość produktu, który kupujesz
  za podaną cenę, a nie pojedynczego modułu. **We wszystkich pięciu jest to pierwsza wartość:**

  | Produkt | Wartości | Co kupujesz | Cena/kWh: 1. wartość | Cena/kWh: 2. wartość |
  |---|---|---|---|---|
  | PowerFlow Stack 7.5 | 7.5, 30 | 1 moduł; 30 to maks. rozbudowa (4 szt.) | **146.7** | 36.7 |
  | PowerFlow Stack 10.5 | 10.5, 3.5 | zestaw 3 modułów po 3.5 | **147.6** | 442.9 |
  | PowerFlow Stack 14 | 14, 3.5 | zestaw 4 modułów | **139.3** | 557.1 |
  | PowerFlow Stack 7 | 7, 3.5 | zestaw 2 modułów | **154.3** | 308.6 |
  | AuraPower Reserve 12.5 | 12.5, 2.5 | zestaw 5 modułów | **143.9** | 719.6 |

  Potwierdzenie z trzech niezależnych źródeł: (1) pierwsza wartość równa się liczbie w nazwie,
  (2) cena za kWh przy pierwszej wartości mieści się w zakresie reszty baterii (120–162.50, mediana ~148),
  przy drugiej odstaje 2–5×, (3) pojedynczy moduł PowerFlow Stack 3.5 kosztuje 499, a zestaw 3 modułów
  (10.5) kosztuje 1550 ≈ 3 × 499.
  Druga wartość opisuje kontekst: pojemność modułu składowego (w nawiasie albo po „comprised of”) albo
  maksymalną rozbudowę („up to… for a total of”). Może być mniejsza (3.5) albo większa (30) od właściwej,
  więc nie da się wybrać jej regułą „min” ani „max”, tylko kolejnością.
- **Pozycja wartości w opisie jest różna:** w 8 panelach W stoi dalej niż 60 znaków od początku.
- **Konektory nie mają kWh ani W**, ale mają fałszywych kandydatów:
  - nazwy kończące się liczbą: `T-Branch 2-1`, `3-1`, `4-1`, `Y-Splitter 3-1`, `4-1` (5 sztuk),
  - liczby z jednostkami: `15A`, `20A`, `1500V`, `8 AWG`, `10-pack`, `Evo 2`.
- **Wielkość liter ma znaczenie:** regex `\d\s?A\b` bez rozróżniania wielkości liter łapie
  „Reserve 15, **a** scalable” jako 15 A.
- **Producent `TerraWatt` zawiera „Watt”:** dopasowanie po słowie „watt” daje fałszywe trafienia.
- Inne liczby z jednostkami w opisach: `48V` (baterie), `5400 Pa`, `210mm`, `5 lbs`, `25%` (panele).

### Prototyp parsera

Reguła: kategoria wyznacza jednostkę (`battery` → kWh, `solar panel` → W, `connector` → brak),
w opisie bierzemy **pierwsze** dopasowanie `<liczba><jednostka>` (z rozróżnianiem wielkości liter),
kontrola: wartość równa liczbie na końcu nazwy.

Wynik na 150 wierszach: **100 poprawnych, 50 bez wartości (wszystkie konektory), 0 podejrzanych.**
Zakresy: kWh 2.4–15, W 300–600.

Przypadki brzegowe do testu parsera:

| Wejście (kategoria, fragment opisu) | Oczekiwany wynik |
|---|---|
| battery, „a 10kWh LiFePO4 battery” | 10 kWh |
| battery, „compact 2.5kWh LFP” | 2.5 kWh (ułamek) |
| battery, „7.5kWh… for a total of 30kWh” | 7.5 kWh (druga większa) |
| battery, „10.5kWh… three 3.5kWh modules” | 10.5 kWh (druga mniejsza) |
| battery, „AuraPower Reserve 15, a scalable 15kWh” | 15 kWh (nie „15 A”) |
| battery, „5kWh 48V rack” | 5 kWh (pomija V) |
| battery, „6,000 cycle life” bez kWh | brak (nie 6000) |
| solar panel, „450W output” | 450 W |
| solar panel, „5400 Pa… 405W” | 405 W |
| connector, „15A fuse… 1500V” | brak |
| connector, nazwa „T-Branch 2-1” | brak (liczba w nazwie to nie parametr) |

## Wpływ na produkt

- kWh ma sens tylko dla baterii, W tylko dla paneli. Konektory nie mają żadnej z tych wartości.
- Otwarte pytania (tematy 4 i 8 w [requirements.md](requirements.md)): czy filtr/sort po kWh/W jest
  dostępny tylko po wyborze kategorii; co z produktami bez wartości (ukryć przy filtrze, dać na koniec
  sortowania, oznaczyć „brak danych”).
- Zakresy filtrów wynikające z danych: kWh 2.4–15, W 300–600, cena 6.99–1999 (zależnie od kategorii).

## Zależności

- **Cena prawie liniowo zależy od parametru:** korelacja Pearsona cena~kWh = 0.994, cena~W = 0.971.
  - bateria: 120–162.50 za kWh (mediana 147.81),
  - panel: 0.48–0.89 za W (mediana 0.60). Najtańsze są panele elastyczne (FusionPV Flex),
    najdroższe bifacjalne N-type (RadiantEnergy X-Pro).
- **W każdej serii cena rośnie razem z parametrem** (brak wyjątków), więc sortowanie po cenie i po
  parametrze daje w serii tę samą kolejność.
- Wartość z nazwy i z opisu to dwa niezależne źródła tej samej informacji (zgodne 100/100). Można ich
  użyć do wzajemnej kontroli.

## Obserwacje domenowe

- **Kategoria `connector` jest niejednorodna.** Według nazw: rozgałęźniki i combinery 18, pary i złącza 12,
  bezpieczniki i diody 8, **narzędzia 8** (zaciskarki, klucze), adaptery 2, akcesoria 2 (zaślepki,
  **zestaw etykiet**). Narzędzia i etykiety to nie konektory. Dane traktujemy tak, jak są, ale nazwa
  kategorii w UI może wprowadzać w błąd.
- Standardy złączy: MC4 21, MC4-Evo 2 5, H4 5, MC3 3, bez standardu 16. To potencjalny filtr,
  niewymagany.
- Chemia baterii (LFP/LiFePO4, NMC) jest tylko w opisie. To potencjalny filtr, niewymagany.
- **Jednostki imperialne** (`AWG`, `1-foot`, `3ft`, `5 lbs`) przy odbiorcach w Europie sugerują dane
  z rynku USA. Nie zmieniamy ich, ale warto o tym wiedzieć.
- Opisy mają 137–211 znaków (mediana 165), więc mieszczą się w karcie bez skracania albo z lekkim
  skróceniem.
