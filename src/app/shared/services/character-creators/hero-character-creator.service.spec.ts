import { TestBed } from '@angular/core/testing';

import { HeroCharacterCreatorService } from './hero-character-creator.service';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { ElementalTypes } from '../../../core/models/elemental-types.model';
import { CharacterAbilities } from '../../../core/models/character-abilities.model';

const ALL_ABILITIES: CharacterAbilities[] = Object.values(CharacterAbilities);

describe('HeroCharacterCreatorService', () => {
  let service: HeroCharacterCreatorService;

  const createWithRandom: (value: number) => CharacterInfo = (value: number): CharacterInfo => {
    vi.spyOn(Math, 'random').mockReturnValue(value);
    return service.CreateNewRandomHero();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroCharacterCreatorService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('creates a hero with matching id, name and description', () => {
    const hero: CharacterInfo = service.CreateNewRandomHero();

    expect(hero.name).toBe(`Hero ${hero.id}`);
    expect(hero.description).toContain(hero.name);
    expect(hero.image).toMatch(/^\.\/img\/hero-icon-.+\.jpeg$/);
    expect(Object.values(ElementalTypes)).toContain(hero.type);
  });

  it('uses the lower bounds when random returns 0', () => {
    const hero: CharacterInfo = createWithRandom(0);

    expect(hero).toMatchObject({ health: 50, armor: 5, attack: 10, defense: 5, speed: 5 });
    expect(hero.abilities).toEqual(ALL_ABILITIES.slice(0, 1));
    expect(hero.image).toBe('./img/hero-icon-barbarian.jpeg');
  });

  it('uses the upper bounds when random is close to 1', () => {
    const hero: CharacterInfo = createWithRandom(0.9999);

    expect(hero).toMatchObject({ health: 249, armor: 54, attack: 59, defense: 54, speed: 34 });
    expect(hero.abilities).toEqual(ALL_ABILITIES);
    expect(hero.image).toBe('./img/hero-icon-wizard.jpeg');
  });
});
