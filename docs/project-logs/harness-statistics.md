# Harness-Statistik

Generiert von `node scripts/claude/work-statistics.mjs` – nicht von Hand bearbeiten. Wie die Zahlen entstehen und zu lesen sind, mit Beispielrechnungen: Abschnitt **Erläuterungen** am Ende.

## Übersicht

Werte je umgesetztem Punkt (Median). Index: 100 = Median aller Läufe desselben Messverfahrens, höher = effizienter. „vorläufig“: weniger als 3 Läufe. Nacharbeit zählt zum früheren Lauf; `interview-me` zählt nicht.

### Messverfahren 1 (ab alt-1, –)

| Stand | Seit | Läufe | Dauer (min) | Tools | Tokens gesamt | Output-Tokens | Fehlschläge + 1 | Diff-Zeilen | Index           |
| ----- | ---- | ----- | ----------- | ----- | ------------- | ------------- | --------------- | ----------- | --------------- |
| alt-1 | –    | 2     | 2,1         | 8     | 473.359       | 3.552         | 0,33            | 52          | 100 (vorläufig) |

### Messverfahren 2 (ab alt-2, 2026-10-31 20:56)

| Stand | Seit             | Läufe | Dauer (min) | Tools | Tokens gesamt | Output-Tokens | Fehlschläge + 1 | Diff-Zeilen | Index |
| ----- | ---------------- | ----- | ----------- | ----- | ------------- | ------------- | --------------- | ----------- | ----- |
| alt-2 | 2026-10-31 20:56 | 5     | 2,7         | 12,3  | 651.829       | 6.779         | 0,67            | 84          | 100   |

### Messverfahren 3 (ab f0a6f624, 2026-11-01 10:00)

| Stand    | Seit             | Läufe | Dauer (min) | Tools | Tokens gesamt | Output-Tokens | Fehlschläge + 1 | Diff-Zeilen | Index           |
| -------- | ---------------- | ----- | ----------- | ----- | ------------- | ------------- | --------------- | ----------- | --------------- |
| f0a6f624 | 2026-11-01 10:00 | 2     | 9,2         | 13,4  | 1.238.507     | 9.328         | 0,99            | 391         | 100 (vorläufig) |

### Messverfahren 4 (ab cdcba13c, 2026-11-01 19:29)

| Stand    | Seit             | Läufe | Dauer (min) | Tools | Tokens gesamt | Output-Tokens | Fehlschläge + 1 | Diff-Zeilen | Index |
| -------- | ---------------- | ----- | ----------- | ----- | ------------- | ------------- | --------------- | ----------- | ----- |
| cdcba13c | 2026-11-01 19:29 | 14    | 5,2         | 11,2  | 1.365.221     | 7.113         | 0,68            | 179         | 100   |

## Läufe

| Datum            | Skill              | Slug                              | Punkte | Diff (+/−)    | Dauer (min) | Runden | Rückfragen | Tools | Fehlschläge (erwartet) | Output-Tokens | Tokens gesamt | Modell                   | Harness-Stand             | Nacharbeit | Index |
| ---------------- | ------------------ | --------------------------------- | ------ | ------------- | ----------- | ------ | ---------- | ----- | ---------------------- | ------------- | ------------- | ------------------------ | ------------------------- | ---------- | ----- |
| 2026-10-31 08:15 | implement-refactor | responsive-app-header             | 4      | +30 / −22     | 8           | 2      | 0          | 28    | 1                      | 10.579        | 1.736.458     | unbekannt                | alt-1                     | –          | 97    |
| 2026-10-31 09:13 | implement-feature  | main-nav-menu-button              | 6      | +440 / −105   | 13          | 1      | 1          | 54    | 0                      | 26.758        | 3.075.626     | unbekannt                | alt-1                     | –          | 109   |
| 2026-10-31 20:56 | implement-refactor | work-statistics-failure-detection | 3      | +280 / −58    | 8           | 1      | 2          | 47    | 1 (+1)                 | 22.162        | 1.955.487     | unbekannt                | alt-2                     | –          | 82    |
| 2026-10-31 21:33 | implement-feature  | grid-sized-character-models       | 7      | +349 / −78    | 20          | 1      | 1          | 117   | 4 (+1)                 | 47.456        | 8.567.528     | unbekannt                | alt-2                     | –          | 83    |
| 2026-11-01 08:28 | implement-refactor | quick-access-bar                  | 6      | +366 / −136   | 10          | 1      | 1          | 52    | 5                      | 28.301        | 3.803.996     | unbekannt                | alt-2                     | –          | 119   |
| 2026-11-01 09:17 | implement-refactor | project-logs-folder               | 4      | +42 / −36     | 3           | 1      | 1          | 15    | 1                      | 6.137         | 787.996       | unbekannt                | alt-2                     | –          | 244   |
| 2026-11-01 10:00 | implement-refactor | harness-statistics-log            | 7      | +2186 / −85   | 40          | 4      | 1          | 86    | 0                      | 94.044        | 10.122.304    | claude-opus-5-5 (medium) | alt-2 (ändert Harness)    | –          | 75    |
| 2026-11-01 11:02 | implement-feature  | character-conditions              | 10     | +2309 / −37   | 32          | 3      | 0          | 108   | 6 (+1)                 | 86.689        | 13.202.753    | claude-opus-5-5 (medium) | f0a6f624 (ändert Harness) | –          | 137   |
| 2026-11-01 12:49 | implement-feature  | game-event-log                    | 7      | +3764 / −63   | 106         | 3      | 0          | 112   | 8 (+1)                 | 69.906        | 8.097.164     | claude-opus-5-5 (medium) | 3443b517 (ändert Harness) | –          | 84    |
| 2026-11-01 19:29 | interview-me       | dungeon-round-control             | –      | +213 / −12    | 8           | 2      | 4          | 29    | 2                      | 19.110        | 2.308.023     | claude-opus-5-5 (medium) | 961e5ba4 (ändert Harness) | –          | –     |
| 2026-11-01 20:06 | implement-feature  | dungeon-round-control             | 7      | +651 / −35    | 34          | 2      | 1          | 100   | 4 (+1)                 | 51.598        | 10.883.784    | claude-opus-5-5 (medium) | cdcba13c (ändert Harness) | –          | 96    |
| 2026-11-01 20:20 | interview-me       | time-tracker-sidebar-layout       | –      | +171 / −0     | 8           | 1      | 3          | 17    | 0                      | 15.060        | 1.405.207     | claude-opus-5-5 (medium) | ed60a6d0                  | –          | –     |
| 2026-11-01 20:35 | implement-feature  | time-tracker-sidebar-layout       | 6      | +305 / −210   | 12          | 2      | 1          | 47    | 3 (+2)                 | 29.030        | 4.042.421     | claude-opus-5-5 (medium) | ed60a6d0 (ändert Harness) | –          | 164   |
| 2026-11-05 16:57 | implement-feature  | card-manager-real-card-format     | 6      | +32 / −24     | 11          | 2      | 1          | 33    | 2 (+1)                 | 16.000        | 2.911.196     | claude-opus-5-5 (medium) | b573d305                  | –          | 206   |
| 2026-11-05 17:19 | implement-feature  | card-manager-active-card-focus    | 4      | +121 / −23    | 20          | 2      | 3          | 19    | 1 (+1)                 | 18.904        | 2.533.500     | claude-opus-5-5 (medium) | b573d305                  | –          | 136   |
| 2026-11-05 17:43 | implement-feature  | card-manager-bank-rows            | 5      | +596 / −82    | 27          | 3      | 2          | 27    | 0 (+1)                 | 32.494        | 3.723.374     | claude-opus-5-5 (medium) | b573d305                  | –          | 147   |
| 2026-11-05 18:45 | implement-feature  | card-manager-active-card-overlay  | 6      | +1185 / −98   | 11          | 2      | 1          | 41    | 4 (+1)                 | 29.490        | 3.893.009     | claude-opus-5-5 (medium) | b573d305 (ändert Harness) | –          | 167   |
| 2026-11-06 17:49 | implement-feature  | character-max-values              | 7      | +896 / −119   | 16          | 2      | 1          | 61    | 3 (+1)                 | 47.984        | 8.229.305     | claude-opus-5-5 (medium) | 61343aac (ändert Harness) | –          | 138   |
| 2026-11-06 19:03 | implement-feature  | character-equipment-cards         | 11     | +3252 / −455  | 62          | 6      | 1          | 156   | 7 (+3)                 | 149.372       | 29.611.888    | claude-opus-5-5 (medium) | a5840509 (ändert Harness) | –          | 71    |
| 2026-11-06 20:45 | implement-feature  | card-manager-multiple-decks       | 13     | +3327 / −1216 | 84          | 9      | 1          | 178   | 8 (+1)                 | 181.203       | 42.406.910    | claude-opus-5-5 (medium) | bd01c4f6 (ändert Harness) | –          | 64    |
| 2026-11-07 08:17 | implement-refactor | card-move-foundation              | 4      | +929 / −349   | 22          | 2      | 1          | 71    | 3                      | 71.941        | 11.953.663    | claude-opus-5-5 (medium) | ae22f539 (ändert Harness) | –          | 64    |
| 2026-11-07 09:11 | implement-feature  | card-viewer                       | 9      | +3091 / −1196 | 52          | 2      | 1          | 140   | 5 (+1)                 | 131.549       | 27.570.491    | claude-opus-5-5 (medium) | cf02c4cf (ändert Harness) | –          | 78    |
| 2026-11-07 10:17 | implement-feature  | character-inventory               | 7      | +5572 / −1426 | 52          | 2      | 1          | 158   | 10                     | 146.492       | 31.993.157    | claude-opus-5-5 (medium) | ee6587e7 (ändert Harness) | –          | 52    |
| 2026-11-07 14:05 | implement-feature  | card-viewer-comfort               | 6      | +2159 / −1042 | 225         | 3      | 1          | 112   | 8 (+3)                 | 121.304       | 23.974.831    | claude-opus-5-5 (medium) | 1e63671f (ändert Harness) | –          | 37    |
| 2026-11-07 18:07 | implement-feature  | deck-catalog                      | 5      | +525 / −67    | 12          | 2      | 1          | 44    | 2 (+1)                 | 34.084        | 4.525.047     | claude-opus-5-5 (medium) | 0b0ea502 (ändert Harness) | –          | 139   |

## Harness-Stände

| Stand    | Seit             | Modell                   | Claude Code | Messbruch | Einordnung             | Beschreibung                                                                                             | Erwartete Wirkung                                                                                                | Geänderte Dateien                                                                                |
| -------- | ---------------- | ------------------------ | ----------- | --------- | ---------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| alt-1    | –                | unbekannt                | unbekannt   | –         | wirkungsrelevant       | Harness-Stand unbekannt (übernommen aus ai-implementations-log.md)                                       | –                                                                                                                | –                                                                                                |
| alt-2    | 2026-10-31 20:56 | unbekannt                | unbekannt   | ja        | wirkungsrelevant       | Harness-Stand unbekannt; Fehlschläge aus Prüfausgaben (work-statistics-failure-detection)                | –                                                                                                                | scripts/claude/activity-log.mjs, scripts/claude/check-output.mjs, .claude/hooks/log-activity.mjs |
| f0a6f624 | 2026-11-01 10:00 | claude-opus-5-5 (medium) | 2.1.314     | ja        | wirkungsrelevant       | Statistiklog mit Harness-Stand, Effizienz-Index und --append in Skills und Regel                         | Arbeitsweise unverändert; ca. +1 Tool-Aufruf je Lauf durch --append                                              | erster Stand (43 Dateien)                                                                        |
| 3443b517 | 2026-11-01 11:02 | claude-opus-5-5 (medium) | 2.1.314     | –         | nicht wirkungsrelevant | architecture.md: Einträge für Zustands-Modelle, Tick-Service, Utils und Komponenten                      | Keine messbare Wirkung; nur neue Einträge in der Verzeichnisstruktur.                                            | ~ .claude/rules/architecture.md                                                                  |
| 961e5ba4 | 2026-11-01 12:49 | claude-opus-5-5 (medium) | 2.1.314     | –         | nicht wirkungsrelevant | architecture.md: GameLog-Dateien und ConditionTick-Ereignisse dokumentiert                               | Reine Strukturdoku, keine Wirkung auf Effizienz erwartet                                                         | ~ .claude/rules/architecture.md                                                                  |
| cdcba13c | 2026-11-01 19:29 | claude-opus-5-5 (medium) | 2.1.314     | ja        | nicht wirkungsrelevant | work-statistics: Skill-Lauf beginnt auch bei /skill mitten im Prompt oder beim Skill-Tool-Aufruf         | Keine Wirkung auf die Arbeit; Läufe, deren Prompt nicht mit /skill beginnt, werden jetzt erfasst statt verworfen | ~ .claude/rules/work-statistics.md, ~ scripts/claude/activity-log.mjs                            |
| ed60a6d0 | 2026-11-01 20:06 | claude-opus-5-5 (medium) | 2.1.314     | –         | nicht wirkungsrelevant | architecture.md: RoundMenu, RoundService, markMoved/clearMovedThisRound dokumentiert                     | Reine Doku-Ergänzung zu neuen Bausteinen; keine messbare Wirkung auf Effizienz erwartet                          | ~ .claude/rules/architecture.md                                                                  |
| 9263c7a1 | 2026-11-01 20:35 | claude-opus-5-5 (medium) | 2.1.314     | –         | nicht wirkungsrelevant | architecture.md: time-step.model und feature-page.css dokumentiert                                       | Keine Wirkung auf die Effizienz; nur Doku der neuen Klassen                                                      | ~ .claude/rules/architecture.md                                                                  |
| b573d305 | 2026-11-05 16:57 | claude-opus-5-5 (medium) | 2.1.317     | –         | nicht wirkungsrelevant | Claude-Code-Update 2.1.314 → 2.1.317                                                                     | Keine messbare Wirkung, nur Versionswechsel                                                                      | Claude Code 2.1.314 → 2.1.317                                                                    |
| 61343aac | 2026-11-05 18:45 | claude-opus-5-5 (medium) | 2.1.317     | –         | nicht wirkungsrelevant | architecture.md: ActiveCardOverlay in der Card-Manager-Komponentenliste ergänzt                          | Keine Wirkung auf Effizienz; reine Doku der neuen Komponente                                                     | ~ .claude/rules/architecture.md                                                                  |
| a5840509 | 2026-11-06 17:49 | claude-opus-5-5 (medium) | 2.1.318     | –         | nicht wirkungsrelevant | architecture.md um DeadMarker, character-limits/character-stat ergänzt; Claude Code 2.1.317 → 2.1.318    | Reine Strukturdoku und Patch-Update; keine messbare Wirkung auf Dauer, Tools oder Tokens erwartet.               | ~ .claude/rules/architecture.md, Claude Code 2.1.317 → 2.1.318                                   |
| bd01c4f6 | 2026-11-06 19:03 | claude-opus-5-5 (medium) | 2.1.318     | –         | nicht wirkungsrelevant | architecture.md: Ausrüstung, card-deck und equipment in der Verzeichnisstruktur dokumentiert             | Keine Wirkung auf die Effizienz erwartet; nur Doku der neuen Struktur                                            | ~ .claude/rules/architecture.md                                                                  |
| ae22f539 | 2026-11-06 20:45 | claude-opus-5-5 (medium) | 2.1.318     | –         | nicht wirkungsrelevant | architecture.md: Card-Manager-Struktur mit mehreren Decks, SearchField und text-search in shared         | Reine Strukturdoku, keine Änderung an Regeln oder Abläufen; keine messbare Wirkung erwartet                      | ~ .claude/rules/architecture.md                                                                  |
| cf02c4cf | 2026-11-07 08:17 | claude-opus-5-5 (medium) | 2.1.318     | –         | nicht wirkungsrelevant | architecture.md: CardDisplay unter shared, card-location/card-move/equipment-transfer-Utils dokumentiert | Reine Doku des Ist-Stands; keine Änderung an Ablauf oder Effizienz erwartet                                      | ~ .claude/rules/architecture.md                                                                  |
| ee6587e7 | 2026-11-07 09:11 | claude-opus-5-5 (medium) | 2.1.318     | –         | nicht wirkungsrelevant | architecture.md beschreibt Hand, Card Viewer und shared/card-actions                                     | Keine messbare Wirkung; nur die Strukturbeschreibung des neuen Codes                                             | ~ .claude/rules/architecture.md                                                                  |
| 1e63671f | 2026-11-07 10:17 | claude-opus-5-5 (medium) | 2.1.318     | –         | nicht wirkungsrelevant | architecture.md: neue Inventar-Dateien und Komponenten dokumentiert                                      | Reine Strukturdoku, keine Änderung an Regeln oder Abläufen; keine Wirkung auf Effizienz erwartet                 | ~ .claude/rules/architecture.md                                                                  |
| 0b0ea502 | 2026-11-07 14:05 | claude-opus-5-5 (medium) | 2.1.319     | –         | nicht wirkungsrelevant | architecture.md um Untermenüs, Rückgängig, Blättern und CharacterCards ergänzt; CC-Update                | keine messbare Wirkung, reine Doku-Nachführung                                                                   | ~ .claude/rules/architecture.md, Claude Code 2.1.318 → 2.1.319                                   |
| 47b0f147 | 2026-11-07 18:07 | claude-opus-5-5 (medium) | 2.1.319     | –         | nicht wirkungsrelevant | Deck-Katalog in architecture.md dokumentiert; Playwright erzeugt vor ng serve die Deckliste              | Keine Wirkung auf die Effizienz erwartet, nur Doku und ein zusätzlicher Startschritt der E2E-Läufe               | ~ .claude/rules/architecture.md, ~ playwright.config.ts                                          |

## Erläuterungen

Dieser Abschnitt erklärt, woher die Zahlen kommen, was jede Spalte bedeutet und wie Übersicht und
Effizienz-Index berechnet werden. Er wird mit jeder Aktualisierung unverändert mitgeschrieben
(Vorlage: `scripts/claude/statistics-guide.md`).

### Wozu diese Datei?

Claude arbeitet in diesem Projekt nach Skills, Regeln, Hooks und Skripten – zusammen der **Harness**.
Wird der Harness geändert (z. B. eine Regel präzisiert), soll sich belegen lassen, ob die folgenden Läufe
dadurch schneller, sparsamer oder fehlerärmer geworden sind. Dafür hält diese Datei für jeden Lauf eines
Skills (`implement-feature`, `implement-refactor`, `interview-me`) die gemessenen Kennzahlen fest und
ordnet jeden Lauf dem Harness-Stand zu, mit dem er gearbeitet hat.

Die Datei besteht aus drei Teilen:

1. **Übersicht** – die Auswertung: Mediane und Effizienz-Index je Harness-Stand.
2. **Läufe** – die Rohdaten: eine Zeile je Skill-Lauf.
3. **Harness-Stände** – wann sich der Harness geändert hat, was sich geändert hat und warum.

Alle Zahlen stammen aus Skripten (Aktivitätslog der Hooks, Sitzungsprotokoll, `git`), nie aus Schätzung.
Kosten werden bewusst nicht ausgewiesen.

### Spalten der Tabelle „Läufe“

| Spalte                 | Bedeutung                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                  | Ende des Laufs (Zeitpunkt der Auswertung), lokale Zeit.                                                                                                                           |
| Skill                  | Welcher Skill gelaufen ist.                                                                                                                                                       |
| Slug                   | Name des Feature- bzw. Refactoring-Requests (bei `interview-me` das Thema).                                                                                                       |
| Punkte                 | Anzahl der in diesem Lauf umgesetzten Punkte des Requests. Maß für den Umfang; alle Vergleiche rechnen **je Punkt**. Leer bei `interview-me`.                                     |
| Diff (+/−)             | Hinzugefügte / entfernte Zeilen seit Branch-Start, ohne `docs/project-logs/**` und Lockfiles. Neue, noch nicht getrackte Dateien zählen voll als hinzugefügt.                     |
| Dauer (min)            | Minuten vom Skill-Aufruf bis zur Auswertung – **inklusive** der Zeit, in der Claude auf eine Antwort gewartet hat.                                                                |
| Runden                 | Anzahl der Nutzer-Prompts im Lauf. 1 = alles in einem Durchgang.                                                                                                                  |
| Rückfragen             | Wie oft Claude per Auswahldialog nachgefragt hat. Die Plan-Freigabe ist eine davon.                                                                                               |
| Tools                  | Tool-Aufrufe von Claude selbst (Lesen, Schreiben, Bash …), ohne Subagenten.                                                                                                       |
| Fehlschläge (erwartet) | Fehlgeschlagene Tool-Aufrufe und rote Prüfläufe (Tests, Lint, Build, E2E). In Klammern absichtlich rote Läufe, z. B. eine Probe als Beleg für „fehlt noch“; sie zählen nicht mit. |
| Output-Tokens          | Von Claude erzeugter Text inkl. Code (Haupt-Sitzung und Subagenten). Gut geeignet, um den Schreibaufwand zu vergleichen.                                                          |
| Tokens gesamt          | Alle verarbeiteten Tokens: Input, Cache-Schreiben, Cache-Lesen und Output, inkl. Subagenten. Wird meist vom Cache-Lesen dominiert, wächst also mit Länge des Laufs.               |
| Modell                 | Modell aus dem Sitzungsprotokoll, in Klammern die Effort-Stufe.                                                                                                                   |
| Harness-Stand          | Kennung des Stands, mit dem der Lauf gearbeitet hat. „(ändert Harness)“: Der Lauf hat selbst Harness-Dateien geändert (siehe unten).                                              |
| Nacharbeit             | `ja (…)`: Später gab es noch Läufe mit demselben Slug (Datum in Klammern). `zu …`: Dieser Lauf ist Nacharbeit zum Lauf vom genannten Datum.                                       |
| Index                  | Effizienz-Index des Laufs (siehe unten). `–` bei Nacharbeit-Läufen (sie stecken im Index des früheren Laufs) und bei `interview-me`.                                              |

### Harness-Stand und Spalten der Tabelle „Harness-Stände“

Zum Harness gehören `.claude/CLAUDE.md`, `.claude/settings.json`, `.claude/rules/**`, `.claude/skills/**`,
`.claude/hooks/**`, `scripts/claude/**` (ohne Tests), `scripts/git-hooks/**`, `.husky/**`,
`vitest.config.ts`, `playwright.config.ts`, die persönlichen Einstellungen `~/.claude/settings.json` und
das Memory des Projekts.

Der **Harness-Stand** ist ein 8-stelliger Fingerabdruck (Hash) über den Inhalt all dieser Dateien plus
Modell, Effort und Claude-Code-Version. Ändert sich auch nur ein Zeichen, entsteht ein neuer Stand. Ob die
Änderung schon committet ist, spielt keine Rolle. Der zuletzt gesehene Stand liegt in
`harness-statistics.state.json`; durch den Vergleich damit entsteht die Liste der geänderten Dateien.

| Spalte            | Bedeutung                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Stand             | Kennung des Stands. `alt-1` / `alt-2`: übernommene Läufe aus der Zeit vor dem Statistiklog, genauer Stand unbekannt.        |
| Seit              | Datum des Laufs, bei dem der Stand zum ersten Mal gemessen wurde.                                                           |
| Modell            | Modell und Effort-Stufe dieses Stands.                                                                                      |
| Claude Code       | Version von Claude Code.                                                                                                    |
| Messbruch         | `ja`: Die Messung selbst hat sich geändert (siehe unten). Ab hier wird nicht mit früheren Läufen verglichen.                |
| Einordnung        | `wirkungsrelevant` (kann die Arbeitsweise ändern), `nicht wirkungsrelevant` (z. B. Tippfehler, reines Update) oder `offen`. |
| Beschreibung      | Was geändert wurde, in einem Satz.                                                                                          |
| Erwartete Wirkung | Die Hypothese zur Änderung, z. B. „weniger Tool-Aufrufe in Schritt 1b“. Ob sie eintritt, zeigt die Übersicht.               |
| Geänderte Dateien | `+` neu, `~` geändert, `−` entfernt, dazu Modell- oder Versionswechsel. Lange Listen werden nach 12 Einträgen gekürzt.      |

**Lauf ändert den Harness:** Baut ein Lauf selbst am Harness (z. B. ein Refactoring an einem Skill), hat er
noch mit dem alten Stand gearbeitet. Er zählt deshalb zum vorigen Stand und bekommt den Vermerk
„(ändert Harness)“. Der neue Stand gilt ab dem nächsten Lauf.

**Messbruch:** Ändert sich eines der Mess-Skripte (`work-statistics.mjs`, `activity-log.mjs`,
`check-output.mjs`, `transcript-usage.mjs`, `transcript-model.mjs`, `git-files.mjs`,
`format-statistics.mjs`, `log-activity.mjs`), können dieselben Läufe danach andere Zahlen ergeben – etwa wenn
Fehlschläge genauer erkannt werden. Ein solcher Stand ist automatisch ein Messbruch. Die Übersicht beginnt
dann ein neues **Messverfahren**; Läufe verschiedener Messverfahren werden nie miteinander verglichen.

### Die Übersicht

Je Messverfahren gibt es eine Tabelle mit einer Zeile je wirkungsrelevantem Harness-Stand. Nicht
wirkungsrelevante Stände zählen zum Stand davor, damit Kleinigkeiten die Statistik nicht zersplittern.
`interview-me` zählt nicht mit, weil dort keine Punkte umgesetzt werden.

| Spalte                 | Bedeutung                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Läufe                  | Anzahl der Läufe (Nacharbeit mit dem früheren Lauf zusammen als einer).                         |
| Dauer, Tools, Tokens … | **Median je Punkt** über die Läufe des Stands.                                                  |
| Fehlschläge + 1        | Median von (Fehlschläge + 1) je Punkt; das „+ 1“ erklärt der Abschnitt zum Index.               |
| Diff-Zeilen            | Median der geänderten Zeilen (+ und −) je Punkt – zeigt, wie groß die Punkte im Schnitt waren.  |
| Index                  | Effizienz-Index des Stands. „(vorläufig)“: weniger als 3 Läufe, also noch wenig aussagekräftig. |

**Warum je Punkt?** Ein Lauf mit 8 Punkten braucht natürlich mehr als einer mit 2. Erst die Teilung durch die
Punkte macht große und kleine Läufe vergleichbar.

**Warum der Median?** Der Median ist der mittlere Wert der sortierten Liste und reagiert kaum auf
Ausreißer. Beispiel Tools je Punkt: Bei 8, 10 und 15 ist der Median 10. Bei vier Werten 8, 10, 12 und 40
ist es der Mittelwert der beiden mittleren, also (10 + 12) / 2 = 11 – der Ausreißer 40 verschiebt ihn
kaum, ein Durchschnitt läge bei 17,5.

### Der Effizienz-Index

Der Index fasst fünf Kennzahlen zu einer Zahl zusammen. **100 = so effizient wie der Median** aller
vergleichbaren Läufe (gleiches Messverfahren), **höher = effizienter**, niedriger = aufwendiger.

| Kennzahl je Punkt                                  | Gewicht |
| -------------------------------------------------- | ------- |
| Tokens gesamt                                      | 30 %    |
| Tools                                              | 20 %    |
| Dauer                                              | 20 %    |
| Fehlschläge + 1                                    | 15 %    |
| Interaktionen: max(0, Runden + Rückfragen − 2) + 1 | 15 %    |

So wird gerechnet:

1. Jede Kennzahl durch die Punkte teilen.
2. Für jede Kennzahl das **Verhältnis Median / eigener Wert** bilden. Liegt der Lauf unter dem Median
   (besser), ist das Verhältnis größer als 1.
3. Die Verhältnisse gewichtet multiplizieren (gewichtetes geometrisches Mittel): jedes Verhältnis hoch
   sein Gewicht nehmen und alles multiplizieren, zum Schluss × 100 und runden.

Das geometrische Mittel sorgt dafür, dass „doppelt so gut“ und „halb so gut“ sich genau aufheben, egal ob
es um Millionen Tokens oder um zwei Fehlschläge geht.

**Warum „+ 1“ und „− 2“?** Null Fehlschläge sind der Normalfall; ohne „+ 1“ ergäbe das eine Division durch
null. Ein normaler Lauf hat 1 Runde (der Aufruf) und 1 Rückfrage (die Plan-Freigabe); „− 2“ zieht diesen
Grundbedarf ab, sodass nur _zusätzliche_ Runden und Rückfragen ins Gewicht fallen. Das „max(0, …) + 1“ hält
den Wert positiv.

#### Beispielrechnung

Angenommen, die Mediane je Punkt des Messverfahrens sind:

| Tokens gesamt | Tools | Dauer   | Fehlschläge + 1 | Interaktionen |
| ------------- | ----- | ------- | --------------- | ------------- |
| 600.000       | 12    | 2,5 min | 0,5             | 0,25          |

**Lauf A** setzt 4 Punkte um: 8 min, 1 Runde, 1 Rückfrage, 40 Tools, 1 Fehlschlag, 2.000.000 Tokens.

| Kennzahl        | Lauf A je Punkt                    | Median / Wert           | hoch Gewicht       |
| --------------- | ---------------------------------- | ----------------------- | ------------------ |
| Tokens          | 2.000.000 / 4 = 500.000            | 600.000 / 500.000 = 1,2 | 1,2^0,30 = 1,0562  |
| Tools           | 40 / 4 = 10                        | 12 / 10 = 1,2           | 1,2^0,20 = 1,0371  |
| Dauer           | 8 / 4 = 2 min                      | 2,5 / 2 = 1,25          | 1,25^0,20 = 1,0456 |
| Fehlschläge + 1 | (1 + 1) / 4 = 0,5                  | 0,5 / 0,5 = 1           | 1                  |
| Interaktionen   | (max(0, 1 + 1 − 2) + 1) / 4 = 0,25 | 0,25 / 0,25 = 1         | 1                  |

Index = 100 × 1,0562 × 1,0371 × 1,0456 × 1 × 1 ≈ **115** – Lauf A war rund 15 % effizienter als der
Median, vor allem durch weniger Tokens und kürzere Dauer.

**Lauf B** ist genauso wie A, hat aber 3 Fehlschläge statt 1: (3 + 1) / 4 = 1, Verhältnis 0,5 / 1 = 0,5,
gewichtet 0,5^0,15 = 0,9013. Index = 100 × 1,0562 × 1,0371 × 1,0456 × 0,9013 ≈ **103**. Zwei zusätzliche
Fehlschläge kosten also 12 Indexpunkte.

Der **Index eines Stands** wird genauso berechnet, nur mit den Medianen des Stands statt der Werte eines
einzelnen Laufs.

### Nacharbeit

Muss ein Request nach seinem Lauf noch einmal angefasst werden, gehört dieser Aufwand zum ursprünglichen
Lauf. Gibt es später einen Lauf mit demselben Slug, werden deshalb die Kennzahlen beider Läufe addiert und
durch die Punkte des **ersten** Laufs geteilt. Das Ergebnis zählt im Stand des ersten Laufs.

Beispiel: Lauf A setzt 4 Punkte mit 40 Tools um, ein späterer Lauf mit demselben Slug braucht noch einmal
20 Tools. Gezählt werden (40 + 20) / 4 = 15 Tools je Punkt statt 10 – Lauf A wirkt durch die Nacharbeit
weniger effizient, und das ist gewollt.

### So prüfst du, ob eine Harness-Änderung gewirkt hat

1. In **Harness-Stände** die Zeile der Änderung suchen und die **Erwartete Wirkung** lesen.
2. In der **Übersicht** im selben Messverfahren die Zeile dieses Stands mit der Zeile davor vergleichen:
   Hat sich die Kennzahl aus der Hypothese in die erwartete Richtung bewegt? Steigt der Index?
3. Auf „(vorläufig)“ achten: Unter 3 Läufen kann ein einzelner ungewöhnlicher Lauf das Bild prägen.
4. Liegt dazwischen ein Messbruch, ist ein direkter Vergleich nicht möglich.

### Grenzen

- Die **Dauer** enthält Wartezeit auf Antworten des Nutzers; sie misst also nicht nur Claudes Tempo.
- Die **Punkte** sind unterschiedlich groß. Die Spalte Diff-Zeilen hilft einzuschätzen, ob ein Stand
  einfach größere Punkte bekommen hat.
- **Tokens gesamt** steigen mit der Länge eines Laufs überproportional, weil jede Antwort den bisherigen
  Verlauf erneut liest (Cache-Lesen).
- Bei wenigen Läufen ist der Index ein Hinweis, kein Beweis.
