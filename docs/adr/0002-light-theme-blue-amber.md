# 0002. Jeden jasny motyw, primary niebieski, akcent bursztynowy

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Sklep B2B z fotowoltaiką: wygląd ma być spokojny i profesjonalny, kolory pasujące do tematyki
(słońce, energia, technologia). Nuxt UI daje kolory semantyczne (`primary`, `secondary`, `neutral`...)
ustawiane w `app.config.ts` i domyślnie tryb ciemny z przełącznikiem. W jasnym motywie `primary`
to odcień 500 z białym tekstem na przyciskach.

## Rozważane opcje

1. Primary niebieski, secondary bursztynowy, neutral slate.
2. Primary zielony (emerald), neutral slate.
3. Primary bursztynowy.

## Decyzja

Opcja 1, tylko jasny motyw. Niebieski kojarzy się z zaufaniem i technologią (B2B), a panele PV
są niebieskie. Bursztyn jako akcent „słońca” w wyróżnieniach. `--ui-primary` przesunięty na odcień 600,
bo `blue-500` z białym tekstem ma ok. 3,7:1, a WCAG AA wymaga 4,5:1.
Tryb ciemny wyłączony przez `ui.colorMode: false`: jeden motyw do zaprojektowania i przetestowania.

Kolory muszą spełniać kontrast WCAG 2.1 AA (4,5:1 dla tekstu, 3:1 dla dużego tekstu i elementów UI),
bo decyduje to o czytelności dla użytkownika. Paleta i odcienie mogą się zmienić, gdy na ekranie
pojawią się docelowe komponenty i sprawdzimy je w realnym użyciu.

## Minusy

- Mniej skojarzeń z „eko” niż zieleń.
- Bursztynowy tekst na białym tle ma za mały kontrast: secondary tylko jako tło akcentu, do sprawdzenia
  w przeglądzie dostępności.
- Brak trybu ciemnego dla osób, które go preferują.

## Warunek rewizji

Komponent na ekranie nie spełnia WCAG AA w obecnej palecie, marketplace ma własny brand book
albo użytkownicy zgłaszają potrzebę trybu ciemnego.
