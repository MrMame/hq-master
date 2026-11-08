import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { assignedCard, createPropertyCard, RUNE_ARMOR } from '../../testing/deck.fixtures';
import { activeChanges } from './property-transfer.util';

const LIFE: Card = createPropertyCard('l1', 'Lebensamulett', [{ name: 'Leben', value: 30 }]);
const hero: CharacterInfo = { ...createTestCharacter('a'), Leben: 20, Ruestung: 4 };
const dwarf: CharacterInfo = { ...createTestCharacter('b'), Leben: 10, Ruestung: 0 };

const changes: (before: AssignedCard[], after: AssignedCard[]) => CharacterInfo[] = (
  before,
  after,
) => activeChanges([hero, dwarf], { belt: [], assigned: before }, { belt: [], assigned: after });

describe('activeChanges', () => {
  it('raises Leben when a card starts to work (20 → 50) and lowers it again (50 → 20)', () => {
    expect(changes([], [assignedCard(LIFE, 'a', 'amulet')])).toEqual([{ ...hero, Leben: 50 }]);
    const worn: CharacterInfo = { ...hero, Leben: 50 };
    expect(
      activeChanges(
        [worn],
        { belt: [], assigned: [assignedCard(LIFE, 'a', 'amulet')] },
        { belt: [], assigned: [] },
      ),
    ).toEqual([hero]);
  });

  it('kills when the card stops working after damage (10 → 0)', () => {
    const hurt: CharacterInfo = { ...hero, Leben: 10 };
    expect(
      activeChanges(
        [hurt],
        { belt: [], assigned: [assignedCard(LIFE, 'a', 'amulet')] },
        { belt: [], assigned: [] },
      ),
    ).toEqual([{ ...hero, Leben: 0 }]);
  });

  it('changes nothing when the card only changes the slot of the same character', () => {
    expect(changes([assignedCard(LIFE, 'a', 'head')], [assignedCard(LIFE, 'a', 'body')])).toEqual(
      [],
    );
  });

  it('moves the values from the giver to the receiver', () => {
    expect(
      changes([assignedCard(RUNE_ARMOR, 'a', 'body')], [assignedCard(RUNE_ARMOR, 'b', 'head')]),
    ).toEqual([
      { ...hero, Ruestung: 2 },
      { ...dwarf, Ruestung: 2 },
    ]);
  });

  it('sums the change of a replaced and a new card, never below 0', () => {
    const zero: CharacterInfo = { ...hero, Ruestung: 1 };
    expect(
      activeChanges(
        [zero],
        { belt: [], assigned: [assignedCard(RUNE_ARMOR, 'a', 'body')] },
        { belt: [], assigned: [assignedCard(LIFE, 'a', 'body')] },
      ),
    ).toEqual([{ ...zero, Ruestung: 0, Leben: 50 }]);
  });

  it('keeps Leben when a card is swapped for an equal one, even below its value', () => {
    const OTHER: Card = createPropertyCard('l2', 'Lebensring', [{ name: 'Leben', value: 30 }]);
    expect(
      changes([assignedCard(LIFE, 'a', 'amulet')], [assignedCard(OTHER, 'a', 'amulet')]),
    ).toEqual([hero]);
  });

  it('keeps the same card of another deck instance apart', () => {
    expect(
      changes(
        [assignedCard(LIFE, 'a', 'amulet', 'deck-1')],
        [assignedCard(LIFE, 'a', 'amulet', 'deck-2')],
      ),
    ).toEqual([hero]);
  });
});
