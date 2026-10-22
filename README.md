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

## 2. Pozyskanie kWh/W i przypadki brzegowe

TODO. Analiza danych: [docs/data-analysis.md](docs/data-analysis.md).

## 3. Indeksowanie kombinacji filtrów

TODO

## 4. Czego celowo nie zrobiono i co dalej

- Zasada „bez klas palet Tailwinda i wartości arbitralnych” nie jest wymuszona regułą ESLint, tylko pilnowana w review.
- `exactOptionalPropertyTypes` pominięte: tarcie z typami Nuxt UI, rozróżnienie brakującego pola daje
  walidacja w runtime ([ADR 0003](docs/adr/0003-typescript-strict.md)).
- Brak cache CDN (ISR) dla kombinacji filtrów ([ADR 0004](docs/adr/0004-ssr-listing.md)).

## 5. Lighthouse

TODO

## 6. Użycie AI

TODO

## 7. Czas pracy

TODO (z historii commitów: analiza wymagań i danych, implementacja, suma).
