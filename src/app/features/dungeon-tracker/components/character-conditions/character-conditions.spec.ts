import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterConditions, ConditionsVariant } from './character-conditions';
import { ActiveCondition } from '../../../../core/models/character-condition.model';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import { afterStart, createTestCondition } from '../../../../core/testing/condition.fixtures';

const poison: ActiveCondition = createTestCondition();
const blind: ActiveCondition = createTestCondition({
  id: 'blind',
  intervalSeconds: 0,
  damagePerTick: 0,
  durationSeconds: 0,
});

describe('CharacterConditions', () => {
  let fixture: ComponentFixture<CharacterConditions>;
  let host: HTMLElement;

  const render: (conditions: ActiveCondition[], variant?: ConditionsVariant) => void = (
    conditions,
    variant = 'token',
  ) => {
    fixture.componentRef.setInput('conditions', conditions);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
  };

  const items: () => HTMLElement[] = () =>
    Array.from(host.querySelectorAll<HTMLElement>('[data-testid="condition"]'));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CharacterConditions] });
    TestBed.inject(GameTimeService).restore(afterStart(150));
    fixture = TestBed.createComponent(CharacterConditions);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows only the icon at the token with name and remaining time as tooltip', () => {
    render([poison, blind]);

    expect(items().map((item) => item.getAttribute('aria-label'))).toEqual([
      'Gift – noch 7:30',
      'Blind – unbegrenzt',
    ]);
    expect(items()[0].title).toBe('Gift – noch 7:30');
    expect(items()[0].querySelector('img')?.getAttribute('src')).toContain('poison.svg');
    expect(items()[0].textContent?.trim()).toBe('');
    expect(host.classList).toContain('character-conditions--token');
  });

  it('shows icon, name and remaining time under the selected token', () => {
    render([poison, blind], 'selected');

    const parts: (item: HTMLElement) => (string | undefined)[] = (item) =>
      ['label', 'remaining'].map((part) =>
        item.querySelector(`.character-conditions__${part}`)?.textContent?.trim(),
      );
    expect(items().map(parts)).toEqual([
      ['Gift', '7:30'],
      ['Blind', 'unbegrenzt'],
    ]);
  });

  it('shows icon and remaining time without name in the legend', () => {
    render([poison], 'legend');

    expect(items()[0].textContent?.trim()).toBe('7:30');
  });

  it('updates the remaining time when the game time advances', () => {
    render([poison], 'legend');
    TestBed.inject(GameTimeService).addTime({ seconds: 30 });
    fixture.detectChanges();

    expect(items()[0].textContent?.trim()).toBe('7:00');
  });

  it('shows more than 3 conditions at the token as "+n" with the hidden ones as tooltip', () => {
    const many: ActiveCondition[] = [
      poison,
      blind,
      createTestCondition({ id: 'dazed' }),
      createTestCondition({ id: 'dazed', durationSeconds: 900 }),
    ];
    render(many);

    expect(items()).toHaveLength(3);
    const more: HTMLElement = host.querySelector('[data-testid="conditions-more"]') as HTMLElement;
    expect(more.textContent?.trim()).toBe('+1');
    expect(more.title).toBe('Benommen – noch 12:30');
  });

  it('shows all conditions without "+n" outside the token', () => {
    render([poison, blind, poison, blind], 'selected');

    expect(items()).toHaveLength(4);
    expect(host.querySelector('[data-testid="conditions-more"]')).toBeNull();
  });

  it('renders nothing without conditions', () => {
    render([]);

    expect(items()).toHaveLength(0);
  });
});
