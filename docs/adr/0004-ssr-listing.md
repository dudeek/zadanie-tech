# 0004. Listing `/` renderowany w SSR przy każdym żądaniu

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Link z filtrami w query ma się wyrenderować w SSR z właściwymi wynikami. Starter miał
`routeRules: { '/': { prerender: true } }`: `/` generowany raz przy buildzie ignoruje query, więc każdy
link z filtrami dostaje w HTML pełną listę. Danych jest 150 wierszy w pamięci, filtrowanie trwa milisekundy.

## Rozważane opcje

1. Czyste SSR: usunąć regułę, renderować każde żądanie.
2. ISR na Vercelu z `allowQuery` (lista parametrów filtrów) i `passQuery: true`.
   Bez `passQuery` funkcja renderuje stronę bez query, czyli ten sam błąd co przy prerenderze.
3. SSR teraz, ISR na końcu, jeśli zostanie czas.

## Decyzja

Opcja 1. Najprostsza i poprawna z definicji: HTML zawsze odpowiada query. Brak warstwy cache,
którą trzeba debugować i której nie da się przetestować lokalnie.

## Minusy

- Każde żądanie uruchamia funkcję: cold start podnosi TTFB (widoczne w Lighthouse).
- Brak cache CDN dla popularnych kombinacji filtrów.

## Warunek rewizji

Ruch albo TTFB z Lighthouse uzasadnią cache. Wtedy opcja 2 z `allowQuery` generowanym
z tej samej listy parametrów co schemat URL, żeby nie utrzymywać jej w dwóch miejscach.
