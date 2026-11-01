import { advanceConditions, ConditionAdvance } from './condition-tick.util';
import { CharacterInfo } from '../../core/models/character-info.model';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
} from '../../core/testing/condition.fixtures';

const poisoned: (health?: number) => CharacterInfo = (health: number = 12): CharacterInfo => ({
  ...createConditionedCharacter('a'),
  health,
});

describe('advanceConditions', () => {
  it('applies one tick of damage after one interval and moves lastTickAt', () => {
    const { character, events }: ConditionAdvance = advanceConditions(poisoned(), afterStart(60));

    expect(character.health).toBe(11);
    expect(character.conditions[0].lastTickAt).toBe(afterStart(60).toISOString());
    expect(events).toEqual([
      {
        type: 'damage',
        characterId: 'a',
        conditionId: 'poison',
        gameTime: afterStart(60).toISOString(),
        damage: 1,
      },
    ]);
  });

  it('does nothing before the first tick and ticks on the next step (+30 s, +30 s)', () => {
    const start: CharacterInfo = poisoned();
    const first: ConditionAdvance = advanceConditions(start, afterStart(30));
    expect(first.character).toBe(start);
    expect(first.character.health).toBe(12);
    expect(first.events).toEqual([]);

    expect(advanceConditions(first.character, afterStart(60)).character.health).toBe(11);
  });

  it('catches up all ticks of a time jump up to the end and then removes the condition', () => {
    const { character, events }: ConditionAdvance = advanceConditions(
      poisoned(20),
      afterStart(3600),
    );

    expect(character.health).toBe(10);
    expect(character.conditions).toEqual([]);
    expect(events.filter((e) => e.type === 'damage')).toHaveLength(10);
    expect(events.at(-1)).toEqual({
      type: 'expired',
      characterId: 'a',
      conditionId: 'poison',
      gameTime: afterStart(600).toISOString(),
    });
  });

  it('still counts the tick exactly at the end', () => {
    const almost: CharacterInfo = createConditionedCharacter('a', [
      createTestCondition({ lastTickAt: afterStart(540).toISOString() }),
    ]);
    const { character, events }: ConditionAdvance = advanceConditions(almost, afterStart(600));

    expect(character.health).toBe(11);
    expect(character.conditions).toEqual([]);
    expect(events.map((e) => e.type)).toEqual(['damage', 'expired']);
  });

  it('keeps an unlimited condition and keeps ticking', () => {
    const endless: CharacterInfo = createConditionedCharacter('a', [
      createTestCondition({ durationSeconds: 0 }),
    ]);
    const { character }: ConditionAdvance = advanceConditions(endless, afterStart(3600));

    expect(character.health).toBe(0);
    expect(character.conditions).toHaveLength(1);
    expect(character.conditions[0].lastTickAt).toBe(afterStart(3600).toISOString());
  });

  it('only expires a condition with interval 0 and no damage', () => {
    const dazed: CharacterInfo = createConditionedCharacter('a', [
      createTestCondition({
        id: 'dazed',
        intervalSeconds: 0,
        damagePerTick: 0,
        durationSeconds: 30,
      }),
    ]);

    const before: ConditionAdvance = advanceConditions(dazed, afterStart(20));
    expect(before.character).toBe(dazed);

    const after: ConditionAdvance = advanceConditions(dazed, afterStart(30));
    expect(after.character.health).toBe(12);
    expect(after.character.conditions).toEqual([]);
    expect(after.events.map((e) => e.type)).toEqual(['expired']);
  });

  it('applies no damage at 0 health but still moves lastTickAt and expires', () => {
    const dead: ConditionAdvance = advanceConditions(poisoned(0), afterStart(120));
    expect(dead.character.health).toBe(0);
    expect(dead.events).toEqual([]);
    expect(dead.character.conditions[0].lastTickAt).toBe(afterStart(120).toISOString());

    expect(advanceConditions(poisoned(0), afterStart(600)).character.conditions).toEqual([]);
  });

  it('stops damage events once the health reaches 0 during a jump', () => {
    const { events }: ConditionAdvance = advanceConditions(poisoned(2), afterStart(300));
    expect(events.filter((e) => e.type === 'damage')).toHaveLength(2);
  });

  it('changes nothing when the time is set back', () => {
    const ticked: CharacterInfo = createConditionedCharacter('a', [
      createTestCondition({ lastTickAt: afterStart(120).toISOString() }),
    ]);
    const { character, events }: ConditionAdvance = advanceConditions(ticked, afterStart(60));

    expect(character).toBe(ticked);
    expect(events).toEqual([]);
  });

  it('returns the same object for a character without conditions', () => {
    const plain: CharacterInfo = createConditionedCharacter('a', []);
    expect(advanceConditions(plain, afterStart(3600)).character).toBe(plain);
  });

  it('handles several conditions independently', () => {
    const both: CharacterInfo = createConditionedCharacter('a', [
      createTestCondition(),
      createTestCondition({
        id: 'blind',
        intervalSeconds: 0,
        damagePerTick: 0,
        durationSeconds: 60,
      }),
    ]);
    const { character }: ConditionAdvance = advanceConditions(both, afterStart(90));

    expect(character.health).toBe(11);
    expect(character.conditions.map((c) => c.id)).toEqual(['poison']);
  });
});
