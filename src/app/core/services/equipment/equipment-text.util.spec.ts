import { bonusSourcesText, formatBonus } from './equipment-text.util';

describe('equipment texts', () => {
  it('formats a bonus with a visible sign and a typographic minus', () => {
    expect(formatBonus(2)).toBe('+2');
    expect(formatBonus(-1)).toBe('−1');
    expect(formatBonus(0)).toBe('+0');
  });

  it('names the sources of a bonus for the tooltip', () => {
    expect(
      bonusSourcesText([
        { name: 'Turmschild', value: 2 },
        { name: 'Fluchring', value: -1 },
      ]),
    ).toBe('Turmschild +2, Fluchring −1');
  });
});
