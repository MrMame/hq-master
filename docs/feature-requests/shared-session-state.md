# Feature Request: Shared Session State Layer

**Datum:** 2026-10-15  
**Priorität:** Hoch  
**Bezug REQUIREMENTS.md:** Abschnitt 0 (App-weite Anforderungen), Abschnitt 4 (GameSession)

---

## Problem

Die aktuelle Architektur widerspricht der zentralen Anforderung aus REQUIREMENTS.md §0:

> *„Alle Features greifen auf die gleiche SpieleSession Daten zu."*

Aktueller Stand:
- Jedes Feature speichert Daten in **isolierten localStorage-Keys** ohne reaktive Verbindung zu anderen Features.
- `DungeonTrackerPage` liest Characters **einmalig** im Constructor — Änderungen im Character-Tracker sind erst nach Navigation sichtbar.
- `GametimeService` wird von **keinem anderen Feature** konsumiert, obwohl REQUIREMENTS.md §0 explizit fordert, dass Zeitänderungen alle Features beeinflussen (z.B. Giftschaden pro Runde).
- `GametimeService` hat **keine Persistenz** — die Spielzeit resettet bei jedem Page-Reload.
- `provideHttpClient()` fehlt in `app.config.ts` → Card-Manager-Feature crasht beim Deck-Laden.

---

## Ziel

Einen reaktiven, persistenten **Session State Layer** einführen, auf den alle Feature-Services zugreifen. Änderungen in einem Feature werden sofort in allen anderen Features sichtbar — ohne Navigation oder manuellen Reload.

---

## Anforderungen

### 1. `CharactersDbService` — reaktiv machen

- Ein `WritableSignal<CharacterInfo[]>` hinzufügen, das beim Service-Init aus localStorage befüllt wird.
- Alle Schreib-Operationen (`writeCharacter`, `removeCharacter`) aktualisieren sowohl das Signal als auch localStorage.
- `DungeonTrackerPage` bindet sich an das Signal statt einmalig zu lesen.

**Erwartetes Verhalten:** Charakter im Character-Tracker löschen → Token verschwindet sofort im Dungeon-Tracker, ohne Navigation.

---

### 2. `GametimeService` — persistieren

- Spielzeit beim Start aus localStorage lesen (Key: `'game_time'`).
- Bei jeder Änderung (`addHours`, `addMinutes`, `setGameTime`) sofort in localStorage schreiben.

**Erwartetes Verhalten:** Browser-Tab schließen und wieder öffnen → Spielzeit ist noch identisch mit dem letzten Stand der Session.

---

### 3. `GametimeService` — Feature-übergreifend nutzbar machen

- Vorbereitung für REQUIREMENTS.md §2: Wenn die Spielzeit sich ändert, sollen andere Services reagieren können (z.B. Schaden-Tick für vergiftete Charaktere).
- `GametimeService` soll ein `Signal<Date>` als öffentliche API exponieren, auf das andere Services via `effect()` oder `computed()` reagieren können.

**Erwartetes Verhalten (Zukunft):** `+1 Runde` im TimeTracker → CharacterService prüft automatisch, welche zeitabhängigen Effekte ausgelöst werden müssen.

---

### 4. `provideHttpClient()` in `app.config.ts` eintragen

- In `src/app/app.config.ts` den Aufruf `provideHttpClient()` ergänzen.
- Betrifft: `DeckXmlLoaderService` (Card-Manager-Feature).

**Erwartetes Verhalten:** "Deck laden"-Button funktioniert ohne `NullInjectorError`.

---

### 5. (Optional, längerfristig) GameSession Feature (`/gamesession`) — REQUIREMENTS.md §4

- Neues Feature zum Starten/Beenden einer Spielesession.
- Start einer neuen Session: Ingame-Startzeit wählen, alle Feature-States zurücksetzen.
- Session speichern/laden: alle relevanten Zustände in einer XML-Datei bündeln (Characters, DungeonBoard, CardManager-State, Spielzeit).
- Setzt voraus, dass Punkte 1–3 umgesetzt sind (gemeinsamer State-Layer).

---

## Technische Umsetzungshinweise

### Empfohlenes Muster (bereits in `CardManagerService` etabliert):

```typescript
// Service hält Signal + schreibt bei jeder Mutation in localStorage
private _items = signal<T[]>(this.storageService.readFromLocalStorage<T[]>(KEY) ?? []);
readonly items = this._items.asReadonly();

private persist(value: T[]) {
  this._items.set(value);
  this.storageService.writeToLocalStorage(KEY, value);
}
```

Dieses Muster auf `CharactersDbService` und `GametimeService` ausrollen.

---

## Betroffene Dateien

| Datei | Änderung |
|---|---|
| `src/app/core/services/persistent/characters-database-service.ts` | Signal hinzufügen, alle Mutationen darüber routen |
| `src/app/core/services/gaming/gametime-service.ts` | localStorage-Persistenz + öffentliches Signal |
| `src/app/app.config.ts` | `provideHttpClient()` eintragen |
| `src/app/features/dungeon-tracker/components/dungeon-tracker-page/dungeon-tracker-page.ts` | Reaktiv auf Characters-Signal binden statt einmaligem Read |

---

## Akzeptanzkriterien

- [ ] Charakter hinzufügen/entfernen im Character-Tracker → sofort im Dungeon-Tracker sichtbar (ohne Navigation)
- [ ] Spielzeit überlebt Browser-Reload
- [ ] Deck laden im Card-Manager funktioniert ohne Fehler
- [ ] Alle bestehenden Vitest-Tests laufen durch (`npm run test`)
- [ ] TypeScript strict-mode: kein `any`, Build fehlerfrei (`npm run build`)
