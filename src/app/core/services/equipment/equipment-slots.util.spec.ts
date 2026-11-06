import { preferredSlot, slotsForCard } from './equipment-slots.util';
import { AssignedCard } from '../../models/deck-state.model';
import { assignedCard, TOWER_SHIELD } from '../../testing/deck.fixtures';

describe('equipment slots', () => {
  it('maps card slots to character slots', () => {
    expect(slotsForCard('body')).toEqual(['body']);
    expect(slotsForCard('hand')).toEqual(['leftHand', 'rightHand']);
    expect(slotsForCard('head')).toEqual(['head']);
    expect(slotsForCard('amulet')).toEqual(['amulet']);
  });

  it('preselects the free hand', () => {
    expect(preferredSlot('hand', [], 'a')).toBe('leftHand');
    expect(preferredSlot('hand', [assignedCard(TOWER_SHIELD, 'a', 'leftHand')], 'a')).toBe(
      'rightHand',
    );
    // Die linke Hand eines anderen Charakters zählt nicht.
    expect(preferredSlot('hand', [assignedCard(TOWER_SHIELD, 'b', 'leftHand')], 'a')).toBe(
      'leftHand',
    );
  });

  it('falls back to the first slot when all fitting slots are occupied', () => {
    const both: AssignedCard[] = [
      assignedCard(TOWER_SHIELD, 'a', 'leftHand'),
      assignedCard({ ...TOWER_SHIELD, id: 'e9' }, 'a', 'rightHand'),
    ];
    expect(preferredSlot('hand', both, 'a')).toBe('leftHand');
    expect(preferredSlot('body', both, 'a')).toBe('body');
  });
});
