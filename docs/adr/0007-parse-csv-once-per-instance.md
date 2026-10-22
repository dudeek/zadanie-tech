# 0007. Kiedy parsować CSV i kWh/W

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Endpoint `/api/products` filtruje 150 produktów. CSV zmienia się tylko z deployem. Listing jest
renderowany w SSR przy każdym żądaniu ([ADR 0004](0004-ssr-listing.md)). Sposób odczytu pliku
na Vercelu to osobna decyzja (temat 5).

## Rozważane opcje

1. Runtime, raz na instancję: pierwsze żądanie parsuje, wynik zostaje w pamięci modułu.
2. Build: skrypt zamienia CSV na JSON, endpoint go importuje.
3. Runtime przy każdym żądaniu.

## Porównanie

| | 1. Raz na instancję | 2. Build | 3. Każde żądanie |
|---|---|---|---|
| Koszt parsowania | raz po cold starcie | zero w runtime | przy każdym żądaniu |
| TTFB | pierwsze żądanie instancji + parsowanie | bez zmian | każde żądanie + parsowanie |
| HTML dla robota | identyczny | identyczny | identyczny |
| Złe dane | 500 na produkcji, chyba że wcześniej złapie je test | build pada, stara wersja zostaje | jak 1 |
| Złożoność | jedna ścieżka kodu w dev i prod | dodatkowy krok i wygenerowany plik | najprostsza |

**Wydajność.** Parsowanie 150 wierszy to rząd milisekund (do zmierzenia, gdy powstanie parser),
a cold start funkcji to rząd setek. Różnica między opcjami ginie w szumie. Opcja 3 jedyna rośnie
liniowo z ruchem i rozmiarem pliku.

**SEO.** Robot dostaje ten sam HTML w każdej opcji, a różnica w TTFB jest poniżej progu, który wpływa
na LCP. Dla SEO liczy się tryb renderowania (ADR 0004), a nie moment parsowania. Jedyna różnica
istotna dla SEO to awaria: przy opcjach 1 i 3 zepsuty CSV daje 500 na wszystkich URL-ach listingu,
a długotrwałe 5xx obniżają crawl i mogą usunąć strony z indeksu. Opcja 2 nie wypuści złych danych.

## Decyzja

Opcja 1 i test parsera na prawdziwym CSV. Wydajność i HTML są takie jak w opcji 2, bez kroku
generowania. Przewagę opcji 2 przy awarii odrabia test, ale tylko wtedy, gdy blokuje deploy.
Vercel domyślnie publikuje z gita niezależnie od GitHub Actions, dlatego testy jednostkowe
są w komendzie buildu: `vitest run --project unit && nuxt build`. Czerwony test oznacza brak deployu.
Odrzucona alternatywa to Vercel Deployment Check (domena produkcyjna czeka na zielone CI): pełna bramka,
ale konfiguracja poza repo.

## Minusy

- Build na Vercelu jest dłuższy o czas testów jednostkowych.
- Na Vercelu blokują tylko testy jednostkowe. Lint i typecheck pilnuje hook pre-commit i CI, ale nie blokują deployu.
- Pierwsze żądanie każdej instancji płaci za parsowanie.

## Warunek rewizji

CSV aktualizowany bez deployu albo rzędu dziesiątek tysięcy wierszy: wtedy baza albo zewnętrzny
storage, a nie żadna z tych opcji.
