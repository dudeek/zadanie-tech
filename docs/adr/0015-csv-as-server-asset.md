# 0015. CSV jako server asset Nitro, odczyt przez useStorage

- Status: przyjęta
- Data: 2026-10-22

## Kontekst

Dane są w `products.csv`, bez bazy. Na Vercelu serwer działa jako funkcja serverless: w runtime nie ma
gwarancji, że plik z repozytorium leży obok kodu funkcji. Lokalnie `fs` widzi cały projekt, więc błąd
wyszedłby dopiero na produkcji.

## Rozważane opcje

1. `server/assets/products.csv` + `useStorage('assets:server').getItem()`.
2. `fs.readFile` ze ścieżki w repozytorium (plik trzeba ręcznie dołączyć do funkcji).
3. Import CSV jako tekstu w kodzie (`?raw`) albo skrypt generujący JSON przy buildzie.

## Decyzja

Opcja 1. Nitro przy buildzie produkcyjnym wkleja pliki z `server/assets/` do bundla funkcji
(sprawdzone w źródle `server-assets.ts`), więc w runtime nie ma odczytu z dysku. W dev ten sam kod czyta
plik z dysku przez sterownik `fs`. To jeden mechanizm frameworka, bez ręcznej konfiguracji dołączania plików.
Sprawdzone na produkcji: filtry, wyszukiwanie i paginacja zwracają te same wyniki co lokalnie.

## Minusy

- Zmiana danych wymaga deployu (plik jest w bundlu).
- Po dodaniu albo usunięciu pliku w `server/` dev server trzeba zrestartować, bo nie odświeża mapy plików.

## Warunek rewizji

Dane zmieniane bez deployu albo duży plik: wtedy baza albo zewnętrzny storage (Vercel Blob).
