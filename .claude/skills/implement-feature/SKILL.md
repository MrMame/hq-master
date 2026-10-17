---
name: implement-feature
description: Setzt einen Feature Request aus docs/feature-requests/ um (ganz oder einen nummerierten Punkt). Verwenden, wenn der Nutzer einen Feature Request durchführen, umsetzen oder implementieren lassen will, z. B. "/implement-feature shared-session-state #2".
argument-hint: <feature-request-slug> [#punkt]
---

# Feature Request umsetzen

Argumente: `$ARGUMENTS` — Slug der Datei in `docs/feature-requests/` und optional die Nummer des Punkts.

## Umfang eines Aufrufs

- **Mit `#punkt`:** Nur dieser Punkt wird umgesetzt.
- **Ohne `#punkt`:** Alle offenen Punkte der Datei werden in Nummernreihenfolge umgesetzt. Punkte mit `✅ done` werden übersprungen.
- **Ein Aufruf = ein Plan, eine Freigabe, ein Commit, ein Log-Eintrag**, egal ob ein Punkt oder die ganze Datei umgesetzt wird.
- Nach jedem einzelnen Punkt Verifikation (Schritt 4) ausführen. Schlägt sie fehl: anhalten, Fehler melden, nicht mit dem nächsten Punkt weitermachen.

Arbeite die Schritte **in dieser Reihenfolge** ab. Keinen Schritt überspringen; ist ein Schritt nicht anwendbar, das im Abschlussbericht begründen.

## 1. Kontext laden (vor jeder Code-Änderung)

- [ ] `REQUIREMENTS.md` im Projekt-Root lesen. Die Umsetzung muss zu Zielen und Scope dort passen. Widersprüche dem Nutzer melden, bevor du implementierst.
- [ ] `docs/feature-requests/<slug>.md` vollständig lesen (liegt sie bereits in `done/`, ist sie abgeschlossen – Nutzer fragen, bevor weitergearbeitet wird). Nur die Punkte im Umfang des Aufrufs umsetzen (siehe „Umfang eines Aufrufs“).
- [ ] Regeln prüfen: `.claude/rules/architecture.md`, `clean-code.md`, `testing.md`, `feature-requests.md`.
- [ ] Alle betroffenen Dateien und ihre Aufrufer lesen (`Grep` nach den Klassen-/Methodennamen).

## 1b. Ist-Zustand prüfen (vor dem Plan)

- [ ] Für jeden Punkt im Umfang prüfen, ob das gewünschte Verhalten bereits implementiert ist bzw. ob die beschriebene Beobachtung (fehlende Funktion, Fehler) im aktuellen Code noch vorhanden ist (Code lesen, `Grep`, ggf. vorhandene Tests ausführen oder das Verhalten nachstellen).
- [ ] Ergebnis je Punkt kurz festhalten: **fehlt noch** / **bereits umgesetzt** / **nur teilweise umgesetzt** / **nicht prüfbar**, jeweils mit Beleg (Datei:Zeile, Testausgabe).
- [ ] Ist der Punkt **bereits umgesetzt** oder nur teilweise: diesen Punkt **nicht** umsetzen. Den Nutzer informieren und fragen, ob der Punkt als `✅ done (bereits erfüllt, YYYY-MM-DD HH:MM)` markiert, angepasst oder verworfen werden soll.
- [ ] Ist der Zustand **nicht prüfbar** (z. B. nur manuell in der UI nachstellbar): das offen sagen und vor dem Plan nachfragen.
- [ ] Nur Punkte mit Ergebnis „fehlt noch“ gehen in den Plan (Schritt 2).

## 2. Plan

- [ ] Einen Plan für alle Punkte im Umfang (Reihenfolge, betroffene Dateien, Testfälle, Verifikation) erstellen und vom Nutzer freigeben lassen. Danach ohne weitere Rückfragen umsetzen, außer bei Fehlern oder unerwarteten Problemen.
- [ ] Vorbestehende Probleme außerhalb des Scopes nicht stillschweigend fixen, sondern auflisten und fragen, ob sie als neuer Punkt in den Feature Request sollen.

## 3. Umsetzung — Checkliste

- [ ] Neue Komponenten/Services/Module nur per Angular CLI (`ng g c|s|m …`).
- [ ] State als private `signal()`, öffentlich nur `.asReadonly()`; Persistenz nur über `StorageService`.
- [ ] Nur `inject()`, keine Konstruktor-Injection; `effect`/`computed` statt Lifecycle-Hooks.
- [ ] Kein `any`; jede Datei ≤ 150 Zeilen.
- [ ] Jede neue Logik hat Vitest-Tests (`vi.fn()`, nicht `jasmine`).

## 4. Verifikation

- [ ] `npm run lint` keine Lint errors haben.
- [ ] `npm run test -- --watch=false --coverage` grün.
- [ ] Coverage-Report für alle neuen und geänderten Dateien mit Logik prüfen (Definition of Done in `testing.md`): Nicht abgedeckte Zeilen/Zweige testen oder begründen.
- [ ] `npm run build` fehlerfrei.
- [ ] Bei UI-Änderungen: manuellen Prüfschritt im Bericht nennen.

Prettier-Formatierung, Tests beim Beenden und Build/Prettier vor jedem Commit erzwingen die Hooks in `.claude/settings.json` automatisch.

## 5. Feature Request abschließen

Gemäß `.claude/rules/feature-requests.md`:

- [ ] Jeden umgesetzten Punkt markieren: `✅ done (YYYY-MM-DD HH:MM)` an der Überschrift.
- [ ] `**Status:**`-Zeile im Kopf aktualisieren (Teilweise umgesetzt / done mit Datum und Uhrzeit).
- [ ] Erfüllte Akzeptanzkriterien auf `[x]` setzen.
- [ ] Ist der Request **vollständig** done: Datei per `git mv docs/feature-requests/<slug>.md docs/feature-requests/done/` archivieren. Verweise mit vollem Pfad in offenen Requests anpassen; `ai-implementations-log.md` bleibt unverändert (Historie).
- [ ] Neu entdeckte offene Punkte als eigenen nummerierten Abschnitt ergänzen (nur nach Rückfrage).

## 6. Abschlussbericht und Commit

- [ ] Chat Ausgabe : was geändert wurde (mit Dateilinks), Test-/Build-Ergebnis, Coverage der geänderten Dateien (inkl. Begründung für ungetestete Stellen), was bewusst offen blieb.
- [ ] Einen Committext für den gesamten Aufruf vorbereiten (Typ `feat(<scope>): …`, umgesetzte Punkte im Body auflisten).
- [ ] Einen 'ai-implementations-log.md' Eintrag für den gesamten Aufruf vorbereiten (bei ganzer Datei `#1–#n` in der Überschrift).
- [ ] Benutzer den Committext und 'ai-implementations-log.md' Eintrag zeigen und fragen, ob der commit durchgeführt und der 'ai-implementations-log.md' Eintrag hinzugefügt werden soll.
