import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DungeonTrackerPage } from './dungeon-tracker-page';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { CharacterInfo } from '../../../character-tracker/models/character-info.model';

const createCharacter: (id: string) => CharacterInfo = (id: string): CharacterInfo => ({
  id,
  name: `Char ${id}`,
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

describe('DungeonTrackerPage', () => {
  let component: DungeonTrackerPage;
  let fixture: ComponentFixture<DungeonTrackerPage>;
  let charactersDb: CharactersDbService;

  const tokenIds: () => string[] = (): string[] =>
    component.tokens().map((t) => t.position.characterId);

  const renderedTokens: () => number = (): number =>
    (fixture.nativeElement as HTMLElement).querySelectorAll('app-dungeon-token').length;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DungeonTrackerPage],
      providers: [provideRouter([])],
    }).compileComponents();

    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createCharacter('a'));

    fixture = TestBed.createComponent(DungeonTrackerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and show tokens for stored characters', () => {
    expect(component).toBeTruthy();
    expect(tokenIds()).toEqual(['a']);
    expect(renderedTokens()).toBe(1);
  });

  it('should react immediately when a character is added', async () => {
    charactersDb.writeCharacter(createCharacter('b'));
    await fixture.whenStable();
    expect(tokenIds()).toEqual(['a', 'b']);
    expect(renderedTokens()).toBe(2);
  });

  it('should react immediately when a character is removed', async () => {
    charactersDb.removeCharacter(createCharacter('a'));
    await fixture.whenStable();
    expect(tokenIds()).toEqual([]);
    expect(renderedTokens()).toBe(0);
  });

  it('should not render a token for a position without character', async () => {
    TestBed.inject(DungeonBoardService).updatePosition('orphan', 4, 4);
    await fixture.whenStable();
    expect(tokenIds()).toEqual(['a']);
    expect(renderedTokens()).toBe(1);
  });
});
