import { createRandomCharacter, createRandomName } from './random-character.util';
import { CharacterInfo } from '../../core/models/character-info.model';
import { CHARACTER_IMAGES } from '../../core/models/character-images.model';
import { CharacterNameList } from '../../core/models/character-names/character-name-list.model';
import { CHARACTER_NAMES_BY_IMAGE } from '../../core/models/character-names/character-names.model';
import { BARBARIAN_NAMES } from '../../core/models/character-names/barbarian-names.model';
import { ZOMBIE_NAMES } from '../../core/models/character-names/zombie-names.model';

describe('createRandomCharacter', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses the lower bounds and the first image, name and type at random 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const name: string = `${BARBARIAN_NAMES.firstNames[0]} ${BARBARIAN_NAMES.lastNames[0]}`;

    expect(createRandomCharacter('id-1')).toEqual({
      id: 'id-1',
      name,
      type: 'Feuer',
      health: 50,
      armor: 5,
      attack: 10,
      defense: 5,
      speed: 5,
      abilities: ['Flammenwerfer'],
      image: CHARACTER_IMAGES[0],
      description: `Dies ist eine zufällige Beschreibung für ${name}.`,
    });
  });

  it('uses the upper bounds and the last image, name and type just below random 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999);
    const name: string = `${ZOMBIE_NAMES.firstNames.at(-1)} ${ZOMBIE_NAMES.lastNames.at(-1)}`;

    expect(createRandomCharacter('id-2')).toEqual({
      id: 'id-2',
      name,
      type: 'Luft',
      health: 249,
      armor: 54,
      attack: 59,
      defense: 54,
      speed: 34,
      abilities: ['Flammenwerfer', 'Aquatische Angriffe', 'Erdbeben', 'Windstoß'],
      image: CHARACTER_IMAGES.at(-1),
      description: `Dies ist eine zufällige Beschreibung für ${name}.`,
    });
  });

  it('keeps the given id and picks the name from the lists of the image class', () => {
    const character: CharacterInfo = createRandomCharacter('kept-id');
    const names: CharacterNameList = CHARACTER_NAMES_BY_IMAGE[character.image];
    const [firstName, lastName] = character.name.split(' ');

    expect(character.id).toBe('kept-id');
    expect(CHARACTER_IMAGES).toContain(character.image);
    expect(names.firstNames).toContain(firstName);
    expect(names.lastNames).toContain(lastName);
    expect(character.name.length).toBeGreaterThanOrEqual(12);
    expect(character.name.length).toBeLessThanOrEqual(20);
  });
});

describe('createRandomName', () => {
  afterEach(() => vi.restoreAllMocks());

  const names: CharacterNameList = {
    firstNames: ['Al', 'Alf'],
    lastNames: ['Bo', 'Sturmaxt'],
  };

  it('draws again while the combination is shorter than 12 characters', () => {
    // „Al Bo“ (5), „Al Sturmaxt“ (11), dann „Alf Sturmaxt“ (12)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5);

    expect(createRandomName(names)).toBe('Alf Sturmaxt');
    expect(Math.random).toHaveBeenCalledTimes(6);
  });

  it('accepts a combination of exactly 12 characters on the first draw', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.5);

    expect(createRandomName(names)).toBe('Alf Sturmaxt');
    expect(Math.random).toHaveBeenCalledTimes(2);
  });
});
