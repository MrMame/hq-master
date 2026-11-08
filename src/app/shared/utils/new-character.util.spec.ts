import { createNewCharacter } from './new-character.util';
import { CharacterInfo } from '../../core/models/character-info.model';

describe('createNewCharacter', () => {
  afterEach(() => vi.restoreAllMocks());

  it('starts with an empty name, zero stats and no image', () => {
    const { id, ...values } = createNewCharacter();

    expect(id).toEqual(expect.any(String));
    expect(values).toEqual({
      name: '',
      Leben: 0,
      Ruestung: 0,
      Tempo: 0,
      image: '',
      description: '',
      conditions: [],
      movedThisRound: false,
    });
  });

  it('builds the id from time and a random number', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
    vi.spyOn(Math, 'random').mockReturnValue(0.042);

    expect(createNewCharacter().id).toBe('1700000000000-42');
  });

  it('returns independent objects and condition lists on every call', () => {
    const first: CharacterInfo = createNewCharacter();
    const second: CharacterInfo = createNewCharacter();

    expect(second).not.toBe(first);
    expect(second.conditions).not.toBe(first.conditions);
  });
});
