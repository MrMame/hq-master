import {
  conditionText,
  damageText,
  equipmentText,
  formatClock,
  formatSpan,
  timeChangeText,
} from './game-log-text.util';
import { DamageTypes } from '../../models/damage-types.model';

const at: (hours: number, minutes?: number, seconds?: number) => Date = (
  hours: number,
  minutes: number = 0,
  seconds: number = 0,
): Date => new Date(2381, 0, 1, hours, minutes, seconds);

describe('game-log-text.util', () => {
  it('formats the clock with leading zeros', () => {
    expect(formatClock(at(8, 5, 3))).toBe('08:05:03');
  });

  it.each([
    [0, '0 s'],
    [10, '10 s'],
    [90, '1 min 30 s'],
    [3600, '1 h'],
    [3725, '1 h 2 min 5 s'],
    [-60, '1 min'],
  ])('formats a span of %i s as "%s"', (seconds: number, expected: string) => {
    expect(formatSpan(seconds)).toBe(expected);
  });

  it('describes a time step with old and new time', () => {
    expect(timeChangeText(at(12), at(13), 'add')).toBe('+1 h (12:00:00 → 13:00:00)');
  });

  it('marks a negative time step with a minus sign', () => {
    expect(timeChangeText(at(12), at(11, 59, 50), 'add')).toBe('−10 s (12:00:00 → 11:59:50)');
  });

  it('describes a set game time', () => {
    expect(timeChangeText(at(12), at(8), 'set')).toBe('Spielzeit gesetzt (12:00:00 → 08:00:00)');
  });

  it.each([
    ['damage', 'Grimgor: 1 Schaden durch Gift'],
    ['expired', 'Gift bei Grimgor abgelaufen'],
    ['set', 'Gift bei Grimgor gesetzt'],
    ['removed', 'Gift bei Grimgor entfernt'],
  ] as const)('describes a condition event of kind "%s"', (kind, expected) => {
    expect(conditionText(kind, 'Grimgor', 'poison', 1)).toBe(expected);
  });

  it('uses the condition label and "Unbenannt" for a missing or empty name', () => {
    expect(conditionText('expired', undefined, 'blind')).toBe('Blind bei Unbenannt abgelaufen');
    expect(conditionText('damage', '', 'dazed')).toBe('Unbenannt: 0 Schaden durch Benommen');
  });

  it('describes manual damage on armor and on health', () => {
    expect(damageText('Lyra', 3, DamageTypes.Normal)).toBe('Lyra: 3 Schaden auf Rüstung');
    expect(damageText(undefined, 2, DamageTypes.Critical)).toBe('Unbenannt: 2 Schaden auf Leben');
  });

  it('describes assigning and discarding equipment', () => {
    expect(equipmentText('Barbar der Rote', 'Runenrüstung', 'Körper')).toBe(
      'Barbar der Rote erhält Runenrüstung (Körper)',
    );
    expect(equipmentText(undefined, 'Runenrüstung', null)).toBe('Unbenannt legt Runenrüstung ab');
  });
});
