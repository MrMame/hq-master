# Feature Request: Auswahlliste der verfügbaren Decks

**Datum:** 2026-11-07  
**Priorität:** Mittel  
**Status:** ✅ done (2026-11-07 18:04)  
**Bezug:** `src/app/features/card-manager/components/add-deck-form/`, `src/app/core/services/card-deck/`,
`public/decks/`, `package.json`, `playwright.config.ts`, `.gitignore`, `REQUIREMENTS.md` (Abschnitt Card Manager)

---

## Problem

- Neue Decks legt der DM als Ordner unter `public/decks/<deck>/` (XML + SVG) ab. Im Card Manager muss er den Pfad
  der XML-Datei aber von Hand eintippen und kennen.
- Die App läuft statisch (GitHub Pages, `ng deploy`). Der Browser kann `public/` nicht auflisten, die App weiß also
  nicht, welche Decks es gibt.

---

## Ziel

Der DM wählt im Card Manager ein Deck aus einer Auswahlliste aller bereitgestellten Decks und fügt es hinzu. Ein neues
Deck bereitzustellen heißt nur noch: Ordner nach `public/decks/` kopieren.

---

## Anforderungen

### 1. Deck-Katalog per Skript erzeugen ✅ done (2026-11-07 18:04)

- Ein Node-Skript `scripts/build-deck-index.mjs` durchsucht `public/decks/*/*.xml` und schreibt
  `public/decks/index.json`:

  ```json
  [{ "id": "default-deck", "name": "Beispieldeck", "url": "decks/default/default-deck.xml" }]
  ```

- `id` und `name` kommen aus den Attributen des `<deck>`-Elements, `url` ist der Pfad relativ zu `public/`
  (mit `/`, auch unter Windows).
- Sortierung nach `name` (deutsch, ohne Groß-/Kleinschreibung), damit die Liste stabil ist.
- Ist eine XML-Datei kein Deck (kein `<deck>`-Element) oder fehlt `name`, bricht das Skript mit einer Meldung ab,
  die Datei und Grund nennt. Es entsteht dann keine `index.json`.
- Das Skript bekommt Tests (`node --test`), u. a. für mehrere Decks, Sortierung, fehlenden `name` und kein Deck.

### 2. Skript automatisch ausführen ✅ done (2026-11-07 18:04)

- Das Skript läuft vor jedem Weg, auf dem die App gebaut oder ausgeliefert wird:
  `prestart`, `prebuild`, `predeploy` in `package.json` (`ng deploy` ruft nicht `npm run build` auf) und im
  `webServer.command` von `playwright.config.ts` (startet `ng serve` direkt).
- `public/decks/index.json` ist ein Build-Ergebnis und steht in `.gitignore`.

### 3. Katalog in der App laden ✅ done (2026-11-07 18:04)

- Ein Service `DeckCatalogService` (in `core/services/card-deck/`) lädt `decks/index.json` per `HttpClient` und
  stellt die Einträge als Signal bereit, dazu Lade- und Fehlerzustand.
- Der Katalog wird einmal geladen, nicht bei jedem Öffnen des Card Managers neu.
- Der Katalog gehört nicht zur Spielesession und nicht zum XML-Spielstand.

### 4. Auswahlliste statt Pfadeingabe ✅ done (2026-11-07 18:04)

- `AddDeckForm` zeigt statt des Textfelds eine Auswahlliste mit den Namen aller Decks im Katalog und daneben
  „Deck hinzufügen“. Eine Pfadeingabe gibt es nicht mehr.
- Vorausgewählt ist der erste Eintrag. Die Auswahl bleibt nach dem Hinzufügen stehen, damit dasselbe Deck sofort noch
  einmal hinzugefügt werden kann.
- Alle Einträge sind immer wählbar und hinzufügbar, auch wenn das Deck schon auf dem Tisch liegt. Es gibt keine
  Markierung bereits geladener Decks.
- „Deck hinzufügen“ ruft wie bisher `CardManagerService.addDeck(url)` auf; Durchnummerierung gleicher Namen, Ladeanzeige
  und Fehlermeldung beim Laden der XML bleiben.
- Das gilt für beide Stellen, an denen `AddDeckForm` erscheint (Gruppe „Deck Management“ und leerer Spieltisch).
- Zustände:
  - Katalog lädt: Auswahl und Knopf deaktiviert, Hinweis „Decks werden geladen …“.
  - Katalog nicht ladbar: Meldung „Deckliste konnte nicht geladen werden.“, Knopf deaktiviert.
  - Katalog leer: Meldung „Keine Decks unter public/decks gefunden.“, Knopf deaktiviert.

### 5. Dokumentation ✅ done (2026-11-07 18:04)

- `REQUIREMENTS.md` beschreibt die Auswahlliste statt „Pfadangabe, vorbelegt mit dem Beispieldeck“.
- `REQUIREMENTS.md` nennt, dass ein Deck durch Ablegen eines Ordners unter `public/decks/` bereitgestellt wird und
  die Liste beim Start/Build entsteht.

---

## Akzeptanzkriterien

- [x] Ein neuer Deck-Ordner unter `public/decks/` erscheint nach `npm start` ohne weitere Schritte in der Auswahlliste.
- [x] Im Card Manager gibt es kein Textfeld für einen Deck-Pfad mehr.
- [x] Dasselbe Deck lässt sich mehrfach hintereinander hinzufügen („Monster“, „Monster (2)“, …), ohne die Auswahl zu
      ändern.
- [x] Lade-, Fehler- und Leerzustand des Katalogs werden angezeigt; der Knopf ist dann deaktiviert (Specs mit
      `HttpTestingController`).
- [x] Ein fehlerhaftes Deck-XML lässt `npm start` / `npm run build` mit verständlicher Meldung scheitern.
- [x] `npm run e2e` und `npm run deploy` erzeugen den Katalog vor dem Start bzw. Build.
- [x] `public/decks/index.json` ist nicht eingecheckt.
