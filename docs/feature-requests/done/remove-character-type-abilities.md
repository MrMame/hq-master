# Feature Request: Typ und Fähigkeiten der Charaktere entfernen

**Datum:** 2026-11-08  
**Priorität:** Mittel  
**Status:** done (2026-11-08 09:19)  
**Bezug:** `REQUIREMENTS.md` (§2 Dungeon Tracker / Charakter-Editor), `src/app/core/models/character-info.model.ts`

---

## Problem

- Jeder Charakter hat einen „Typ“ (Feuer, Wasser, Erde, Luft) und eine Liste „Fähigkeiten“
  (Flammenwerfer, Aquatische Angriffe, Erdbeben, Windstoß). Beides wird im Spiel nicht verwendet: keine
  Berechnung, keine Anzeige außerhalb des Charakter-Editors.
- Die Felder machen den Charakter-Editor länger, als er sein müsste, und der Zufallscharakter würfelt dafür
  bedeutungslose Werte aus.

---

## Ziel

- `type` und `abilities` gibt es nicht mehr: weder im Model, in der UI, in der Spielesession noch im
  XML-Spielstand.
- Ältere Spielstände (XML und Browser-Session) lassen sich weiter laden; die Altfelder werden dabei
  stillschweigend verworfen.
- Neue Werte kommen nicht hinzu.

---

## Anforderungen

### 1. Model bereinigen ✅ done (2026-11-08 09:19)

- `type: string` und `abilities: string[]` aus `CharacterInfo` entfernen.
- `src/app/core/models/elemental-types.model.ts` (`ElementalTypes`) und
  `src/app/core/models/character-abilities.model.ts` (`CharacterAbilities`) löschen.
- Alle Verwendungen anpassen, u. a. `shared/utils/new-character.util.ts` und
  `shared/utils/random-character.util.ts`. Der Zufallscharakter würfelt nur noch Name, Bild und
  Zahlenwerte aus; der Name richtet sich wie bisher nach der Klasse des Bildes.

### 2. Charakter-Editor ✅ done (2026-11-08 09:19)

- Das Feld „Typ“ (Auswahlliste) und den Abschnitt „Fähigkeiten“ (Checkboxen) samt der Trennlinie
  dazwischen entfernen, ebenso `types`, `abilities` und `toggleAbility` in der Komponente.
- Die Checkbox „In dieser Runde bewegt“ bleibt und sieht unverändert aus. Sie nutzt bisher die Klasse
  `character-editor__ability`; diese bekommt einen neutralen Namen (z. B. `character-editor__checkbox`),
  ebenso der Kommentar „im Stil der Fähigkeiten“.
- Test-Helfer `abilityCheckbox` in `shared/testing/character-editor-dialog.fixtures.ts` entfernen.

### 3. XML-Spielstand ✅ done (2026-11-08 09:19)

- `characters.xml-mapper.ts` schreibt kein Attribut `type` und keine `<ability>`-Elemente mehr.
- Beim Laden werden `type` und `<ability>` älterer Spielstände ignoriert; der Spielstand lädt sonst
  unverändert und ohne Hinweis.

### 4. Browser-Session (localStorage) ✅ done (2026-11-08 09:19)

- `characters-codec.util.ts` übernimmt gespeicherte Charaktere heute per Spread mit allen Feldern. Beim
  Laden werden `type` und `abilities` entfernt, damit sie weder im Speicher noch beim nächsten Speichern
  oder XML-Export wieder auftauchen.

### 5. Tests und Doku ✅ done (2026-11-08 09:19)

- Fixtures (`core/testing/character.fixtures.ts` u. a.), Specs und lokale e2e-Proben unter `e2e/probe/`
  ohne `type`/`abilities` anlegen.
- Neue Tests: altes XML mit `type` und `<ability>` lädt ohne diese Felder; alte Session mit `type` und
  `abilities` wird ohne diese Felder dekodiert; der Editor zeigt weder „Typ“ noch „Fähigkeiten“.
- `REQUIREMENTS.md` prüfen und ggf. ergänzen: Der Charakter hat keinen Typ und keine Fähigkeiten mehr.

---

## Akzeptanzkriterien

- [x] `CharacterInfo` hat keine Felder `type` und `abilities`; `ElementalTypes` und `CharacterAbilities`
      existieren nicht mehr (kein Treffer bei der Suche nach `ElementalTypes`, `CharacterAbilities`,
      `abilities` in `src/`; Ausnahme: `REMOVED_FIELDS` in `characters-codec.util.ts` und die Specs zum
      Entfernen der Altfelder, nötig für #4).
- [x] Der Charakter-Editor zeigt weder „Typ“ noch „Fähigkeiten“; „In dieser Runde bewegt“ funktioniert
      und sieht aus wie bisher.
- [x] Ein Zufallscharakter hat Name, Bild und Zahlenwerte und keinen Typ und keine Fähigkeiten.
- [x] Ein gespeicherter XML-Spielstand enthält weder `type=` am `<character>` noch `<ability>`.
- [x] Ein älterer XML-Spielstand mit `type` und `<ability>` lädt ohne Fehler und ohne Hinweis.
- [x] Eine ältere Browser-Session mit `type`/`abilities` lädt; die Felder sind danach verschwunden.
- [x] Dateien bleiben unter 150 Zeilen; Lint, Build und die Coverage-Schwellen werden eingehalten.

---

## Annahmen (aus dem Interview vom 2026-11-08)

- Gemeint sind alle vier Fähigkeiten im Code, also auch **Windstoß**, nicht nur die drei genannten.
- Altfelder in XML-Spielständen werden **still ignoriert**, ohne Hinweis an den DM.
- Altfelder in der Browser-Session werden **beim Laden aktiv entfernt**.
- Der Umfang ist **nur das Entfernen**; im Werte-System kommt in diesem Request nichts Neues hinzu.
- Die Schadensarten (`DamageTypes`: Normal/Critical) und der Kartentyp im Card Manager
  (`basic`/`equipment`) sind nicht betroffen.
- Die Namensauswahl des Zufallscharakters hängt am Bild bzw. der Klasse, nicht am Typ, und bleibt
  unverändert.
