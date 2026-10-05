# card-focus-view.ts

**Pfad:** `src/app/features/card-deck/components/card-focus-view/card-focus-view.ts`

## Beschreibung

Modal-Overlay, das eine einzelne Karte in Großansicht darstellt. Belegt den gesamten Viewport mit einem halbtransparenten Hintergrund.

## Komponente: `CardFocusView`

`selector: app-card-focus-view` | Standalone | Inline-Template

### Inputs (Signal-Inputs)

| Input           | Typ      | Pflicht | Beschreibung                                      |
|-----------------|----------|---------|---------------------------------------------------|
| `card`          | `Card`   | ✓       | Darzustellende Karte.                             |
| `backImagePath` | `string` | ✓       | Rückseitenbild-Pfad (wird für Layout reserviert). |

### Outputs

| Output   | Typ            | Beschreibung                                          |
|----------|----------------|-------------------------------------------------------|
| `closed` | `EventEmitter<void>` | Wird ausgelöst, wenn der Nutzer das Modal schließt. |

### Interaktion

- Klick oder Doppelklick auf den Overlay-Hintergrund schließt das Modal.
- Klick oder Doppelklick auf den Modal-Inhalt stoppt die Event-Propagation (verhindert versehentliches Schließen).
- Schließen-Button (✕) oben rechts im Bild-Bereich.

### Layout

- Vollbild-Overlay (`fixed inset-0 z-50`) mit `bg-black/85 backdrop-blur-sm`
- Modal-Container: 90 vh × 90 vw
- Obere Zone (33%): Kartenbild als `object-contain`
- Untere Zone: Kartenname (h2, fett) und Beschreibungstext

## Verwandte Typen

- [`Card`](../../models/card.model.md)
