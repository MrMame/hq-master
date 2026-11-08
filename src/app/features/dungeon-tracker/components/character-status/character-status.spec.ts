import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterStatus } from './character-status';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import {
  assignedCard,
  createEquipmentDeckState,
  RUNE_ARMOR,
} from '../../../../core/testing/deck.fixtures';

describe('CharacterStatus', () => {
  let fixture: ComponentFixture<CharacterStatus>;

  const render: (character: CharacterInfo) => void = (character: CharacterInfo): void => {
    fixture.componentRef.setInput('character', character);
    fixture.detectChanges();
  };

  const value: (label: string) => HTMLElement = (label: string): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector(`[aria-label="${label}"]`) as HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CharacterStatus] });
    fixture = TestBed.createComponent(CharacterStatus);
  });

  it.each<[string, string, string]>([
    ['Leben', 'character-status__leben', '12'],
    ['Rüstung', 'character-status__ruestung', '2'],
  ])(
    'shows %s as current value without maximum, with its class and title',
    (label, className, expected) => {
      render(createTestCharacter('a'));

      expect(value(label).classList).toContain(className);
      expect(value(label).title).toBe(label);
      expect(value(label).textContent?.trim()).toBe(expected);
    },
  );

  it('shows the stored value regardless of equipment', () => {
    TestBed.inject(CardManagerService).restore({
      ...createEquipmentDeckState('a'),
      assigned: [assignedCard(RUNE_ARMOR, 'a', 'body')],
    });
    render({ ...createTestCharacter('a'), Ruestung: 6 });

    expect(value('Rüstung').textContent?.trim()).toBe('6');
    expect(value('Leben').textContent?.trim()).toBe('12');
  });

  it('updates when the character input changes', () => {
    render(createTestCharacter('a'));
    render({ ...createTestCharacter('a'), Leben: 5, Ruestung: 3 });

    expect(value('Leben').textContent?.trim()).toBe('5');
    expect(value('Rüstung').textContent?.trim()).toBe('3');
  });

  it('shows the values without buttons by default', () => {
    render(createTestCharacter('a'));

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('button')).toHaveLength(0);
  });

  it.each<[string, DamageTypes, string]>([
    ['Schaden auf Leben', DamageTypes.Critical, 'Leben'],
    ['Schaden auf Rüstung', DamageTypes.Normal, 'Rüstung'],
  ])('when damageable, "%s" requests %s damage', (buttonLabel, damageType, valueLabel) => {
    fixture.componentRef.setInput('damageable', true);
    render(createTestCharacter('a'));
    const requested: (type: DamageTypes) => void = vi.fn();
    fixture.componentInstance.damageRequested.subscribe(requested);

    const button: HTMLButtonElement = (fixture.nativeElement as HTMLElement).querySelector(
      `button[aria-label="${buttonLabel}"]`,
    ) as HTMLButtonElement;
    expect(button.querySelector(`[aria-label="${valueLabel}"]`)).toBe(value(valueLabel));
    button.click();

    expect(requested).toHaveBeenCalledExactlyOnceWith(damageType);
  });

  it('shows the value 0', () => {
    render({ ...createTestCharacter('a'), Leben: 0, Ruestung: 0 });

    expect(value('Leben').textContent?.trim()).toBe('0');
    expect(value('Rüstung').textContent?.trim()).toBe('0');
  });

  it('shows the current value inside the damage buttons as well', () => {
    fixture.componentRef.setInput('damageable', true);
    render({ ...createTestCharacter('a'), Leben: 7 });

    expect(value('Leben').textContent?.trim()).toBe('7');
  });
});
