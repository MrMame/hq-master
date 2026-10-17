import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { CharacterTrackerPage } from './character-tracker-page';
import { CharacterInfo } from '../../models/character-info.model';
import { DamageTypes } from '../../models/damage-types.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterCardLayoutService } from '../../services/character-card-layout.service';
import { CharacterCard } from '../character-card/character-card';
import { By } from '@angular/platform-browser';

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
  let writeSpy: ReturnType<typeof vi.spyOn>;
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
    writeSpy = vi.spyOn(charactersDbService, 'writeCharacter');
    await fixture.whenStable();
  });

  function closeDialogWith(result: CharacterInfo | number | undefined): void {
    dialogOpen.mockReturnValue({ afterClosed: () => of(result) });
  }

  it('shows no cards when no characters are stored', () => {
    expect(component.characters()).toEqual([]);
    expect(fixture.nativeElement.querySelector('app-movable-character-card')).toBeNull();
  });

  it('renders one movable card per stored character', async () => {
    charactersDbService.writeCharacter(dialogCharacter);
    await fixture.whenStable();
    const cards: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(
      'app-movable-character-card',
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('Monster Dialog');
  });

  it('persists a random monster', () => {
    component.addMonster();
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(component.characters()).toHaveLength(1);
  });

  it('persists a random hero', () => {
    component.addHero();
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(component.characters()).toHaveLength(1);
  });

  it('gives every new character its own id', () => {
    component.addMonster();
    component.addMonster();
    component.removeCharacter(component.characters()[0]);
    component.addHero();
    const ids: string[] = component.characters().map((c) => c.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('persists the dialog character with its own id', () => {
    closeDialogWith(dialogCharacter);
    component.addCharacter();
    expect(writeSpy).toHaveBeenCalledWith(dialogCharacter);
    expect(component.characters()).toEqual([dialogCharacter]);
  });

  it('does nothing when the add dialog is cancelled', () => {
    closeDialogWith(undefined);
    component.addCharacter();
    expect(writeSpy).not.toHaveBeenCalled();
    expect(component.characters()).toEqual([]);
  });

  it('removes a character', () => {
    const removeSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(charactersDbService, 'removeCharacter');
    charactersDbService.writeCharacter(dialogCharacter);
    component.removeCharacter(dialogCharacter);
    expect(removeSpy).toHaveBeenCalledWith(dialogCharacter);
    expect(component.characters()).toEqual([]);
  });

  it('persists a new character object with the damage applied', () => {
    charactersDbService.writeCharacter(dialogCharacter);
    writeSpy.mockClear();
    closeDialogWith(15);
    component.takeDamage(dialogCharacter, DamageTypes.Normal);
    expect(writeSpy).toHaveBeenCalledWith({ ...dialogCharacter, armor: 0, health: 95 });
    expect(component.characters()[0]).not.toBe(dialogCharacter);
    expect(dialogCharacter.health).toBe(100);
  });

  it('does nothing when the damage dialog is cancelled', () => {
    closeDialogWith(undefined);
    component.takeDamage(dialogCharacter, DamageTypes.Critical);
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('writes a change in the full card view exactly once', async () => {
    charactersDbService.writeCharacter(dialogCharacter);
    TestBed.inject(CharacterCardLayoutService).toggleMinimised(dialogCharacter.id);
    await fixture.whenStable();
    writeSpy.mockClear();
    const card: CharacterCard = fixture.debugElement.query(
      By.directive(CharacterCard),
    ).componentInstance;
    card.updateField('health', 1);
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(writeSpy).toHaveBeenCalledExactlyOnceWith({ ...dialogCharacter, health: 1 });
  });
});
