import { NUMBER_RECORD_CODEC } from './number-record-codec.util';

describe('NUMBER_RECORD_CODEC', () => {
  it('should store and restore numbers per id unchanged', () => {
    expect(NUMBER_RECORD_CODEC.encode({ a: 300, b: 212.5 })).toEqual({ a: 300, b: 212.5 });
    expect(NUMBER_RECORD_CODEC.decode({ a: 300, b: 212.5 })).toEqual({ a: 300, b: 212.5 });
    expect(NUMBER_RECORD_CODEC.decode({})).toEqual({});
  });

  it('should drop entries that are no positive finite number', () => {
    expect(
      NUMBER_RECORD_CODEC.decode({ ok: 250, text: '250', zero: 0, neg: -5, nan: null, deep: {} }),
    ).toEqual({ ok: 250 });
  });

  it('should reject anything that is no object of numbers', () => {
    expect(NUMBER_RECORD_CODEC.decode([250])).toBeNull();
    expect(NUMBER_RECORD_CODEC.decode('250')).toBeNull();
    expect(NUMBER_RECORD_CODEC.decode(250)).toBeNull();
  });
});
