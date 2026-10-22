# 0017. Zakres testów: jednostkowe tam, gdzie jest ryzyko danych

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Zadanie traktuje testy jako opcjonalne („Vitest, jeden scenariusz E2E, jeśli całość z README zmieści się
w 5 h”). Czas jest ograniczony, więc testy idą tam, gdzie błąd jest najdroższy i najtrudniejszy
do zauważenia ręcznie.

## Rozważane opcje

1. Testy jednostkowe parsera CSV i logiki URL, bez E2E.
2. Jak 1 plus jeden scenariusz E2E w Playwright (filtr → URL → SSR → „wstecz”).
3. Testy komponentów (`@nuxt/test-utils`, happy-dom).

## Decyzja

Opcja 1, 30 testów w Vitest (projekt `unit`, czysty Node, bez Nuxta):

- **Parser CSV i kWh/W** (`parse-products.test.ts`): przypadki brzegowe z analizy danych (dwie wartości
  kWh, „15, a scalable”, `6,000 cycle`, `48V`, `5400 Pa`), błędne ceny, nieznana kategoria, duplikat
  oraz **prawdziwy plik** (150 produktów, 0 ostrzeżeń, 100 z kWh/W).
- **Reset filtrów** (`product-query.test.ts`): co `hasActiveFilters` uznaje za aktywny filtr.

Test prawdziwego pliku działa w komendzie buildu, więc zepsute dane zatrzymują deploy (ADR 0007).
Ścieżkę filtr → URL → SSR → „wstecz” sprawdzaliśmy w przeglądarce skryptem Playwrighta w trakcie pracy,
ale nie jest zapisana jako test w repozytorium.

## Minusy

- Brak E2E: regresja w zachowaniu filtrów (debounce, reset strony, „wstecz”) nie zostanie złapana automatycznie.
- `parseProductQuery` (walidacja URL, ADR 0016) i `listProducts` (filtrowanie, sort, paginacja) nie mają
  testów jednostkowych. Sprawdzaliśmy je zapytaniami do endpointu.

## Warunek rewizji

Pierwsza zmiana zachowania filtrów: najpierw scenariusz E2E i testy `parseProductQuery` oraz `listProducts`
(obie funkcje są czyste, więc to tani test).
