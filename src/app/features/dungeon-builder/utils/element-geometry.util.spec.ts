import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { doorImagePlacement, elementBounds, pieceImagePlacement } from './element-geometry.util';

const layout: DungeonLayout = createTestLayout({
  pieces: [{ id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 90 }],
  walls: [{ id: 'w1', x1: 0, y1: 1, x2: 4, y2: 1 }],
  doors: [{ id: 'd2', catalogId: 'alt', x: 6, y: 2, rotation: 90 }],
});

describe('element-geometry.util', () => {
  it('turns a piece image around the middle of its turned rectangle', () => {
    expect(pieceImagePlacement(layout.pieces[0], TEST_CATALOG.categories[0].pieces[0], 64)).toEqual(
      {
        translateX: 128,
        translateY: 160,
        rotation: 90,
        x: -96,
        y: -64,
        width: 192,
        height: 128,
      },
    );
  });

  it('places a door image centred on its edge, turning around the start point', () => {
    expect(doorImagePlacement(layout.doors[0], 64)).toEqual({
      translateX: 384,
      translateY: 128,
      rotation: 90,
      x: 0,
      y: -8,
      width: 64,
      height: 16,
    });
  });

  it('gives the bounds of pieces, walls and doors', () => {
    expect(elementBounds(layout, { kind: 'piece', id: 't1' }, TEST_CATALOG)).toEqual({
      x: 1,
      y: 1,
      width: 2,
      height: 3,
    });
    expect(elementBounds(layout, { kind: 'wall', id: 'w1' }, null)).toEqual({
      x: expect.closeTo(-0.15),
      y: expect.closeTo(0.85),
      width: expect.closeTo(4.3),
      height: expect.closeTo(0.3),
    });
    expect(elementBounds(layout, { kind: 'door', id: 'd2' }, null)?.height).toBeCloseTo(1.3);
    expect(elementBounds(layout, { kind: 'piece', id: 'nix' }, null)).toBeNull();
    expect(elementBounds(layout, { kind: 'door', id: 'nix' }, null)).toBeNull();
  });
});
