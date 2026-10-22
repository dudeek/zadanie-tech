# 0012. Zapis filtrów w URL: kiedy, jak i co resetuje

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

URL jest jedynym stanem listingu (SSR, udostępnianie linku, „wstecz”). Filtry zmieniają się
na różne sposoby: tekst wyszukiwania, wybór z listy, para pól liczbowych od–do. Zapis po każdym
znaku dawałby zapytania z niepełnymi wartościami („1”, „15”, „150” zamiast „1500”) i śmieci w historii.

## Rozważane opcje

- Wyszukiwanie: debounce przy pisaniu albo formularz z przyciskiem i Enterem.
- Filtry: zapis od razu, z opóźnieniem albo po przycisku „Apply”.
- Historia: `push` dla każdej zmiany albo `replace` dla filtrów.
- Zapis do URL: każdy komponent sam albo jeden wspólny zapis na stronę.

## Decyzja

- **Wyszukiwanie przez formularz** (przycisk albo Enter). Nowy tekst resetuje filtry i stronę.
  Sort zostaje jako preferencja, chyba że dotyczy porzucanej kategorii (kWh/W). Ten sam tekst
  wysłany ponownie nic nie robi, więc przypadkowy Enter nie kasuje filtrów.
- **Listy (kategoria, producent, sort)**: zapis po 300 ms (`FILTER_DELAY`), szybkie zmiany łączą się w jedną.
- **Pola od–do**: `UInputNumber` zmienia wartość dopiero przy opuszczeniu pola albo Enterze, więc para
  jest zapisywana, gdy fokus opuszcza oba pola (przejście z „od” do „do” jeszcze nic nie zapisuje),
  albo od razu po Enterze. Przy min > max pokazujemy błąd i nie zapisujemy.
- **Każda zatwierdzona zmiana to wpis w historii** (`push`), łącznie z paginacją: „wstecz” cofa świadome akcje.
- **Każda zmiana filtra wraca na stronę 1.**
- **Jeden zapis na stronę:** strona tworzy `provideListingQuery()`, a komponenty używają `useListingQuery()`.
  Wspólne debounce sprawia, że wyszukiwanie anuluje zmiany filtrów, które jeszcze czekają.

## Minusy

- Opóźnienie 300 ms jest odczuwalne przy szybkim klikaniu.
- Dużo wpisów w historii przy intensywnym filtrowaniu.
- Link paginacji kliknięty w trakcie oczekującej zmiany filtra przegrywa z nią (filtr wygrywa, strona 1).

## Warunek rewizji

Użytkownicy narzekają na długą historię (wtedy `replace` dla filtrów) albo na opóźnienie.
