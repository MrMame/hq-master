# Feature Requests

## Ablageort

- Feature Requests gehören ausschließlich nach `docs/feature-requests/<name>.md`.
- Niemals im Root-Verzeichnis oder in `src/` ablegen.
- Dateiname: Kurzer Kebab-Case-Slug, der das Feature beschreibt (z.B. `shared-session-state.md`).

## Offene Arbeiten prüfen

- Wenn der Benutzer fragt, ob es offene Aufgaben, offene Feature Requests oder noch ausstehende Arbeiten gibt, MUSS `docs/feature-requests/` durchsucht werden.
- Alle direkt dort liegenden `.md`-Dateien auflisten und deren Titel und Priorität zusammenfassen. Der Unterordner `done/` enthält abgeschlossene Requests und wird dabei nicht berücksichtigt.
- Zusätzlich `docs/ToDo.md` prüfen, falls vorhanden.

## Fertiggestellte Feature Requests

- Umgesetzte Punkte und die `**Status:**`-Zeile werden mit `done` inkl. Datum und Uhrzeit der Fertigstellung markiert.
- Ist ein Request **vollständig** umgesetzt, wird er per `git mv` nach `docs/feature-requests/done/` verschoben. Teilweise umgesetzte Requests bleiben im Hauptordner.
- Abgeschlossene Requests werden nicht gelöscht; sie dokumentieren die Begründung hinter dem Code. Verworfene Requests erhalten Status `rejected` (mit Begründung) und werden ebenfalls nach `done/` verschoben.
- Beim Verschieben Verweise mit vollem Pfad in offenen Requests anpassen. Einträge in `ai-implementations-log.md` bleiben unverändert (Historie).
