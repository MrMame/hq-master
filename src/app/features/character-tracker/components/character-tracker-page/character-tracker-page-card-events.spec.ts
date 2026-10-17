import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CharacterTrackerPage } from './character-tracker-page';
import { CharacterInfo } from '../../models/character-info.model';
import { DamageTypes } from '../../models/damage-types.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterCardLayoutService } from '../../services/character-card-layout.service';
import { MovableCharacterCard } from '../movable-character-card/movable-character-card';
import {
  dialogCharacter,
  setupCharacterTrackerPage,
} from '../../testing/character-tracker-page.fixtures';

describe('CharacterTrackerPage – card events', () => {
  let fixture: ComponentFixture<CharacterTrackerPage>;
  let closeDialogWith: (result: number | undefined) => void;
  let charactersDbService: CharactersDbService;
  let writeSpy: ReturnType<typeof vi.spyOn>;
  let card: MovableCharacterCard;

  beforeEach(async () => {
    ({ fixture, closeDialogWith } = await setupCharacterTrackerPage());
    charactersDbService = TestBed.inject(CharactersDbService);
    charactersDbService.writeCharacter(dialogCharacter);
    await fixture.whenStable();
    card = fixture.debugElement.query(By.directive(MovableCharacterCard))
      .componentInstance as MovableCharacterCard;
    writeSpy = vi.spyOn(charactersDbService, 'writeCharacter');
  });

  afterEach(() => vi.useRealTimers());

  const characters: () => CharacterInfo[] = (): CharacterInfo[] => charactersDbService.characters();

  it('removes a character when its card requests it', () => {
    const removeSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(charactersDbService, 'removeCharacter');
    card.removeRequested.emit();
    expect(removeSpy).toHaveBeenCalledWith(dialogCharacter);
    expect(characters()).toEqual([]);
  });

  it('persists a new character object with the damage applied', () => {
    closeDialogWith(15);
    card.damageRequested.emit(DamageTypes.Normal);
    expect(writeSpy).toHaveBeenCalledWith({ ...dialogCharacter, armor: 0, health: 95 });
    expect(characters()[0]).not.toBe(dialogCharacter);
    expect(dialogCharacter.health).toBe(100);
  });

  it('does nothing when the damage dialog is cancelled', () => {
    closeDialogWith(undefined);
    card.damageRequested.emit(DamageTypes.Critical);
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('writes a change in the full card view exactly once', async () => {
    TestBed.inject(CharacterCardLayoutService).toggleMinimised(dialogCharacter.id);
    await fixture.whenStable();
    vi.useFakeTimers();
    const healthField: HTMLInputElement = (fixture.nativeElement as HTMLElement).querySelector(
      'app-character-card input[type="number"]',
    ) as HTMLInputElement;
    healthField.value = '1';
    healthField.dispatchEvent(new Event('input'));
    // Früher per debounceTime verzögert geschrieben; alle anstehenden Timer ablaufen lassen,
    // damit auch ein verspäteter Schreibzugriff auffallen würde.
    vi.runAllTimers();
    expect(writeSpy).toHaveBeenCalledExactlyOnceWith({ ...dialogCharacter, health: 1 });
  });
});
