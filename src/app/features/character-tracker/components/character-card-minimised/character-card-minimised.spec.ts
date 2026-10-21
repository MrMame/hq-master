import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCardMinimised } from './character-card-minimised';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../models/damage-types.model';

const orc: CharacterInfo = {
  id: 'orc-1',
  name: 'Orc',
  type: 'Erde',
  health: 42,
  armor: 7,
  attack: 1,
  defense: 1,
  speed: 1,
  abilities: [],
  image: './img/monster-icon-Orc.png',
  description: '',
};

describe('CharacterCardMinimised', () => {
  let component: CharacterCardMinimised;
  let fixture: ComponentFixture<CharacterCardMinimised>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCardMinimised],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCardMinimised);
    fixture.componentRef.setInput('character', orc);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should show health and armor', () => {
    expect(host.textContent).toContain('42');
    expect(host.textContent).toContain('7');
  });

  it('should request normal and critical damage', () => {
    const emitted: DamageTypes[] = [];
    component.damageRequested.subscribe((type) => emitted.push(type));
    host.querySelectorAll('button').forEach((button) => button.click());
    expect(emitted).toEqual([DamageTypes.Normal, DamageTypes.Critical]);
  });
});
