import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { elementsOutside, resizeLayout } from './layout-resize.util';

// Plan 10 × 8: Tisch bei (6,1) reicht bis Spalte 8, Wand bis x = 9, Tür bei Zeile 7.
const layout: DungeonLayout = createTestLayout({
  floor: { '0,0': 'room', '8,7': 'room' },
  pieces: [
    { id: 't1', catalogId: 'table', col: 6, row: 1, rotation: 0 },
    { id: 'c1', catalogId: 'chest', col: 0, row: 0, rotation: 0 },
  ],
  walls: [{ id: 'w1', x1: 1, y1: 3, x2: 9, y2: 3 }],
  doors: [{ id: 'd1', catalogId: 'door', x: 2, y: 7, rotation: 0 }],
});

describe('layout-resize.util', () => {
  it('counts elements that would lie fully or partly outside', () => {
    expect(elementsOutside(layout, { columns: 10, rows: 8 }, TEST_CATALOG)).toBe(0);
    expect(elementsOutside(layout, { columns: 8, rows: 8 }, TEST_CATALOG)).toBe(2);
    expect(elementsOutside(layout, { columns: 10, rows: 6 }, TEST_CATALOG)).toBe(1);
  });

  it('drops elements and floor outside when shrinking', () => {
    const shrunk: DungeonLayout = resizeLayout(layout, { columns: 8, rows: 6 }, TEST_CATALOG);
    expect([shrunk.columns, shrunk.rows]).toEqual([8, 6]);
    expect(shrunk.floor).toEqual({ '0,0': 'room' });
    expect(shrunk.pieces.map((p) => p.id)).toEqual(['c1']);
    expect(shrunk.walls).toEqual([]);
    expect(shrunk.doors).toEqual([]);
  });

  it('keeps everything when growing', () => {
    const grown: DungeonLayout = resizeLayout(layout, { columns: 12, rows: 9 }, TEST_CATALOG);
    expect(grown).toEqual({ ...layout, columns: 12, rows: 9 });
  });
});
