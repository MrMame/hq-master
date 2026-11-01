import {
  conditionEnd,
  formatClock,
  formatDuration,
  formatRemaining,
  isConditionExpired,
  nextTickAt,
  remainingSeconds,
} from './condition-time.util';
import { afterStart, createTestCondition } from '../../core/testing/condition.fixtures';

describe('condition-time.util', () => {
  it('computes the end from start and duration, none for an unlimited duration', () => {
    expect(conditionEnd(createTestCondition())).toBe(afterStart(600).getTime());
    expect(conditionEnd(createTestCondition({ durationSeconds: 0 }))).toBeNull();
  });

  it('is expired exactly at the end', () => {
    expect(isConditionExpired(createTestCondition(), afterStart(599))).toBe(false);
    expect(isConditionExpired(createTestCondition(), afterStart(600))).toBe(true);
    expect(isConditionExpired(createTestCondition({ durationSeconds: 0 }), afterStart(9999))).toBe(
      false,
    );
  });

  it('rounds the remaining seconds up and never below 0', () => {
    expect(remainingSeconds(createTestCondition(), afterStart(149.5))).toBe(451);
    expect(remainingSeconds(createTestCondition(), afterStart(700))).toBe(0);
    expect(remainingSeconds(createTestCondition({ durationSeconds: 0 }), afterStart(1))).toBeNull();
  });

  it('gives the next tick after lastTickAt', () => {
    expect(nextTickAt(createTestCondition())).toEqual(afterStart(60));
  });

  it.each<[string, Partial<ReturnType<typeof createTestCondition>>]>([
    ['interval 0', { intervalSeconds: 0 }],
    ['no damage', { damagePerTick: 0 }],
    ['the next tick after the end', { lastTickAt: afterStart(570).toISOString() }],
  ])('has no next tick with %s', (_case, overrides) => {
    expect(nextTickAt(createTestCondition(overrides))).toBeNull();
  });

  it('keeps an unlimited condition ticking', () => {
    const endless: ReturnType<typeof createTestCondition> = createTestCondition({
      durationSeconds: 0,
      lastTickAt: afterStart(6000).toISOString(),
    });
    expect(nextTickAt(endless)).toEqual(afterStart(6060));
  });

  it.each<[number, string]>([
    [0, '0:00'],
    [5, '0:05'],
    [450, '7:30'],
    [3600, '60:00'],
  ])('formats %s s as %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  it('formats the remaining time or "unbegrenzt"', () => {
    expect(formatRemaining(createTestCondition(), afterStart(150))).toBe('7:30');
    expect(formatRemaining(createTestCondition({ durationSeconds: 0 }), afterStart(150))).toBe(
      'unbegrenzt',
    );
  });

  it('formats the game time as a clock', () => {
    expect(formatClock(afterStart(65))).toBe('12:01:05');
  });
});
