# 0013. SEO: indeksujemy kategorię i producenta, reszta noindex

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Każda kombinacja filtrów ma własny URL renderowany w SSR (ADR 0004, 0012). Kombinacji są tysiące
(kategoria × producent × zakresy × sort × wyszukiwanie × strona), a większość to prawie te same strony.
Indeksowanie wszystkich rozmywa ranking duplikatami i marnuje budżet crawlowania. Zadanie wymaga tytułu
i meta zależnych od filtrów.

## Rozważane opcje

1. Indeksowane: kategoria i kategoria + producent (+ strona). Wyszukiwanie i zakresy `noindex, follow`.
2. Indeksowane tylko kategorie.
3. Wszystko indeksowane, porządek tylko przez `canonical`.

## Decyzja

Opcja 1. Kategoria i „producent + kategoria” to frazy, których szukają instalatorzy („PowerFlow batteries”),
i mają stabilną treść. Wyszukiwanie to strony o cienkiej treści, a zakresy cen i kWh/W to nieskończenie
wiele wariantów tej samej listy.

- `canonical` i `og:url` buduje `useLocaleHead({ seo: { canonicalQueries } })` z i18n, tylko z parametrów
  `INDEXABLE_PARAMS` (`category`, `manufacturer`, `page`). `?category=battery&sort=price-asc`
  wskazuje więc na `?category=battery`.
- `robots`: `noindex, follow`, gdy jest wyszukiwanie albo zakres (`isIndexable`). `follow`, żeby robot
  dalej przechodził do produktów i kategorii.
- Tytuł i opis z filtrów i wyniku: „PowerFlow Batteries | PV Marketplace”, „5 products, priced from €499.00”.
  Cena „od” liczona z całego wyniku (`minPrice`), a nie z bieżącej strony.
- Kolejne strony paginacji mają własny `canonical` (`?page=2`), bo zawierają inne produkty.

## Minusy

- Zakresy (np. „baterie 10–15 kWh”) nie trafią do wyników wyszukiwania, choć mogłyby być wartościowe.
- Brak sitemap z listą indeksowanych kombinacji.

## Warunek rewizji

Dane z Search Console pokażą ruch na frazach z zakresami albo pojawi się potrzeba sitemap.
