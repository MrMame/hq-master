import { TestBed } from '@angular/core/testing';

import { MonsterCharacterCreatorService } from './monster-character-creator.service';
import { CharacterInfo } from '../../models/character-info.model';
import { ElementalTypes } from '../../models/elemental-types.model';
import { CharacterAbilities } from '../../models/character-abilities.model';

const ALL_ABILITIES: CharacterAbilities[] = Object.values(CharacterAbilities);

describe('MonsterCharacterCreatorService', () => {
  let service: MonsterCharacterCreatorService;

  const createWithRandom: (value: number) => CharacterInfo = (value: number): CharacterInfo => {
    vi.spyOn(Math, 'random').mockReturnValue(value);
    return service.CreateNewRandomMonster();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonsterCharacterCreatorService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates a monster with matching id, name and description', () => {
    const monster: CharacterInfo = service.CreateNewRandomMonster();

    expect(monster.name).toBe(`Monster ${monster.id}`);
    expect(monster.description).toContain(monster.name);
    expect(monster.image).toMatch(/^\.\/img\/monster-icon-.+\.png$/);
    expect(Object.values(ElementalTypes)).toContain(monster.type);
  });

  it('uses the lower bounds when random returns 0', () => {
    const monster: CharacterInfo = createWithRandom(0);

    expect(monster).toMatchObject({ health: 50, armor: 5, attack: 10, defense: 5, speed: 5 });
    expect(monster.abilities).toEqual(ALL_ABILITIES.slice(0, 1));
    expect(monster.image).toBe('./img/monster-icon-ChaosWarrior.png');
  });

  it('uses the upper bounds when random is close to 1', () => {
    const monster: CharacterInfo = createWithRandom(0.9999);

    expect(monster).toMatchObject({ health: 249, armor: 54, attack: 59, defense: 54, speed: 34 });
    expect(monster.abilities).toEqual(ALL_ABILITIES);
    expect(monster.image).toBe('./img/monster-icon-Zombie.png');
  });
});
