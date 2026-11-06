# Feature Request: Ausrüstungskarten verändern Charakterwerte

**Datum:** 2026-11-06  
**Priorität:** Hoch  
**Status:** offen  
**Voraussetzung:** `docs/feature-requests/done/character-max-values.md` muss vorher umgesetzt sein (done 2026-11-06).  
**Bezug:** `src/app/features/card-manager/`, `public/decks/default/default-deck.xml`, `src/app/core/models/`,
`src/app/shared/components/character-editor-dialog/`, `src/app/features/dungeon-tracker/components/character-status/`,
`src/app/features/game-session/`

---

## Problem

- Karten im Deck haben heute keinen Einfluss auf Charaktere. Ausrüstung wie „Runenrüstung“ oder „Turmschild“
  ist nur eine `basic`-Karte mit Beschreibung.
- Der DM muss Boni durch Ausrüstung im Kopf behalten und Werte von Hand ändern und später wieder zurückändern.

---

## Ziel

- Der DM kann eine gezogene Ausrüstungskarte einem Charakter zuweisen. Solange die Karte in einem Slot des Charakters
  liegt, verändert sie seine Werte und ist aus dem Deck entfernt.
- Wird die Karte aus dem Slot entfernt, gelten wieder genau die vorherigen Werte, und die Karte liegt im Ablagestapel.
- Im Charakter-Editor sieht der DM übersichtlich Grundwert, Bonus je Karte und den wirksamen Wert.
- Die wirksamen Werte sind die Grundlage für spätere Probenwürfe.

---

## Grundsatz

- **Grundwerte werden nie durch Karten verändert.** `attack`, `defense`, `speed`, `maxHealth`, `maxArmor` im
  `CharacterInfo` bleiben die Werte ohne Ausrüstung.
- Die wirksamen Werte berechnet eine einzige reine Funktion (z. B. `effectiveStats(character, modifiers)`) aus
  Grundwerten und Modifikatoren. Alle Anzeigen und später die Probenwürfe nutzen nur diese Funktion.
- Wem eine Karte gehört, steht an genau **einer** Stelle (im Deck-Zustand, siehe 3.). Der Charakter speichert keine Kopie.
- Modifikator-Typen und die Berechnung liegen in `core/` (Charakter-Editor und Dungeon Tracker brauchen sie);
  `core/` importiert nichts aus `features/`.

---

## Anforderungen

### 1. Modifikatoren und Slots (Modell)

- `StatModifier { stat: ModifiableStat; value: number }`, additiv, negative Werte erlaubt.
- `ModifiableStat` = `attack` | `defense` | `speed` | `maxHealth` | `maxArmor`.
- `EquipmentSlot` = `head` | `body` | `leftHand` | `rightHand` | `amulet` (Anzeige: Kopf, Körper, linke Hand,
  rechte Hand, Amulett). Jeder Slot nimmt höchstens eine Karte.

### 2. Ausrüstungskarten im Deck

- Neuer Kartentyp `equipment` mit `slot` und `modifiers: StatModifier[]`.
- Deck-XML, z. B.:
  ```xml
  <card id="card-065" name="Runenrüstung" image="decks/default/card-rune-armor.svg" type="equipment" slot="body">
    <description>…</description>
    <modifier stat="maxArmor" value="2"/>
    <modifier stat="speed" value="-1"/>
  </card>
  ```
- `deck-xml-loader.service.ts` liest Slot und Modifikatoren; unbekannte `stat`-Werte oder fehlender Slot → Karte wird
  als `basic` geladen (mit Konsolen-Warnung), damit ein fehlerhafter Eintrag das Deck nicht bricht.
- Im Beispieldeck werden dauerhafte Ausrüstungsgegenstände (mindestens Runenrüstung, Turmschild, Schutzamulett,
  Magischer Schild) zu `equipment` mit sinnvollen Werten. Zeitlich begrenzte Karten (Elixier, Fackel, Tränke) bleiben
  `basic` (siehe „Nicht Teil dieses Requests“).
- `CardDisplay` zeigt bei Ausrüstungskarten Slot und Modifikatoren (z. B. `Rüstung +2 · Tempo −1`).

### 3. Besitz im Deck-Zustand

- `DeckState` erhält `assigned: AssignedCard[]` mit `{ card, characterId, slot }`.
- Eine zugewiesene Karte liegt in keinem anderen Bereich (Nachziehstapel, Ablage, aktive Karte, Bank).
- „Alles neu mischen“ (`reshuffleAll`) lässt zugewiesene Karten bei ihren Besitzern.
- Ein neues Deck laden verwirft alle Zuweisungen (Rückfrage, falls Zuweisungen bestehen).
- Auf der Karte steht „Im Besitz von <Name>“; der Name wird über `characterId` nachgeschlagen, damit Umbenennungen
  sofort sichtbar sind.

### 4. Zuweisen beim Ziehen

- Ist die aktive Karte eine Ausrüstungskarte, zeigt die schwebende Karte einen Button „Charakter zuweisen“.
- Ein Dialog listet die Charaktere der Session (Bild und Name). Der Slot ist durch die Karte vorgegeben; bei Händen
  wählt der DM links oder rechts (vorausgewählt: der freie).
- Ist der Slot belegt, fragt die App nach, ob die bisherige Karte in den Ablagestapel soll.
- Nach dem Zuweisen ist keine Karte mehr aktiv.
- Ohne Charaktere in der Session ist der Button deaktiviert (Tooltip mit Grund).

### 5. Ausrüstung im Charakter-Editor

- Neuer Abschnitt „Ausrüstung“: alle Slots mit Kartenname und kleinem Kartenbild, leere Slots als „frei“.
- Je belegtem Slot ein Button „Ablegen“: Die Karte kommt in den Ablagestapel. Wie die übrigen Änderungen im Editor
  wird das erst mit „Übernehmen“ wirksam, „Abbrechen“ verwirft es.
- Bei Angriff, Verteidigung, Tempo, max. Leben und max. Rüstung steht neben dem eingebbaren Grundwert der Bonus und der
  wirksame Wert, z. B. `Verteidigung 4  +2  = 6`. Ein Tooltip nennt die Quellen (`Turmschild +2`).
  Bonus positiv grün, negativ rot.

### 6. Aktuelle Werte von Leben und Rüstung

- Wird eine Karte mit `maxHealth`/`maxArmor`-Bonus zugewiesen, steigt der aktuelle Wert um denselben Betrag.
- Wird sie abgelegt, sinkt das wirksame Maximum; der aktuelle Wert wird auf das neue Maximum begrenzt (nie unter 0).
- Beispiel: Rüstung 4/4, Runenrüstung +2 → 6/6; 3 Schaden → 3/6; Karte ablegen → 3/4.

### 7. Anzeige im Dungeon Tracker

- Legende und markiertes Token zeigen die wirksamen Maximalwerte (`aktuell/wirksames Maximum`).

### 8. Charakter entfernen

- Wird ein Charakter gelöscht, kommen alle seine Karten in den Ablagestapel.

### 9. Ereignis-Log

- Zuweisen und Ablegen erzeugen je einen Eintrag im Log (z. B. „Barbar der Rote erhält Runenrüstung (Körper)“,
  „Barbar der Rote legt Runenrüstung ab“), Filter „Alle“.

### 10. Speichern und Laden

- `assigned` gehört zum Deck-Zustand in der Spielesession und im XML-Spielstand.
- Ältere Spielstände ohne `assigned` laden mit leerer Liste. Zuweisungen auf nicht mehr vorhandene Charaktere landen
  beim Laden im Ablagestapel.

### 11. Tests

- `effectiveStats`: ohne Karten, mehrere Karten, negative Werte, Grundwerte bleiben unverändert.
- XML-Loader: Ausrüstungskarte, fehlerhafte Einträge.
- `CardManagerService`: zuweisen, belegter Slot, ablegen, `reshuffleAll`, neues Deck, Charakter entfernen.
- Editor (über DOM): Ausrüstungsabschnitt, Ablegen + Übernehmen/Abbrechen, Anzeige Grundwert/Bonus/wirksam.
- Zuweisungsdialog: Auswahl, Hand-Slot, Rückfrage bei belegtem Slot, keine Charaktere.
- Codec/XML: Hin- und Rückweg, Altdaten, verwaiste Zuweisungen.
- Playwright-Probe: Karte ziehen → zuweisen → Werte im Editor → ablegen → Karte im Ablagestapel.

---

## Nicht Teil dieses Requests (spätere Requests)

- Zeitlich begrenzte Karten (Elixier „für einen Kampf“, Fackel 10 Minuten) mit Ablauf über die Spielzeit, analog zu den
  Zuständen.
- Zustände als Modifikatoren (z. B. „Benommen: −1 Angriff“) – fließen später in dieselbe `effectiveStats`-Funktion.
- Probenwürfe/Treffer-Simulation auf Basis der wirksamen Werte.

---

## Akzeptanzkriterien

- [ ] Eine gezogene Ausrüstungskarte lässt sich einem Charakter zuweisen und ist danach in keinem Stapel und nicht in
      der Bank.
- [ ] Die Karte zeigt „Im Besitz von <Name>“.
- [ ] Der Charakter-Editor zeigt Grundwert, Bonus mit Quellen und wirksamen Wert; die Grundwerte bleiben unverändert.
- [ ] Nach dem Ablegen gelten wieder die vorherigen Werte, und die Karte liegt im Ablagestapel.
- [ ] Leben/Rüstung verhalten sich wie in 6. beschrieben.
- [ ] Zuweisungen bleiben nach Neuladen und im XML-Spielstand erhalten; alte Spielstände laden ohne Fehler.
- [ ] `REQUIREMENTS.md` (Card Manager, Charakter-Editor) beschreibt das Verhalten.
- [ ] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.
