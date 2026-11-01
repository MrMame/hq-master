import { GAME_LOG_CODEC, isGameLogEntry } from './game-log-codec.util';
import { createTestLog, createTestLogEntry } from '../../testing/game-log.fixtures';

describe('game-log-codec.util', () => {
  it('accepts entries with and without optional fields', () => {
    expect(createTestLog().every(isGameLogEntry)).toBe(true);
  });

  it.each([
    ['no object', 'text'],
    ['missing text', { ...createTestLogEntry(), text: undefined }],
    ['unknown type', { ...createTestLogEntry(), type: 'trap' }],
    ['numeric character id', { ...createTestLogEntry(), characterId: 1 }],
    ['numeric character name', { ...createTestLogEntry(), characterName: 1 }],
    ['unknown condition', { ...createTestLogEntry(), conditionId: 'fire' }],
    ['text value', { ...createTestLogEntry(), value: '3' }],
    ['unknown damage type', { ...createTestLogEntry(), damageType: 'Magic' }],
  ])('rejects an entry with %s', (_case: string, entry: unknown) => {
    expect(isGameLogEntry(entry)).toBe(false);
  });

  it('decodes only valid entries and rejects anything but a list', () => {
    expect(GAME_LOG_CODEC.decode([createTestLogEntry(), { id: 1 }])).toEqual([
      createTestLogEntry(),
    ]);
    expect(GAME_LOG_CODEC.decode({})).toBeNull();
    expect(GAME_LOG_CODEC.encode(createTestLog())).toEqual(createTestLog());
  });
});
