import {
  conditionFromTemplate,
  isWholeNumber,
  minutesOf,
  secondsOf,
  startConditions,
  withMinutes,
  withSeconds,
} from './condition-draft.util';
import { conditionTemplate } from '../../core/models/condition-templates.model';
import { afterStart, createTestCondition } from '../../core/testing/condition.fixtures';

describe('condition-draft.util', () => {
  it('copies the template values without a start time', () => {
    expect(conditionFromTemplate(conditionTemplate('dazed'))).toEqual({
      id: 'dazed',
      intervalSeconds: 0,
      damagePerTick: 0,
      durationSeconds: 30,
      description: conditionTemplate('dazed').description,
      startedAt: '',
      lastTickAt: '',
    });
  });

  it('starts new conditions now, keeps active ones and drops expired ones', () => {
    const fresh: ReturnType<typeof createTestCondition> = createTestCondition({
      id: 'blind',
      startedAt: '',
      lastTickAt: '',
    });
    const active: ReturnType<typeof createTestCondition> = createTestCondition();
    const expired: ReturnType<typeof createTestCondition> = createTestCondition({
      id: 'dazed',
      durationSeconds: 30,
    });
    const now: Date = afterStart(45);

    expect(startConditions([fresh, active, expired], now)).toEqual([
      { ...fresh, startedAt: now.toISOString(), lastTickAt: now.toISOString() },
      active,
    ]);
  });

  it.each<[number | null, number, boolean]>([
    [0, Infinity, true],
    [59, 59, true],
    [60, 59, false],
    [-1, Infinity, false],
    [1.5, Infinity, false],
    [null, Infinity, false],
  ])('treats %s (max %s) as a whole number: %s', (value, max, expected) => {
    expect(isWholeNumber(value, max)).toBe(expected);
  });

  it('splits and replaces minutes and seconds', () => {
    expect(minutesOf(450)).toBe(7);
    expect(secondsOf(450)).toBe(30);
    expect(withMinutes(450, 2)).toBe(150);
    expect(withSeconds(450, 5)).toBe(425);
  });
});
