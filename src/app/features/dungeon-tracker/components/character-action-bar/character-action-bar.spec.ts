import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterActionBar } from './character-action-bar';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

const ORK: CharacterInfo = { ...createTestCharacter('a'), name: 'Ork' };

/** Umgebendes Element wie Token oder Legendeneintrag, das Klicks und Doppelklicks mitzählt. */
@Component({
  imports: [CharacterActionBar],
  template: `
    <div (click)="outerClick()" (dblclick)="outerDoubleClick()">
      <app-character-action-bar [character]="character" />
    </div>
  `,
})
class ActionBarHost {
  character: CharacterInfo = ORK;
  outerClick: () => void = vi.fn();
  outerDoubleClick: () => void = vi.fn();
}

describe('CharacterActionBar', () => {
  let fixture: ComponentFixture<ActionBarHost>;
  let host: HTMLElement;
  const openEdit: ReturnType<typeof vi.fn> = vi.fn();
  const requestDamage: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(() => {
    [openEdit, requestDamage].forEach((mock) => mock.mockReset());
    TestBed.configureTestingModule({
      imports: [ActionBarHost],
      providers: [
        { provide: CharacterEditorService, useValue: { openEdit } },
        { provide: CharacterDamageService, useValue: { requestDamage } },
      ],
    });
    fixture = TestBed.createComponent(ActionBarHost);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  const toolbar: () => HTMLElement = (): HTMLElement =>
    host.querySelector('app-character-action-bar') as HTMLElement;

  const button: (label: string) => HTMLButtonElement = (label: string): HTMLButtonElement =>
    host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;

  it('is a toolbar named after the character', () => {
    expect(toolbar().getAttribute('role')).toBe('toolbar');
    expect(toolbar().getAttribute('aria-label')).toBe('Aktionen für Ork');
  });

  it('follows a renamed character in the toolbar name', () => {
    fixture.componentInstance.character = { ...ORK, name: 'Goblin' };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(toolbar().getAttribute('aria-label')).toBe('Aktionen für Goblin');
  });

  it('shows edit, health damage and armor damage in this order, with titles and icons', () => {
    const buttons: HTMLButtonElement[] = Array.from(toolbar().querySelectorAll('button'));

    expect(buttons.map((b) => [b.getAttribute('aria-label'), b.title])).toEqual([
      ['Charakter editieren', 'Charakter editieren'],
      ['Schaden auf Leben', 'Schaden auf Leben'],
      ['Schaden auf Rüstung', 'Schaden auf Rüstung'],
    ]);
    expect(buttons.map((b) => b.querySelector('img')?.getAttribute('src'))).toEqual([
      './img/edit.svg',
      './img/hit-critical.svg',
      './img/hit-normal.svg',
    ]);
  });

  it('"Charakter editieren" opens the editor with the character', () => {
    button('Charakter editieren').click();

    expect(openEdit).toHaveBeenCalledExactlyOnceWith(ORK);
    expect(requestDamage).not.toHaveBeenCalled();
  });

  it.each<[string, DamageTypes]>([
    ['Schaden auf Leben', DamageTypes.Critical],
    ['Schaden auf Rüstung', DamageTypes.Normal],
  ])('"%s" asks the damage service for %s damage', (label, damageType) => {
    button(label).click();

    expect(requestDamage).toHaveBeenCalledExactlyOnceWith(ORK, damageType);
    expect(openEdit).not.toHaveBeenCalled();
  });

  it('keeps clicks and double clicks away from the surrounding element', () => {
    button('Charakter editieren').click();
    toolbar().click();
    button('Schaden auf Leben').dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    expect(fixture.componentInstance.outerClick).not.toHaveBeenCalled();
    expect(fixture.componentInstance.outerDoubleClick).not.toHaveBeenCalled();
  });
});
