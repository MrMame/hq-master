import { TestBed } from '@angular/core/testing';

import { CharactersDbService } from './characters-db.service';
import { CharacterInfo } from '../../models/character-info.model';
import { describePersistedState } from '../../session-state/testing/describe-persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';

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
    TestBed.configureTestingModule({});
  });

  describePersistedState('characters', {
    key: SESSION_KEYS.characters,
    create: () => TestBed.inject(CharactersDbService),
    read: (s: CharactersDbService) => s.characters(),
    fallback: [],
    stored: { raw: [createCharacter('a')], expected: [createCharacter('a')] },
    mutate: (s: CharactersDbService) => s.writeCharacter(createCharacter('b')),
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

  it('should replace all characters on restore without sharing the input array', () => {
    service = TestBed.inject(CharactersDbService);
    service.writeCharacter(createCharacter('x'));
    const restored: CharacterInfo[] = [createCharacter('a'), createCharacter('b')];
    service.restore(restored);
    expect(service.sessionState()).toEqual(restored);
    expect(service.sessionState()).not.toBe(restored);
    expect(readStored().map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('should clear all characters on reset', () => {
    service = TestBed.inject(CharactersDbService);
    service.writeCharacter(createCharacter('a'));
    service.reset();
    expect(service.sessionState()).toEqual([]);
    expect(readStored()).toEqual([]);
  });

  it('should emit a new array reference on every mutation', () => {
    service = TestBed.inject(CharactersDbService);
    const before: CharacterInfo[] = service.characters();
    service.writeCharacter(createCharacter('a'));
    expect(service.characters()).not.toBe(before);
  });
});
