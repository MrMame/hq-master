# CardManager — XML-Format

Deck-Dateien liegen unter `public/decks/` und werden per URL geladen.

---

## Basic-Deck (nur Bild + Text)

```xml
<deck name="Ereignisse" backImage="ereignisse-back.svg" type="basic">
  <card id="sturm" name="Sturm" image="ereignisse-sturm.svg">
    <description>Ein starker Sturm bricht über die Gruppe herein.</description>
  </card>
  <card id="nebel" name="Nebel" image="ereignisse-nebel.svg">
    <description>Dichter Nebel senkt sich in den Dungeon.</description>
  </card>
</deck>
```

Das `type`-Attribut am `<deck>`-Element ist bei Basic-Decks **optional** —
fehlt es, gilt `type="basic"` als Standard (Rückwärtskompatibilität).

---

## Combat-Deck (Bild + Text + Kampfwerte)

```xml
<deck name="Monster" backImage="monster-back.svg" type="combat">
  <card id="goblin" name="Goblin" image="goblin.svg">
    <description>Ein kleiner, gemeiner Goblin mit einem rostigen Messer.</description>
    <attack>3</attack>
    <defense>1</defense>
  </card>
  <card id="troll" name="Troll" image="troll.svg">
    <description>Ein massiver Felsentroll. Langsam, aber brutal.</description>
    <attack>7</attack>
    <defense>5</defense>
  </card>
</deck>
```

---

## Feld-Referenz

### `<deck>`-Attribute

| Attribut    | Pflicht | Typ                     | Beschreibung                          |
|-------------|---------|-------------------------|---------------------------------------|
| `name`      | ja      | string                  | Anzeigename des Decks                 |
| `backImage` | ja      | string (Dateiname/Pfad) | Rückseiten-Bild aller Karten          |
| `type`      | nein    | `basic` \| `combat`     | Standard-Kartentyp; Standard: `basic` |
| `id`        | nein    | string                  | Deck-ID; wird sonst per UUID generiert |

### `<card>`-Attribute

| Attribut | Pflicht | Typ                 | Beschreibung                                              |
|----------|---------|---------------------|-----------------------------------------------------------|
| `id`     | ja      | string              | Eindeutige ID innerhalb des Decks                         |
| `name`   | ja      | string              | Anzeigename der Karte                                     |
| `image`  | ja      | string (Dateiname)  | Vorderseitenbild der Karte                                |
| `type`   | nein    | `basic` \| `combat` | Überschreibt den Deck-Standard für diese einzelne Karte   |

### Kind-Elemente von `<card>`

| Element         | Pflicht | Typ    | Beschreibung                         |
|-----------------|---------|--------|--------------------------------------|
| `<description>` | nein    | string | Beschreibungstext (Zeilenumbrüche ok) |
| `<attack>`      | combat  | number | Angriffswert; Pflicht bei `type="combat"` |
| `<defense>`     | combat  | number | Verteidigungswert; Pflicht bei `type="combat"` |
