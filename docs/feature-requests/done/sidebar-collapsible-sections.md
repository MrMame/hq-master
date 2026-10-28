# Feature Request: Aufklappbare Gruppen in der Seitenleiste, Suche und „Zuletzt verwendet“ in der Bibliothek

**Datum:** 2026-10-28  
**Priorität:** Mittel  
**Status:** done (2026-10-28 17:30)  
**Bezug:** `REQUIREMENTS.md` (Dungeon Builder: „Die Bibliothek in der linken Seitenleiste kommt aus einer
Katalog-Datei …“), `src/app/shared/components/collapsible-sidebar/collapsible-sidebar.ts`

---

## Problem

- Die gemeinsame Seitenleiste (`CollapsibleSidebar`) lässt sich nur als Ganzes ein- und ausklappen. Die Gruppen
  darin (im Builder z. B. Layout, Boden, Türen, Möbel-Kategorien) stehen immer vollständig untereinander.
- Jedes Feature baut seine Gruppen selbst aus `<h3 class="general-sidebar__heading">` und Inhalt. Es gibt kein
  gemeinsames Verhalten.
- Der Element-Katalog des Builders (`public/dungeon-builder/catalog.xml`) soll laufend um eigene Teile erweitert
  werden. Mit jedem Teil wird die Bibliothek länger, und der DM muss immer weiter scrollen, um ein Teil zu finden.

---

## Ziel

Umsetzung in zwei Stufen:

- **Stufe 1 (Punkte 1–4):** Jede Gruppe in der Seitenleiste aller Features lässt sich über ihre Überschrift auf-
  und zuklappen. Der Zustand bleibt nach dem Neuladen erhalten. Ein Button klappt alle Gruppen eines Features auf
  einmal auf oder zu.
- **Stufe 2 (Punkte 5–6):** Die Bibliothek des Builders bekommt ein Suchfeld über alle Gruppen und eine Gruppe
  „Zuletzt verwendet“ mit den zuletzt platzierten Teilen.

```
Dungeon Builder                    [⊟]   ← alle zuklappen / [⊞] alle aufklappen
▸ Datei
▾ Layout
    Breite / Höhe …
──────────────────────────────
[🔍 Element suchen …        ×]
▾ Zuletzt verwendet (4)
    [Tisch] [Tür] [Truhe] [Treppe]
▸ Boden (5)
▸ Türen (3)
▾ Grundmöbel (12)
    [Tisch] [Bett] [Schrank] …
▸ Hindernisse (8)
```

---

## Anforderungen

### 1. Gemeinsame Komponente `SidebarSection` ✅ done (2026-10-28 17:30)

- Neue Shared-Komponente: `ng g c shared/components/sidebar-section` → `SidebarSection`.
- Eingaben: `title` (Text), `sectionId` (stabiler Schlüssel, z. B. `dungeon-builder.layout`), optional `count`
  (Anzahl der Einträge, wird als „Möbel (12)“ angezeigt).
- Die Überschrift ist ein Button über die ganze Breite mit Pfeil (▸ zu / ▾ offen), `aria-expanded` und
  `aria-controls` auf den Inhalt (eindeutige ID je Instanz wie in `CollapsibleSidebar`).
- Optik wie die bisherige `general-sidebar__heading`. Hover in `--color-yellow-400` wie der Griff der
  Seitenleiste.
- Zugeklappt bleibt der Inhalt im DOM und behält seinen Zustand (wie bei `CollapsibleSidebar`), wird aber
  ausgeblendet.
- Neue Abschnitte sind standardmäßig aufgeklappt.

**Erwartetes Verhalten:** Ein Klick (oder Enter/Leertaste) auf die Überschrift klappt die Gruppe zu, ein weiterer
klappt sie wieder auf.

---

### 2. Zustand speichern ✅ done (2026-10-28 17:30)

- Der Zustand wird über einen Service gespeichert, z. B. `ng g s shared/services/sidebar-section-state` →
  `SidebarSectionStateService`, mit `persistedState` und neuem Key in `TOOL_STATE_KEYS`
  (z. B. `sidebarSections: 'sidebar_sections'`).
- Gespeichert wird nur die Liste der zugeklappten `sectionId`s. Unbekannte oder fehlende IDs gelten als
  aufgeklappt. So bleiben neue Katalog-Kategorien sichtbar, und gelöschte hinterlassen keine Fehler.
- Der Zustand gehört nicht zur Spielesession: Er steht nicht in der SaveSession, und eine neue Session setzt ihn
  nicht zurück.
- Katalog-Kategorien haben keine `id`. Ihre `sectionId` wird aus dem Namen gebildet
  (z. B. `dungeon-builder.library.Grundmöbel`). Benennt der DM eine Kategorie um, ist sie wieder aufgeklappt. Das
  ist in Ordnung.

---

### 3. Alle auf- und zuklappen ✅ done (2026-10-28 17:30)

- Neben dem Titel der Seitenleiste (`general-sidebar__title`) steht ein kleiner Button, der alle Abschnitte des
  Features zuklappt. Sind alle zu, klappt er alle auf (`aria-label` „Alle Gruppen einklappen“ /
  „Alle Gruppen ausklappen“).
- Zugeordnet wird über das Präfix der `sectionId` (z. B. `dungeon-builder.`), damit sich die Features nicht
  gegenseitig beeinflussen.
- Umsetzung z. B. als eigene kleine Shared-Komponente `SidebarSectionToggleAll` (Eingabe: Präfix) oder als
  optionale Eingabe an `CollapsibleSidebar`.

---

### 4. Einsatz in allen Features ✅ done (2026-10-28 17:30)

- **Dungeon Builder:** Datei, Layout, Boden, Türen und jede Katalog-Kategorie werden zu `SidebarSection`s. Boden,
  Türen und die Kategorien zeigen ihre Anzahl.
- **Dungeon Tracker:** Charaktere (mit Anzahl, ersetzt das heutige „Charaktere (n)“), Spielbrett-Foto laden,
  Raster-Einstellungen.
- **Card Manager:** Deck Aktionen.
- Die `<hr class="general-sidebar__divider" />` zwischen den Gruppen werden überflüssig, wenn die Abschnitte
  selbst voneinander abgesetzt sind. Ob sie bleiben, wird bei der Umsetzung optisch entschieden.

**Erwartetes Verhalten:** In jedem Feature lassen sich die Gruppen gleich bedienen. Klappt der DM im Builder
„Hindernisse“ zu und lädt die Seite neu, ist „Hindernisse“ weiterhin zu.

---

### 5. Suche in der Bibliothek (Builder) ✅ done (2026-10-28 17:30)

- Oben in der Bibliothek steht ein Suchfeld (`type="search"`, `aria-label` „Element suchen“).
- Gesucht wird ohne Rücksicht auf Groß- und Kleinschreibung im Namen der Einträge aller Gruppen (Boden inkl. „Fels“,
  Türen, Möbel-Kategorien), schon während der Eingabe.
- Solange ein Suchbegriff gesetzt ist:
  - Gruppen mit Treffern sind aufgeklappt, ohne den gespeicherten Zustand zu überschreiben.
  - Gruppen ohne Treffer sind ausgeblendet.
  - Die Anzahl in der Überschrift zeigt die Treffer.
  - Ohne Treffer erscheint „Keine Elemente gefunden“.
- Ein ×-Button und die Escape-Taste leeren das Feld. Danach gilt wieder der gespeicherte Zustand.
- Der Suchbegriff ist reiner UI-Zustand und wird nicht gespeichert.
- Treffer lassen sich wie gewohnt ziehen oder als Stempel wählen.

---

### 6. Gruppe „Zuletzt verwendet“ (Builder) ✅ done (2026-10-28 17:30)

- Ganz oben in der Bibliothek steht die Gruppe „Zuletzt verwendet“ mit den letzten 8 verschiedenen Türen und
  Möbelstücken, das neueste zuerst. Bodenarten zählen nicht dazu.
- Ein Teil wird eingetragen, wenn der DM es als Stempel wählt oder per Drag & Drop erfolgreich auf dem Plan
  ablegt. Ein schon enthaltenes Teil rückt nach vorn statt doppelt zu erscheinen.
- Die Liste wird mit einem eigenen Key in `TOOL_STATE_KEYS` gespeichert (z. B.
  `dungeonBuilderRecent: 'dungeon_builder_recent'`, Wert: Liste von Katalog-IDs).
- IDs, die im aktuellen Katalog nicht mehr vorkommen, werden ignoriert.
- Die Gruppe ist ausgeblendet, solange sie leer ist oder ein Suchbegriff gesetzt ist.
- Sie ist eine normale `SidebarSection` (`dungeon-builder.library.recent`) und lässt sich auf- und zuklappen.
- Die Einträge verhalten sich wie die übrigen: ziehen oder Stempel per Tipp, aktiver Stempel hervorgehoben.

---

### 7. Aufteilung ✅ done (2026-10-28 17:30)

- `ElementLibrary` darf nicht über 150 Zeilen je Datei wachsen. Die Darstellung einer Gruppe mit ihren Einträgen
  kommt z. B. in `ng g c features/dungeon-builder/components/library-group` → `LibraryGroupSection`. Die Bodengruppe
  bleibt eigenständig, weil sie Bodenarten wählt statt Stempel.
- Die Filterlogik ist eine reine Funktion, z. B. `utils/library-search.util.ts`
  (`filterGroups(groups, term): LibraryGroup[]`).
- Die Liste „Zuletzt verwendet“ führt ein eigener Service, z. B.
  `ng g s features/dungeon-builder/services/recent-elements` → `RecentElementsService` (`record(catalogId)`,
  `recentIds`). Eingetragen wird beim Stempel (`BuilderUiService.toggleStamp`) und nach erfolgreichem
  `placeElement` in der Builder-Seite.

---

### 8. Tests ✅ done (2026-10-28 17:30)

- `sidebar-section.spec.ts` über DOM: Titel und Anzahl werden angezeigt; Klick klappt zu und auf;
  `aria-expanded` stimmt; der Inhalt bleibt im DOM; neue Abschnitte sind offen.
- `sidebar-section-state.service.spec.ts`: Zustand wird gespeichert und beim Start gelesen; unbekannte IDs sind
  offen; kaputter Storage-Eintrag führt zum Standard; „alle“ wirkt nur auf das eigene Präfix.
- Toggle-All über DOM: klappt alle Abschnitte des Features zu und wieder auf; Beschriftung wechselt.
- `library-search.util.spec.ts`: Groß-/Kleinschreibung, Treffer in mehreren Gruppen, leere Gruppen fallen weg,
  leerer Suchbegriff liefert alle Gruppen.
- `element-library.spec.ts`: Eingabe filtert und klappt Treffergruppen auf, ohne den gespeicherten Zustand zu
  ändern; „Keine Elemente gefunden“; × und Escape leeren das Feld.
- `recent-elements.service.spec.ts`: Reihenfolge, keine Doppelten, höchstens 8, Persistenz, unbekannte IDs werden
  ignoriert.
- Builder-Seite: Stempel wählen und Ablegen per Drag & Drop tragen in „Zuletzt verwendet“ ein; die Gruppe ist leer
  bzw. während der Suche ausgeblendet.
- Tracker- und Card-Manager-Specs: Abschnitte sind vorhanden und klappbar.
- Playwright-Probe unter `e2e/probe/`: im Builder eine Gruppe zuklappen, neu laden, sie bleibt zu; Suche findet
  ein Teil, das per Drag & Drop auf den Plan geht und danach unter „Zuletzt verwendet“ erscheint.
- Coverage-Report für neue und geänderte Dateien prüfen.

---

### 9. Dokumentation ✅ done (2026-10-28 17:30)

- `REQUIREMENTS.md`: allgemein ergänzen, dass sich die Gruppen der linken Seitenleiste in allen Features einzeln
  und gemeinsam auf- und zuklappen lassen und der Zustand erhalten bleibt. Beim Dungeon Builder ergänzen, dass die
  Bibliothek eine Suche und eine Gruppe „Zuletzt verwendet“ hat.
- `.claude/rules/architecture.md`: `SidebarSection` (und ggf. `SidebarSectionToggleAll`) unter
  `shared/components/`, `SidebarSectionStateService` unter `shared/services/`, neue Keys in `TOOL_STATE_KEYS`,
  `LibraryGroupSection`, `RecentElementsService` und `library-search.util.ts` im Dungeon Builder.

---

## Hinweise

- **Entscheidung (2026-10-28):** Variante „Akkordeon + Suche + Zuletzt verwendet“ gewählt. Verworfen wurden
  reines Akkordeon (hilft bei langen Gruppen zu wenig) und eine Icon-Leiste mit Reitern (größter Umbau, wird mit
  wachsender Kategorienzahl selbst voll).
- Stufe 1 und Stufe 2 lassen sich getrennt umsetzen (`/implement-feature sidebar-collapsible-sections 1` usw.).
- Nicht Teil dieses Requests: Favoriten per Stern, eine kompakte reine Icon-Ansicht der Bibliothek und
  verschachtelte Kategorien (z. B. Möbel > Tische). `SidebarSection` sollte so gebaut sein, dass Verschachteln
  später möglich ist.

- **Umsetzung (2026-10-28):**
  - **Entscheidungen auf Rückfrage:** Während einer Suche sind Treffergruppen offen und ihr Kopf-Button ist
    deaktiviert, damit ein Klick nicht unsichtbar den gespeicherten Zustand ändert. Einträge unter „Zuletzt
    verwendet“ heißen barrierefrei z. B. „Tisch (3 × 2) – zuletzt verwendet“, damit es keine zwei gleichnamigen
    Buttons gibt; sichtbar bleibt „Tisch“. Eingetragen wird beim Loslassen über dem Plan, weil `placeElement`
    keinen Erfolg meldet. Der Builder hat die neue Überschrift „Datei“; „Deck Aktionen“ ist jetzt die Überschrift
    des Abschnitts im Card Manager.
  - **Alle auf-/zuklappen:** eigene Komponente `SidebarSectionToggleAll` in der neuen Kopfzeile
    `.general-sidebar__header`. Angezeigte Abschnitte melden sich beim `SidebarSectionStateService` an
    (nicht gespeichert); daran erkennt der Button, ob alle zu sind.
  - **Bibliothek:** Auch die Bodengruppe nutzt `LibraryGroupSection` (nicht ziehbar, `draggable=false`); „Fels“
    hat die ID `ROCK_ID` (`''`). `LibraryGroup` hat ein Feld `key`, die Abschnitts-ID ist
    `dungeon-builder.library.<key>` (`floor`, `doors`, `recent` bzw. Kategoriename).
  - **Gespeicherte ID-Listen** prüft der neue `STRING_LIST_CODEC` (`core/session-state/`); ein kaputter Eintrag
    fällt auf den Startwert zurück.
  - **In der Probe gefunden:** Der per CSS `::before` gezeichnete Pfeil gehörte zum barrierefreien Namen
    („▸ Grundmöbel“). Er sitzt jetzt in einem eigenen `aria-hidden`-Element.

---

## Akzeptanzkriterien

- [x] In Dungeon Builder, Dungeon Tracker und Card Manager lässt sich jede Gruppe der Seitenleiste über ihre
      Überschrift per Maus, Touch und Tastatur auf- und zuklappen
- [x] Der Zustand bleibt nach dem Neuladen erhalten, gehört nicht zur Spielesession, und neue Katalog-Kategorien
      sind standardmäßig offen
- [x] Ein Button je Feature klappt alle Gruppen auf einmal auf bzw. zu, ohne andere Features zu beeinflussen
- [x] Die Suche in der Bibliothek filtert über alle Gruppen, blendet leere Gruppen aus und lässt sich per × und
      Escape leeren
- [x] „Zuletzt verwendet“ zeigt die letzten 8 platzierten bzw. als Stempel gewählten Türen und Möbel, bleibt nach
      dem Neuladen erhalten und lässt sich wie die übrigen Einträge ziehen und stempeln
- [x] Jede Datei hat höchstens 150 Zeilen; `REQUIREMENTS.md` und `architecture.md` sind angepasst
- [x] `npm run lint`, `npm run test -- --watch=false --coverage` (Schwellen eingehalten) und `npm run build`
      laufen grün
