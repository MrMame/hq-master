import { duplicateIds, uniqueIds, withUniqueCardIds } from './card-id.util';
import { Card } from '../../models/card.model';
import { BASIC_CARD, SWORD_CARD } from '../../testing/deck.fixtures';

describe('card-id.util', () => {
  describe('uniqueIds', () => {
    it('keeps ids that are already unique in their order', () => {
      expect(uniqueIds(['c1', 'b1', 's1'])).toEqual(['c1', 'b1', 's1']);
    });

    it('numbers every further occurrence from 2 on', () => {
      expect(uniqueIds(['a', 'a', 'a', 'a', 'a'])).toEqual(['a', 'a-2', 'a-3', 'a-4', 'a-5']);
    });

    it('never collides with an id that stands further down', () => {
      const ids: string[] = uniqueIds(['a', 'a', 'a-2']);
      expect(ids).toEqual(['a', 'a-3', 'a-2']);
      expect(new Set(ids).size).toBe(3);
    });

    it('skips suffixes used by earlier ids and by numbered duplicates', () => {
      expect(uniqueIds(['a-2', 'a', 'a', 'a-2'])).toEqual(['a-2', 'a', 'a-3', 'a-2-2']);
    });

    it('treats reserved ids as taken', () => {
      expect(uniqueIds(['a', 'b', 'a'], ['a', 'a-2'])).toEqual(['a-3', 'b', 'a-4']);
    });

    it('returns an empty list for no ids', () => {
      expect(uniqueIds([])).toEqual([]);
    });
  });

  describe('withUniqueCardIds', () => {
    it('renames only the duplicates and keeps all other fields', () => {
      const cards: Card[] = withUniqueCardIds([SWORD_CARD, BASIC_CARD, SWORD_CARD]);

      expect(cards.map((card) => card.id)).toEqual(['c1', 'b1', 'c1-2']);
      expect(cards[0]).toBe(SWORD_CARD);
      expect(cards[1]).toBe(BASIC_CARD);
      expect(cards[2]).toEqual({ ...SWORD_CARD, id: 'c1-2' });
    });

    it('renames a card whose id is reserved', () => {
      expect(withUniqueCardIds([BASIC_CARD], ['b1'])).toEqual([{ ...BASIC_CARD, id: 'b1-2' }]);
    });
  });

  describe('duplicateIds', () => {
    it('lists each repeated id once in order of its first occurrence', () => {
      expect(duplicateIds(['b', 'a', 'b', 'a', 'a', 'c'])).toEqual(['b', 'a']);
    });

    it('is empty without repetitions', () => {
      expect(duplicateIds(['a', 'b'])).toEqual([]);
    });
  });
});
