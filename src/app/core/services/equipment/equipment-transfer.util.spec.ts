import { EquipmentCard } from '../../models/card.model';
import { CharacterInfo } from '../../models/character-info.model';
import { createTestCharacter } from '../../testing/character.fixtures';
import { assignedCard, createEquipmentCard, RUNE_ARMOR } from '../../testing/deck.fixtures';
import { EquipmentTransfer, transferEquipment } from './equipment-transfer.util';

const NOW: Date = new Date('2026-01-01T12:00:00Z');
// Handschuh links/rechts: Rüstung +1 bzw. +2.
const LEFT: EquipmentCard = createEquipmentCard('e7', 'Handschuh', 'hand', [
  { stat: 'maxArmor', value: 1 },
]);
const RIGHT: EquipmentCard = createEquipmentCard('e8', 'Stachelhandschuh', 'hand', [
  { stat: 'maxArmor', value: 2 },
]);
const texts: (transfer: EquipmentTransfer) => string[] = (transfer) =>
  transfer.entries.map((entry) => entry.text);

describe('transferEquipment', () => {
  // Rüstung 4 + Handschuh 1 + Stachelhandschuh 2 = 7/7.
  const barbarian: CharacterInfo = { ...createTestCharacter('a'), name: 'Barbar', armor: 7 };

  it('limits the receiver when a hand change replaces the other hand card', () => {
    const transfer: EquipmentTransfer = transferEquipment({
      assigned: [assignedCard(LEFT, 'a', 'leftHand'), assignedCard(RIGHT, 'a', 'rightHand')],
      ref: { deckId: 'deck-1', cardId: 'e7' },
      card: LEFT,
      giver: barbarian,
      receiver: barbarian,
      slot: 'rightHand',
      now: NOW,
    });

    // Stachelhandschuh fällt weg (−2), der Handschuh wirkt weiter: 5/5.
    expect(transfer.characters).toEqual([{ ...barbarian, armor: 5 }]);
    expect(texts(transfer)).toEqual([
      'Barbar legt Stachelhandschuh ab',
      'Barbar erhält Handschuh (Rechte Hand)',
    ]);
  });

  it('writes giver before receiver and logs giving up, replacing and receiving in order', () => {
    const dwarf: CharacterInfo = { ...createTestCharacter('b'), name: 'Zwerg', armor: 6 };
    const transfer: EquipmentTransfer = transferEquipment({
      assigned: [assignedCard(RUNE_ARMOR, 'b', 'body'), assignedCard(RIGHT, 'a', 'body')],
      ref: { deckId: 'deck-1', cardId: 'e1' },
      card: RUNE_ARMOR,
      giver: dwarf,
      receiver: { ...barbarian, armor: 6 },
      slot: 'body',
      now: NOW,
    });

    // Zwerg 6/6 → 4/4; Barbar 6/6 → ohne Stachelhandschuh 4/4 → Runenrüstung +2 → 6/6.
    expect(transfer.characters.map((c) => [c.id, c.armor])).toEqual([
      ['b', 4],
      ['a', 6],
    ]);
    expect(texts(transfer)).toEqual([
      'Zwerg legt Runenrüstung ab',
      'Barbar legt Stachelhandschuh ab',
      'Barbar erhält Runenrüstung (Körper)',
    ]);
    expect(transfer.entries[0].gameTime).toBe(NOW.toISOString());
  });
});
