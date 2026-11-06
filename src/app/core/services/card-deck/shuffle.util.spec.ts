import { shuffled } from './shuffle.util';

describe('shuffled', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a new list with the same items and leaves the input unchanged', () => {
    const items: readonly number[] = [1, 2, 3, 4];
    const result: number[] = shuffled(items);
    expect(result).not.toBe(items);
    expect([...result].sort()).toEqual([1, 2, 3, 4]);
    expect(items).toEqual([1, 2, 3, 4]);
  });

  it('swaps items according to the random numbers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(shuffled([1, 2, 3])).toEqual([2, 3, 1]);
  });
});
