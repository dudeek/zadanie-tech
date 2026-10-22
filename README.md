# Listing produktów PV

Strona listingu produktów fotowoltaicznych dla marketplace'u B2B: Nuxt 4, TypeScript strict,
filtrowanie na serwerze (Nitro, CSV), stan filtrów w URL, SSR.

Produkcja: https://zadanie-tech.vercel.app/

## Uruchomienie

Wymagane Node 24 i pnpm 12 (wersje w `mise.toml`).

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm check    # lint + typecheck + testy (to samo w hooku pre-commit i w CI)
pnpm build
```

## 1. Kluczowe decyzje

Pełne uzasadnienia, odrzucone opcje i warunki rewizji: [docs/adr/](docs/adr/).

- Node 24 lokalnie, w CI i na Vercelu, przypięty w repo, a nie w dashboardzie ([ADR 0001](docs/adr/0001-node-24.md)).
- Jeden jasny motyw, primary niebieski, kontrast WCAG AA ([ADR 0002](docs/adr/0002-light-theme-blue-amber.md)).
- TypeScript strict z domyślnymi ustawieniami Nuxta plus `noImplicitReturns` i `noFallthroughCasesInSwitch`
  ([ADR 0003](docs/adr/0003-typescript-strict.md)).
- `/` renderowany w SSR przy każdym żądaniu: prerender ze startera ignorował query z filtrami
  ([ADR 0004](docs/adr/0004-ssr-listing.md)).
- UI po angielsku jak dane, i18n z jedną lokalizacją, więc kolejny język nie wymaga zmian w komponentach
  ([ADR 0005](docs/adr/0005-english-ui-i18n.md)).
- kWh/W z opisu, kontrolowane liczbą z nazwy; przy niezgodności „brak danych” zamiast zgadywania
  ([ADR 0006](docs/adr/0006-spec-from-description-checked-by-name.md)).
- CSV parsowany raz na instancję serwera. Wydajność i SEO jak przy parsowaniu w buildzie,
  a zepsute dane zatrzymuje test w komendzie buildu ([ADR 0007](docs/adr/0007-parse-csv-once-per-instance.md)).
- Model bez sztucznego `id`, cena jako walidowana liczba, waluta EUR jako założenie zdefiniowane
  w jednym formacie i18n ([ADR 0008](docs/adr/0008-product-model.md)).
- Filtr i sort po kWh/W tylko w kategorii, której dotyczą, domyślnie A–Z, bo nie mamy danych
  o popularności ([ADR 0009](docs/adr/0009-filters-and-sorting.md)).
- Wyszukiwanie: każde słowo musi wystąpić w nazwie, producencie lub opisie, bez biblioteki i rankingu
  ([ADR 0010](docs/adr/0010-search-all-words.md)).
- Produkty jako karty w siatce, 20 na stronę, kWh/W i cena w stopce w jednej linii, żeby dało się je porównać
  ([ADR 0011](docs/adr/0011-product-cards.md)).
- Filtry w URL: wyszukiwanie przyciskiem (nowe resetuje filtry), listy po 300 ms, pola od–do po opuszczeniu
  pary lub Enterze, każda zmiana to wpis w historii; jeden zapis URL na stronę ([ADR 0012](docs/adr/0012-filters-in-url.md)).
- SEO: indeksowane kategoria i producent, wyszukiwanie i zakresy `noindex, follow`, `canonical` bez sortu
  i zakresów ([ADR 0013](docs/adr/0013-seo-indexable-filters.md)).

## 2. Pozyskanie kWh/W i przypadki brzegowe

Najpierw analiza danych skryptem na wszystkich 150 wierszach ([docs/data-analysis.md](docs/data-analysis.md)),
potem parser ([server/utils/parse-products.ts](server/utils/parse-products.ts)) i testy jednostkowe.

- **Kategoria wyznacza jednostkę:** bateria → kWh, panel → W, konektor → brak. Dzięki temu nie trzeba
  przeliczać jednostek i nie łapiemy fałszywych trafień z innych kategorii.
- **Źródłem jest opis, kontrolą liczba na końcu nazwy** („Stack 7.5”). Przy niezgodności wartość to `null`
  plus ostrzeżenie w logu: „brak danych” jest lepszy niż błędna pojemność ([ADR 0006](docs/adr/0006-spec-from-description-checked-by-name.md)).
- **Pierwsza wartość z opisu.** 5 baterii ma dwie wartości kWh (moduł i system albo maksymalna rozbudowa).
  Pierwsza dotyczy kupowanej sztuki, co potwierdza cena za kWh: przy pierwszej wartości mieści się w zakresie
  reszty baterii (~148 €/kWh), przy drugiej odstaje 2–5×.
- **Wielkość liter ma znaczenie:** „Reserve 15, **a** scalable” nie może dać 15 A, a producent „Terra**Watt**”
  nie może dać W.
- **Fałszywi kandydaci odrzucani:** `6,000 cycle` (bez jednostki), `48V`, `5400 Pa`, `MC4`, `T-Branch 2-1`, `10-pack`.
- **Cena** sprawdzana regexem przed `Number()`, bo `Number('')` daje 0, a `parseFloat('1,999.00')` daje 1.
- **Wynik:** 100 wartości poprawnych, 50 braków (wszystkie konektory), 0 niezgodności. Test na prawdziwym
  pliku działa w komendzie buildu, więc zmiana danych łamiąca regułę zatrzyma deploy ([ADR 0007](docs/adr/0007-parse-csv-once-per-instance.md)).

## 3. Indeksowanie kombinacji filtrów

Indeksujemy tylko kombinacje o stabilnej treści, których ludzie szukają: kategorię i kategorię z producentem
(„PowerFlow batteries”), z własnym tytułem, opisem i `canonical`. Sortowanie nie zmienia treści, więc
`canonical` je pomija, a wyszukiwanie i zakresy cen czy kWh/W dają nieskończenie wiele wariantów tej samej
listy, więc mają `noindex, follow` (robot nadal przechodzi po linkach). Przy większej skali: sitemap
z listą indeksowanych kombinacji i decyzje na podstawie danych z Search Console ([ADR 0013](docs/adr/0013-seo-indexable-filters.md)).

## 4. Czego celowo nie zrobiono i co dalej

- Zasada „bez klas palet Tailwinda i wartości arbitralnych” nie jest wymuszona regułą ESLint, tylko pilnowana w review.
- `exactOptionalPropertyTypes` pominięte: tarcie z typami Nuxt UI, rozróżnienie brakującego pola daje
  walidacja w runtime ([ADR 0003](docs/adr/0003-typescript-strict.md)).
- Brak cache CDN (ISR) dla kombinacji filtrów ([ADR 0004](docs/adr/0004-ssr-listing.md)).
- Przełącznik widoku siatka/lista (lista wierszy lepiej nadaje się do porównywania parametrów), z wyborem
  w cookie, a nie w URL ([ADR 0011](docs/adr/0011-product-cards.md)).
- Wybór liczby produktów na stronę (20/40/60), dziś stałe 20.
- Producent: wielokrotny wybór (serwer już obsługuje `manufacturer` powtarzany w URL), dziś pojedynczy.
- Filtry na telefonie w wysuwanym panelu (`USlideover`): dziś są nad listą, więc pierwszy produkt jest niżej.
- Pełny opis na telefonie: dziś tooltip tylko na desktopie (w HTML jest cały opis, więc SEO i czytniki ekranu go mają).
- Wolne łącze: `useFetch` domyślnie anuluje poprzednie zapytanie (`dedupe: 'cancel'`), ale nie sprawdziliśmy tego
  na throttlingu. Do zrobienia: jawny `AbortController` i `timeout` z komunikatem dla użytkownika.

## 5. Lighthouse

TODO

## 6. Użycie AI

TODO

## 7. Czas pracy

TODO (z historii commitów: analiza wymagań i danych, implementacja, suma).
