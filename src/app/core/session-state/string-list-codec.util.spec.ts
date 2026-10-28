import { STRING_LIST_CODEC } from './string-list-codec.util';

describe('STRING_LIST_CODEC', () => {
  it('should store and restore a list of texts unchanged', () => {
    expect(STRING_LIST_CODEC.encode(['a', 'b'])).toEqual(['a', 'b']);
    expect(STRING_LIST_CODEC.decode(['a', 'b'])).toEqual(['a', 'b']);
    expect(STRING_LIST_CODEC.decode([])).toEqual([]);
  });

  it('should reject anything that is not a list of texts', () => {
    expect(STRING_LIST_CODEC.decode({ a: 1 })).toBeNull();
    expect(STRING_LIST_CODEC.decode('a')).toBeNull();
    expect(STRING_LIST_CODEC.decode(['a', 2])).toBeNull();
  });
});
