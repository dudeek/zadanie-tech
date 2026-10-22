# 0011. Produkty jako karty w siatce, 20 na stronę

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Produkt ma nazwę, producenta, kategorię, opis (ok. 200 znaków), cenę i u baterii oraz paneli kWh/W.
Zdjęć nie ma. Wyszukiwanie obejmuje opis, więc opis musi być widoczny, żeby było wiadomo, dlaczego
produkt pasuje. Instalator porównuje przede wszystkim cenę i parametr.

## Rozważane opcje

| | Tabela | Karty (siatka) | Lista wierszy |
|---|---|---|---|
| Porównywanie ceny i parametru | najlepsze | słabsze, bo pozycja zależy od treści | dobre (stałe kolumny) |
| Opis (~200 znaków) | nie mieści się | tak | tak, 2 linie |
| Wyszukiwanie po opisie | nie widać, dlaczego pasuje | tak | tak |
| Telefon | osobny widok | naturalnie | naturalnie |
| Bez zdjęć | tak | puste miejsce, gdy karta zakłada zdjęcie | tak |

## Decyzja

Karty w siatce (1/2/3/4 kolumny od 375 do 1280 px), z komponentów Nuxt UI. Lista wierszy była
zbudowana i sprawdzona, ale karty zostały wybrane ze względu na odbiór wizualny. Główny minus kart
łagodzi układ: kWh/W i cena są w stopce dociśniętej do dołu karty, więc w każdym rzędzie siatki stoją
na tej samej wysokości. Opis jest przycięty do 3 linii. Sortowanie będzie w liście rozwijanej nad
siatką, a paginacja pod nią. Akcent kolorystyczny wybierzemy na końcu (ADR 0002).

20 produktów na stronę: przy 4 kolumnach to 5 pełnych rzędów, a kategoria (50 produktów) mieści się
na 3 stronach. Lighthouse mierzymy na tej wartości.

## Minusy

- Porównywanie ceny i parametru jest słabsze niż w tabeli albo w liście.
- Mniej produktów na ekranie niż w liście wierszy.

## Warunek rewizji

Użytkownicy porównują głównie parametry. Wtedy przełącznik siatka/lista z wyborem zapisanym w cookie,
a nie w URL (to preferencja, nie treść, i nie tworzy duplikatów stron).
