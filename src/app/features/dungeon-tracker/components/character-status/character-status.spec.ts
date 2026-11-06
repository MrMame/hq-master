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
    ['Leben', 'character-status__health', '12/12'],
    ['Rüstung', 'character-status__armor', '2/4'],
  ])('shows %s as current/max with its class and title', (label, className, expected) => {
    render(createTestCharacter('a'));

    expect(value(label).classList).toContain(className);
    expect(value(label).title).toBe(label);
    expect(value(label).textContent?.trim()).toBe(expected);
  });

  it('shows the effective maximum including equipment and follows assignment changes', () => {
    const cardManager: CardManagerService = TestBed.inject(CardManagerService);
    cardManager.restore({
      ...createEquipmentDeckState('a'),
      assigned: [assignedCard(RUNE_ARMOR, 'a', 'body')],
    });
    render({ ...createTestCharacter('a'), armor: 6 });
    expect(value('Rüstung').textContent?.trim()).toBe('6/6');
    expect(value('Leben').textContent?.trim()).toBe('12/12');

    cardManager.discardAssignedCards(['e1']);
    fixture.detectChanges();
    expect(value('Rüstung').textContent?.trim()).toBe('6/4');
  });

  it('updates when the character input changes', () => {
    render(createTestCharacter('a'));
    render({ ...createTestCharacter('a'), health: 5, armor: 3 });

    expect(value('Leben').textContent?.trim()).toBe('5/12');
    expect(value('Rüstung').textContent?.trim()).toBe('3/4');
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

  it('shows the value 0 and the maximum', () => {
    render({ ...createTestCharacter('a'), health: 0, armor: 0 });

    expect(value('Leben').textContent?.trim()).toBe('0/12');
    expect(value('Rüstung').textContent?.trim()).toBe('0/4');
  });

  it('shows current/max inside the damage buttons as well', () => {
    fixture.componentRef.setInput('damageable', true);
    render({ ...createTestCharacter('a'), health: 7, maxHealth: 10 });

    expect(value('Leben').textContent?.trim()).toBe('7/10');
  });
});
