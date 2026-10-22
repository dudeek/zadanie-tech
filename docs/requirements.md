# Wymagania i analiza danych

Streszczenie treści zadania (oryginał lokalnie w `task/`, poza repo) i wnioski z analizy `products.csv`.

## Wymagania

Funkcje:

- [ ] filtr po kategorii, producencie i zakresie cen,
- [ ] wyszukiwanie po nazwie, producencie i opisie,
- [ ] filtr lub sortowanie po pojemności (kWh) albo mocy (W), wyciągniętych z danych.

Technicznie:

- [ ] Nuxt 4, Composition API, **TypeScript strict**,
- [ ] endpoint Nitro (`/api/products`), **filtrowanie i wyszukiwanie po stronie serwera**, dane z CSV, bez bazy,
- [ ] **stan filtrów w URL**: link z filtrami renderuje się w SSR z właściwymi wynikami, „wstecz” działa,
- [ ] SEO: tytuł i meta zależne od filtrów,
- [ ] czytelny i wygodny UI (biblioteka komponentów, bez autorskiego designu),
- [ ] deploy z publicznym linkiem.

Poza zakresem: strona produktu, logowanie, panel edycji.
Opcjonalnie (tylko jeśli całość z README zmieści się w 5 h): testy Vitest, jeden scenariusz E2E Playwright.

## README (ważniejsze niż dodatkowe funkcje)

1. Kluczowe decyzje i dlaczego.
2. Jak pozyskano kWh/W i jakie przypadki brzegowe obsłużono.
3. Indeksowanie kombinacji filtrów w wyszukiwarkach (2–3 zdania, bez implementacji).
4. Czego celowo nie zrobiono i co dalej.
5. Wynik Lighthouse dla listingu.
6. Użycie AI: do czego, gdzie trzeba było poprawiać wynik i dlaczego.
7. Realny czas pracy.

## Nie tniemy

Każda pozycja wynika z wymagań: pozyskanie kWh/W (funkcja + README pkt 2), filtrowanie na serwerze,
stan w URL + SSR + „wstecz”, SEO, TS strict, deploy, README. Test parsera kWh/W nie jest wymagany
przez zadanie; jeśli zostaje, to jako nasza decyzja.

## Dane

Pełna analiza `products.csv`: [data-analysis.md](data-analysis.md). Odbiorcy: instalatorzy
i dystrybutorzy w całej Europie; dane po angielsku.

### Pułapka w kodzie startera

`routeRules: { '/': { prerender: true } }` w `nuxt.config.ts`: prerenderowany `/` ignoruje query,
więc link z filtrami nie wyrenderuje się w SSR. Usunięte, `/` w SSR ([ADR 0004](adr/0004-ssr-listing.md)).

## Tematy do decyzji (każda kończy się ADR)

1. ~~Język i i18n (odbiorcy w całej Europie).~~ EN, i18n z jedną lokalizacją, [ADR 0005](adr/0005-english-ui-i18n.md).
2. ~~Źródło kWh/W: opis, nazwa czy oba z kontrolą zgodności; parsowanie przy starcie czy przy buildzie.~~
   Opis z kontrolą nazwy ([ADR 0006](adr/0006-spec-from-description-checked-by-name.md)), raz na instancję
   z testem w buildzie ([ADR 0007](adr/0007-parse-csv-once-per-instance.md)).
3. ~~Model danych: jedno pole „parametr + jednostka” czy dwa; `id`/slug, waluta, format ceny.~~
   [ADR 0008](adr/0008-product-model.md).
4. ~~Filtr/sort po kWh/W przy mieszanych kategoriach (różne jednostki).~~ [ADR 0009](adr/0009-filters-and-sorting.md).
5. Odczyt CSV na Vercelu (`server/assets` + `useStorage` czy `fs`).
6. Schemat URL: nazwy parametrów, wielu producentów, slugi, walidacja, błędne wartości.
7. Historia: `push` czy `replace`, filtry od razu czy po zatwierdzeniu.
8. Producenci zależni od kategorii i pola zakresów: [ADR 0009](adr/0009-filters-and-sorting.md).
   Otwarte: liczniki przy opcjach filtrów (fasety).
9. Wyszukiwanie: tokeny AND, [ADR 0010](adr/0010-search-all-words.md). Otwarte: debounce (z tematem 7).
10. Paginacja czy jedna strona.
11. ~~Tryb renderowania `/`.~~ SSR, [ADR 0004](adr/0004-ssr-listing.md).
12. ~~SEO: tytuł/opis z filtrów, `canonical`, `noindex` dla części kombinacji.~~ [ADR 0013](adr/0013-seo-indexable-filters.md).
13. Stany: pusty wynik, ładowanie, błąd.
14. Zakres testów.
