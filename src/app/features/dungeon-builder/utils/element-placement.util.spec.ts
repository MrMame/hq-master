import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { isEmptyLayout, placeElement, unknownElementCount } from './element-placement.util';

describe('element-placement.util', () => {
  it('places pieces centred on the tile and doors on the nearest edge', () => {
    const layout: DungeonLayout = createTestLayout();
    const withTable: DungeonLayout = placeElement(
      layout,
      TEST_CATALOG,
      { id: 't1', catalogId: 'table' },
      { x: 5.5, y: 4.5 },
    );
    expect(withTable.pieces).toEqual([
      { id: 't1', catalogId: 'table', col: 4, row: 4, rotation: 0 },
    ]);

    const withDoor: DungeonLayout = placeElement(
      layout,
      TEST_CATALOG,
      { id: 'd1', catalogId: 'door' },
      { x: 2.9, y: 3.6 },
    );
    expect(withDoor.doors).toEqual([{ id: 'd1', catalogId: 'door', x: 3, y: 3, rotation: 90 }]);
  });

  it('leaves the layout unchanged for an unknown entry or without catalog', () => {
    const layout: DungeonLayout = createTestLayout();
    expect(placeElement(layout, TEST_CATALOG, { id: 'x', catalogId: 'weg' }, { x: 1, y: 1 })).toBe(
      layout,
    );
    expect(placeElement(layout, null, { id: 'x', catalogId: 'table' }, { x: 1, y: 1 })).toBe(
      layout,
    );
  });

  it('counts floors, pieces and doors without catalog entry', () => {
    const layout: DungeonLayout = createTestLayout({
      floor: { '0,0': 'room', '1,0': 'lava' },
      pieces: [
        { id: 'a', catalogId: 'table', col: 0, row: 0, rotation: 0 },
        { id: 'b', catalogId: 'weg', col: 3, row: 3, rotation: 0 },
      ],
      doors: [{ id: 'd', catalogId: 'alt', x: 1, y: 1, rotation: 0 }],
    });
    expect(unknownElementCount(layout, TEST_CATALOG)).toBe(3);
    expect(unknownElementCount(layout, null)).toBe(0);
  });

  it('knows an empty layout', () => {
    expect(isEmptyLayout(createTestLayout())).toBe(true);
    expect(isEmptyLayout(createTestLayout({ floor: { '0,0': 'room' } }))).toBe(false);
    expect(
      isEmptyLayout(createTestLayout({ walls: [{ id: 'w', x1: 0, y1: 0, x2: 1, y2: 0 }] })),
    ).toBe(false);
    expect(
      isEmptyLayout(
        createTestLayout({ doors: [{ id: 'd', catalogId: 'door', x: 0, y: 0, rotation: 0 }] }),
      ),
    ).toBe(false);
  });
});
