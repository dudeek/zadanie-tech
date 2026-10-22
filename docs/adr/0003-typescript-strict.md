# 0003. TypeScript strict: domyślne Nuxta plus dwie flagi

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Zadanie wymaga TypeScript w trybie strict. Nuxt 4.6 generuje cztery tsconfigi (app, server, shared,
node) i we wszystkich włącza `strict` oraz `noUncheckedIndexedAccess` (`rows[0]` i `match[1]` mają typ
`T | undefined`, co pomaga przy parserze CSV i kWh/W). Nieużywane zmienne i importy typów sprawdza
już ESLint. `nuxt typecheck` uruchamiają `pnpm check`, hook pre-commit i CI. TypeScript nie chroni
na granicach systemu (query z URL, wiersze CSV), tam potrzebna jest walidacja w runtime.

## Rozważane opcje

1. Domyślne Nuxta plus `noImplicitReturns` i `noFallthroughCasesInSwitch`.
2. Jak 1 plus `exactOptionalPropertyTypes`.
3. Tylko domyślne Nuxta.

## Decyzja

Opcja 1, ustawiona w `typescript.tsConfig.compilerOptions` w `nuxt.config.ts` (trafia do wszystkich
kontekstów). Obie flagi nie kosztują nic, a łapią błędy w parserze i w mapowaniu filtrów.
`noUnusedLocals`/`noUnusedParameters` byłyby duplikatem reguły ESLint.

## Minusy

- Bez `exactOptionalPropertyTypes` „pola nie ma” i „pole = `undefined`” to dla TS to samo.
  Przy obiekcie filtrów z URL rozróżnienie zapewnia walidacja, nie kompilator.

## Warunek rewizji

Błąd z pomylenia brakującego pola z `undefined` albo potwierdzenie, że typy Nuxt UI
są zgodne z `exactOptionalPropertyTypes`.
