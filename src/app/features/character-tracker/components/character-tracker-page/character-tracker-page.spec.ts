import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CharacterTrackerPage } from './character-tracker-page';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { MovableCharacterCard } from '../movable-character-card/movable-character-card';
import { clickButton } from '../../../../shared/testing/click-button';
import {
  dialogCharacter,
  setupCharacterTrackerPage,
} from '../../testing/character-tracker-page.fixtures';

describe('CharacterTrackerPage', () => {
  let fixture: ComponentFixture<CharacterTrackerPage>;
  let host: HTMLElement;
  let closeDialogWith: (result: CharacterInfo | undefined) => void;
  let charactersDbService: CharactersDbService;
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    ({ fixture, closeDialogWith } = await setupCharacterTrackerPage());
    host = fixture.nativeElement as HTMLElement;
    charactersDbService = TestBed.inject(CharactersDbService);
    writeSpy = vi.spyOn(charactersDbService, 'writeCharacter');
  });

  const characters: () => CharacterInfo[] = (): CharacterInfo[] => charactersDbService.characters();

  it('shows no cards when no characters are stored', () => {
    expect(characters()).toEqual([]);
    expect(host.querySelector('app-movable-character-card')).toBeNull();
  });

  it('renders one movable card per stored character', async () => {
    charactersDbService.writeCharacter(dialogCharacter);
    await fixture.whenStable();
    const cards: NodeListOf<Element> = host.querySelectorAll('app-movable-character-card');
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('Monster Dialog');
  });

  it.each<[string]>([['Add Monster'], ['Add Hero']])('"%s" persists one character', (label) => {
    clickButton(host, label);
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(characters()).toHaveLength(1);
  });

  it('gives every new character its own id', async () => {
    clickButton(host, 'Add Monster');
    clickButton(host, 'Add Monster');
    await fixture.whenStable();
    (
      fixture.debugElement.query(By.directive(MovableCharacterCard))
        .componentInstance as MovableCharacterCard
    ).removeRequested.emit();
    clickButton(host, 'Add Hero');
    const ids: string[] = characters().map((c) => c.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('persists the dialog character with its own id', () => {
    closeDialogWith(dialogCharacter);
    clickButton(host, 'Add Character');
    expect(writeSpy).toHaveBeenCalledWith(dialogCharacter);
    expect(characters()).toEqual([dialogCharacter]);
  });

  it('does nothing when the add dialog is cancelled', () => {
    closeDialogWith(undefined);
    clickButton(host, 'Add Character');
    expect(writeSpy).not.toHaveBeenCalled();
    expect(characters()).toEqual([]);
  });
});
