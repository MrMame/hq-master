import { readDeckCatalog } from './deck-catalog.util';

describe('readDeckCatalog', () => {
  it('returns the entries with id, name and url only', () => {
    const entries: unknown = [{ id: 'm', name: 'Monster', url: 'decks/m/m.xml', extra: 1 }];
    expect(readDeckCatalog(entries)).toEqual([{ id: 'm', name: 'Monster', url: 'decks/m/m.xml' }]);
  });

  it('accepts an empty catalog', () => {
    expect(readDeckCatalog([])).toEqual([]);
  });

  it.each<[string, unknown]>([
    ['no list', { id: 'm' }],
    ['null entry', [null]],
    ['missing url', [{ id: 'm', name: 'Monster' }]],
    ['wrong type', [{ id: 'm', name: 3, url: 'x' }]],
  ])('rejects %s', (_label, value) => {
    expect(() => readDeckCatalog(value)).toThrow('Ungültige Deckliste');
  });
});
