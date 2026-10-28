import { placeNewTokens } from './token-placement.util';
import { DungeonPosition } from '../models/dungeon-position.model';

describe('placeNewTokens', () => {
  it('should place the first token on [0,0] when the board is empty', () => {
    expect(placeNewTokens([], ['a'])).toEqual([{ characterId: 'a', col: 0, row: 0 }]);
  });

  it('should skip occupied fields', () => {
    const occupied: DungeonPosition[] = [
      { characterId: 'x', col: 0, row: 0 },
      { characterId: 'y', col: 1, row: 0 },
    ];
    expect(placeNewTokens(occupied, ['a'])).toEqual([{ characterId: 'a', col: 2, row: 0 }]);
  });

  it('should give several new tokens of one run different fields', () => {
    const occupied: DungeonPosition[] = [{ characterId: 'x', col: 1, row: 0 }];
    expect(placeNewTokens(occupied, ['a', 'b', 'c'])).toEqual([
      { characterId: 'a', col: 0, row: 0 },
      { characterId: 'b', col: 2, row: 0 },
      { characterId: 'c', col: 3, row: 0 },
    ]);
  });

  it('should wrap to the next row after five columns', () => {
    const placed: DungeonPosition[] = placeNewTokens([], ['a', 'b', 'c', 'd', 'e', 'f']);
    expect(placed[4]).toEqual({ characterId: 'e', col: 4, row: 0 });
    expect(placed[5]).toEqual({ characterId: 'f', col: 0, row: 1 });
  });

  it('should ignore tokens outside the placement area', () => {
    const occupied: DungeonPosition[] = [{ characterId: 'x', col: 9, row: 0 }];
    expect(placeNewTokens(occupied, ['a'])).toEqual([{ characterId: 'a', col: 0, row: 0 }]);
  });

  it('should still start at [0,0] when tokens lie left of or above the origin', () => {
    const occupied: DungeonPosition[] = [
      { characterId: 'x', col: -1, row: 0 },
      { characterId: 'y', col: 0, row: -1 },
      { characterId: 'z', col: -2, row: -1 },
    ];
    expect(placeNewTokens(occupied, ['a', 'b'])).toEqual([
      { characterId: 'a', col: 0, row: 0 },
      { characterId: 'b', col: 1, row: 0 },
    ]);
  });

  it('should return no positions when there are no new characters', () => {
    expect(placeNewTokens([{ characterId: 'x', col: 0, row: 0 }], [])).toEqual([]);
  });
});
