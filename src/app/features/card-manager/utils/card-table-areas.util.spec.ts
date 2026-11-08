import { CardTableArea } from '../models/card-table-area.model';
import { cardTableAreas, ownedCount } from './card-table-areas.util';

describe('cardTableAreas', () => {
  const areas: CardTableArea[] = cardTableAreas({
    hand: 3,
    equipped: 0,
    inventory: 0,
    belt: 1,
    decks: 0,
  });

  it('lists the five areas in the order of the main area with ids in their own scope', () => {
    expect(areas.map((area) => [area.navLabel, area.sectionId, area.elementId])).toEqual([
      ['Hand', 'card-manager-table.hand', 'card-table-area-hand'],
      ['Ausgerüstet', 'card-manager-table.equipped', 'card-table-area-equipped'],
      ['Inventar', 'card-manager-table.inventory', 'card-table-area-inventory'],
      ['Gürtel', 'card-manager-table.belt', 'card-table-area-belt'],
      ['Spieltisch', 'card-manager-table.decks', 'card-table-area-decks'],
    ]);
    expect(areas[0].title).toBe('Hand des Dungeon Masters');
  });

  it('gives empty card areas a reason but keeps the table visible without decks', () => {
    expect(areas.map((area) => [area.count, area.emptyReason])).toEqual([
      [3, null],
      [0, 'Keine ausgerüsteten Karten'],
      [0, 'Keine Karten im Inventar'],
      [1, null],
      [0, null],
    ]);
  });
});

describe('ownedCount', () => {
  it('counts only cards of existing characters', () => {
    const cards: { characterId: string }[] = [
      { characterId: 'a' },
      { characterId: 'b' },
      { characterId: 'a' },
    ];
    expect(ownedCount(cards, ['a'])).toBe(2);
    expect(ownedCount(cards, [])).toBe(0);
  });
});
