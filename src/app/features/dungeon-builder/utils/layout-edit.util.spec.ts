import { DungeonLayout, PlacedDoor, PlacedPiece, PlacedWall } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import {
  addDoor,
  addPiece,
  addWall,
  hasElement,
  moveElement,
  removeElement,
  rotateElement,
} from './layout-edit.util';

const TABLE: PlacedPiece = { id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 0 };
const CHEST: PlacedPiece = { id: 'c1', catalogId: 'chest', col: 2, row: 1, rotation: 0 };
const WALL: PlacedWall = { id: 'w1', x1: 0, y1: 1, x2: 5, y2: 1 };
const DOOR: PlacedDoor = { id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 0 };

function filledLayout(): DungeonLayout {
  return createTestLayout({ pieces: [TABLE, CHEST], walls: [WALL], doors: [DOOR] });
}

describe('layout-edit.util', () => {
  it('adds pieces and walls on top of their layer', () => {
    const layout: DungeonLayout = addWall(addPiece(createTestLayout(), TABLE), WALL);
    expect(layout.pieces).toEqual([TABLE]);
    expect(layout.walls).toEqual([WALL]);
  });

  it('replaces a door on the same edge', () => {
    const other: PlacedDoor = { id: 'd2', catalogId: 'door', x: 3, y: 1, rotation: 180 };
    expect(addDoor(filledLayout(), other).doors).toEqual([other]);
  });

  it('knows and removes elements of every kind', () => {
    const layout: DungeonLayout = filledLayout();
    expect(hasElement(layout, { kind: 'door', id: 'd1' })).toBe(true);
    expect(removeElement(layout, { kind: 'piece', id: 't1' }).pieces).toEqual([CHEST]);
    expect(removeElement(layout, { kind: 'wall', id: 'w1' }).walls).toEqual([]);
    expect(removeElement(layout, { kind: 'door', id: 'd1' }).doors).toEqual([]);
    expect(removeElement(layout, { kind: 'piece', id: 'x' })).toBe(layout);
  });

  it('moves an element and puts it on top of its layer', () => {
    const moved: DungeonLayout = moveElement(
      filledLayout(),
      { kind: 'piece', id: 't1' },
      { dx: 2, dy: 3 },
      TEST_CATALOG,
    );
    expect(moved.pieces).toEqual([CHEST, { ...TABLE, col: 3, row: 4 }]);
  });

  it('moves walls and doors by grid points', () => {
    const layout: DungeonLayout = filledLayout();
    expect(moveElement(layout, { kind: 'wall', id: 'w1' }, { dx: 1, dy: 2 }, null).walls).toEqual([
      { ...WALL, x1: 1, y1: 3, x2: 6, y2: 3 },
    ]);
    expect(moveElement(layout, { kind: 'door', id: 'd1' }, { dx: 0, dy: 1 }, null).doors).toEqual([
      { ...DOOR, y: 2 },
    ]);
  });

  it('leaves the layout unchanged for no movement or an unknown element', () => {
    const layout: DungeonLayout = filledLayout();
    expect(moveElement(layout, { kind: 'piece', id: 't1' }, { dx: 0, dy: 0 }, null)).toBe(layout);
    expect(moveElement(layout, { kind: 'wall', id: 'x' }, { dx: 1, dy: 0 }, null)).toBe(layout);
    expect(rotateElement(layout, { kind: 'door', id: 'x' }, null)).toBe(layout);
    expect(rotateElement(layout, { kind: 'piece', id: 'x' }, null)).toBe(layout);
  });

  it('turns elements of every kind clockwise', () => {
    const layout: DungeonLayout = filledLayout();
    expect(
      rotateElement(layout, { kind: 'piece', id: 't1' }, TEST_CATALOG).pieces[1].rotation,
    ).toBe(90);
    expect(rotateElement(layout, { kind: 'wall', id: 'w1' }, null).walls[0]).toEqual({
      ...WALL,
      x1: 2,
      y1: 0,
      x2: 2,
      y2: 5,
    });
    expect(rotateElement(layout, { kind: 'door', id: 'd1' }, null).doors[0].rotation).toBe(90);
  });
});
