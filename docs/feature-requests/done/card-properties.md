# Feature Request: Karteneigenschaften, dynamische Werte, Gürtel und ein einziger Kartentyp

**Datum:** 2026-11-08  
**Priorität:** Hoch  
**Status:** done (2026-11-08 14:03)  
**Bezug:** `REQUIREMENTS.md` (Charakter-Editor, Card Manager, Dungeon Tracker),
`src/app/core/models/character-info.model.ts`, `src/app/core/models/equipment.model.ts`,
`src/app/core/models/card.model.ts`, `src/app/core/services/equipment/effective-stats.util.ts`,
`src/app/core/services/characters/character-limits.util.ts`,
`src/app/core/services/card-deck/equipment-card-xml.util.ts`, `src/app/shared/card-actions/assign.card-action.ts`,
`src/app/shared/services/card-assignment.service.ts`

---

## Problem

- Das Modell kennt fest `maxHealth`, `maxArmor`, `attack`, `defense` und `speed`. Karten dürfen nur diese Werte
  ändern (`MODIFIABLE_STATS`). Neue Werte aus einem Deck brauchen deshalb jedes Mal eine Codeänderung.
- Ein Wert hat zwei Namen: einen englischen Schlüssel im Code und XML (`maxArmor`) und eine deutsche
  Beschriftung im Editor („Max. Rüstung“). Deck-Autor und DM sprechen dadurch nicht über dasselbe Wort.
- Max-Leben und Max-Rüstung führen eine Obergrenze ein, die das Spiel nicht braucht.
- Karten wirken nur aus Ausrüstungsslots. Für Karten, die mitgeführt werden und trotzdem wirken sollen, gibt es
  keinen Ort.
- Es gibt zwei Kartentypen (`basic`, `equipment`). Nur Ausrüstung lässt sich anlegen, und nur in den Slot, den
  ihre XML vorgibt. Wo eine Karte liegen und wirken darf, hängt damit am Typ statt am Ort.

---

## Ziel

- Die Wirkung einer Karte steht nur in ihrer XML, z. B. `<property name="Leben" value="+30"/>` → „Leben +30“.
- Fest im Modell gibt es nur noch **Leben**, **Ruestung** und **Tempo**. Alle anderen Eigenschaften (z. B.
  „Angriff“, „Abwehr“) sind dynamisch. Sie kommen ausschließlich aus Karten, die gerade wirken.
- **Ein Name je Eigenschaft:** Der Name aus der XML ist zugleich der Feldname im Modell und die Beschriftung im
  Editor. Es gibt keine Übersetzungstabelle.
- **Ein einziger Kartentyp:** Jede Karte kann im Inventar, im neuen **Gürtel** oder **angelegt** in einem
  beliebigen Slot eines Charakters liegen.
- Karten wirken, solange sie angelegt (Slot) oder im Gürtel eines Charakters liegen. Karten im Inventar geben
  keine Eigenschaften an den Charakter weiter.
- Der Code bleibt einfach: Wirksame Werte berechnet weiterhin eine einzige reine Funktion.

---

## Entscheidungen aus dem Interview (2026-11-08)

| Thema                    | Entscheidung                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Feste Namen              | `Leben`, `Ruestung`, `Tempo` (ohne Umlaut), im XML, Modell und Editor gleich                                                         |
| Modell                   | `CharacterInfo` hat die Felder `Leben`, `Ruestung`, `Tempo`. Dynamische Eigenschaften werden nicht gespeichert, sondern berechnet    |
| Leben/Ruestung +n        | Wirkt die Karte ab jetzt, steigt der gespeicherte Wert um n. Wirkt sie nicht mehr, sinkt er um n, nie unter 0 (Ablegen kann töten)   |
| Tempo +n                 | Bonus auf den gespeicherten Grundwert; wirksam = Grundwert + Bonus, Anzeige `+1 = 7`                                                 |
| Obergrenze               | keine; Leben/Ruestung sind ganze Zahlen ≥ 0, die Anzeige zeigt nur den aktuellen Wert                                                |
| Dynamischer Grundwert    | keiner; Wert = Summe der wirkenden Karten, ohne solche Karte gibt es die Eigenschaft am Charakter nicht                              |
| Negative Summen          | Werte werden nie unter 0 angezeigt                                                                                                   |
| Namensvergleich          | exakt (Groß-/Kleinschreibung zählt), Leerzeichen am Rand werden entfernt                                                             |
| Eigenschaften an Karten  | jede Karte darf `<property>` haben                                                                                                   |
| Gürtel                   | unbegrenzte Liste je Charakter, jede Karte erlaubt, Eigenschaften wirken                                                             |
| Altdaten                 | verwerfen: alte Felder und `<modifier>` ignorieren; Charaktere ohne `Leben`/`Ruestung`/`Tempo` nicht laden                           |
| Wirkung dyn. Eigensch.   | nur Anzeige, keine Würfelproben oder Berechnungen (bestätigt 2026-11-08)                                                             |
| Kartentypen              | nur noch ein Kartentyp; `cardType`, `BasicCard`/`EquipmentCard` entfallen (Folge-Interview 2026-11-08)                               |
| Slot-Regel               | jede Karte passt in jeden der 5 Slots; kein `slot` mehr an der Karte, `CardSlot` entfällt                                            |
| `type`/`slot` im XML     | an `<deck>` und `<card>` ignoriert (Deck-XML und Spielstand), alte Daten laden ohne Fehler; aus `zwerg.xml` entfernt                 |
| Slot-Belegung            | je Slot genau eine Karte; Gürtel und Inventar unbegrenzt, beliebige Karten                                                           |
| Anlegen (Card Viewer)    | Aktion → Charakter → Slot (alle 5 in `EQUIPMENT_SLOTS`-Reihenfolge, belegte mit „ersetzt <Karte>“, aktueller Slot fehlt)             |
| Belegter Ziel-Slot       | bisherige Karte: „In den Gürtel“, „Ins Inventar“, „In den Ablagestapel“ oder „Abbrechen“                                             |
| Anlegen (Editor)         | gleiches Slot-Untermenü wie im Card Viewer, inkl. Auswahl für die verdrängte Karte; wirkt erst mit „Übernehmen“                      |
| Deck entfernen           | wirkende Karten des Decks verschwinden wie beim Ablegen: Leben/Ruestung sinken um ihren Wert, nie unter 0 (Freigabe 2026-11-08)      |
| Mehrere Karten je Aktion | Leben/Ruestung ändern sich je Charakter und Bewegung um die Summe (Tausch gleichwertiger Karten ändert nichts), Umsetzung 2026-11-08 |

---

## Anforderungen

### 0. Umsetzungsreihenfolge (gilt für den gesamten Request)

- Der Request wird **in einem Lauf vollständig** umgesetzt, aber streng **Punkt für Punkt in der Reihenfolge
  1 → 8**. Ein Punkt beginnt erst, wenn der vorige abgeschlossen ist.
- Nach jedem Punkt: betroffene Specs, danach die ganze Suite (`npm run test -- --watch=false`), `npm run lint`
  und `npm run build` grün. Der Punkt wird mit `✅ done (Datum Uhrzeit)` markiert, bevor der nächste beginnt.
- Kein Zwischenstand mit alten und neuen Namen nebeneinander. Jeder Punkt hinterlässt einen konsistenten,
  lauffähigen Stand ohne Kompatibilitäts-Aliase (z. B. kein `health` als Getter für `Leben`).
- Umbenennungen (Punkt 3) werden vollständig per Suche geprüft (`grep` über `src/`, `e2e/`, `public/decks/`,
  `REQUIREMENTS.md`, `.claude/rules/architecture.md`). Treffer außer Altdaten-Kommentaren gelten als nicht fertig.
- Dateien, die durch den Umbau über 150 Zeilen wachsen, werden im selben Punkt aufgeteilt, nicht am Ende.
- Abschluss: Coverage-Lauf (`npm run test -- --watch=false --coverage`) und `npm run e2e`.
- Zeigt sich unterwegs, dass eine Entscheidung dieses Requests nicht trägt, wird angehalten und nachgefragt,
  statt eigenmächtig abzuweichen.

### 1. Max-Leben und Max-Rüstung entfernen ✅ done (2026-11-08 10:15)

- `maxHealth` und `maxArmor` aus `CharacterInfo`, `ModifiableStat`, Editor, Codec, Session-XML, Zufalls- und
  Startcharakter, Fixtures und E2E entfernen.
- `character-limits.util.ts` begrenzt nur noch auf ganze Zahlen ≥ 0 (`readLimit`, `normalizedLimits` und
  Begrenzung auf das Maximum fallen weg). Das gilt auch für `EquipmentSyncService`.
- `withStat` verliert das Koppeln des Maximums an den Startwert (`linkMaximum`).
- `CharacterStatus` zeigt Leben und Rüstung ohne `/max`.
- Altdaten mit Max-Feldern laden weiter, die Felder werden verworfen.

### 2. Angriff und Abwehr aus dem Modell entfernen ✅ done (2026-11-08 10:18)

- `attack` und `defense` aus `CharacterInfo`, Editor, Codec, Session-XML, Zufalls- und Startcharakter entfernen.
- Altdaten laden weiter, die Felder werden verworfen.

### 3. Feste Werte heißen `Leben`, `Ruestung`, `Tempo` ✅ done (2026-11-08 10:23)

- `health` → `Leben`, `armor` → `Ruestung`, `speed` → `Tempo` in `CharacterInfo` und überall im Code (Schaden,
  Status, Log-Texte, Codec, Session-XML).
- Eine Konstante `FIXED_PROPERTIES = ['Leben', 'Ruestung', 'Tempo']` ist die einzige Liste der festen Werte.
  Der Editor beschriftet die Felder mit genau diesem Namen.
- Session-XML und Browser-Session schreiben die neuen Namen. Alte Namen (`health` …) werden nicht
  umgeschrieben: Ein gespeicherter Charakter ohne gültige Zahl in `Leben`, `Ruestung` oder `Tempo` ist ungültig
  und wird beim Laden verworfen (Codec und XML-Mapper, mit Konsolenwarnung). Seine Slot-, Gürtel- und
  Inventarkarten werden danach wie bei gelöschten Charakteren abgelegt.

### 4. Eigenschaften an jeder Karte (`<property>`) ✅ done (2026-11-08 10:29)

- Neues Modell `CardProperty { name: string; value: number }` an `BaseCard` (`properties: CardProperty[]`).
  Es ersetzt `StatModifier`/`ModifiableStat`/`MODIFIABLE_STATS`.
- Deck-XML und Spielstand: `<property name="…" value="…"/>` als Kind von `<card>`, für jede Karte.
  `value` ist eine ganze Zahl mit optionalem Vorzeichen (`+30`, `-1`, `2`). `name` wird an den Rändern
  getrimmt und darf nicht leer sein.
- Ungültige `<property>` (leerer Name, kein Integer): Die Karte lädt ohne diese Eigenschaft, mit
  Konsolenwarnung inkl. Karten-ID.
- `<modifier>` wird nicht mehr gelesen (Altdaten verwerfen).
- Anzeige einer Eigenschaft: `Name ±Wert`, z. B. „Leben +30“, „Abwehr -1“.
- Kommentar in `public/decks/zwerg/zwerg.xml` und die Format-Doku in `REQUIREMENTS.md` aktualisieren.
- `scripts/build-deck-index.mjs` muss neue Kinder nicht prüfen (bleibt unverändert, außer wenn die Tests es
  verlangen).

### 5. Ein einziger Kartentyp ✅ done (2026-11-08 10:36)

- `CardType`, `CARD_TYPES`, `toCardType`, `BasicCard`, `EquipmentCard`, `CardSlot` und `CARD_SLOTS` entfallen.
  `Card` ist ein einziges Interface (bisher `BaseCard`) mit `properties`; `cardType` und `slot` gibt es nicht mehr.
- Deck-XML und Spielstand: Die Attribute `type` (an `<deck>` und `<card>`) und `slot` (an `<card>`) werden weder
  gelesen noch geschrieben. Alte Decks und Spielstände mit diesen Attributen laden ohne Fehler.
  `equipment-card-xml.util.ts` geht im Property-Parser auf bzw. wird passend umbenannt.
- Angelegte Karten behalten ihren `EquipmentSlot` (`head`, `body`, `leftHand`, `rightHand`, `amulet`) aus dem
  Spielstand. Jede Karte darf in jedem Slot liegen, je Slot höchstens eine.
- Zuweisen (`CardAssignmentService` bzw. `EquipmentService`) bekommt den Ziel-Slot immer explizit; die Ableitung
  aus der Karte (inkl. „freie Hand“) entfällt.
- Kein Code prüft mehr einen Kartentyp, um Ort oder Wirkung zu bestimmen.
- `public/decks/zwerg/zwerg.xml` (Attribute `type` entfernen, Kommentar) und `REQUIREMENTS.md` (Abschnitte 0 und
  5: Kartentypen, `slot`, `combat` → `basic`) nachziehen.

### 6. Wirksame Werte inkl. dynamischer Eigenschaften ✅ done (2026-11-08 10:42)

- **Wirkende Karten** eines Charakters = Karten in seinen Slots + Karten in seinem Gürtel. Eine Funktion
  liefert sie (z. B. `activeCardsOf(state, characterId)`), alle anderen nutzen sie.
- `effectiveStats` liefert Tempo (Grundwert + Bonus) und alle dynamischen Eigenschaften als
  `ReadonlyMap<string, number>` bzw. Record in **Reihenfolge des ersten Auftretens** (Slots in
  `EQUIPMENT_SLOTS`-Reihenfolge, dann Gürtel in Reihenfolge). Alle Werte sind ≥ 0.
- Eigenschaften mit den Namen `Leben` und `Ruestung` sind **keine** dynamischen Eigenschaften. Sie verändern
  beim Wirksamwerden bzw. Ende der Wirkung den gespeicherten Wert (Ersatz für `withAddedEquipment`):
  - Karte beginnt zu wirken (anlegen, in den Gürtel, Übernahme von einem anderen Charakter): `+n`.
  - Karte wirkt nicht mehr (ablegen, ins Inventar, Hand, Stapel, Bank, anderer Charakter): `−n`, min. 0.
  - Wechsel zwischen Slot und Gürtel desselben Charakters ändert nichts.
- Bonusquellen (`bonusSources`) nennen je Eigenschaft die Karten mit Beitrag (Tooltip).
- Log-Einträge der Ausrüstung bleiben wie heute, sie nennen die Eigenschaften mit ihrem Namen.

### 7. Gürtel als neuer Kartenort ✅ done (2026-11-08 10:50)

- `DeckState` bekommt `belt: BeltCard[]` (`deckId`, `card`, `characterId`), wie `inventory`. Neue
  `CardLocation`-Art `belt`. Alle Bewegungen laufen ausschließlich über `moveCard` bzw. `EquipmentService.moveCard`.
- Unbegrenzt viele Karten, jede Karte. Neueste Karte am Ende.
- Session: Browser-Session (`DECK_STATE_CODEC`, fehlend → leer) und Session-XML (`<belt>`, fehlend → leer).
- Verwaiste Gürtelkarten (Charakter gelöscht) werden wie Inventarkarten abgelegt (`EquipmentSyncService`,
  `withoutDanglingRefs`).
- Rückgängig (`CardUndoService`) und Log (wie `inventory-log.util.ts`) gelten auch für den Gürtel.

### 8. Anlegen, Gürtel und Eigenschaften in der Oberfläche ✅ done (2026-11-08 14:03)

- **Card Viewer:** Aktion „In den Gürtel legen“ (Untermenü Charakter) für `live` und im Entwurf des Editors;
  bei Karten im Gürtel steht der Ort „Gürtel von …“ im Titel.
- **Card Viewer, „Einem Charakter anlegen“:** für jede Karte (auch aus Inventar und Gürtel). Aktion → Charakter →
  Untermenü mit allen 5 Slots in `EQUIPMENT_SLOTS`-Reihenfolge; ein belegter Slot zeigt „ersetzt <Karte>“, der
  Slot, in dem die Karte gerade liegt, wird nicht angeboten (höchstens drei Klicks). Das Hand-Untermenü entfällt.
- **Belegter Slot:** Die bisherige Karte kommt nach Wahl „In den Gürtel“, „Ins Inventar“, „In den Ablagestapel“,
  oder die Aktion wird abgebrochen. Rückgängig bringt beide Karten zurück.
- **Charakter-Editor, „Anlegen“:** für Inventar- und Gürtelkarten, mit demselben Slot-Untermenü und derselben
  Auswahl für die verdrängte Karte; wirkt erst mit „Übernehmen“.
- **Charakter-Editor:** Abschnitt „Gürtel“ neben „Ausrüstung“/„Inventar“ (öffnet den Viewer im Entwurf).
  Eingabefelder nur für `Leben`, `Ruestung`, `Tempo`. Darunter die dynamischen Eigenschaften nur zur Anzeige,
  z. B. „Angriff 3“, mit den Quellkarten im Tooltip. Die Werte berücksichtigen den Entwurf.
- **Card Manager:** Bereich „Gürtel“ unter „Inventar“, nach Charakter gruppiert, ohne Karten ausgeblendet.
- **Dungeon Tracker:** `CharacterCards` zeigt die Gürtelkarten (Anzahl wie beim Inventar). Die dynamischen
  Eigenschaften stehen in der Legende (zusätzliche Zeile) und am markierten Token (wie `CharacterConditions`
  `selected`).
- `architecture.md` und `REQUIREMENTS.md` nachziehen.

---

## Akzeptanzkriterien

- Im Code, in Templates, Fixtures und E2E kommen `maxHealth`, `maxArmor`, `attack`, `defense`, `health`,
  `armor`, `speed`, `ModifiableStat`, `<modifier>`, `cardType`, `CardType`, `BasicCard`, `EquipmentCard` und
  `CardSlot` nicht mehr vor (außer in Kommentaren zu Altdaten).
- „Wirbelattacke“ (ohne `slot`) lässt sich in jeden der 5 Slots anlegen, in den Gürtel und ins Inventar legen.
  Ein altes Deck mit `type="equipment" slot="head"` lädt ohne Fehler; die Karte ist in jeden Slot anlegbar.
- Anlegen in einen belegten Slot mit „In den Gürtel“: Die verdrängte Karte liegt im Gürtel, Leben/Ruestung des
  Charakters bleiben unverändert.
- Eine Deck-Karte mit `<property name="Blitzschaden" value="+2"/>` im Gürtel zeigt am Charakter
  „Blitzschaden 2“, ohne Codeänderung. Im Inventar zeigt sie nichts.
- Karte mit „Leben +30“ anlegen: Leben 20 → 50. Ablegen: 50 → 20. Nach 40 Schaden und Ablegen: 0, Charakter
  tot.
- „Tempo +1“ im Gürtel: Editor zeigt Grundwert 6 und `+1 = 7`, gespeichert bleibt 6.
- Karte von Slot in Gürtel desselben Charakters: Leben unverändert.
- „Angriff“ und „angriff“ zählen als zwei Eigenschaften. „Abwehr -1“ allein zeigt 0.
- Alter Spielstand mit Max-Werten, Angriff/Abwehr und `<modifier>` lädt ohne Fehler: Altwerte fehlen, Charaktere
  nur mit `health`/`armor`/`speed` werden verworfen, ihre Karten liegen im Ablagestapel.
- Gürtel übersteht Reload und Speichern/Laden der Session-XML. Rückgängig stellt eine Gürtelbewegung samt
  Leben/Rüstung wieder her.
- Jede Datei ≤ 150 Zeilen. Tests, Coverage-Schwellen, Lint und Build sind grün.

---

## Annahmen

- Die Wirkung von Leben/Ruestung hängt an Ortswechseln der Karte, nicht an einer Neuberechnung. Das hält
  Schaden einfach (er verbraucht den gespeicherten Wert).
- Feldnamen mit Großbuchstaben (`Leben`) sind gewollt. ESLint hat keine `naming-convention`-Regel.
- Slot und Gürtel wirken gleich. Der Slot bleibt als Ordnung am Charakter (je Slot eine Karte, Anzeige in
  Legende und Editor); eine eigene Regelwirkung des Slots gibt es nicht.
- Die Abschaffung der Kartentypen (Punkt 5) liegt vor Wirkung und Gürtel (Punkte 6–8), damit diese ohne
  Typprüfung gebaut werden und kein Zwischenstand mit Übergangsregel („Basiskarten nur im Gürtel“) entsteht.
- Das Ereignis-Log behält „angelegt“/„abgelegt“ und das Schild-Symbol.

---

## Umsetzungshinweise (2026-11-08 14:03)

- Leben/Ruestung folgen `activeChanges` (`core/services/equipment/property-transfer.util.ts`): Vergleich der wirkenden
  Karten vor und nach jeder Bewegung über `EquipmentService`, auch für `removeDeck`.
- Gürtel-Abschnitt im Editor und Bereich „Gürtel“ im Card Manager nutzen die bestehenden Inventar-Komponenten mit
  `kind="belt"` statt eigener Kopien; die dynamischen Eigenschaften zeigt die neue Komponente `CharacterProperties`.
- „In den Gürtel legen“ im Entwurf des Editors wirkt direkt auf den eigenen Gürtel (kein Charakter-Untermenü, der Entwurf
  betrifft nur den bearbeiteten Charakter).
- Nachbesserung (2026-11-08): Im Charakter-Editor zeigen die Felder `Leben`/`Ruestung` schon den Entwurfsstand
  (vorgemerktes Anlegen, Ablegen, Gürtel). Eine Eingabe gilt als angezeigter Wert; „Übernehmen“ führt erst die
  Kartenbewegungen aus und schreibt dann genau die angezeigten Werte. Vorher stiegen im Entwurf nur Tempo und die
  dynamischen Eigenschaften, Leben/Ruestung erst nach „Übernehmen“.
