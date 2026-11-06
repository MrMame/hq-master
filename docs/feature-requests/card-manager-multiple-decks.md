# Feature Request: Card Manager mit beliebig vielen Decks

**Datum:** 2026-11-06  
**Priorität:** Hoch  
**Status:** offen  
**Bezug:** `src/app/features/card-manager/`, `src/app/core/services/card-deck/`, `src/app/core/models/card.model.ts`,
`src/app/features/game-session/xml/`, `src/styles/components/feature-page.css`, `src/styles/tokens.css`,
`REQUIREMENTS.md` (Abschnitt 5)

---

## Problem

- Der Card Manager verwaltet genau ein Deck. Am echten Spieltisch liegen beliebig viele Decks (6 und mehr)
  nebeneinander, jedes mit eigenem Nachziehstapel, Ablagestapel und eigener Bank.
- „Deck Laden“, „Nachziehstapel Mischen“ und „Zurücksetzen“ in der Seitenleiste wirken immer auf das eine Deck.
- Das Erscheinungsbild (bunte Flächen rot, blau, grün, gelb, lila) passt nicht zu Dungeon Tracker, Dungeon Builder
  und Time Tracker (dunkle Seite, gemeinsame Seitenhülle `feature-page`).

---

## Ziel

- Der DM legt beliebig viele Decks auf den „Spieltisch“, auch dasselbe Deck mehrfach, und zieht jederzeit aus
  jedem Deck eine Karte.
- Jedes Deck hat einen eigenen Nachziehstapel, Ablagestapel und eine eigene Bank. Mischen und Zurücksetzen
  wirken nur auf dieses Deck.
- Es gibt immer genau **eine** aktive Karte für alle Decks.
- Jede Karte aus jedem Deck lässt sich wie bisher einem Charakter zuweisen.
- Auch bei vielen Decks behält der DM die Übersicht: kompakte Deck-Reihen, höchstens eine aufgeklappt.
- Der Card Manager sieht aus wie Dungeon Tracker und Dungeon Builder.

---

## Grundsatz

- **Keine Obergrenze** für die Zahl der Decks. Layout und Datenmodell dürfen keine feste Anzahl annehmen.
- Ein Deck auf dem Tisch ist eine **Deck-Instanz** mit eigener ID, eigenem Namen und eigenem Zustand
  (Nachziehstapel, Ablagestapel, Bank). Dieselbe Deck-XML-Datei kann mehrere Instanzen haben.
- Karten sind über alle Instanzen eindeutig adressierbar (Instanz-ID plus Karten-ID). Zuweisungen an Charaktere
  speichern diese Adresse, damit Karten gleicher ID aus zwei Instanzen nicht verwechselt werden.
- Eine Karte gehört immer zu ihrer Instanz. Ablegen bringt sie in den Ablagestapel **ihrer** Instanz zurück.

---

## Anforderungen

### 1. Datenmodell: Liste von Deck-Instanzen

- Der Deck-Zustand der Spielesession wird zu einer geordneten Liste von Deck-Instanzen
  (`id`, `name`, Deck-Konfiguration/Quelle, `drawPile`, `discardPile`, `bank`).
- Die aktive Karte steht einmal im Zustand, mit Verweis auf ihre Instanz.
- Der Bereich „Ausgerüstet“ bleibt gemeinsam für alle Decks. Jeder Eintrag verweist auf Instanz und Karte.
- Die Reihenfolge der Liste ist die Anzeigereihenfolge.

### 2. Deck hinzufügen

- „Deck hinzufügen“ in der Seitenleiste lädt eine Deck-XML-Datei als **neue** Instanz; bestehende Decks bleiben
  unverändert.
- Der Name kommt aus dem Deck. Gibt es den Namen schon, wird automatisch durchnummeriert, z. B. „Monster (2)“.
- Ohne Decks zeigt der Hauptbereich einen Hinweis („Noch keine Decks“) mit „Deck hinzufügen“.

### 3. Deck-Reihen im Hauptbereich

- Jede Instanz erscheint als kompakte Reihe: Name, Nachziehstapel (Rückseite mit Anzahl), oberste Karte des
  Ablagestapels mit Anzahl, Anzahl der Bank-Karten, Menü ⋮.
- Ein Klick auf den Nachziehstapel zieht sofort eine Karte dieses Decks (siehe 5.).
- Ein Klick auf die Reihe klappt sie auf und zeigt Nachziehstapel, Ablagestapel und Bank dieses Decks mit allen
  Karten, bedienbar wie heute. Es ist höchstens eine Reihe aufgeklappt; das Aufklappen einer anderen klappt die
  bisherige zu. Neue Decks starten eingeklappt.
- Leere Stapel zeigen einen Platzhalter statt einer Karte.

### 4. Aktionen je Deck

- Das Menü ⋮ jeder Reihe bietet: **Mischen** (Nachziehstapel dieses Decks), **Zurücksetzen** (nur dieses Deck),
  **Umbenennen**, **Entfernen**.
- „Zurücksetzen“ lässt ausgerüstete Karten dieses Decks bei ihren Besitzern (wie heute). Ist die aktive Karte aus
  diesem Deck, wird sie mit zurückgesetzt.
- „Entfernen“ fragt nach. Danach sind das Deck, seine Stapel, seine Bank und **seine ausgerüsteten Karten**
  verschwunden; die Charaktere verlieren deren Boni. Ist die aktive Karte aus diesem Deck, gibt es danach keine
  aktive Karte.
- Die Reihenfolge der Decks lässt sich ändern (z. B. per Ziehen oder Hoch/Runter im Menü), passend zur Lage auf dem
  echten Tisch.
- Die Gruppe „Deck Aktionen“ in der Seitenleiste mit Aktionen für ein einzelnes Deck entfällt.

### 5. Eine aktive Karte

- Es gibt immer höchstens eine aktive Karte. Sie schwebt wie heute über der Seite und zeigt zusätzlich den Namen
  ihres Decks.
- Ein Klick auf die aktive Karte legt sie in den Ablagestapel ihres Decks.
- Zieht der DM eine Karte, während schon eine aktiv ist (aus demselben oder einem anderen Deck), kommt die bisherige
  automatisch in den Ablagestapel ihres Decks und die neue wird aktiv.
- „Charakter zuweisen“ funktioniert wie bisher für Ausrüstungskarten aus jedem Deck. Muss ein belegter Slot geräumt
  werden, kommt die bisherige Karte in den Ablagestapel **ihres** Decks.

### 6. Ausgerüstet

- Der Bereich „Ausgerüstet“ bleibt ein gemeinsamer Bereich für alle Decks, mit „Im Besitz von <Name>“ und einem
  Hinweis auf das Herkunftsdeck.
- Legt der DM eine Karte im Charakter-Editor ab oder wird ein Charakter gelöscht, kommt die Karte in den
  Ablagestapel ihres Decks.

### 7. Seitenleiste „Decks“

- Die Gruppe „Decks“ listet alle Instanzen in Tischreihenfolge mit Name und Anzahl im Nachziehstapel.
- Ein Klick auf einen Eintrag klappt die Reihe des Decks auf und scrollt zu ihr.
- Ein Suchfeld filtert die Liste nach Namen (wie die Suche im Dungeon Builder).
- „Deck hinzufügen“ steht in dieser Gruppe.

### 8. Spielesession und XML-Spielstand

- Alle Instanzen (Name, Reihenfolge, Quelle, Stapel, Bank), die aktive Karte und die Zuweisungen gehören zur
  Spielesession und zum XML-Spielstand.
- Ältere Spielstände mit einem Deck laden als eine Instanz; ihre Zuweisungen werden dieser Instanz zugeordnet.
- Zuweisungen an fehlende Charaktere landen beim Laden wie bisher im Ablagestapel ihres Decks; Zuweisungen auf
  fehlende Deck-Instanzen werden verworfen.

### 9. Erscheinungsbild wie Dungeon Tracker und Dungeon Builder

- Der Card Manager nutzt die gemeinsame Seitenhülle aus `src/styles/components/feature-page.css`
  (`feature-page`, `feature-page__main`, dunkle Seite `--color-gray-900`, weiße Schrift).
- Überschriften im Hauptbereich nutzen `section-heading`, leere Bereiche `empty-hint`.
- Die bunten Platzhalter-Farben (`--color-card-manager-*` in `tokens.css`) entfallen; Deck-Reihen, Stapel und Bank
  bekommen dezente dunkle Flächen und Ränder aus den vorhandenen Tokens, passend zu Legende und Bibliothek von
  Tracker und Builder.
- Die Seitenleiste mit Titel „Card Manager“ und „alle auf-/zuklappen“ bleibt wie in den anderen Features.
- Der Card Manager ist am PC und auf dem Tablet bedienbar; auf schmalen Bildschirmen gibt es keinen waagerechten
  Seitenscroll.

### 10. Dokumentation

- `REQUIREMENTS.md`, Abschnitt 5 (Card Manager), beschreibt das neue Verhalten.

---

## Akzeptanzkriterien

- [ ] Der DM kann mindestens 10 Decks hinzufügen, auch dieselbe Deck-Datei mehrfach; doppelte Namen werden
      durchnummeriert, Decks lassen sich umbenennen und umsortieren.
- [ ] Mischen, Zurücksetzen und Entfernen wirken nur auf das gewählte Deck; die anderen bleiben unverändert.
- [ ] Ein Klick auf den Nachziehstapel einer eingeklappten Reihe zieht eine Karte dieses Decks.
- [ ] Höchstens eine Deck-Reihe ist aufgeklappt.
- [ ] Es gibt höchstens eine aktive Karte. Wer zieht, während eine aktiv ist, legt sie automatisch in den
      Ablagestapel ihres Decks.
- [ ] Ablegen bringt jede Karte in den Ablagestapel ihres eigenen Decks, auch aus „Ausgerüstet“ und beim
      Löschen eines Charakters.
- [ ] Karten mit gleicher ID aus zwei Instanzen derselben Deck-Datei werden nie verwechselt (Ziehen, Zuweisen,
      Ablegen, Speichern/Laden).
- [ ] Entfernen eines Decks fragt nach und entfernt auch seine ausgerüsteten Karten samt Boni.
- [ ] Die Suche in der Seitenleiste filtert die Deckliste; ein Klick klappt das Deck auf und scrollt zu ihm.
- [ ] Spielesession und XML-Spielstand enthalten alle Decks; ein alter Spielstand mit einem Deck lädt als ein Deck.
- [ ] Der Card Manager nutzt `feature-page` und sieht dunkel aus wie Dungeon Tracker und Builder; die
      `--color-card-manager-*`-Tokens sind entfernt.
- [ ] Specs decken die Deck-Verwaltung, Zuweisungen über mehrere Instanzen und die XML-Migration ab; ein
      Playwright-Smoke-Test zieht aus zwei Decks nacheinander.
