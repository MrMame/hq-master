# Feature Request: Karten nur aus Vorder- und Rückseiten-Grafik

**Datum:** 2026-11-08  
**Priorität:** Mittel  
**Status:** done (2026-11-08 08:02)  
**Bezug:** `src/app/shared/components/card-display/`, `src/app/shared/components/card-viewer-panel/`,
`src/app/features/card-manager/components/` (`deck-piles`, `deck-row`, `dm-hand`, `equipped-cards`, `inventory-cards`),
`src/app/core/models/card.model.ts`, `src/app/core/models/deck-config.model.ts`,
`src/app/core/services/card-deck/deck-xml-loader.service.ts`, `src/app/features/game-session/xml/card.xml-mapper.ts`,
`scripts/build-deck-index.mjs`, `public/decks/`, `e2e/card-manager-decks.spec.ts`, `REQUIREMENTS.md` (Abschnitt 5)

---

## Problem

- Eine Karte besteht heute aus einem kleinen SVG-Symbol, über das die App Name, `ATK/DEF` (Typ `combat`), Slot und
  Modifier (Typ `equipment`), „Im Besitz von …“ und „aus <Deck>“ legt (`card-display.html`).
- Der DM gestaltet seine Karten künftig vollständig als Grafik, mit Name, Bild und Regeltext (Beispiele:
  `public/decks/feature-request-files/wirbelattacke.png` als Vorderseite, `zwerg.png` als zugehörige Rückseite,
  je 756 × 1056 px = 63 : 88). Die Overlays der App sind damit überflüssig und doppelt.
- Die Rückseite gilt heute nur pro Deck (`backImage` am `<deck>`). Einzelne Karten können keine eigene Rückseite haben.
- `<description>` wird geladen und im Spielstand gespeichert, aber nirgends angezeigt.

---

## Ziel

Eine Karte ist in der App genau zwei Grafiken: Vorderseite und Rückseite. Die App zeichnet nichts auf die Karte. Das
Deck-XML bleibt die Datenquelle für alles, was die App auswertet (Name, Typ, Slot, Modifier, künftig Effekte).

---

## Anforderungen

### 1. Deck-XML: Vorder- und Rückseite ✅ done (2026-11-08 08:02)

- `image` an der `<card>` ist die Vorderseite (wie heute).
- `backImage` am `<deck>` ist die Rückseite aller Karten des Decks (wie heute). Neu: Eine `<card>` darf ein eigenes
  `backImage` haben, das für diese Karte die Deck-Rückseite ersetzt. Das ist die Ausnahme, der Normalfall ist die
  Deck-Rückseite.
- Pfade bleiben relativ zu `public/` (z. B. `decks/zwerg/wirbelattacke.png`).
- Erlaubt sind alle Bildformate, die der Browser anzeigt (PNG, JPG, WebP, SVG). Die App verarbeitet die Bilder nicht.
- Die Karte erhält im Modell ihre wirksame Rückseite (eigene oder Deck-Rückseite), sodass alle Anzeigen sie ohne
  Rückgriff auf die Deck-Konfiguration kennen.
- Beispiel:

  ```xml
  <deck id="zwerg" name="Zwerg" backImage="decks/zwerg/zwerg.png">
    <card id="wirbelattacke" name="Wirbelattacke" image="decks/zwerg/wirbelattacke.png" type="basic">
      <description>Alle angrenzenden Felder werden angegriffen. …</description>
    </card>
    <!-- Ausnahme: eigene Rückseite -->
    <card id="sonderkarte" name="Sonderkarte" image="decks/zwerg/sonder.png" backImage="decks/zwerg/sonder-back.png"/>
  </deck>
  ```

### 2. Was das Deck-XML weiter beschreibt ✅ done (2026-11-08 08:02)

- `id`, `name` (für Log, Viewer-Kopf, Menütexte wie „Barbar – ersetzt Turmschild“, Seitenleiste, Alt-Text), `type`.
- Ausrüstung (`type="equipment"`) mit `slot` und `<modifier stat="…" value="…"/>` unverändert. Die Werte wirken wie
  bisher auf die Charaktere, werden aber nicht mehr auf der Karte angezeigt.
- `<description>` bleibt optional als Notiz für den DM im XML (z. B. Regeltext als durchsuchbare Kopie). Die App zeigt
  sie nicht an.
- Künftige Karteneffekte werden ebenfalls im Deck-XML beschrieben (nicht Teil dieses Requests).

### 3. Kartentyp `combat` entfällt ✅ done (2026-11-08 08:02)

- Kartentypen sind nur noch `basic` und `equipment`. `CombatCard`, `<attack>`/`<defense>` und ihre Anzeige
  (`ATK x / DEF y`) werden entfernt.
- Deck-XML und Spielstände mit `type="combat"` laden die Karte als `basic` (Werte werden ignoriert).

### 4. Kartenanzeige ohne Overlay ✅ done (2026-11-08 08:02)

- `CardDisplay` zeigt nur die Grafik der gewählten Seite, randlos im Format 63 : 88 (die Grafik bringt Rahmen und
  Schrift mit). Kein Name, keine Werte, kein Slot, keine Modifier auf der Karte.
- „Im Besitz von <Name>“ (Bereich „Ausgerüstet“) und „aus <Deck>“ (Hand, Inventar, „Ausgerüstet“) stehen als kleine
  Beschriftung **unter** der Karte, nicht auf ihr. Wo sie heute nicht erscheinen, kommen sie nicht dazu.
- Alt-Text der Vorderseite ist der Kartenname, der Rückseite „Kartenrückseite“.
- Gilt überall, wo Karten erscheinen: Hand, „Ausgerüstet“, „Inventar“, aufgeklappte Stapel und Bank, kompakte Reihe,
  Card Viewer, Charakter-Editor (Ausrüstung, Inventar), Legende und markiertes Token im Dungeon Tracker.

### 5. Platzhalter bei fehlender Grafik ✅ done (2026-11-08 08:02)

- Lässt sich eine Grafik nicht laden (z. B. alter Spielstand mit gelöschter SVG), zeigt die Karte eine neutrale Fläche
  im Kartenformat mit dem Kartennamen (Rückseite: ohne Namen), statt eines kaputten Bildes.

### 6. Nachziehstapel zeigt die Rückseite der obersten Karte ✅ done (2026-11-08 08:02)

- Die kompakte Reihe und der aufgeklappte Nachziehstapel zeigen die Rückseite der obersten Karte (die als nächstes
  gezogen wird), nicht pauschal die Deck-Rückseite. Ist der Stapel leer, bleibt der heutige Platzhalter.

### 7. Card Viewer: Karte umdrehen ✅ done (2026-11-08 08:02)

- Neben der Karte bzw. im Menü gibt es den Button „Umdrehen“; er wechselt zwischen Vorder- und Rückseite.
- Der Viewer öffnet immer mit der Vorderseite. Beim Blättern und nach einer Aktion zeigt er wieder die Vorderseite.
- Ein Klick auf die Karte selbst löst weiterhin nichts aus. Umdrehen bewegt keine Karte, erzeugt keinen Log-Eintrag und
  keinen „Rückgängig“-Hinweis und gehört nicht zur Spielesession.

### 8. Prüfung beim Start/Build ✅ done (2026-11-08 08:02)

- `scripts/build-deck-index.mjs` prüft für jedes Deck, dass jede genannte Grafik (`backImage` am `<deck>`, `image` und
  ggf. `backImage` jeder `<card>`) unter `public/` existiert.
- Fehlt eine Datei, scheitern Start und Build mit einer Meldung, die Deck-Datei, Karten-ID und Pfad nennt (wie heute
  bei fehlerhaftem XML); es entsteht keine `index.json`.
- Tests (`node --test`) für: alle Dateien vorhanden, fehlende Vorderseite, fehlende Deck-Rückseite, fehlende
  karteneigene Rückseite.

### 9. Spielstand ✅ done (2026-11-08 08:02)

- Der Spielstand speichert weiter eine Kopie jeder Karte (wie heute), ohne `attack`/`defense`, mit der karteneigenen
  Rückseite, falls vorhanden.
- Ältere Spielstände laden weiterhin: `combat` wird `basic`, fehlende Bilder zeigen den Platzhalter (Punkt 5). Eine
  Migration alter Bildpfade gibt es nicht.

### 10. Neues Startdeck „Zwerg“ ✅ done (2026-11-08 08:02)

- Neuer Ordner `public/decks/zwerg/` mit `zwerg.xml` (Deck-Name „Zwerg“, `backImage="decks/zwerg/zwerg.png"`) und
  einer Karte „Wirbelattacke“ (`type="basic"`, `image="decks/zwerg/wirbelattacke.png"`, Regeltext als `<description>`).
- `zwerg.png` und `wirbelattacke.png` werden per `git mv` aus `public/decks/feature-request-files/` dorthin verschoben;
  der Ordner `feature-request-files/` entfällt.
- Das alte Beispieldeck `public/decks/default/` (XML + 70 SVGs) wird gelöscht.
- Bildgröße: Die App akzeptiert jede Größe. Empfehlung für den DM (in `REQUIREMENTS.md`): WebP oder JPG unter etwa
  300 KB je Karte; die Beispiel-PNGs (je ~1,6 MB) tauscht der DM später selbst aus.

### 11. Tests, E2E und Dokumentation ✅ done (2026-11-08 08:02)

- Unit-Tests und Fixtures (`core/testing/deck.fixtures.ts` u. a.) ohne `combat` und mit karteneigener Rückseite;
  Specs für: Anzeige nur der Grafik, Beschriftung unter der Karte, Platzhalter bei Ladefehler, Rückseite der obersten
  Karte im Nachziehstapel, „Umdrehen“ im Card Viewer (inkl. Rücksetzen beim Blättern), Laden von `combat` als `basic`
  aus Deck-XML und Spielstand.
- `e2e/card-manager-decks.spec.ts` auf das Deck „Zwerg“ umstellen (eine Karte je Deck genügt für das Szenario).
  Probes unter `e2e/probe/`, die das alte Beispieldeck voraussetzen, werden nicht angepasst (gitignored).
- `REQUIREMENTS.md` Abschnitt 5: „Deck-XML + SVG“ → „Deck-XML + Kartengrafiken“; die Anzeige von Slot und Werten an
  Ausrüstungskarten (`Rüstung +2 · Tempo −1`) entfällt; Vorder-/Rückseite, karteneigene Rückseite, Umdrehen im Card
  Viewer, Rückseite der obersten Karte im Stapel und Grafikprüfung beim Start/Build ergänzen.

---

## Akzeptanzkriterien

- [x] Karten zeigen überall nur ihre Grafik; Besitzer/Herkunftsdeck stehen unter der Karte.
- [x] Eine `<card backImage="…">` überschreibt die Deck-Rückseite; ohne Attribut gilt die Deck-Rückseite.
- [x] Der Nachziehstapel zeigt die Rückseite der obersten Karte.
- [x] Im Card Viewer dreht „Umdrehen“ die Karte; Blättern und Aktionen zeigen wieder die Vorderseite.
- [x] Eine nicht ladbare Grafik zeigt eine neutrale Fläche mit dem Kartennamen.
- [x] Ausrüstungs-Modifier wirken unverändert auf die Charakterwerte.
- [x] `type="combat"` lädt aus Deck-XML und Spielstand als `basic`; `CombatCard` existiert nicht mehr.
- [x] Eine fehlende Grafik lässt Start und Build mit Meldung (Deck, Karte, Pfad) scheitern.
- [x] `public/decks/` enthält nur das Deck „Zwerg“; `default/` und `feature-request-files/` sind entfernt.
- [x] Unit-Tests, `node --test scripts/*.test.mjs`, E2E-Smoke und Coverage-Schwellen sind grün.
- [x] `REQUIREMENTS.md` beschreibt das neue Kartenkonzept.
