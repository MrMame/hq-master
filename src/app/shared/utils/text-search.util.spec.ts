import { isSearching, matchesSearch } from './text-search.util';

describe('text search', () => {
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
});
