import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { doorSteps, floorSteps, pieceSteps, wallSteps } from './element-steps.util';

const layout: DungeonLayout = createTestLayout({
  floor: { '1,1': 'room', '2,1': 'lava' },
  pieces: [
    { id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 0 },
    { id: 'x1', catalogId: 'verschwunden', col: 5, row: 5, rotation: 0 },
  ],
  walls: [{ id: 'w1', x1: 0, y1: 1, x2: 4, y2: 1 }],
  doors: [
    { id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 0 },
    { id: 'd2', catalogId: 'alt', x: 6, y: 2, rotation: 90 },
    { id: 'd3', catalogId: 'alt', x: 7, y: 4, rotation: 0 },
  ],
});

describe('element-steps.util', () => {
  it('draws one image per floor tile and a placeholder for unknown floors', () => {
    expect(floorSteps(layout, TEST_CATALOG, 64)).toEqual([
      {
        kind: 'image',
        key: 'f:1,1:room',
        src: 'img/room.svg',
        placement: {
          x: 64,
          y: 64,
          width: 64,
          height: 64,
          translateX: 0,
          translateY: 0,
          rotation: 0,
        },
      },
      { kind: 'unknown', key: 'f:2,1', x: 128, y: 64, width: 64, height: 64 },
    ]);
  });

  it('draws pieces as images and unknown pieces as one-tile placeholders', () => {
    const [table, unknown] = pieceSteps(layout, TEST_CATALOG, 64);
    expect(table).toMatchObject({ kind: 'image', key: 'p:t1', src: 'img/table.svg' });
    expect(unknown).toEqual({
      kind: 'unknown',
      key: 'p:x1',
      x: 320,
      y: 320,
      width: 64,
      height: 64,
    });
  });

  it('draws wall lines with the catalog appearance and a gap for each door', () => {
    expect(wallSteps(layout, TEST_CATALOG.appearance, 64)).toEqual([
      { kind: 'line', key: 'w:w1:0', color: '#ffffff', width: 16, x1: 0, y1: 64, x2: 128, y2: 64 },
      {
        kind: 'line',
        key: 'w:w1:1',
        color: '#ffffff',
        width: 16,
        x1: 192,
        y1: 64,
        x2: 256,
        y2: 64,
      },
    ]);
  });

  it('draws doors as images and unknown doors as thin placeholders across their edge', () => {
    const [known, vertical, horizontal] = doorSteps(layout, TEST_CATALOG, 64);
    expect(known).toMatchObject({ kind: 'image', key: 'd:d1', src: 'img/door.svg' });
    expect(vertical).toEqual({
      kind: 'unknown',
      key: 'd:d2',
      x: 376,
      y: 128,
      width: 16,
      height: 64,
    });
    expect(horizontal).toEqual({
      kind: 'unknown',
      key: 'd:d3',
      x: 448,
      y: 248,
      width: 64,
      height: 16,
    });
  });
});
