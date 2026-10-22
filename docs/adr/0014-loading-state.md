# 0014. Stan ładowania listy: przygaszenie i pasek postępu

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Po zmianie filtra, sortu, frazy albo strony `useFetch` pobiera nowe wyniki, a lista nie dawała żadnego
sygnału, że coś się dzieje. Odpowiedź z serwera zwykle przychodzi szybko (CSV w pamięci, [ADR 0007](0007-parse-csv-once-per-instance.md)),
ale na wolnej sieci użytkownik widział stare wyniki bez wskazówki, czy jego klik zadziałał.
Nuxt 4 na czas ponownego pobierania zostawia poprzednie `data`.

## Rozważane opcje

- **Przygaszenie starych wyników + nieokreślony `UProgress` nad listą.**
- Skeletony kart (`USkeleton`) w miejsce listy.
- Spinner wyśrodkowany nad przygaszoną listą.

## Decyzja

Przygaszenie + pasek. Gdy `status === 'pending'`, lista dostaje `opacity-50`, `pointer-events-none`
i `aria-busy`, a nad nią pojawia się cienki `UProgress` (pozycjonowany absolutnie, więc układ się nie
przesuwa). Stare wyniki zostają na miejscu, więc przy szybkiej odpowiedzi nic nie mruga, a skeletony
wymagałyby opóźnienia, żeby nie migać. Spinner na długiej liście może wypaść poza ekran.
SSR renderuje gotowe dane, więc loader dotyczy tylko nawigacji po stronie klienta.

## Minusy

- Na wolnej sieci sygnał jest słabszy niż przy skeletonach.
- Przy bardzo szybkiej odpowiedzi przygaszenie może błysnąć na ułamek sekundy.

## Warunek rewizji

Pobieranie zacznie trwać zauważalnie długo (np. zewnętrzne API zamiast CSV): wtedy skeletony
z opóźnieniem pokazania.
