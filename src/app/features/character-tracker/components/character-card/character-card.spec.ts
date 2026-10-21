import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCard } from './character-card';
import { CharacterInfo } from '../../../../core/models/character-info.model';
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
    await TestBed.configureTestingModule({
      imports: [CharacterCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCard);
    fixture.componentRef.setInput('character', orc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.useRealTimers());

  it('should show the character', () => {
    expect(fixture.nativeElement.textContent).toContain('Grimmig');
  });

  it.each<[number, keyof CharacterInfo]>([
    [0, 'health'],
    [1, 'defense'],
    [2, 'speed'],
    [3, 'attack'],
  ])('should emit a numeric change when input %i (%s) is edited', (index, key) => {
    const emitted: CharacterInfo[] = [];
    component.characterChange.subscribe((c) => emitted.push(c));
    const field: HTMLInputElement = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="number"]',
    )[index] as HTMLInputElement;

    field.value = '17';
    field.dispatchEvent(new Event('input'));

    expect(emitted).toEqual([{ ...orc, [key]: 17 }]);
    expect(orc[key]).not.toBe(17);
  });

  it('should not write to the database itself', () => {
    vi.useFakeTimers();
    const writeSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(
      TestBed.inject(CharactersDbService),
      'writeCharacter',
    );
    const speedField: HTMLInputElement = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="number"]',
    )[2] as HTMLInputElement;
    speedField.value = '9';
    speedField.dispatchEvent(new Event('input'));
    // Früher per debounceTime verzögert geschrieben; alle anstehenden Timer ablaufen lassen,
    // damit auch ein verspäteter Schreibzugriff auffallen würde.
    vi.runAllTimers();
    expect(writeSpy).not.toHaveBeenCalled();
  });
});
