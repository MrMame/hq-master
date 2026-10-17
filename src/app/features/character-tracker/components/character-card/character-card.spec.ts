import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCard } from './character-card';
import { CharacterInfo } from '../../models/character-info.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';

const orc: CharacterInfo = {
  id: 'orc-1',
  name: 'Orc',
  type: 'Erde',
  health: 42,
  armor: 7,
  attack: 3,
  defense: 4,
  speed: 5,
  abilities: ['Keule'],
  image: '',
  description: 'Grimmig',
};

describe('CharacterCard', () => {
  let component: CharacterCard;
  let fixture: ComponentFixture<CharacterCard>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CharacterCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCard);
    fixture.componentRef.setInput('character', orc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should show the character', () => {
    expect(fixture.nativeElement.textContent).toContain('Grimmig');
  });

  it('should emit a changed copy without touching the input', () => {
    const emitted: CharacterInfo[] = [];
    component.characterChange.subscribe((c) => emitted.push(c));
    component.updateField('health', 30);
    expect(emitted).toEqual([{ ...orc, health: 30 }]);
    expect(orc.health).toBe(42);
  });

  it('should not write to the database itself', async () => {
    const writeSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(
      TestBed.inject(CharactersDbService),
      'writeCharacter',
    );
    component.updateField('speed', 9);
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(writeSpy).not.toHaveBeenCalled();
  });
});
