import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { hitTest } from './hit-test.util';

// Tisch 3 × 2 ab (1,1), Truhe darüber auf (2,1), Wand auf Zeile 1 mit Tür bei x = 2.
const layout: DungeonLayout = createTestLayout({
  pieces: [
    { id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 0 },
    { id: 'c1', catalogId: 'chest', col: 2, row: 1, rotation: 0 },
  ],
  walls: [{ id: 'w1', x1: 0, y1: 1, x2: 5, y2: 1 }],
  doors: [{ id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 0 }],
});

describe('hit-test.util', () => {
  it('finds the top element: door before wall before piece', () => {
    expect(hitTest(layout, TEST_CATALOG, { x: 2.5, y: 1.1 })).toEqual({ kind: 'door', id: 'd1' });
    expect(hitTest(layout, TEST_CATALOG, { x: 4.5, y: 0.9 })).toEqual({ kind: 'wall', id: 'w1' });
  });

  it('finds the last placed piece on a cell and nothing on free cells', () => {
    expect(hitTest(layout, TEST_CATALOG, { x: 2.5, y: 1.5 })).toEqual({ kind: 'piece', id: 'c1' });
    expect(hitTest(layout, TEST_CATALOG, { x: 1.5, y: 2.5 })).toEqual({ kind: 'piece', id: 't1' });
    expect(hitTest(layout, TEST_CATALOG, { x: 8.5, y: 6.5 })).toBeNull();
  });
});
