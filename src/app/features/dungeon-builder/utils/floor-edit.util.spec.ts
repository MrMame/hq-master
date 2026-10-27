import { DungeonLayout } from '../models/dungeon-layout.model';
import { TileCell } from '../models/grid.model';
import { createTestLayout } from '../testing/builder.fixtures';
import { fillArea, paintFloor } from './floor-edit.util';

describe('floor-edit.util', () => {
  describe('paintFloor', () => {
    it('sets the floor of the cells and skips cells outside the plan', () => {
      const painted: DungeonLayout = paintFloor(
        createTestLayout(),
        [
          { col: 0, row: 0 },
          { col: 1, row: 0 },
          { col: 10, row: 0 },
        ],
        'room',
      );
      expect(painted.floor).toEqual({ '0,0': 'room', '1,0': 'room' });
    });

    it('turns cells back into rock with null', () => {
      const layout: DungeonLayout = createTestLayout({ floor: { '0,0': 'room', '1,0': 'room' } });
      expect(paintFloor(layout, [{ col: 0, row: 0 }], null).floor).toEqual({ '1,0': 'room' });
    });

    it('returns the same layout when nothing changes', () => {
      const layout: DungeonLayout = createTestLayout({ floor: { '0,0': 'room' } });
      expect(paintFloor(layout, [{ col: 0, row: 0 }], 'room')).toBe(layout);
      expect(paintFloor(layout, [{ col: 5, row: 5 }], null)).toBe(layout);
    });
  });

  describe('fillArea', () => {
    // Raum 2 × 2 links oben, daneben ein Gang; der Rest ist Fels.
    const layout: DungeonLayout = createTestLayout({
      columns: 4,
      rows: 3,
      floor: { '0,0': 'room', '1,0': 'room', '0,1': 'room', '1,1': 'room', '2,0': 'corridor' },
    });

    it('collects the connected area of the same floor only', () => {
      const area: TileCell[] = fillArea(layout, { col: 1, row: 1 });
      expect(area).toHaveLength(4);
      expect(area).not.toContainEqual({ col: 2, row: 0 });
    });

    it('fills connected rock up to the plan border', () => {
      expect(fillArea(layout, { col: 3, row: 2 })).toHaveLength(7);
    });

    it('returns nothing for a cell outside the plan', () => {
      expect(fillArea(layout, { col: 9, row: 9 })).toEqual([]);
    });
  });
});
