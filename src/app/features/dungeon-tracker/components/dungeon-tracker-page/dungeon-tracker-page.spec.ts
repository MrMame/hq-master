import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DungeonTrackerPage } from './dungeon-tracker-page';
import { CharactersDbService } from '../../../../core/services/persistent/characters-database-service';
import { DungeonBoardService } from '../../services/dungeon-board-service';
import { CharacterInfo } from '../../../character-tracker/models/CharacterInfo';

const createCharacter = (id: string): CharacterInfo => ({
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
  let boardService: DungeonBoardService;

  const positionIds = (): string[] => boardService.positions().map((p) => p.characterId);

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DungeonTrackerPage],
      providers: [provideRouter([])],
    }).compileComponents();

    charactersDb = TestBed.inject(CharactersDbService);
    boardService = TestBed.inject(DungeonBoardService);
    charactersDb.writeCharacter(createCharacter('a'));

    fixture = TestBed.createComponent(DungeonTrackerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and place tokens for stored characters', () => {
    expect(component).toBeTruthy();
    expect(positionIds()).toEqual(['a']);
  });

  it('should react immediately when a character is added', async () => {
    charactersDb.writeCharacter(createCharacter('b'));
    await fixture.whenStable();
    expect(component.getCharacter('b')).toBeDefined();
    expect(positionIds()).toContain('b');
  });

  it('should react immediately when a character is removed', async () => {
    charactersDb.removeCharacter(createCharacter('a'));
    await fixture.whenStable();
    expect(component.getCharacter('a')).toBeUndefined();
    expect(positionIds()).not.toContain('a');
  });
});
