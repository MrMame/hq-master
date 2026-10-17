import { parseDateTimeLocal } from './date-time-local.util';

describe('parseDateTimeLocal', () => {
  it('should parse a datetime-local value', () => {
    expect(parseDateTimeLocal('2390-05-06T07:30')).toEqual({
      year: 2390,
      month: 5,
      day: 6,
      hours: 7,
      minutes: 30,
      seconds: 0,
    });
  });

  it('should return null for an invalid value', () => {
    expect(parseDateTimeLocal('')).toBeNull();
  });
});
