# Feature Request: Eindeutige Karten-IDs beim Laden eines Decks und Mehrfachkarten per `count`

**Datum:** 2026-11-08  
**Priorität:** Hoch  
**Status:** done (2026-11-08 19:57)  
**Bezug:** `src/app/core/services/card-deck/deck-xml-loader.service.ts`,
`src/app/core/services/card-deck/card-move.util.ts`, `src/app/core/services/card-deck/deck-state.util.ts`
(`isSameCard`), `src/app/core/services/card-deck/card-normalize.util.ts`,
`src/app/features/game-session/xml/deck.xml-mapper.ts`, `public/decks/schaetze/schaetze.xml`

---

## Problem

- Innerhalb einer Deck-Instanz erkennt die App eine Karte nur an ihrer `id` (`CardRef = { deckId, cardId }`,
  `isSameCard`, `take()` in `card-move.util.ts`).
- Der Loader übernimmt die `id` aus der XML ungeprüft. Kommt eine `id` mehrfach vor, z. B. 5× `kleinerGoldnugget`
  im Deck „Schaetze“, gelten alle Exemplare als dieselbe Karte.
- Wird eine dieser Karten bewegt (in den Gürtel, auf die Hand, in einen Slot, auf Ablage oder Bank), entfernt
  `take()` **alle** Karten mit dieser `id` vom Herkunftsort. Am Ziel landet nur **eine**. Die übrigen Exemplare
  sind verloren, und der Nachziehstapel schrumpft um mehrere Karten.
- Mehrere gleiche Karten lassen sich heute nur anlegen, indem man den `<card>`-Block kopiert und jeder Kopie von
  Hand eine eigene `id` gibt.

---

## Ziel

- Jede Karte einer Deck-Instanz hat eine eindeutige `id`, egal wie die XML aussieht.
- Doppelte IDs in einer Deck-XML führen nicht mehr zu Kartenverlust.
- Gleiche Karten lassen sich in der XML einmal beschreiben und mit `count` vervielfachen.

---

## Anforderungen

1. **Doppelte IDs eindeutig machen ✅ done (2026-11-08 19:57):** `DeckXmlLoaderService.parseXml` vergibt eindeutige IDs. Das erste
   Vorkommen behält seine `id`, jedes weitere erhält die nächste freie Nummer als Suffix: `kleinerGoldnugget`,
   `kleinerGoldnugget-2`, `kleinerGoldnugget-3`, … „Frei“ heißt: Die ID ist in diesem Deck noch nicht vergeben,
   auch nicht durch eine Karte, die weiter unten in der XML steht. Die Regel liegt als reine Funktion in einer
   eigenen Util-Datei, damit Punkt 2 und 3 sie wiederverwenden.
2. **Warnung ✅ done (2026-11-08 19:57):** Gibt es doppelte IDs, schreibt der Loader eine `console.warn` mit Deck-ID und den betroffenen IDs.
   Das Laden bricht nicht ab.
3. **Mehrfachkarten per `count` ✅ done (2026-11-08 19:57):** Eine `<card>` darf das Attribut `count="n"` tragen (ganze Zahl ≥ 1). Der
   Loader erzeugt n Exemplare mit allen Feldern der Karte, die IDs nach der Regel aus Punkt 1 (`id`, `id-2`, …).
   Fehlt `count`, ist er ungültig oder kleiner als 1, gilt 1; ein ungültiger Wert erzeugt zusätzlich eine
   `console.warn`.
4. **Bestehende Spielstände ✅ done (2026-11-08 19:57):** Beim Laden eines Deck-Zustands (Spielstand-XML, gespeicherte Session über
   `withNormalizedCards`) werden doppelte IDs innerhalb einer Instanz nach derselben Regel eindeutig gemacht, und
   zwar in `config.cards` sowie in Nachziehstapel, Ablage und Bank. Karten in Hand, Slots, Inventar und Gürtel
   behalten ihre ID, weil Verweise darauf zeigen. Die Umbenennung in den Stapeln vermeidet IDs, die dort schon
   vergeben sind.
5. **Deck „Schaetze“ bereinigen ✅ done (2026-11-08 19:57):** `public/decks/schaetze/schaetze.xml` beschreibt jede Karte nur noch einmal und
   nutzt `count` (`kleinerGoldnugget` mit `count="5"`, `goblinsGold` mit `count="2"`). Der Kopfkommentar der
   Deck-XMLs erklärt `count`.

---

## Akzeptanzkriterien

- [x] Ein Deck mit 5× derselben `id` lädt 5 Karten mit 5 verschiedenen IDs; dabei erscheint eine Warnung.
- [x] Eine Karte daraus in den Gürtel legen verringert den Nachziehstapel um genau 1, und die Karte liegt im Gürtel.
      Dasselbe gilt für Hand, Slot, Ablage und Bank.
- [x] `count="3"` ergibt 3 gleiche Karten mit eindeutigen IDs; ein fehlendes, ungültiges oder zu kleines `count`
      ergibt 1 Karte.
- [x] Ein Suffix kollidiert nie mit einer ID, die bereits in der XML steht (z. B. `a`, `a`, `a-2` → drei
      verschiedene IDs).
- [x] Ein gespeicherter Stand mit doppelten IDs im Nachziehstapel lädt mit eindeutigen IDs. Danach verliert ein
      Verschieben keine Karten mehr.
- [x] Decks ohne doppelte IDs und ohne `count` laden unverändert (gleiche IDs, gleiche Reihenfolge).
- [x] Unit-Tests decken Loader, Eindeutigkeits-Util und Spielstand-Migration ab, inklusive der Grenzfälle oben.

---

## Offene Fragen

- Soll der Card Manager doppelte IDs zusätzlich sichtbar melden (z. B. per Snackbar), statt nur in der Konsole?
  Nicht umgesetzt; bei Bedarf als eigener Feature Request.
- Karten, die durch den Fehler bereits verloren gingen, stellt Punkt 4 nicht wieder her. Ob sie per „Deck
  zurücksetzen“ zurückkommen, hängt davon ab, wie `unassignedCards` aus `config.cards` rechnet; das wird bei der
  Umsetzung geprüft.
  **Ergebnis:** `resetDeck` rechnet aus Stapeln, Ablage, Bank und Hand (`unassignedCards`), nicht aus `config.cards`.
  Bereits verlorene Karten kommen per „Deck zurücksetzen“ also nicht zurück; dafür das Deck neu hinzufügen.
