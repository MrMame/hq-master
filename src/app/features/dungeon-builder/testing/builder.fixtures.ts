import { DungeonLayout, NEW_LAYOUT } from '../models/dungeon-layout.model';
import { CatalogPiece, ElementCatalog } from '../models/element-catalog.model';
import { rectangleCells } from '../utils/piece-shape.util';

function rectanglePiece(id: string, name: string, width: number, height: number): CatalogPiece {
  return { id, name, image: `img/${id}.svg`, width, height, cells: rectangleCells(width, height) };
}

/** Kleiner Katalog für Specs: Tisch 3 × 2, Truhe 1 × 1, Schutt in L-Form, eine Tür. */
export const TEST_CATALOG: ElementCatalog = {
  appearance: { rockColor: '#000000', wallColor: '#ffffff', wallThickness: 0.25 },
  floors: [
    { id: 'room', name: 'Raumboden', image: 'img/room.svg' },
    { id: 'corridor', name: 'Gang', image: 'img/corridor.svg' },
  ],
  doors: [{ id: 'door', name: 'Tür', image: 'img/door.svg' }],
  categories: [
    {
      name: 'Möbel',
      pieces: [rectanglePiece('table', 'Tisch', 3, 2), rectanglePiece('chest', 'Truhe', 1, 1)],
    },
    {
      name: 'Hindernisse',
      pieces: [
        {
          id: 'rubble',
          name: 'Schutt',
          image: 'img/rubble.svg',
          width: 2,
          height: 2,
          cells: [
            { col: 0, row: 0 },
            { col: 0, row: 1 },
            { col: 1, row: 1 },
          ],
        },
      ],
    },
  ],
};

/** Layout 10 × 8 aus Fels; einzelne Felder lassen sich überschreiben. */
export function createTestLayout(partial: Partial<DungeonLayout> = {}): DungeonLayout {
  return { ...NEW_LAYOUT, name: 'Test', columns: 10, rows: 8, ...partial };
}
