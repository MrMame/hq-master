import { MockInstance } from 'vitest';
import { cardCount } from './card-count.util';

describe('card-count.util', () => {
  let warn: MockInstance<(...data: unknown[]) => void>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => warn.mockRestore());

  it('is 1 without the attribute and does not warn', () => {
    expect(cardCount(null, 'a')).toBe(1);
    expect(warn).not.toHaveBeenCalled();
  });

  it('reads whole numbers from 1 on, also with surrounding spaces', () => {
    expect(cardCount('1', 'a')).toBe(1);
    expect(cardCount('3', 'a')).toBe(3);
    expect(cardCount(' 12 ', 'a')).toBe(12);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each(['0', '-1', '2.5', 'drei', '', '+2'])('falls back to 1 for "%s" and warns', (raw) => {
    expect(cardCount(raw, 'gold')).toBe(1);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).toContain('gold');
  });
});
