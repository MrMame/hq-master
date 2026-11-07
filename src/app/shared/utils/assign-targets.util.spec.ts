import { CardLocation } from '../../core/models/card-location.model';
import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { assignedCard, RUNE_ARMOR, TOWER_SHIELD } from '../../core/testing/deck.fixtures';
import { AssignTarget, assignTargets, replacingLabel } from './assign-targets.util';

const CHARACTERS: CharacterInfo[] = [createTestCharacter('a'), createTestCharacter('b')];

const summary: (targets: AssignTarget[]) => [string, string[]][] = (targets) =>
  targets.map((t) => [t.character.id, t.slots.map((s) => `${s.slot}:${s.replaces ?? '-'}`)]);

describe('assignTargets', () => {
  it('offers every character with the slot of the card and names the card it replaces', () => {
    const targets: AssignTarget[] = assignTargets(RUNE_ARMOR, { kind: 'hand' }, CHARACTERS, [
      assignedCard(TOWER_SHIELD, 'b', 'body'),
    ]);
    expect(summary(targets)).toEqual([
      ['a', ['body:-']],
      ['b', ['body:Turmschild']],
    ]);
  });

  it('puts the free hand first and leaves out the slot the card lies in', () => {
    const assigned: AssignedCard[] = [assignedCard(TOWER_SHIELD, 'a', 'leftHand')];
    expect(summary(assignTargets(TOWER_SHIELD, { kind: 'bank' }, CHARACTERS, assigned))).toEqual([
      ['a', ['rightHand:-', 'leftHand:Turmschild']],
      ['b', ['leftHand:-', 'rightHand:-']],
    ]);
    const worn: CardLocation = { kind: 'equipped', characterId: 'a', slot: 'leftHand' };
    expect(summary(assignTargets(TOWER_SHIELD, worn, CHARACTERS, assigned))[0]).toEqual([
      'a',
      ['rightHand:-'],
    ]);
  });

  it('leaves out a character without a possible slot', () => {
    const worn: CardLocation = { kind: 'equipped', characterId: 'a', slot: 'body' };
    expect(summary(assignTargets(RUNE_ARMOR, worn, CHARACTERS, []))).toEqual([['b', ['body:-']]]);
  });
});

describe('replacingLabel', () => {
  it('adds the replaced card to the label', () => {
    expect(replacingLabel('Barbar', 'Turmschild')).toBe('Barbar – ersetzt Turmschild');
    expect(replacingLabel('Linke Hand', null)).toBe('Linke Hand');
  });
});
