# Feature Request: Deck-Dateien im Card Manager auswählen statt Pfad tippen

**Datum:** 2026-11-06  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `src/app/features/card-manager/components/add-deck-form/`, `public/decks/`, `package.json` (Skripte),
`scripts/`, `REQUIREMENTS.md` (Abschnitt 5), `docs/feature-requests/done/card-manager-multiple-decks.md` (#2, #11)

---

## Problem

- In der Gruppe „Deck Management“ gibt der DM den Pfad einer Deck-XML-Datei als Text ein (vorbelegt mit
  `decks/default/default-deck.xml`). Welche Decks es gibt, sieht er nicht; am Tablet ist das Tippen mühsam und
  Tippfehler führen zu einer Fehlermeldung.
- Die App läuft im Browser und kann `public/decks/` zur Laufzeit nicht durchsuchen (der statische Server liefert keine
  Verzeichnislisten). Sie braucht deshalb eine Liste der vorhandenen Decks.

---

## Ziel

- Der DM wählt in „Deck Management“ ein vorhandenes Deck aus einer Auswahlliste (Name des Decks) und fügt es mit
  „Deck hinzufügen“ als neues Deck auf den Tisch.
- Ein neues Deck wird verfügbar, indem man seine Dateien unter `public/decks/<deck>/` ablegt; eine Liste von Hand
  pflegen muss niemand.

---

## Anforderungen

### 1. Deckliste beim Start und Build erzeugen

- Ein Node-Skript (z. B. `scripts/decks/generate-deck-index.mjs`) durchsucht `public/decks/*/*.xml` und schreibt
  `public/decks/decks.json` mit je Deck dem Pfad (relativ zur base href, z. B. `decks/default/default-deck.xml`) und
  dem Namen aus dem Attribut `name` des `<deck>`-Elements (fehlt er: Dateiname ohne Endung).
- Sortierung nach Name. Dateien ohne `<deck>`-Element werden übersprungen und als Warnung ausgegeben.
- Das Skript läuft automatisch vor `npm start`, `npm run build`, `npm run watch` und `npm run deploy`
  (z. B. `prestart`/`prebuild`), damit Entwicklung, Build und Veröffentlichung dieselbe Liste haben.
- `public/decks/decks.json` ist erzeugt; ob sie eingecheckt oder per `.gitignore` ausgeschlossen wird, entscheidet die
  Umsetzung (Tests und e2e müssen ohne vorherigen manuellen Schritt laufen).

### 2. Auswahl in „Deck Management“

- Statt des Pfadfelds zeigt „Deck Management“ eine Auswahlliste mit den Decknamen aus `decks/decks.json`;
  vorausgewählt ist das erste Deck.
- „Deck hinzufügen“ lädt das gewählte Deck als neue Instanz wie bisher (gleicher Ablauf, Durchnummerieren der Namen,
  Lade- und Fehlerzustand).
- Kann die Liste nicht geladen werden oder ist sie leer, zeigt die Gruppe einen Hinweis („Keine Decks gefunden“) und
  „Deck hinzufügen“ ist deaktiviert.
- Dasselbe gilt für das Formular im leeren Spieltisch („Noch keine Decks auf dem Tisch.“).

### 3. Dokumentation

- `REQUIREMENTS.md`, Abschnitt 5, beschreibt die Auswahl statt der Pfadangabe und wie ein neues Deck verfügbar wird.
- `.claude/rules/architecture.md` nennt das Skript und `decks.json`.

---

## Akzeptanzkriterien

- [ ] Nach `npm start` bzw. `npm run build` enthält `decks/decks.json` alle Decks unter `public/decks/` mit Pfad und
      Namen; ein neu abgelegtes Deck erscheint ohne weitere Pflege.
- [ ] „Deck Management“ zeigt eine Auswahlliste mit Decknamen statt eines Pfadfelds; „Deck hinzufügen“ legt das gewählte
      Deck als neue Instanz auf den Tisch.
- [ ] Ohne Liste oder ohne Decks erscheint ein Hinweis und „Deck hinzufügen“ ist deaktiviert.
- [ ] Specs decken Skript (Name, Fallback, Sortierung, ungültige Dateien) und Auswahl ab; die e2e-Smoke-Tests
      (`card-manager-decks`, `routes`) laufen weiter.
