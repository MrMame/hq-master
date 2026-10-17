import { TestBed } from '@angular/core/testing';

import { CharactersDbService } from './characters-db.service';
import { CharacterInfo } from '../../../features/character-tracker/models/character-info.model';

const createCharacter: (id: string, name?: string) => CharacterInfo = (
  id: string,
  name: string = `Char ${id}`,
): CharacterInfo => ({
  id,
  name,
  type: 'hero',
  health: 10,
  armor: 1,
  attack: 2,
  defense: 2,
  speed: 3,
  abilities: [],
  image: '',
  description: '',
});

const readStored: () => CharacterInfo[] = (): CharacterInfo[] =>
  JSON.parse(localStorage.getItem('characters') ?? '[]') as CharacterInfo[];

describe('CharactersDbService', () => {
  let service: CharactersDbService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should be created with an empty signal when nothing is stored', () => {
    service = TestBed.inject(CharactersDbService);
    expect(service).toBeTruthy();
    expect(service.characters()).toEqual([]);
  });

  it('should initialise the signal from localStorage', () => {
    localStorage.setItem('characters', JSON.stringify([createCharacter('a')]));
    service = TestBed.inject(CharactersDbService);
    expect(service.characters().map((c) => c.id)).toEqual(['a']);
  });

  it('should start with an empty signal when the stored JSON is invalid', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    localStorage.setItem('characters', '{not json');
    service = TestBed.inject(CharactersDbService);
    expect(service.characters()).toEqual([]);
    vi.restoreAllMocks();
  });

  it('should add a new character to signal and localStorage', () => {
    service = TestBed.inject(CharactersDbService);
    service.writeCharacter(createCharacter('a'));
    expect(service.characters().map((c) => c.id)).toEqual(['a']);
    expect(readStored().map((c) => c.id)).toEqual(['a']);
  });

  it('should replace an existing character by id', () => {
    service = TestBed.inject(CharactersDbService);
    service.writeCharacter(createCharacter('a', 'Old'));
    service.writeCharacter(createCharacter('a', 'New'));
    expect(service.characters()).toHaveLength(1);
    expect(service.characters()[0].name).toBe('New');
    expect(readStored()[0].name).toBe('New');
  });

  it('should remove a character from signal and localStorage', () => {
    service = TestBed.inject(CharactersDbService);
    service.writeCharacter(createCharacter('a'));
    service.writeCharacter(createCharacter('b'));
    service.removeCharacter(createCharacter('a'));
    expect(service.characters().map((c) => c.id)).toEqual(['b']);
    expect(readStored().map((c) => c.id)).toEqual(['b']);
  });

  it('should emit a new array reference on every mutation', () => {
    service = TestBed.inject(CharactersDbService);
    const before: CharacterInfo[] = service.characters();
    service.writeCharacter(createCharacter('a'));
    expect(service.characters()).not.toBe(before);
  });
});
