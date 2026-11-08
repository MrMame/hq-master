import { Card } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { assignedCard, createPropertyCard, RUNE_ARMOR } from '../../testing/deck.fixtures';
import { NewGameLogEntry } from '../../models/game-log-entry.model';
import { transferEntries } from './equipment-transfer.util';

const NOW: Date = new Date('2026-01-01T12:00:00Z');
// Handschuh links/rechts: Rüstung +1 bzw. +2.
const LEFT: Card = createPropertyCard('e7', 'Handschuh', [{ name: 'Ruestung', value: 1 }]);
const RIGHT: Card = createPropertyCard('e8', 'Stachelhandschuh', [{ name: 'Ruestung', value: 2 }]);
const texts: (entries: NewGameLogEntry[]) => string[] = (entries) =>
  entries.map((entry) => entry.text);

describe('transferEntries', () => {
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', Ruestung: 7 };

  it('logs only the replaced card when the card changes the slot of the same character', () => {
    const entries: NewGameLogEntry[] = transferEntries({
      assigned: [assignedCard(LEFT, 'a', 'leftHand'), assignedCard(RIGHT, 'a', 'rightHand')],
      ref: { deckId: 'deck-1', cardId: 'e7' },
      card: LEFT,
      giver: barbarian,
      receiver: barbarian,
      slot: 'rightHand',
      now: NOW,
    });

    expect(texts(entries)).toEqual([
      'Barbar legt Stachelhandschuh ab',
      'Barbar erhält Handschuh (Rechte Hand)',
    ]);
  });

  it('logs giving up, replacing and receiving in order', () => {
    const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg', Ruestung: 6 };
    const entries: NewGameLogEntry[] = transferEntries({
      assigned: [assignedCard(RUNE_ARMOR, 'b', 'body'), assignedCard(RIGHT, 'a', 'body')],
      ref: { deckId: 'deck-1', cardId: 'e1' },
      card: RUNE_ARMOR,
      giver: dwarf,
      receiver: { ...barbarian, Ruestung: 6 },
      slot: 'body',
      now: NOW,
    });

    expect(texts(entries)).toEqual([
      'Zwerg legt Runenrüstung ab',
      'Barbar legt Stachelhandschuh ab',
      'Barbar erhält Runenrüstung (Körper)',
    ]);
    expect(entries[0].gameTime).toBe(NOW.toISOString());
  });

  it('logs taking a card out of the inventory with the inventory text', () => {
    const entries: NewGameLogEntry[] = transferEntries({
      assigned: [],
      ref: { deckId: 'deck-1', cardId: 'e1' },
      card: RUNE_ARMOR,
      giver: undefined,
      receiver: barbarian,
      slot: 'body',
      now: NOW,
      inventoryOwner: barbarian,
    });
    expect(texts(entries)).toEqual(['Runenrüstung von Barbar aus dem Inventar angelegt']);
  });
});
