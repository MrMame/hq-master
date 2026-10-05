# card-deck-state.model.ts

**Pfad:** `src/app/features/card-deck/models/card-deck-state.model.ts`

## Beschreibung

Enthält den Typ für einen einzelnen Sammelablage-Slot sowie die Konstante für die Slot-Anzahl.

## Typ: `StagingSlot`

```ts
type StagingSlot = Card | null;
```

Ein Slot in der Sammelablage ist entweder mit einer `Card` belegt oder leer (`null`).

## Konstante: `STAGING_SLOT_COUNT`

```ts
const STAGING_SLOT_COUNT: number = 10;
```

Legt fest, wie viele Slots die Sammelablage hat. Wird in `CardDeckService` und `StagingArea` verwendet, um das Slot-Array zu initialisieren.

## Verwandte Typen

- [`Card`](./card.model.md)
