# 0008. Model produktu i cena

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

CSV ma kolumny `name, manufacturer, price, description, category`, bez `id` i bez waluty.
Nazwy są unikalne. Każda kategoria ma jedną jednostkę parametru albo żadnej. Ceny pasują
do `\d+(\.\d{1,2})?` (np. `18.5`). Na cenach nic nie liczymy, tylko filtrujemy, sortujemy
i wyświetlamy. Strony produktu nie ma w zakresie.

## Rozważane opcje

- Parametr: jedno pole `spec: { value, unit } | null` albo dwa pola `capacityKwh` i `powerW`.
- Identyfikator: osobny `id`/slug albo nazwa.
- Cena: `number` albo grosze jako integer. Parsowanie: `parseFloat`, `Number` albo regex i `Number`.
- Waluta: EUR albo brak symbolu. Formatowanie: stała i `Intl` albo `numberFormats` z vue-i18n.

## Decyzja

- `spec: { value, unit } | null`: jednostka wynika z kategorii, więc nie ma stanu „kWh i W naraz”.
- Bez pola `id`: identyfikator jest potrzebny tylko jako `:key` listy, a do tego wystarcza unikalna nazwa.
- Cena jako `number`. Najpierw regex `^\d+(\.\d{1,2})?$`, potem `Number()`, a wiersz niepasujący
  jest odrzucany z ostrzeżeniem. Bez regexa `parseFloat('1,999.00')` daje po cichu 1,
  a `Number('')` daje 0.
- Waluta EUR (rynek europejski) jako jawne założenie. Jest zdefiniowana tylko w formacie `price`
  w `i18n/i18n.config.ts`, a komponenty wywołują `n(price, 'price')` z `useI18n()`.

## Minusy

- EUR i „ceny netto czy brutto” to założenia, których dane nie potwierdzają.
- `number` nie nadaje się do sumowania cen (koszyk).
- Zmiana nazwy produktu zmienia jego klucz na liście.

## Warunek rewizji

Dane dostaną walutę albo `id`, pojawi się koszyk lub sumy (wtedy grosze) albo strona produktu (wtedy slug).
