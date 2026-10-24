import { CHARACTER_NAMES_BY_IMAGE } from './character-names.model';
import { CharacterNameList } from './character-name-list.model';
import { CHARACTER_IMAGES } from '../character-images.model';

const entries: [string, CharacterNameList][] = Object.entries(CHARACTER_NAMES_BY_IMAGE);

describe('CHARACTER_NAMES_BY_IMAGE', () => {
  it('has a name list for exactly the images of CHARACTER_IMAGES', () => {
    expect(Object.keys(CHARACTER_NAMES_BY_IMAGE).sort()).toEqual([...CHARACTER_IMAGES].sort());
  });

  it.each(entries)('%s has 50 unique first and 50 unique last names', (_image, names) => {
    expect(new Set(names.firstNames).size).toBe(50);
    expect(names.firstNames).toHaveLength(50);
    expect(new Set(names.lastNames).size).toBe(50);
    expect(names.lastNames).toHaveLength(50);
  });

  it.each(entries)('%s keeps first names ≤ 8 and last names ≤ 11 characters', (_image, names) => {
    expect(names.firstNames.filter((name) => name.length > 8)).toEqual([]);
    expect(names.lastNames.filter((name) => name.length > 11)).toEqual([]);
  });

  it.each(entries)('%s allows a combination with at least 12 characters', (_image, names) => {
    const longestFirst: number = Math.max(...names.firstNames.map((name) => name.length));
    const longestLast: number = Math.max(...names.lastNames.map((name) => name.length));

    expect(longestFirst + 1 + longestLast).toBeGreaterThanOrEqual(12);
  });
});
