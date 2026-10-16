---
name: implement-feature
description: Setzt einen Feature Request aus docs/feature-requests/ um (ganz oder einen nummerierten Punkt). Verwenden, wenn der Nutzer einen Feature Request durchführen, umsetzen oder implementieren lassen will, z. B. "/implement-feature shared-session-state #2".
argument-hint: <feature-request-slug> [#punkt]
---

# Feature Request umsetzen

Argumente: `$ARGUMENTS` — Slug der Datei in `docs/feature-requests/` und optional die Nummer des Punkts.

Arbeite die Schritte **in dieser Reihenfolge** ab. Keinen Schritt überspringen; ist ein Schritt nicht anwendbar, das im Abschlussbericht begründen.

## 1. Kontext laden (vor jeder Code-Änderung)

- [ ] `REQUIREMENTS.md` im Projekt-Root lesen. Die Umsetzung muss zu Zielen und Scope dort passen. Widersprüche dem Nutzer melden, bevor du implementierst.
- [ ] `docs/feature-requests/<slug>.md` vollständig lesen. Nur den angefragten Punkt umsetzen.
- [ ] Regeln prüfen: `.claude/rules/architecture.md`, `clean-code.md`, `testing.md`, `feature-requests.md`.
- [ ] Alle betroffenen Dateien und ihre Aufrufer lesen (`Grep` nach den Klassen-/Methodennamen).

## 2. Plan

- [ ] Plan mit betroffenen Dateien, Testfällen und Verifikation erstellen und vom Nutzer freigeben lassen.
- [ ] Vorbestehende Probleme außerhalb des Scopes nicht stillschweigend fixen, sondern auflisten und fragen, ob sie als neuer Punkt in den Feature Request sollen.

## 3. Umsetzung — Checkliste

- [ ] Neue Komponenten/Services/Module nur per Angular CLI (`ng g c|s|m …`).
- [ ] State als private `signal()`, öffentlich nur `.asReadonly()`; Persistenz nur über `StorageService`.
- [ ] Nur `inject()`, keine Konstruktor-Injection; `effect`/`computed` statt Lifecycle-Hooks.
- [ ] Kein `any`; jede Datei ≤ 150 Zeilen.
- [ ] Jede neue Logik hat Vitest-Tests (`vi.fn()`, nicht `jasmine`).

## 4. Verifikation

- [ ] `npm run test -- --watch=false` grün.
- [ ] `npm run build` fehlerfrei.
- [ ] Bei UI-Änderungen: manuellen Prüfschritt im Bericht nennen.

Prettier-Formatierung, Tests beim Beenden und Build/Prettier vor jedem Commit erzwingen die Hooks in `.claude/settings.json` automatisch.

## 5. Feature Request abschließen

Gemäß `.claude/rules/feature-requests.md`:

- [ ] Umgesetzten Punkt markieren: `✅ done (YYYY-MM-DD HH:MM)` an der Überschrift.
- [ ] `**Status:**`-Zeile im Kopf aktualisieren (Teilweise umgesetzt / done mit Datum und Uhrzeit).
- [ ] Erfüllte Akzeptanzkriterien auf `[x]` setzen.
- [ ] Neu entdeckte offene Punkte als eigenen nummerierten Abschnitt ergänzen (nur nach Rückfrage).

## 6. Abschlussbericht

Kurz: was geändert wurde (mit Dateilinks), Test-/Build-Ergebnis, was bewusst offen blieb. Nicht committen oder pushen, außer der Nutzer verlangt es.
