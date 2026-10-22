# 0006. kWh/W z opisu, kontrolowane liczbą z nazwy

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Filtr i sort po kWh/W wymagają wartości wyciągniętej z danych ([analiza](../data-analysis.md)).
Kategoria wyznacza jednostkę: `battery` ma kWh, `solar panel` W, `connector` nie ma żadnej. Pierwsze
dopasowanie `<liczba><jednostka>` w opisie (z rozróżnianiem wielkości liter) daje 100 poprawnych wartości
i 50 braków (konektory). Liczba na końcu nazwy zgadza się w 100 przypadkach na 100. Mamy dwa niezależne
źródła, dziś zgodne.

## Rozważane opcje

1. Opis jako źródło, liczba z nazwy jako kontrola.
2. Tylko opis.
3. Tylko nazwa (liczba na końcu i jednostka z kategorii).

## Decyzja

Opcja 1. Wartość pochodzi z opisu, bo opis jest specyfikacją z jednostką. Przy niezgodności z nazwą
parser zwraca `null` i zapisuje ostrzeżenie w logu serwera. Nie wiemy wtedy, które źródło jest poprawne,
a dla instalatora „brak danych” jest lepszy niż błędna pojemność. Opcja 2 przepuściłaby taką zmianę
w danych po cichu. Opcja 3 jest krucha: nazwa nie ma jednostki, a `T-Branch 2-1` też kończy się liczbą.

## Minusy

- Produkt z literówką w nazwie traci wartość, choć opis jest poprawny.
- Kontrola zakłada konwencję nazw „liczba na końcu”. Nowy producent bez niej dostanie `null` wszędzie.

## Warunek rewizji

Dane dostaną osobną kolumnę z parametrem albo ostrzeżenia o niezgodności zaczną się pojawiać
dla poprawnych produktów.
