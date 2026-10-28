import { LibraryGroup } from '../models/library-entry.model';
import { TEST_CATALOG } from '../testing/builder.fixtures';
import { floorGroup, pieceGroups } from './library-groups.util';
import { filterGroups, isSearching, matchesSearch } from './library-search.util';

describe('library search', () => {
  const groups: LibraryGroup[] = [floorGroup(TEST_CATALOG), ...pieceGroups(TEST_CATALOG)];

  it('should not count an empty or blank term as a search', () => {
    expect(isSearching('')).toBe(false);
    expect(isSearching('   ')).toBe(false);
    expect(isSearching(' t ')).toBe(true);
  });

  it('should match names regardless of case and surrounding blanks', () => {
    expect(matchesSearch('Alchemistentisch', 'TISCH')).toBe(true);
    expect(matchesSearch('Tür', ' tü ')).toBe(true);
    expect(matchesSearch('Truhe', 'tisch')).toBe(false);
  });

  it('should return all groups unchanged without a search term', () => {
    expect(filterGroups(groups, ' ')).toBe(groups);
  });

  it('should keep only matching entries and drop groups without hits', () => {
    const result: LibraryGroup[] = filterGroups(groups, 'r');

    expect(result.map((group) => [group.name, group.items.map((item) => item.name)])).toEqual([
      ['Boden', ['Raumboden']],
      ['Türen', ['Tür']],
      ['Möbel', ['Truhe']],
    ]);
  });

  it('should find the rock floor and return nothing for an unknown term', () => {
    expect(filterGroups(groups, 'fels').map((group) => group.key)).toEqual(['floor']);
    expect(filterGroups(groups, 'xyz')).toEqual([]);
  });
});
