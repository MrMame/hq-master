import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Mock, vi } from 'vitest';

import { CharacterTrackerPage } from '../components/character-tracker-page/character-tracker-page';
import { CharacterInfo } from '../../../core/models/character-info.model';

export const dialogCharacter: CharacterInfo = {
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

export interface CharacterTrackerPageSetup {
  fixture: ComponentFixture<CharacterTrackerPage>;
  /** Legt fest, womit der nächste geöffnete Dialog geschlossen wird. */
  closeDialogWith: (result: CharacterInfo | number | undefined) => void;
}

/** Rendert die Page mit gemocktem `MatDialog`. */
export async function setupCharacterTrackerPage(): Promise<CharacterTrackerPageSetup> {
  const dialogOpen: Mock = vi.fn();
  await TestBed.configureTestingModule({
    imports: [CharacterTrackerPage],
    providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
  }).compileComponents();
  const fixture: ComponentFixture<CharacterTrackerPage> =
    TestBed.createComponent(CharacterTrackerPage);
  await fixture.whenStable();
  return {
    fixture,
    closeDialogWith: (result) => dialogOpen.mockReturnValue({ afterClosed: () => of(result) }),
  };
}
