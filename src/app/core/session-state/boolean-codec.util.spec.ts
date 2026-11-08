import { BOOLEAN_CODEC } from './boolean-codec.util';

describe('BOOLEAN_CODEC', () => {
  it('should store and restore true and false unchanged', () => {
    expect(BOOLEAN_CODEC.encode(true)).toBe(true);
    expect(BOOLEAN_CODEC.decode(true)).toBe(true);
    expect(BOOLEAN_CODEC.decode(false)).toBe(false);
  });

  it('should reject anything that is not a boolean', () => {
    expect(BOOLEAN_CODEC.decode('true')).toBeNull();
    expect(BOOLEAN_CODEC.decode(1)).toBeNull();
    expect(BOOLEAN_CODEC.decode({})).toBeNull();
  });
});
