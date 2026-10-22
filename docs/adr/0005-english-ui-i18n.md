# 0005. UI po angielsku, infrastruktura i18n z jedną lokalizacją

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Odbiorcy to instalatorzy i dystrybutorzy w całej Europie. Nazwy i opisy produktów w CSV są tylko
po angielsku i nie tłumaczymy ich. Moduł `@nuxtjs/i18n` jest już skonfigurowany (lokalizacja `en`,
`prefix_except_default`). Druga lokalizacja oznacza dodatkowe teksty i SEO dla każdej lokalizacji
(`hreflang`, prefiksowane URL-e, `canonical`).

## Rozważane opcje

1. UI po angielsku, i18n z jedną lokalizacją, każdy tekst przez `t()`.
2. Angielski i polski od razu.
3. Angielski bez modułu i18n, teksty wprost w szablonach.

## Decyzja

Opcja 1. Język UI zgodny z danymi, więc strona nie jest dwujęzyczna. Angielski jest wspólnym językiem
B2B w Europie. Kolejny język to plik w `i18n/locales/` i wpis w `nuxt.config.ts`, bez zmian
w komponentach. `lang` w `<html>` pochodzi z i18n (`useLocaleHead`), a nie jest wpisany na sztywno.

Dokumentacja (README, ADR, `docs/`) jest po polsku, bo zadanie i oceniający są polskojęzyczni.
Kod, klucze tłumaczeń i commity są po angielsku.

## Minusy

- Użytkownik nieznający angielskiego nie ma wersji w swoim języku.
- Moduł i18n i `t()` to narzut, dopóki jest jedna lokalizacja.

## Warunek rewizji

Rynek docelowy wymaga lokalnego języka albo dane dostaną tłumaczenia opisów.
