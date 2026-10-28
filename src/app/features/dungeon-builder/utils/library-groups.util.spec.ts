import { LibraryGroup } from '../models/library-entry.model';
import { TEST_CATALOG } from '../testing/builder.fixtures';
import { floorGroup, pieceGroups, recentGroup } from './library-groups.util';

describe('library groups', () => {
  it('should list rock first, then the floors of the catalog', () => {
    const group: LibraryGroup = floorGroup(TEST_CATALOG);

    expect(group.key).toBe('floor');
    expect(group.name).toBe('Boden');
    expect(group.items.map((item) => item.label)).toEqual(['Fels', 'Raumboden', 'Gang']);
    expect(group.items[0]).toMatchObject({ id: '', image: '', swatch: '#000000' });
  });

  it('should list doors and piece categories in catalog order with size labels', () => {
    const groups: LibraryGroup[] = pieceGroups(TEST_CATALOG);

    expect(groups.map((group) => [group.key, group.name])).toEqual([
      ['doors', 'Türen'],
      ['Möbel', 'Möbel'],
      ['Hindernisse', 'Hindernisse'],
    ]);
    expect(groups[0].items[0]).toMatchObject({ id: 'door', size: '', label: 'Tür' });
    expect(groups[1].items[0]).toMatchObject({
      id: 'table',
      size: '3 × 2',
      label: 'Tisch (3 × 2)',
    });
  });

  it('should drop empty groups', () => {
    const groups: LibraryGroup[] = pieceGroups({
      ...TEST_CATALOG,
      doors: [],
      categories: [{ name: 'Leer', pieces: [] }],
    });
    expect(groups).toEqual([]);
  });

  it('should build the recent group in the given order and skip unknown ids', () => {
    const group: LibraryGroup = recentGroup(pieceGroups(TEST_CATALOG), ['chest', 'gone', 'door']);

    expect(group.key).toBe('recent');
    expect(group.name).toBe('Zuletzt verwendet');
    expect(group.items.map((item) => [item.id, item.name, item.label])).toEqual([
      ['chest', 'Truhe', 'Truhe (1 × 1) – zuletzt verwendet'],
      ['door', 'Tür', 'Tür – zuletzt verwendet'],
    ]);
  });
});
