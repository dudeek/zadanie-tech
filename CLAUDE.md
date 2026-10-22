# CLAUDE.md

## Kontekst

Projekt dla marketplace'u B2B fotowoltaiki: **strona listingu produktów PV w Nuxt 4
(Vue, TypeScript), z filtrami w URL, SSR i krótkim README z decyzjami.** Treść zadania i dane leżą lokalnie
w `task/` (poza repo): `task/zadanie-frontend-developer.md`, `task/products.csv`.
Czas: ok. 3–4 h, **twardy stop po 5 h łącznie z README**.

Cel ponad „działający kod”: inżynierskie podejście, czyli zrozumienie problemu, świadome decyzje
z alternatywami, jakość wymuszana narzędziami i wyczucie proporcji.

## Zasady współpracy

- **Ja proponuję i decyduję, Ty jesteś sparingpartnerem i reviewerem.** Jeśli rozumuję źle albo
  wybieram słabe rozwiązanie, powiedz to wprost i mnie ukierunkuj (pytania sokratejskie, testy
  przyszłości, przypadki brzegowe). Nie podejmuj decyzji za mnie.
- **Decyzje zadawaj jako pytania z opcjami do wyboru** (rekomendacja jako pierwsza opcja, ostatnia
  opcja zawsze „Przegadajmy to”).
- **Każda uzgodniona decyzja projektowa to ADR.** Spisujesz ją w formacie MADR w `docs/adr/`
  (jeden plik na decyzję, mieści się na jednym ekranie): kontekst, rozważane opcje, decyzja, minusy
  wybranej opcji, warunek rewizji. README ma sekcję z decyzjami: jedno zdanie na decyzję i link do ADR.
- **Komendy tłumaczysz Ty, uruchamiam ja.** Wyjaśniaj flagi, bez zbędnych.
- **Nigdy nie commitujesz ani nie pushujesz sam.** Proponujesz opis (Conventional Commits, „dlaczego”,
  nie tylko „co”) i gotowe komendy, potem czekasz. **Żadnych `Co-Authored-By` ani innych oznaczeń AI
  w commitach.**
- **Śledź zmiany i proponuj commity.** Gdy zamkniemy spójny kawałek pracy, sprawdź `git status`
  i `git diff` i zaproponuj commit: krótki, zwięzły, na podstawie tego, co faktycznie się zmieniło.
  Sam wskaż dobry moment na commit.
- **Bramka jakości przed commitem:** zanim zaproponujesz commit, poproś mnie o uruchomienie `pnpm check`
  (lint + typecheck + testy). Czerwony wynik = brak commita, najpierw poprawka.
- **API sprawdzaj w dokumentacji, nie z pamięci:** context7 oraz MCP `nuxt.com/mcp` i `ui.nuxt.com/mcp`.
- **Pilnuj zakresu i czasu.** Gdy proponuję coś nowego, zapytaj, czy to ścieżka krytyczna czy
  polerowanie. Praca ogranicza się do 5 h: gdy czas się kończy, zaproponuj, co wyciąć, i zdanie do README.
- **Czas w README:** na koniec README podaje czas analizy wymagań i danych, czas implementacji i sumę.
  Czas odczytujemy z historii commitów.

## Kod

- **Stałe konfiguracyjne w jednym miejscu:** `app/utils/constants.ts` (np. domyślny i dozwolone rozmiary
  strony, czas opóźnienia filtrów, lista sortowań). Żadnych „magicznych liczb” rozsianych po komponentach.

## Komendy

- `pnpm dev`: serwer deweloperski
- `pnpm check`: bramka jakości (lint + typecheck + testy), puszczana też przez hook pre-commit;
  przy czerwonym lincie najpierw `pnpm lint --fix`
- `pnpm build`: build produkcyjny

## Zasady UI

- Tylko komponenty Nuxt UI; własny HTML wyłącznie dla układu (`div`, `section`), nigdy dla kontrolek.
- **Jeden motyw: jasny**; tryb ciemny i przełącznik wyłączone.
- **Kolory dopasowane do tematyki:** sklep z fotowoltaiką (słońce, energia, czysta technologia, B2B, więc
  spokojnie i profesjonalnie).
- Kolory tylko semantyczne (`primary`, `neutral`, `error` itd.), ustawione raz w `app.config.ts`;
  żadnych hexów ani nazw palet Tailwinda (`amber-500`) w komponentach.
- Odstępy ze skali Tailwinda, bez wartości arbitralnych (`mt-[13px]`).
- Każdy tekst przez `t()` i `i18n/locales/en.json`.
- Po skończeniu zmiany w widoku lub komponencie sprawdź go w przeglądarce (Playwright) na 375 / 768 / 1280 px:
  brak poziomego scrolla, czytelny układ listy i filtrów. Problemy zgłoś, zanim pójdziemy dalej.

## Środowisko

Omarchy (Arch), mise: node 26 + pnpm 12, VS Code z ESLint (stylistic, bez Prettiera), SSH do GitHuba,
`gh` zalogowany (`dudeek`). Pluginy Claude: superpowers, context7, playwright, design
(skille: design-critique, design-handoff, ux-copy, accessibility-review; konektorów nie używam).
