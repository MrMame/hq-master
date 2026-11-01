import { TestBed } from '@angular/core/testing';

import { CharactersDbService } from './characters-db.service';
import { CharacterInfo } from '../../models/character-info.model';
import { createTestCharacter } from '../../testing/character.fixtures';

const readStored: () => CharacterInfo[] = (): CharacterInfo[] =>
  JSON.parse(localStorage.getItem('characters') ?? '[]') as CharacterInfo[];

const movedFlags: (characters: CharacterInfo[]) => boolean[] = (characters) =>
  characters.map((c) => c.movedThisRound);

describe('CharactersDbService – round flag', () => {
  let service: CharactersDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharactersDbService);
    service.writeCharacter(createTestCharacter('a'));
    service.writeCharacter(createTestCharacter('b'));
  });

  it('marks only the given character as moved in signal and storage', () => {
    service.markMoved('a');
    expect(movedFlags(service.characters())).toEqual([true, false]);
    expect(movedFlags(readStored())).toEqual([true, false]);
  });

  it('keeps the list unchanged when the character is already moved or unknown', () => {
    service.markMoved('a');
    const before: CharacterInfo[] = service.characters();
    service.markMoved('a');
    service.markMoved('unknown');
    expect(service.characters()).toEqual(before);
  });

  it('clears the flag of all characters in signal and storage', () => {
    service.markMoved('a');
    service.markMoved('b');
    service.clearMovedThisRound();
    expect(movedFlags(service.characters())).toEqual([false, false]);
    expect(movedFlags(readStored())).toEqual([false, false]);
  });
});
