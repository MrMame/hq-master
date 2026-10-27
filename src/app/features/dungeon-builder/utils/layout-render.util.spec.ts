import { DungeonLayout } from '../models/dungeon-layout.model';
import { RenderStep } from '../models/render-step.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { exportSize, renderSteps } from './layout-render.util';

const layout: DungeonLayout = createTestLayout({
  floor: { '1,1': 'room', '2,1': 'lava' },
  pieces: [
    { id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 90 },
    { id: 'x1', catalogId: 'verschwunden', col: 5, row: 5, rotation: 0 },
  ],
  walls: [{ id: 'w1', x1: 0, y1: 1, x2: 4, y2: 1 }],
  doors: [
    { id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 0 },
    { id: 'd2', catalogId: 'alt', x: 6, y: 2, rotation: 90 },
  ],
});

describe('layout-render.util', () => {
  it('uses 64 px per tile up to 2048 px on the longest side', () => {
    expect(exportSize(26, 19)).toEqual({ tile: 64, width: 1664, height: 1216 });
    expect(exportSize(40, 10)).toEqual({ tile: 51, width: 2040, height: 510 });
  });

  it('draws the layers in order: rock, floor, pieces, walls, doors', () => {
    const keys: string[] = renderSteps(layout, TEST_CATALOG, 64).map((step) => step.key);
    expect(keys).toEqual([
      'rock',
      'f:1,1:room',
      'f:2,1',
      'p:t1',
      'p:x1',
      'w:w1:0',
      'w:w1:1',
      'd:d1',
      'd:d2',
    ]);
  });

  it('draws rock and walls with the catalog appearance and gaps for doors', () => {
    const steps: RenderStep[] = renderSteps(layout, TEST_CATALOG, 64);
    expect(steps[0]).toMatchObject({ kind: 'rect', color: '#000000', width: 640, height: 512 });
    expect(steps.filter((s) => s.kind === 'line')).toEqual([
      expect.objectContaining({ x1: 0, x2: 128, color: '#ffffff', width: 16 }),
      expect.objectContaining({ x1: 192, x2: 256 }),
    ]);
  });

  it('turns pieces around the middle of their rectangle', () => {
    const table: RenderStep | undefined = renderSteps(layout, TEST_CATALOG, 64).find(
      (s) => s.key === 'p:t1',
    );
    expect(table).toMatchObject({
      kind: 'image',
      src: 'img/table.svg',
      placement: { translateX: 128, translateY: 160, rotation: 90, x: -96, y: -64, width: 192 },
    });
  });

  it('shows elements without catalog entry as placeholders', () => {
    const steps: RenderStep[] = renderSteps(layout, TEST_CATALOG, 64);
    expect(steps.find((s) => s.key === 'f:2,1')).toMatchObject({ kind: 'unknown', x: 128 });
    expect(steps.find((s) => s.key === 'p:x1')).toMatchObject({ kind: 'unknown', x: 320, y: 320 });
    expect(steps.find((s) => s.key === 'd:d2')).toMatchObject({
      kind: 'unknown',
      x: 376,
      y: 128,
      width: 16,
      height: 64,
    });
  });

  it('falls back to the default appearance without catalog', () => {
    expect(renderSteps(createTestLayout(), null, 64)[0]).toMatchObject({ color: '#1c1915' });
  });
});
