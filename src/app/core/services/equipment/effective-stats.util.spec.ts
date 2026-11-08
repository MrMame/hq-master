import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard } from '../../models/deck-state.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import {
  assignedCard,
  createPropertyCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../testing/deck.fixtures';
import {
  activeCardsOf,
  bonusOf,
  bonusSources,
  cardsOf,
  effectiveStats,
  propertiesOf,
} from './effective-stats.util';

// Grundwert: Tempo 5.
const character: CharacterInfo = createTestCharacter('a');
const card: (name: string, ...values: [string, number][]) => Card = (name, ...values) =>
  createPropertyCard(
    name,
    name,
    values.map(([n, value]) => ({ name: n, value })),
  );

describe('effectiveStats', () => {
  it('equals the base Tempo and has no dynamic properties without cards', () => {
    expect(effectiveStats(character, [])).toEqual({ Tempo: 5, dynamic: new Map() });
  });

  it('adds Tempo of all cards, negative values included, never below 0', () => {
    expect(effectiveStats(character, [RUNE_ARMOR, card('Stiefel', ['Tempo', 3])]).Tempo).toBe(7);
    expect(effectiveStats(character, [card('Blei', ['Tempo', -9])]).Tempo).toBe(0);
  });

  it('sums dynamic properties in order of first appearance', () => {
    const cards: Card[] = [
      card('Schwert', ['Angriff', 3], ['Blitzschaden', 2]),
      TOWER_SHIELD,
      card('Ring', ['Angriff', 1]),
    ];
    expect([...effectiveStats(character, cards).dynamic]).toEqual([
      ['Angriff', 4],
      ['Blitzschaden', 2],
      ['Abwehr', 2],
    ]);
  });

  it('treats names case-sensitively and shows negative sums as 0', () => {
    const cards: Card[] = [card('A', ['Angriff', 2]), card('B', ['angriff', 1], ['Abwehr', -1])];
    expect([...effectiveStats(character, cards).dynamic]).toEqual([
      ['Angriff', 2],
      ['angriff', 1],
      ['Abwehr', 0],
    ]);
  });

  it('never lists Leben, Ruestung or Tempo as dynamic properties', () => {
    const cards: Card[] = [card('Trank', ['Leben', 30], ['Ruestung', 2], ['Tempo', 1])];
    expect(effectiveStats(character, cards).dynamic.size).toBe(0);
  });

  it('leaves the base values of the character unchanged', () => {
    const before: CharacterInfo = { ...character };
    effectiveStats(character, [RUNE_ARMOR]);
    expect(character).toEqual(before);
  });
});

describe('activeCardsOf', () => {
  it('lists the slot cards of one character in slot order', () => {
    const assigned: AssignedCard[] = [
      assignedCard(TOWER_SHIELD, 'a', 'amulet'),
      assignedCard(RUNE_ARMOR, 'b', 'body'),
      assignedCard(RUNE_ARMOR, 'a', 'head'),
    ];
    expect(activeCardsOf({ assigned, belt: [] }, 'a')).toEqual([RUNE_ARMOR, TOWER_SHIELD]);
    expect(activeCardsOf({ assigned, belt: [] }, 'x')).toEqual([]);
  });
});

describe('equipment helpers', () => {
  const amulet: Card = card('Schutzamulett', ['Abwehr', 1]);
  const assigned: AssignedCard[] = [
    assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
    assignedCard(RUNE_ARMOR, 'b', 'body'),
    assignedCard(amulet, 'a', 'amulet'),
  ];

  it('finds the cards of one character', () => {
    expect(cardsOf(assigned, 'a').map((entry) => entry.card.name)).toEqual([
      'Turmschild',
      'Schutzamulett',
    ]);
  });

  it('sums the properties per name', () => {
    expect(bonusOf(propertiesOf([TOWER_SHIELD, amulet]), 'Abwehr')).toBe(3);
    expect(bonusOf([], 'Abwehr')).toBe(0);
  });

  it('names the cards that change a property', () => {
    expect(bonusSources([TOWER_SHIELD, amulet], 'Abwehr')).toEqual([
      { name: 'Turmschild', value: 2 },
      { name: 'Schutzamulett', value: 1 },
    ]);
    expect(bonusSources([TOWER_SHIELD], 'Tempo')).toEqual([]);
  });
});
