import { gameTimeFromDate } from './game-time';

describe('gameTimeFromDate', () => {
  it('should convert a date into a complete GameTime with 1-based month', () => {
    expect(gameTimeFromDate(new Date(2390, 4, 6, 7, 30, 15))).toEqual({
      year: 2390,
      month: 5,
      day: 6,
      hours: 7,
      minutes: 30,
      seconds: 15,
    });
  });
});
