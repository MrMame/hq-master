import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout } from '../testing/builder.fixtures';
import { isDungeonLayout, LAYOUT_CODEC } from './layout-codec.util';

describe('layout-codec.util', () => {
  const layout: DungeonLayout = createTestLayout({ floor: { '0,0': 'room' } });

  it('stores the layout unchanged and reads it back', () => {
    expect(isDungeonLayout(layout)).toBe(true);
    expect(LAYOUT_CODEC.encode(layout)).toBe(layout);
    expect(LAYOUT_CODEC.decode(layout)).toBe(layout);
  });

  it.each<[string, unknown]>([
    ['a list', []],
    ['null', null],
    ['walls that are no list', { ...createTestLayout(), walls: 'kaputt' }],
    ['a missing size', { ...createTestLayout(), columns: '26' }],
    ['a floor that is no object', { ...createTestLayout(), floor: [] }],
  ])('rejects %s', (_case, stored) => {
    expect(LAYOUT_CODEC.decode(stored)).toBeNull();
  });
});
