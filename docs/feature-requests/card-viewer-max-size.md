# Feature Request: Card Viewer zeigt die Karte so groß wie möglich

**Datum:** 2026-11-08  
**Priorität:** Mittel  
**Status:** offen  
**Bezug:** `src/app/shared/components/card-viewer-panel/`, `src/app/shared/components/card-viewer/`,
`src/app/shared/components/card-action-menu/`, `src/app/core/session-state/tool-state-keys.ts`, `REQUIREMENTS.md`
(Abschnitt 5, Card Viewer), `docs/feature-requests/done/card-image-only.md` (Kartengrafik, „Umdrehen“)

---

## Problem

- Der Card Viewer begrenzt die Karte auf feste Anteile des Fensters: höchstens 60 % der Höhe und 30 % der Breite,
  auf schmalen Bildschirmen (≤ 600 px) 50 % der Höhe und 70 % der Breite (`card-viewer-panel.css`).
- Das Aktionsmenü steht fest neben bzw. unter der Karte und nimmt ihr dauerhaft Platz.
- Seit `card-image-only` ist die Karte reine Grafik mit Regeltext; auf Tablet und Handy ist der Text dadurch klein.

---

## Ziel

Die Karte im Card Viewer nutzt auf jedem Gerät (PC, Tablet quer/hoch, Handy) den größtmöglichen Platz im Fenster,
immer im Format 63 : 88. Bedienelemente nehmen ihr so wenig Platz wie möglich.

---

## Anforderungen

### 1. Karte füllt den verfügbaren Platz

- Die Karte ist so groß, wie es das Fenster abzüglich der Bedienleiste (Punkt 2) und eines schmalen Rands (Punkt 4)
  zulässt; das Format 63 : 88 bleibt immer erhalten (begrenzt wird durch Höhe oder Breite, je nachdem, was zuerst
  erreicht ist).
- Die festen Anteile (60 %/30 %, schmal 50 %/70 %) entfallen.
- Die Karte wird auch über die Pixelgröße der Grafik hinaus vergrößert (z. B. auf großen Monitoren).
- Bei Größenänderung des Fensters oder Drehen des Geräts passt sich die Karte sofort an.

### 2. Eine Bedienleiste über der Karte

- Alle Bedienelemente stehen in einer Leiste über der Karte: Deck und Ort (z. B. „Zwerg · Hand“), ‹ Stelle am Ort
  (z. B. „3 / 12“) ›, „Umdrehen“, „Aktionen“, „Schließen“ (×).
- Pfeile und Stelle erscheinen wie bisher nur, wenn am Ort mehrere Karten liegen und der Viewer `live` ist;
  am Anfang/Ende ist der jeweilige Pfeil deaktiviert.
- Auf schmalen Bildschirmen darf die Leiste in zwei Zeilen umbrechen; es gibt keinen waagerechten Scroll.
- Neben, unter oder auf der Karte stehen keine weiteren Bedienelemente.

### 3. Einklappbares Aktionsmenü

- Das Aktionsmenü ist ein- und ausklappbar über den Button „Aktionen“ in der Leiste (`aria-expanded`).
- Aufgeklappt liegt es als Fläche **über** der Karte (oben rechts, unter dem Button); die Karte behält ihre Größe und
  springt nicht. Inhalt und Verhalten des Menüs (Einträge, Trennlinien, ausgegraute Einträge, Untermenüs mit
  „‹ Zurück“) bleiben unverändert.
- Nach einer Aktion bleibt das Menü offen und zeigt die Aktionen der Karte, die der Viewer nun anzeigt. Der Zustand
  ändert sich nur über den Button „Aktionen“.
- Ein Klick auf die Karte löst weiterhin nichts aus (klappt das Menü auch nicht zu).

### 4. Schmaler Rand zum Schließen

- Rund um Leiste und Karte bleibt ein schmaler Rand (ca. 16 px) zum Fensterrand frei. Ein Klick auf den abgedunkelten
  Hintergrund schließt den Viewer wie bisher; ebenso „Schließen“ und Escape.

### 5. Ein-/Ausklapp-Zustand bleibt im Browser erhalten

- Ob das Aktionsmenü ein- oder ausgeklappt ist, bleibt beim Schließen und Öffnen des Viewers, beim Wechsel des
  Features und nach dem Neuladen erhalten (wie der Ein-/Ausklapp-Zustand der Seitenleiste).
- Der Zustand ist Werkzeug-Zustand: `persistedState` mit einem neuen Key in `TOOL_STATE_KEYS`, kein
  `SessionStateSlice`, nicht im XML-Spielstand; „Session starten“ und das Laden eines Spielstands ändern ihn nicht.
- Ohne gespeicherten Zustand ist das Menü **zugeklappt**.
- Er gilt für alle Einsatzorte des Viewers gleich (Card Manager, Dungeon Tracker, Charakter-Editor im Entwurf).

### 6. Tests und Dokumentation

- Specs: Leiste mit allen Elementen (mit/ohne Pfeile), Menü auf-/zuklappen per Button inkl. `aria-expanded`,
  Startzustand zugeklappt, Zustand bleibt nach Schließen/Öffnen und aus dem Storage erhalten (`describePersistedState`),
  Menü bleibt nach einer Aktion offen, Entwurfsmodus.
- Playwright-Probe: Karte füllt im Querformat (z. B. 1280 × 800) die Höhe bzw. im Hochformat (z. B. 390 × 844) die
  Breite abzüglich Leiste und Rand, Seitenverhältnis 63 : 88, offenes Menü ändert die Kartengröße nicht.
- E2E-Smoke (`e2e/card-manager-decks.spec.ts`) an das zugeklappte Menü anpassen (vor „In den Ablagestapel legen“
  „Aktionen“ öffnen).
- `REQUIREMENTS.md` Abschnitt 5 (Card Viewer: Größe, Leiste, einklappbares Menü) und `.claude/rules/architecture.md`
  (`CardViewerPanel`, neuer Key/Service) anpassen.

---

## Annahmen (aus dem Interview vom 2026-11-08)

- „In einer Session gespeichert“ meint wie bei der Seitenleiste den Browser, nicht die Spielesession (bestätigt).
- Escape schließt wie bisher den ganzen Viewer, auch bei offenem Menü (keine zusätzlichen Tastenkürzel).
- Offene Untermenü-Ebenen werden beim Zuklappen und bei Kartenwechsel zurückgesetzt (wie heute bei Kartenwechsel).
- Hochskalieren über die Grafikauflösung hinaus ist ausdrücklich gewollt (Unschärfe auf großen Monitoren akzeptiert).

---

## Akzeptanzkriterien

- [ ] Die Karte füllt auf PC, Tablet (quer/hoch) und Handy den Platz bis auf Leiste und schmalen Rand, im Format 63 : 88.
- [ ] Deck/Ort, Pfeile mit Stelle, „Umdrehen“, „Aktionen“ und × stehen in einer Leiste über der Karte.
- [ ] „Aktionen“ klappt das Menü über der Karte auf und zu; die Karte ändert dabei ihre Größe nicht.
- [ ] Ohne gespeicherten Zustand ist das Menü zugeklappt; der Zustand bleibt nach Schließen, Featurewechsel und
      Neuladen erhalten und gehört nicht zur Spielesession.
- [ ] Nach einer Aktion bleibt das Menü offen.
- [ ] Klick auf den Rand/Hintergrund, × und Escape schließen den Viewer.
- [ ] Unit-Tests, Probe, E2E-Smoke und Coverage-Schwellen sind grün; `REQUIREMENTS.md` ist angepasst.
