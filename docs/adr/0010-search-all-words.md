# 0010. Wyszukiwanie: każde słowo w nazwie, producencie lub opisie

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Wyszukiwanie ma obejmować nazwę, producenta i opis i działać na serwerze. Danych jest 150 wierszy,
tylko ASCII. Użytkownik wpisuje kilka słów w dowolnej kolejności, np. `powerflow 7.5`
dla „PowerFlow Stack 7.5”. Wyszukiwanie zawęża listę, nie zmienia kolejności (sort z [ADR 0009](0009-filters-and-sorting.md)).

## Rozważane opcje

1. Cała fraza jako podciąg.
2. Każde słowo musi wystąpić gdziekolwiek w trzech polach (AND).
3. Wyszukiwanie z trafnością lub tolerancją literówek (biblioteka typu Fuse.js albo silnik wyszukiwania).

## Decyzja

Opcja 2. Parametr `search`. Zapytanie jest przycinane, zamieniane na małe litery i dzielone
po białych znakach. Produkt pasuje, gdy każde słowo jest podciągiem połączonego tekstu
`name + manufacturer + description` (małymi literami, przygotowanego raz przy wczytaniu CSV).
Porównanie przez `includes`, bez regexa, więc znaki specjalne z zapytania nie wymagają escapowania.
Puste zapytanie nie filtruje. Opcja 1 zawodzi przy naturalnym wpisywaniu, a opcja 3 to zależność
i ranking, których przy 150 produktach i sortowaniu A–Z nie potrzebujemy.

## Minusy

- Brak tolerancji literówek (`powreflow` nic nie znajdzie).
- Krótkie słowo dopasuje się w środku innych (`pa` w „panel” i „Pa”).
- Słowo trafione w opisie daje wynik, którego użytkownik może nie rozumieć.

## Warunek rewizji

Tysiące produktów, potrzeba trafności albo tolerancji literówek, albo opisy w kilku językach.
