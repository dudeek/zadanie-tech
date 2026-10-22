# 0009. Filtry i sortowanie

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Zadanie wymaga filtrów po kategorii, producencie i cenie oraz filtra lub sortu po kWh/W.
kWh mają tylko baterie, W tylko panele, konektory nie mają żadnej z tych wartości. Każdy producent
jest w jednej kategorii. Ceny wszystkich kategorii mieszczą się w 6.99–1999, konektorów w 6.99–220.
Nie mamy danych o popularności ani marży, więc nie ma podstaw do kolejności „polecanej”.

## Rozważane opcje

- kWh/W: zawsze widoczne albo tylko po wybraniu kategorii. Wspólny parametr `specMin`/`specMax`
  albo osobne dla każdej wielkości.
- Producent: jeden albo wielu, lista pełna albo zawężona do kategorii.
- Zakresy: suwak albo dwa pola liczbowe.
- Sortowanie: brak, tylko cena albo cena i kWh/W. Domyślnie kolejność z CSV albo nazwa.

## Decyzja

| Filtr / sort | Parametr URL | Dostępny |
|---|---|---|
| Kategoria | `category` | zawsze |
| Producent (wielu) | `manufacturer` (powtarzany) | zawsze, lista zawężona do kategorii |
| Cena od–do | `priceMin`, `priceMax` | zawsze |
| Pojemność od–do (kWh) | `capacityMin`, `capacityMax` | `category=battery` |
| Moc od–do (W) | `powerMin`, `powerMax` | `category=solar-panel` |
| Sort | `sort`: `name` (domyślny), `price-asc`, `price-desc`, `capacity-asc/desc`, `power-asc/desc` | kWh/W tylko w swojej kategorii |

- kWh/W są dostępne tylko w kategorii, w której mają sens, więc nie porównujemy kWh z W.
  Osobne parametry dla każdej wielkości sprawiają, że zmiana kategorii nie zmienia znaczenia liczby.
  Serwer ignoruje parametry niepasujące do kategorii, a UI czyści je przy zmianie kategorii.
- Producenci z innej kategorii: serwer stosuje filtry dosłownie (pusty wynik), a UI czyści ich przy zmianie kategorii.
- Zakresy jako dwa pola liczbowe. Suwak przy rozpiętości ok. 300× jest nieprecyzyjny.
  Granice z danych dla wybranej kategorii.
- Domyślnie nazwa A–Z: bez danych o popularności to jedyna kolejność przewidywalna dla użytkownika
  i stabilna przy paginacji. Produkt bez kWh/W (`null`, [ADR 0006](0006-spec-from-description-checked-by-name.md))
  odpada przy filtrze zakresu i trafia na koniec przy sortowaniu.

## Minusy

- Bez wybranej kategorii nie da się filtrować ani sortować po kWh/W.
- Dziewięć parametrów URL, więcej do walidacji (temat 6).

## Warunek rewizji

Pojawią się dane o popularności (sort „polecane”) albo kategorie z kilkoma parametrami technicznymi.
