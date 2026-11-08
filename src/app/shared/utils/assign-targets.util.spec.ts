import { CardLocation } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { assignedCard, RUNE_ARMOR, TOWER_SHIELD } from '../../core/testing/deck.fixtures';
import { AssignTarget, assignTargets, replacingLabel, slotTargets } from './assign-targets.util';

const CHARACTERS: CharacterInfo[] = [createTestCharacter('a'), createTestCharacter('b')];

const summary: (targets: AssignTarget[]) => [string, string[]][] = (targets) =>
  targets.map((t) => [t.character.id, t.slots.map((s) => `${s.slot}:${s.replaces ?? '-'}`)]);

describe('assignTargets', () => {
  it('offers every character with all 5 slots in order and names the card each replaces', () => {
    const targets: AssignTarget[] = assignTargets({ kind: 'hand' }, CHARACTERS, [
      assignedCard(TOWER_SHIELD, 'b', 'body'),
    ]);
    expect(summary(targets)).toEqual([
      ['a', ['head:-', 'body:-', 'leftHand:-', 'rightHand:-', 'amulet:-']],
      ['b', ['head:-', 'body:Turmschild', 'leftHand:-', 'rightHand:-', 'amulet:-']],
    ]);
  });

  it('leaves out only the slot the card lies in', () => {
    const assigned: AssignedCard[] = [assignedCard(RUNE_ARMOR, 'a', 'leftHand')];
    const worn: CardLocation = { kind: 'equipped', characterId: 'a', slot: 'leftHand' };
    expect(summary(assignTargets(worn, CHARACTERS, assigned))).toEqual([
      ['a', ['head:-', 'body:-', 'rightHand:-', 'amulet:-']],
      ['b', ['head:-', 'body:-', 'leftHand:-', 'rightHand:-', 'amulet:-']],
    ]);
  });
});

describe('slotTargets', () => {
  it('lists the slots of one character from any location', () => {
    expect(
      slotTargets('a', { kind: 'inventory', characterId: 'a' }, [
        assignedCard(TOWER_SHIELD, 'a', 'amulet'),
      ]).map((target) => `${target.slot}:${target.replaces ?? '-'}`),
    ).toEqual(['head:-', 'body:-', 'leftHand:-', 'rightHand:-', 'amulet:Turmschild']);
  });
});

describe('replacingLabel', () => {
  it('adds the replaced card to the label', () => {
    expect(replacingLabel('Barbar', 'Turmschild')).toBe('Barbar – ersetzt Turmschild');
    expect(replacingLabel('Linke Hand', null)).toBe('Linke Hand');
  });
});
