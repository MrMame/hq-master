import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { CharacterTrackerPage } from './character-tracker-page';
import { CharacterInfo } from '../../models/character-info.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';

const dialogCharacter: CharacterInfo = {
  id: '1700000000000-42',
  name: 'Monster Dialog',
  type: 'Feuer',
  health: 100,
  armor: 10,
  attack: 20,
  defense: 10,
  speed: 15,
  abilities: [],
  image: './img/monster-icon-Orc.png',
  description: 'Aus dem Dialog',
};

describe('CharacterTrackerPage', () => {
  let component: CharacterTrackerPage;
  let fixture: ComponentFixture<CharacterTrackerPage>;
  let charactersDbService: CharactersDbService;
  const dialogOpen: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    localStorage.clear();
    dialogOpen.mockReset();
    await TestBed.configureTestingModule({
      imports: [CharacterTrackerPage],
      providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterTrackerPage);
    component = fixture.componentInstance;
    charactersDbService = TestBed.inject(CharactersDbService);
    await fixture.whenStable();
  });

  function closeDialogWith(result: CharacterInfo | false | undefined): void {
    dialogOpen.mockReturnValue({ afterClosed: () => of(result) });
    component.addCharacter();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows no cards when no characters are stored', () => {
    expect(component.movableCharacterItems()).toEqual([]);
  });

  it('shows one card per stored character', () => {
    localStorage.setItem('characters', JSON.stringify([dialogCharacter]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CharacterTrackerPage],
      providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
    });
    const page: CharacterTrackerPage =
      TestBed.createComponent(CharacterTrackerPage).componentInstance;
    expect(page.movableCharacterItems().map((i) => i.characterInfo)).toEqual([dialogCharacter]);
  });

  it('persists the dialog character with its own id and adds a card', () => {
    const cardsBefore: number = component.movableCharacterItems().length;
    const writeSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(charactersDbService, 'writeCharacter');

    closeDialogWith(dialogCharacter);

    expect(writeSpy).toHaveBeenCalledWith(dialogCharacter);
    expect(charactersDbService.characters()).toContainEqual(dialogCharacter);
    const cards: CharacterInfo[] = component.movableCharacterItems().map((i) => i.characterInfo);
    expect(cards).toHaveLength(cardsBefore + 1);
    expect(cards[cards.length - 1].id).toBe('1700000000000-42');
  });

  const cancelResults: (false | undefined)[] = [false, undefined];
  it.each(cancelResults)('does nothing when the dialog closes with %s', (result) => {
    const cardsBefore: number = component.movableCharacterItems().length;
    const writeSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(charactersDbService, 'writeCharacter');

    closeDialogWith(result);

    expect(writeSpy).not.toHaveBeenCalled();
    expect(charactersDbService.characters()).toEqual([]);
    expect(component.movableCharacterItems()).toHaveLength(cardsBefore);
  });
});
