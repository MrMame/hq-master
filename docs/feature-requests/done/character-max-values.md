# Feature Request: Maximalwerte für Leben und Rüstung

**Datum:** 2026-11-06  
**Priorität:** Hoch – **muss vor allen anderen offenen Feature Requests umgesetzt werden**
(Voraussetzung für `docs/feature-requests/character-equipment-cards.md`)  
**Status:** done (2026-11-06 17:46)  
**Bezug:** `src/app/core/models/character-info.model.ts`, `src/app/core/services/characters/`,
`src/app/shared/components/character-editor-dialog/`, `src/app/shared/components/damage-taken-dialog/`,
`src/app/features/dungeon-tracker/components/character-status/`, `src/app/features/game-session/xml/characters.xml-mapper.ts`

---

## Problem

- `health` und `armor` sind heute nur aktuelle Werte. Schaden verringert sie direkt, einen Maximalwert gibt es nicht.
- Der DM sieht deshalb nicht, wie stark ein Charakter schon verletzt ist („3 Leben“, aber 3 von 4 oder 3 von 12?).
- Ausrüstungskarten (`character-equipment-cards.md`) sollen später Leben und Rüstung erhöhen. Ohne Maximalwert
  ist unklar, was beim Ablegen einer Karte mit dem bereits verlorenen Wert passiert.

---

## Ziel

- Jeder Charakter hat zu Leben und Rüstung einen eingebbaren Maximalwert.
- Der aktuelle Wert liegt immer zwischen 0 und dem Maximalwert.
- Überall, wo Leben und Rüstung angezeigt werden, sieht der DM „aktuell / maximal“.

---

## Anforderungen

### 1. Datenmodell ✅ done (2026-11-06 17:46)

- `CharacterInfo` erhält `maxHealth: number` und `maxArmor: number` (ganze Zahlen ≥ 0).
- `health` bleibt der aktuelle Wert und gilt als `0 ≤ health ≤ maxHealth`, ebenso `armor` zu `maxArmor`.

### 2. Charakter-Editor ✅ done (2026-11-06 17:46)

- Zu Leben und Rüstung je ein Feld „Maximum“ neben dem aktuellen Wert.
- Wird das Maximum unter den aktuellen Wert gesenkt, wird der aktuelle Wert beim Übernehmen auf das Maximum gesenkt.
- Ein aktueller Wert über dem Maximum ist nicht übernehmbar (Validierung mit Hinweis) – oder wird auf das Maximum
  begrenzt; die Umsetzung wählt eine Variante und beschreibt sie im Abschlussbericht.
- Neuer Charakter: Maximum = eingegebener Startwert. „Zufälliger Charakter erstellen“ setzt Maximum und aktuellen
  Wert gleich.

### 3. Anzeige ✅ done (2026-11-06 17:46)

- Legende und Anzeige unter dem markierten Token (`CharacterStatus`) zeigen Leben und Rüstung als `aktuell/max`
  (z. B. `7/10`), Farben wie bisher (rot/blau).

### 4. Schaden ✅ done (2026-11-06 17:46)

- Schaden auf Leben oder Rüstung verringert wie bisher nur den aktuellen Wert; der Maximalwert bleibt unverändert.
- Zustände (Gift usw.) verhalten sich unverändert.

### 5. Tote Charaktere am Token kennzeichnen ✅ done (2026-11-06 17:46)

- Ist `health` 0, liegt auf dem Charaktersymbol im Dungeon Tracker (`DungeonToken`) ein großes rotes Kreuz über das
  ganze Porträt. Bild, Zustandssymbole und Ring bleiben darunter erkennbar.
- Steigt das Leben wieder über 0 (z. B. im Charakter-Editor), verschwindet das Kreuz sofort.
- Die Kennzeichnung ergibt sich nur aus `health === 0`. Es gibt kein zusätzliches gespeichertes Feld.
- Der Token bleibt markierbar und verschiebbar; Charakter-Editor und Menüleiste funktionieren wie bisher.
- Das Kreuz ist barrierearm benannt (z. B. `aria-label`/Tooltip „Tot“) und hat ein `data-testid`.
- In der Charakterliste (Legende, `DungeonLegendEntry`) liegt bei 0 Leben ebenfalls ein rotes Kreuz über dem Bild
  des Charakters (passend zur kleineren Bildgröße), mit derselben Benennung „Tot“ und eigenem `data-testid`.
  Es verschwindet wie am Token sofort, sobald das Leben über 0 steigt. Das Kreuz wird als gemeinsame Komponente
  oder gemeinsames Stil-Element für Token und Legende umgesetzt, nicht doppelt.

### 6. Speichern und Laden ✅ done (2026-11-06 17:46)

- `maxHealth`/`maxArmor` gehören zur Spielesession (`CHARACTERS_CODEC`) und zum XML-Spielstand
  (`characters.xml-mapper.ts`).
- Ältere Daten ohne Maximalwerte: Maximum = gespeicherter aktueller Wert.

### 7. Tests ✅ done (2026-11-06 17:46)

- Codec: Altdaten ohne Maximum, ungültige Werte, aktueller Wert über Maximum.
- XML-Mapper: Hin- und Rückweg, Altdaten.
- Editor (über DOM): Maximum eingeben, Maximum unter aktuellen Wert senken, neuer und zufälliger Charakter.
- `CharacterStatus`: Anzeige `aktuell/max`.
- `DungeonToken` und `DungeonLegendEntry`: Kreuz bei Leben 0, kein Kreuz bei Leben > 0, Kreuz verschwindet nach
  Heilung.
- Playwright-Probe: Schaden bis 0 eintragen → Kreuz am Token und in der Legende sichtbar.

---

## Akzeptanzkriterien

- [x] Im Charakter-Editor lassen sich Maximum für Leben und Rüstung eingeben und übernehmen.
- [x] Der aktuelle Wert liegt nach jedem Übernehmen und jedem Schaden zwischen 0 und dem Maximum.
- [x] Legende und markiertes Token zeigen `aktuell/max`.
- [x] Bei 0 Leben zeigen das Token und der Eintrag in der Charakterliste (Legende) ein rotes Kreuz, bei Leben > 0
      nicht.
- [x] Maximalwerte bleiben nach Neuladen des Browsers und im XML-Spielstand erhalten; alte Spielstände laden ohne Fehler.
- [x] `REQUIREMENTS.md` beschreibt die Maximalwerte.
- [x] Dateien bleiben unter 150 Zeilen; die Coverage-Schwellen werden eingehalten.
