# deck-xml-loader.ts

**Pfad:** `src/app/features/card-deck/services/deck-xml-loader.ts`

## Beschreibung

Angular-Service zum Laden und Parsen von Kartendeck-XML-Dateien. Wandelt XML-Rohdaten in ein `DeckConfig`-Objekt um.

## Klasse: `DeckXmlLoaderService`

`@Injectable({ providedIn: 'root' })`

### Öffentliche Methoden

#### `loadFromUrl(url: string): Promise<DeckConfig>`

Lädt eine XML-Datei per HTTP-Fetch von der angegebenen URL und gibt das geparste `DeckConfig`-Objekt zurück.

| Parameter | Typ      | Beschreibung                             |
|-----------|----------|------------------------------------------|
| `url`     | `string` | Relative oder absolute URL zur XML-Datei.|

Wirft einen Fehler, wenn der HTTP-Request fehlschlägt (`!response.ok`).

---

#### `parseXml(xmlText: string): DeckConfig`

Parst einen XML-String direkt zu einem `DeckConfig`-Objekt. Wird intern von `loadFromUrl` genutzt, ist aber auch für synchrones Parsen (z. B. aus `FileReader`) öffentlich zugänglich.

| Parameter | Typ      | Beschreibung          |
|-----------|----------|-----------------------|
| `xmlText` | `string` | XML-Inhalt als String.|

**Verarbeitungsschritte:**
1. Parst den XML-String mit dem nativen `DOMParser`.
2. Prüft auf ein `<parsererror>`-Element; wirft bei ungültigem XML einen Fehler.
3. Liest das `<deck>`-Element und entnimmt `name` und `backImage`.
4. Iteriert alle `<card>`-Elemente und mappt sie auf `Card`-Objekte (`id`, `name`, `image`, `<description>`-Text).

## XML-Format

```xml
<deck name="Deckname" backImage="rueckseite.svg">
  <card id="c1" name="Kartenname" image="bild.svg">
    <description>Beschreibungstext</description>
  </card>
</deck>
```

Alle Deck-Dateien liegen flach im Verzeichnis `public/decks/`. Bilder werden relativ zu `/decks/` referenziert.

## Verwandte Typen

- [`DeckConfig`](../models/deck-config.model.md)
- [`Card`](../models/card.model.md)
