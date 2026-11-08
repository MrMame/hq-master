# Feature Request: Kartenboni sichtbar machen (Card Viewer, Editor, Token)

**Datum:** 2026-11-08  
**Priorität:** Hoch  
**Status:** done (2026-11-08 15:18)  
**Bezug:** `docs/feature-requests/done/card-properties.md`, `REQUIREMENTS.md` (Card Viewer, Charakter-Editor,
Dungeon Tracker), `src/app/shared/utils/stat-bonus.util.ts`,
`src/app/shared/components/character-stats-editor/`, `src/app/shared/components/card-viewer-panel/`,
`src/app/features/dungeon-tracker/components/character-status/character-status.ts`,
`src/app/core/services/equipment/effective-stats.util.ts`

---

## Problem

- Im Card Viewer sieht man nicht, welche Eigenschaften (`<property>`) eine Karte mitbringt. Man muss sie aus
  dem Kartenbild oder der XML ablesen.
- Im Charakter-Editor ist nicht erkennbar, wie sich Leben und Ruestung zusammensetzen. Der gespeicherte Wert
  enthält den Kartenbonus schon (er steigt beim Anlegen um n), das Eingabefeld zeigt nur diese Summe. Nur Tempo
  zeigt heute `+2 = 7`.
- Am Token und in der Legende stehen nur die Endwerte, ohne Hinweis auf Kartenboni.

---

## Ziel

- Der Card Viewer zeigt die Eigenschaften der angesehenen Karte.
- Der Editor zeigt für **Leben, Ruestung und Tempo** gleich: Grundwert (blau, eingebbar) + Kartenbonus (grün)
  = Endwert (rot).
- Token und Legende erklären den Endwert im Tooltip.
- Das Modell bleibt unverändert. Leben/Ruestung speichern weiter den Endwert, der Grundwert wird daraus
  berechnet.

---

## Entscheidungen (2026-11-08)

| Thema                    | Entscheidung                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Grundwert Leben/Ruestung | Grundwert = gespeicherter Wert − Summe der wirkenden Karten für diesen Namen; kein Modellumbau               |
| Negativer Grundwert      | erlaubt und sichtbar (z. B. `−20 +30 = 10` nach Schaden); er zeigt ehrlich, dass Ablegen den Charakter tötet |
| Grundwert Tempo          | unverändert der gespeicherte Wert; Endwert = max(0, Grundwert + Bonus)                                       |
| Farben                   | Grundwert blau, positiver Bonus grün, Endwert rot; negativer Bonus orange (rot ist für den Endwert vergeben) |
| Ohne Bonus               | keine Aufschlüsselung, das Feld sieht aus wie heute                                                          |
| Token / Legende          | Anzeige bleibt kompakt (nur Endwert), Aufschlüsselung nur im Tooltip                                         |
| Card Viewer              | Leiste unter der Karte mit einem Chip je Eigenschaft, in XML-Reihenfolge; ohne Eigenschaften keine Leiste    |

---

## Anforderungen

### 1. Eine Aufschlüsselung für alle festen Werte ✅ done (2026-11-08 15:18)

- `statBonusView` (bzw. ein Nachfolger in `shared/utils/`) liefert für `Leben`, `Ruestung` und `Tempo` je
  Grundwert, Bonus, Endwert und Quellen, oder `null`, wenn keine wirkende Karte den Wert verändert.
- Leben/Ruestung: Endwert = gespeicherter Wert, Grundwert = Endwert − Bonus. Tempo: Grundwert = gespeicherter
  Wert, Endwert = max(0, Grundwert + Bonus).
- Dieselbe Funktion bedient Editor (Punkt 2) und Tooltip (Punkt 3); keine zweite Berechnung.

### 2. Charakter-Editor: Grundwert + Bonus = Endwert ✅ done (2026-11-08 15:18)

- Das Eingabefeld (blau umrandet bzw. blaue Zahl) zeigt bei allen drei Werten den **Grundwert**. Bei Leben/Ruestung
  ist das der Wert ohne Karten laut Entwurf (vorgemerktes Anlegen, Ablegen, Gürtel zählen mit).
- Darunter, wie heute bei Tempo: `+30 = 50` mit Bonus grün (negativ orange) und Endwert rot; Tooltip mit den
  Quellkarten (`Kettenhemd +30`).
- Eingabe bei Leben/Ruestung ändert den Grundwert; der Endwert folgt sofort (Grundwert + Bonus). „Übernehmen“
  speichert den angezeigten Endwert wie bisher (zuerst Kartenbewegungen, dann genau die angezeigten Werte).
- Gültigkeit: ganze Zahl; bei Leben/Ruestung darf der Grundwert negativ sein, der Endwert muss ≥ 0 sein
  (sonst ist das Feld ungültig und sperrt „Übernehmen“). Tempo-Grundwert bleibt ≥ 0.
- Ohne Bonus: Feld wie heute (Grundwert = Endwert, keine Zeile darunter).

### 3. Token und Legende: Tooltip ✅ done (2026-11-08 15:18)

- `CharacterStatus` zeigt weiter nur die Endwerte. Verändern wirkende Karten Leben oder Ruestung, nennt der
  Tooltip die Aufschlüsselung, z. B. „Leben: 20 +30 = 50 (Kettenhemd +30)“; beim schadensfähigen Button
  zusätzlich zur bisherigen Aufgabe („Schaden auf Leben – Leben: 20 +30 = 50 …“).
- Ohne Bonus bleibt der Tooltip wie heute.
- Die wirkenden Karten kommen aus `activeCardsOf` mit dem aktuellen Deck-Zustand.

### 4. Card Viewer: Eigenschaften der Karte ✅ done (2026-11-08 15:18)

- Unter der Karte eine Leiste mit einem Chip je `<property>` in XML-Reihenfolge, Format `Name ±Wert`
  (`formatBonus`), z. B. „Leben +30“, „Abwehr −1“. Positiv grün, negativ orange, 0 neutral.
- Die Leiste ist auf Vorder- und Rückseite sichtbar, in `live` und im Entwurf. Karten ohne Eigenschaften zeigen
  keine Leiste; die Karte nutzt dann die volle Höhe.
- Die Karte bleibt so groß wie möglich; die Leiste nimmt nur ihre eigene Höhe weg.

### 5. Doku ✅ done (2026-11-08 15:18)

- `REQUIREMENTS.md` (Card Viewer, Charakter-Editor, Dungeon Tracker) und `.claude/rules/architecture.md`
  nachziehen.

---

## Akzeptanzkriterien

- [x] Charakter Leben 20, Karte „Leben +30“ angelegt (gespeichert 50): Editor zeigt Feld 20, darunter `+30 = 50`,
      Tooltip „Kettenhemd +30“.
- [x] Danach 40 Schaden (gespeichert 10): Editor zeigt Feld −20 und `+30 = 10`; Token zeigt 10, Tooltip
      „Leben: −20 +30 = 10 (Kettenhemd +30)“.
- [x] Im Editor Grundwert Leben auf 25 ändern: Anzeige `+30 = 55`; „Übernehmen“ speichert 55.
- [x] Grundwert Leben −31 bei Bonus +30: Feld ungültig, „Übernehmen“ gesperrt.
- [x] Karte im Entwurf ablegen: Bonuszeile verschwindet, Feld zeigt den Endwert ohne Karte.
- [x] Tempo-Anzeige `+2 = 7` bleibt wie bisher, jetzt mit den neuen Farben.
- [x] Card Viewer zeigt für die Zwerg-Karte mit Leben/Ruestung/Tempo drei Chips „Leben +30“, „Ruestung +10“,
      „Tempo +5“; eine Karte ohne `<property>` zeigt keine Leiste.
- [x] Jede Datei ≤ 150 Zeilen. Tests, Coverage-Schwellen, Lint und Build sind grün.

---

## Annahmen

- „Rot“ für den Endwert gilt für alle drei Werte im Editor, unabhängig von der Token-Farbe (Leben rot,
  Ruestung blau).
- Dynamische Eigenschaften (`CharacterProperties`) bleiben, wie sie sind; sie haben keinen Grundwert.

---

## Umsetzungshinweise (2026-11-08 15:18)

- `statField` (in `stat-bonus.util.ts`) liefert je Feld Grundwert, `min` (−Bonus bei Leben/Ruestung) und `offset`;
  `storedValue` rechnet die Eingabe auf den gespeicherten Wert um. `withStat` und das Übernehmen im Dialog blieben unverändert.
- Ein leeres Feld bleibt leer (keine Aufschlüsselung), statt den negativen Bonus als Grundwert zu zeigen.
- Die Chips im Card Viewer zeigt die neue Komponente `CardPropertiesStrip`.
