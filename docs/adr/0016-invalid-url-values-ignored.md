# 0016. Błędne wartości w URL są ignorowane, nie odrzucane

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Filtry są w URL (ADR 0012), więc użytkownik może go edytować, wkleić ucięty albo dostać stary link
(np. z sortem, który przestał pasować do kategorii). Serwer i aplikacja czytają URL tym samym parserem
(`parseProductQuery`).

## Rozważane opcje

1. Błędna wartość działa jak brak parametru, a lista się wyświetla.
2. Odpowiedź 400 z opisem błędu.
3. Przekierowanie na poprawiony URL (301).

## Decyzja

Opcja 1. Link z literówką ma pokazać produkty, a nie stronę błędu: to typowe zachowanie listingu sklepu.
Zasady w `shared/utils/query.ts` i `shared/utils/product-query.ts`:

- liczby muszą być skończone i ≥ 0 (`""`, `"abc"`, `"-5"` → brak),
- kategoria i sort tylko z dozwolonych list, sort tylko dozwolony w kategorii (`allowedSort`),
- zakres kWh/W czytany tylko w kategorii, która go ma,
- strona to liczba całkowita ≥ 1, a za duża jest przycinana do ostatniej.

Ten sam parser po obu stronach sprawia, że UI pokazuje dokładnie te filtry, które serwer zastosował.

## Minusy

- Użytkownik nie dostaje informacji, że część URL została pominięta.
- Błędne parametry zostają w pasku adresu, dopóki nie zmieni filtra (`canonical` je pomija, ADR 0013).

## Warunek rewizji

Publiczne API dla integracji (wtedy 400 z opisem) albo dane z analityki o częstych błędnych linkach
(wtedy przekierowanie na poprawiony URL).
