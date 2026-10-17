# Refactoring Requests

Refactoring Requests beschreiben Umbauten ohne neues fachliches Verhalten (Struktur, Benennung, Aufteilung, Aufräumen). Neue Funktionalität gehört in einen Feature Request (`feature-requests.md`).

## Ablageort

- Refactoring Requests gehören ausschließlich nach `docs/refactoring-requests/<name>.md`.
- Niemals im Root-Verzeichnis oder in `src/` ablegen.
- Dateiname: Kurzer Kebab-Case-Slug, der den Umbau beschreibt (z.B. `file-naming-convention.md`).
- Aufbau wie ein Feature Request: Kopf mit Datum, Priorität, Status, Bezug; nummerierte Anforderungen; Akzeptanzkriterien.

## Offene Arbeiten prüfen

- Wenn der Benutzer nach offenen Aufgaben oder ausstehenden Arbeiten fragt, MUSS zusätzlich zu `docs/feature-requests/` auch `docs/refactoring-requests/` durchsucht werden.
- Alle direkt dort liegenden `.md`-Dateien auflisten und Titel und Priorität zusammenfassen. Der Unterordner `done/` wird dabei nicht berücksichtigt.

## Fertiggestellte Refactoring Requests

- Gleiches Vorgehen wie bei Feature Requests (`feature-requests.md`): Markierung mit `done` inkl. Datum und Uhrzeit; vollständig umgesetzte Requests per `git mv` nach `docs/refactoring-requests/done/` verschieben, nicht löschen.

## Umsetzung

- Umsetzung über den Skill `implement-refactor`.
- Jede durchgeführte Umsetzung wird in `ai-implementations-log.md` eingetragen.
