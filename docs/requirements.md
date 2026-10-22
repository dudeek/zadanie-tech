# Wymagania i analiza danych

Streszczenie treści zadania (oryginał lokalnie w `task/`, poza repo) i wnioski z analizy `products.csv`.

## Wymagania

Funkcje:

- [x] filtr po kategorii, producencie i zakresie cen,
- [x] wyszukiwanie po nazwie, producencie i opisie,
- [x] filtr **i** sortowanie po pojemności (kWh) albo mocy (W), wyciągniętych z danych.

Technicznie:

- [x] Nuxt 4, Composition API, **TypeScript strict**,
- [x] endpoint Nitro (`/api/products`), **filtrowanie i wyszukiwanie po stronie serwera**, dane z CSV, bez bazy,
- [x] **stan filtrów w URL**: link z filtrami renderuje się w SSR z właściwymi wynikami, „wstecz” działa,
- [x] SEO: tytuł i meta zależne od filtrów,
- [x] czytelny i wygodny UI (biblioteka komponentów, bez autorskiego designu),
- [x] deploy z publicznym linkiem (do wypchnięcia: ostatnie zmiany).

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
5. ~~Odczyt CSV na Vercelu.~~ [ADR 0015](adr/0015-csv-as-server-asset.md).
6. ~~Schemat URL.~~ Nazwy parametrów w [ADR 0009](adr/0009-filters-and-sorting.md), zapis w [ADR 0012](adr/0012-filters-in-url.md),
   błędne wartości w [ADR 0016](adr/0016-invalid-url-values-ignored.md).
7. ~~Historia: `push` czy `replace`, filtry od razu czy po zatwierdzeniu.~~ [ADR 0012](adr/0012-filters-in-url.md).
8. ~~Producenci zależni od kategorii i pola zakresów~~: [ADR 0009](adr/0009-filters-and-sorting.md).
   Liczniki przy opcjach filtrów: w README pkt 4, „do wdrożenia”.
9. ~~Wyszukiwanie~~: tokeny AND, [ADR 0010](adr/0010-search-all-words.md); przycisk zamiast debounce, [ADR 0012](adr/0012-filters-in-url.md).
10. ~~Paginacja czy jedna strona.~~ Paginacja, 20 na stronę, linki: [ADR 0011](adr/0011-product-cards.md), [ADR 0012](adr/0012-filters-in-url.md).
11. ~~Tryb renderowania `/`.~~ SSR, [ADR 0004](adr/0004-ssr-listing.md).
12. ~~SEO: tytuł/opis z filtrów, `canonical`, `noindex` dla części kombinacji.~~ [ADR 0013](adr/0013-seo-indexable-filters.md).
13. ~~Stany: pusty wynik, ładowanie, błąd.~~ [ADR 0014](adr/0014-loading-state.md), `app/error.vue`, `UEmpty`.
14. ~~Zakres testów.~~ [ADR 0017](adr/0017-test-scope.md). E2E w README pkt 4, „do wdrożenia”.
