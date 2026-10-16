# Projekt-Status & KI-Logbuch

## 🛠️ Letzte Änderungen (Chronologisch)

### (2026-10-16 15:34) - Spielzeit-Persistenz & TimeTracker-Ausbau (shared-session-state #2, #6)

- **Was wurde gemacht:** GametimeService lädt die Spielzeit beim Start aus localStorage (Key `game_time`) und speichert jede Änderung über den StorageService. TimeTracker zeigt die Spielzeit als Label und hat Buttons für +1/+5/+10 Sekunden. `addTime` nimmt ein `GameTimeSpan`-Objekt, `setGameTime` ein `GameTime`-Objekt inkl. Datum; `addHours`/`addMinutes`/`addSeconds` entfernt.
- **Dateien geändert:** `src/app/core/services/gaming/gametime-service.ts`, `gametime-service.spec.ts`, `game-time.ts` (neu), `game-time-span.ts` (neu), `src/app/features/time-tracker/components/time-tracker-page/time-tracker-page.ts|.html|.spec.ts`, `docs/feature-requests/shared-session-state.md`
- **Wichtige Entscheidung:** Speicherung als ISO-String mit Fallback auf die Standardzeit. Benannte Objekt-Parameter statt positioneller Argumente; getrennte Typen für Zeitspanne (`GameTimeSpan`) und Zeitpunkt (`GameTime`). In `GameTime` ist `month` 1-basiert, fehlende Datumsteile bleiben unverändert, fehlende Uhrzeitteile zählen als 0.
