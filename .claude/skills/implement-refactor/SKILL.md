---
name: implement-refactor
description: Setzt einen Refactoring Request aus docs/refactoring-requests/ um (ganz oder einen nummerierten Punkt). Verwenden, wenn der Nutzer einen Refactoring Request durchführen, umsetzen oder implementieren lassen will, z. B. "/implement-refactor file-naming-convention #2".
argument-hint: <refactoring-request-slug> [#punkt]
---

# Refactoring Request umsetzen

Argumente: `$ARGUMENTS` — Slug der Datei in `docs/refactoring-requests/` und optional die Nummer des Punkts.

Arbeite die Schritte **in dieser Reihenfolge** ab. Keinen Schritt überspringen; ist ein Schritt nicht anwendbar, das im Abschlussbericht begründen.

## 1. Kontext laden (vor jeder Code-Änderung)

- [ ] `REQUIREMENTS.md` im Projekt-Root lesen. Die Umsetzung muss zu Zielen und Scope dort passen. Widersprüche dem Nutzer melden, bevor du implementierst.
- [ ] `docs/refactoring-requests/<slug>.md` vollständig lesen. Nur den angefragten Punkt umsetzen.
- [ ] Regeln prüfen: `.claude/rules/architecture.md`, `clean-code.md`, `testing.md`, `refactoring-requests.md`.
- [ ] Alle betroffenen Dateien und ihre Aufrufer lesen (`Grep` nach den Klassen-/Methodennamen).

## 2. Plan

- [ ] Plan mit betroffenen Dateien, Testfällen und Verifikation erstellen und vom Nutzer freigeben lassen.
- [ ] Vorbestehende Probleme außerhalb des Scopes nicht stillschweigend fixen, sondern auflisten und fragen, ob sie als neuer Punkt in den Refactoring Request sollen.

## 3. Umsetzung — Checkliste

- [ ] Neue Komponenten/Services/Module nur per Angular CLI (`ng g c|s|m …`).
- [ ] Dateien verschieben/umbenennen nur mit `git mv`, damit die Historie erhalten bleibt.
- [ ] State als private `signal()`, öffentlich nur `.asReadonly()`; Persistenz nur über `StorageService`.
- [ ] Nur `inject()`, keine Konstruktor-Injection; `effect`/`computed` statt Lifecycle-Hooks.
- [ ] Kein `any`; jede Datei ≤ 150 Zeilen.
- [ ] Jede neue Logik hat Vitest-Tests (`vi.fn()`, nicht `jasmine`).

## 4. Verifikation

- [ ] `npm run lint` keine Lint errors haben.
- [ ] `npm run test -- --watch=false` grün.
- [ ] `npm run build` fehlerfrei.
- [ ] Bei UI-Änderungen: manuellen Prüfschritt im Bericht nennen.

Prettier-Formatierung, Tests beim Beenden und Build/Prettier vor jedem Commit erzwingen die Hooks in `.claude/settings.json` automatisch.

## 5. Refactoring Request abschließen

Gemäß `.claude/rules/refactoring-requests.md`:

- [ ] Umgesetzten Punkt markieren: `✅ done (YYYY-MM-DD HH:MM)` an der Überschrift.
- [ ] `**Status:**`-Zeile im Kopf aktualisieren (Teilweise umgesetzt / done mit Datum und Uhrzeit).
- [ ] Erfüllte Akzeptanzkriterien auf `[x]` setzen.
- [ ] Neu entdeckte offene Punkte als eigenen nummerierten Abschnitt ergänzen (nur nach Rückfrage).

## 6. Abschlussbericht, Log-Eintrag und Commit

- [ ] Chat Ausgabe : was geändert wurde (mit Dateilinks), Test-/Build-Ergebnis, was bewusst offen blieb.
- [ ] Committext vorbereiten (Typ `refactor(<scope>): …`).
- [ ] `ai-implementations-log.md`-Eintrag vorbereiten. Der Eintrag ist **Pflicht** für jede durchgeführte Umsetzung. Neuester Eintrag oben unter „Letzte Änderungen“, Format wie die bestehenden Einträge:

  ```markdown
  ### (YYYY-MM-DD HH:MM) - Refactoring: <Titel> (<slug> #<punkt>)

  - **Was wurde gemacht:** …
  - **Dateien geändert:** …
  - **Wichtige Entscheidung:** …
  ```

- [ ] Benutzer den Committext und den Log-Eintrag zeigen und um Freigabe bitten. Nach Freigabe den Eintrag in `ai-implementations-log.md` einfügen und im selben Commit mitcommitten.
