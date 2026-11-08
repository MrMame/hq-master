# Feature Request: Aktionsmenü im Card Viewer startet zugeklappt, klappbare und getrennte Bereiche im Card Manager

**Datum:** 2026-11-08  
**Priorität:** Mittel  
**Status:** done (2026-11-08 20:30)  
**Bezug:** `REQUIREMENTS.md` (Abschnitt 5 „Card Manager“, Absätze zum Card Viewer, „Hand des Dungeon Masters“,
„Ausgerüstet“, „Inventar“, „Gürtel“; Abschnitt 0 zu den Gruppen der Seitenleiste),
`src/app/shared/services/card-viewer-menu-state.service.ts`,
`src/app/shared/components/card-viewer-panel/`,
`src/app/features/card-manager/components/card-manager-page/`,
`src/app/shared/components/sidebar-section/`, `src/app/shared/components/sidebar-section-toggle-all/`,
`src/app/shared/services/sidebar-section-state.service.ts`,
setzt `docs/feature-requests/done/sidebar-collapsible-sections.md` voraus

---

## Problem

- **Card Viewer:** Ob das Menü „Aktionen“ auf- oder zugeklappt ist, merkt sich der Browser für alle Einsatzorte
  (`CardViewerMenuStateService`, Schlüssel `card_viewer_menu_open`). Wer einmal eine Aktion ausgeführt hat, sieht
  das Menü danach bei jeder Karte offen über der Karte. Meistens will der DM die Karte aber nur ansehen.
- **Card Manager, Hauptbereich:** Die fünf Bereiche „Hand des Dungeon Masters“, „Ausgerüstet“, „Inventar“,
  „Gürtel“ und „Spieltisch“ stehen ohne sichtbare Trennung untereinander. Nur eine kleine graue Überschrift
  (`.section-heading`) zeigt, wo ein Bereich beginnt. Mit vielen Karten muss der DM weit scrollen, um zum
  Spieltisch zu kommen. Einzelne Bereiche lassen sich nicht ausblenden.

---

## Ziel

- Der Card Viewer öffnet immer mit zugeklapptem Aktionsmenü.
- Die fünf Bereiche im Hauptbereich des Card Managers sind deutlich voneinander getrennt. Jeder lässt sich über
  seine Überschrift auf- und zuklappen, ein Button klappt alle auf einmal. Das Verhalten entspricht den Gruppen
  der linken Seitenleiste.
- Eine neue Gruppe „Bereiche“ in der linken Seitenleiste springt per Klick direkt zu einem Bereich.

```
┌ Seitenleiste ───────────┐  ┌ Hauptbereich ──────────────────────────────┐
│ Card Manager       [⊟]  │  │                                     [⊟]    │
│ ▾ Bereiche              │  │ ┌────────────────────────────────────────┐ │
│    Hand (3)             │  │ │ ▾ HAND DES DUNGEON MASTERS (3)         │ │
│    Ausgerüstet (2)      │  │ │   [Karte] [Karte] [Karte]              │ │
│    Inventar (–)         │  │ └────────────────────────────────────────┘ │
│    Gürtel (1)           │  │ ┌────────────────────────────────────────┐ │
│    Spieltisch (2)       │  │ │ ▸ AUSGERÜSTET (2)                      │ │
│ ▾ Deck Management       │  │ └────────────────────────────────────────┘ │
│    …                    │  │ ┌────────────────────────────────────────┐ │
│ ▾ Decks (2)             │  │ │ ▾ GÜRTEL (1)                           │ │
│    …                    │  │ │   …                                    │ │
└─────────────────────────┘  │ └────────────────────────────────────────┘ │
                             │ ┌────────────────────────────────────────┐ │
                             │ │ ▾ SPIELTISCH (2)                       │ │
                             │ │   Deck-Reihen …                        │ │
                             │ └────────────────────────────────────────┘ │
                             └────────────────────────────────────────────┘
```

---

## Anforderungen

### 1. Aktionsmenü im Card Viewer startet zugeklappt ✅ done (2026-11-08 20:30)

- Jedes Öffnen des Card Viewers, egal aus welchem Feature (Card Manager, Dungeon Tracker, Charakter-Editor),
  zeigt das Menü „Aktionen“ zugeklappt.
- Solange der Viewer offen ist, bleibt das bisherige Verhalten: „Aktionen“ klappt das Menü auf und zu, nach einer
  Aktion bleibt es offen, beim Blättern (‹ ›) und „Umdrehen“ ändert sich sein Zustand nicht.
- Der Zustand wird nicht mehr im Browser gespeichert. Er gehört zum geöffneten Viewer, nicht zu einem Dienst mit
  `providedIn: 'root'`: Entweder ein lokales Signal in `CardViewerPanel` oder ein Dienst, der in der Komponente
  bereitgestellt wird. `CardViewerMenuStateService` entfällt, wenn er nicht mehr gebraucht wird.
- Der Schlüssel `card_viewer_menu_open` wird aus `TOOL_STATE_KEYS` entfernt. Ein noch vorhandener Wert im
  `localStorage` wird ignoriert (Aufräumen nicht nötig).

**Erwartetes Verhalten:** Der DM öffnet eine Karte, klappt „Aktionen“ auf und legt die Karte in die Hand. Das Menü
bleibt offen. Er schließt den Viewer und öffnet eine andere Karte: Das Menü ist zugeklappt, auch nach dem
Neuladen.

---

### 2. Klappbare Bereiche im Hauptbereich des Card Managers ✅ done (2026-11-08 20:30)

- Betroffen sind alle fünf Bereiche: „Hand des Dungeon Masters“, „Ausgerüstet“, „Inventar“, „Gürtel“ und
  „Spieltisch“.
- Die Überschrift jedes Bereichs ist ein Button über die ganze Breite mit Pfeil (▸ zu / ▾ offen),
  `aria-expanded` und `aria-controls`, wie bei `SidebarSection`. Klick, Enter und Leertaste klappen den Bereich
  um. Hinter dem Titel steht die Anzahl, z. B. „Gürtel (3)“; beim Spieltisch die Anzahl der Decks.
- Zugeklappt ist nur noch die Überschrift zu sehen. Der Inhalt bleibt im DOM und behält seinen Zustand, z. B. die
  aufgeklappte Deck-Reihe und die Scroll-Position im Bereich.
- Welche Bereiche zugeklappt sind, bleibt wie bei der Seitenleiste im Browser erhalten
  (`SidebarSectionStateService`). Der Zustand gehört nicht zur Spielesession. Ohne gespeicherten Zustand sind alle
  Bereiche aufgeklappt.
- Bereiche ohne Inhalt bleiben wie bisher ganz ausgeblendet: Hand, Ausgerüstet, Inventar und Gürtel ohne Karten.
  Der Spieltisch ist immer sichtbar.
- Die Abschnitts-IDs bekommen einen eigenen Bereich, z. B. `card-manager-table.hand`, `card-manager-table.equipped`,
  `card-manager-table.inventory`, `card-manager-table.belt`, `card-manager-table.decks`. So wirkt „alle
  auf-/zuklappen“ der Seitenleiste (`card-manager`) nicht auf den Hauptbereich und umgekehrt.
- Umsetzung: Die Klapplogik von `SidebarSection` wiederverwenden statt neu bauen, z. B. eine Variante für den
  Hauptbereich oder eine gemeinsame Basis. Ein Bereich, dessen Kindkomponente sich selbst ausblendet (Hand,
  Ausgerüstet, Inventar, Gürtel), darf keine leere Hülle mit Überschrift hinterlassen.

**Erwartetes Verhalten:** Der DM klappt „Ausgerüstet“ und „Inventar“ zu. Der Spieltisch rückt nach oben. Nach dem
Neuladen sind beide Bereiche weiterhin zugeklappt, die anderen offen.

---

### 3. Bereiche optisch trennen ✅ done (2026-11-08 20:30)

- Jeder Bereich steht in einer eigenen Fläche: etwas hellerer Hintergrund als die Seite, dezenter Rahmen,
  abgerundete Ecken und Innenabstand. Zwischen den Flächen liegt ein deutlicher Abstand. Farben und Abstände
  kommen aus den vorhandenen Design-Tokens, wie bei den Flächen anderer Features.
- Die Überschrift wird gegenüber der heutigen `.section-heading` hervorgehoben (größer bzw. heller) und bildet die
  Kopfzeile der Fläche. Hover in `--color-yellow-400` wie bei den Gruppen der Seitenleiste.
- Zugeklappt ist die Fläche nur so hoch wie ihre Kopfzeile.
- Die bisherigen Höhenbegrenzungen bleiben: Hand, „Ausgerüstet“ und „Inventar“ zeigen höchstens zwei
  Kartenreihen, weitere scrollen in sich.

**Erwartetes Verhalten:** Auf einen Blick ist erkennbar, wo die Hand endet und der Gürtel bzw. der Spieltisch
beginnt, auch wenn die Bereiche voller Karten sind.

---

### 4. „Alle auf-/zuklappen“ im Hauptbereich ✅ done (2026-11-08 20:30)

- Oben rechts im Hauptbereich steht ein Button wie `SidebarSectionToggleAll` mit dem Bereich `card-manager-table`.
  Er klappt alle angezeigten Bereiche des Hauptbereichs zu bzw. alle auf. Symbol, Tooltip und `aria-label` wie in
  der Seitenleiste.
- Die Bereiche der Seitenleiste bleiben davon unberührt, und umgekehrt.

**Erwartetes Verhalten:** Ein Klick klappt alle fünf Bereiche zu. Nur die Kopfzeilen stehen untereinander. Ein
weiterer Klick klappt alle wieder auf.

---

### 5. Gruppe „Bereiche“ in der Seitenleiste: Sprung zum Bereich ✅ done (2026-11-08 20:30)

- In der Seitenleiste des Card Managers steht als erste Gruppe „Bereiche“ (eine `SidebarSection` mit
  `sectionId` `card-manager.areas`, also auf- und zuklappbar und Teil von „alle auf-/zuklappen“ der Seitenleiste).
- Sie enthält je einen Eintrag (Button) für „Hand“, „Ausgerüstet“, „Inventar“, „Gürtel“ und „Spieltisch“, in
  derselben Reihenfolge wie im Hauptbereich, jeweils mit Anzahl wie in der Überschrift des Bereichs.
- Ein Klick auf einen Eintrag:
  - klappt den Bereich im Hauptbereich auf, falls er zugeklappt ist, und alle anderen Bereiche des Hauptbereichs
    zu (das wird gespeichert wie Klicks auf die Überschriften; die Gruppen der Seitenleiste bleiben unverändert;
    Änderung auf Wunsch des Nutzers, 2026-11-08),
  - scrollt den Hauptbereich so, dass die Kopfzeile des Bereichs oben sichtbar ist (sanftes Scrollen; bei
    `prefers-reduced-motion` ohne Animation),
  - setzt den Fokus auf die Überschrift des Bereichs.
- Ein Klick auf einen Decknamen in der Gruppe „Decks“ klappt ebenso nur den Spieltisch auf (alle anderen Bereiche
  des Hauptbereichs zu) und öffnet wie bisher die Reihe des Decks (Änderung auf Wunsch des Nutzers, 2026-11-08).
- Ist ein Bereich gerade ausgeblendet, weil er leer ist, ist sein Eintrag ausgegraut und deaktiviert. Ein Tooltip
  nennt den Grund, z. B. „Keine Karten in der Hand“, „Keine Karten im Gürtel“.
- Die Navigation ändert nichts an Karten, Stapeln oder der Spielesession und schreibt keinen Log-Eintrag.

**Erwartetes Verhalten:** Hand, Ausgerüstet und Inventar sind voll, der Gürtel ist zugeklappt. Der DM klickt
links auf „Gürtel“. Der Gürtel klappt auf, der Hauptbereich scrollt zu ihm, und die Überschrift „Gürtel“ hat den
Fokus.

---

### 6. Dokumentation ✅ done (2026-11-08 20:30)

- `REQUIREMENTS.md` Abschnitt 5 anpassen:
  - Card Viewer: „Ob es auf- oder zugeklappt ist, merkt sich der Browser …; ohne gespeicherten Zustand ist es
    zugeklappt …“ ersetzen durch: Das Menü ist bei jedem Öffnen des Viewers zugeklappt und bleibt, solange der
    Viewer offen ist, wie zuletzt eingestellt (auch nach Aktionen und beim Blättern).
  - Hauptbereich: getrennte Flächen, Auf-/Zuklappen je Bereich und gesamt, gespeicherter Zustand außerhalb der
    Spielesession, Gruppe „Bereiche“ in der Seitenleiste mit Sprung zum Bereich.

---

## Akzeptanzkriterien

- [x] Der Card Viewer öffnet in allen Features immer mit zugeklapptem Aktionsmenü, auch wenn es beim letzten
      Öffnen offen war und auch nach dem Neuladen.
- [x] Bei offenem Viewer bleibt das Menü nach einer Aktion, beim Blättern und beim Umdrehen in seinem Zustand.
- [x] `card_viewer_menu_open` wird weder gelesen noch geschrieben.
- [x] Hand, Ausgerüstet, Inventar, Gürtel und Spieltisch lassen sich einzeln über ihre Überschrift (Klick,
      Enter, Leertaste) auf- und zuklappen. `aria-expanded` stimmt, die Anzahl steht in der Überschrift.
- [x] Der Klappzustand bleibt nach dem Neuladen erhalten, ist ohne gespeicherten Wert offen und gehört nicht zur
      Spielesession bzw. zum XML-Spielstand.
- [x] Leere Bereiche bleiben ganz ausgeblendet, ohne leere Kopfzeile; der Spieltisch ist immer sichtbar.
- [x] Die Bereiche stehen in klar getrennten Flächen; zugeklappt ist nur die Kopfzeile sichtbar.
- [x] Der Button „alle auf-/zuklappen“ im Hauptbereich wirkt nur auf die Bereiche des Hauptbereichs, der in der
      Seitenleiste nur auf die Gruppen der Seitenleiste.
- [x] Ein Klick auf einen Eintrag der Gruppe „Bereiche“ klappt den Bereich auf und alle anderen des Hauptbereichs zu, scrollt zu ihm und fokussiert
      seine Überschrift. Einträge leerer Bereiche sind deaktiviert und haben einen Tooltip.
- [x] Specs prüfen das Verhalten über DOM bzw. Harnesses (Klick auf Überschrift, Toggle-all, Navigationseintrag,
      Persistenz, Viewer neu öffnen). Eine Playwright-Probe prüft Sprung und Scrollen im echten Browser.
- [x] Keine Code-Datei überschreitet 150 Zeilen. `REQUIREMENTS.md` ist aktualisiert.
