import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonLegendEntry } from './dungeon-legend-entry';
import { BoardToken } from '../../models/board-token.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { spyOnScrollIntoView } from '../../testing/scroll-into-view.fixtures';

const token: BoardToken = {
  position: { characterId: 'a', col: 3, row: 4 },
  character: { ...createTestCharacter('a'), name: 'Ork', health: 20, armor: 5 },
};

describe('DungeonLegendEntry', () => {
  let fixture: ComponentFixture<DungeonLegendEntry>;
  let host: HTMLElement;
  const scrolledElements: () => Element[] = spyOnScrollIntoView();

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonLegendEntry] });
    fixture = TestBed.createComponent(DungeonLegendEntry);
    fixture.componentRef.setInput('token', token);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  const text: (selector: string) => string | undefined = (selector: string): string | undefined =>
    host.querySelector(selector)?.textContent?.trim();

  const select: (selected: boolean) => void = (selected: boolean): void => {
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
  };

  const actionBar: () => HTMLElement | null = (): HTMLElement | null =>
    host.querySelector('[role="toolbar"]');

  const toggles: () => () => void = (): (() => void) => {
    const toggled: () => void = vi.fn();
    fixture.componentInstance.selectionToggled.subscribe(toggled);
    return toggled;
  };

  it('shows image and name of the character', () => {
    const img: HTMLImageElement = host.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('assets/ork.png');
    expect(img.alt).toBe('Ork');
    expect(text('.legend-entry__name')).toBe('Ork');
  });

  it('shows health and armor of the character', () => {
    expect(text('[aria-label="Leben"]')).toBe('20');
    expect(text('[aria-label="Rüstung"]')).toBe('5');
  });

  it.each<[string, DamageTypes]>([
    ['Schaden auf Leben', DamageTypes.Critical],
    ['Schaden auf Rüstung', DamageTypes.Normal],
  ])('a click on the value "%s" requests %s damage without toggling', (label, damageType) => {
    const requested: (type: DamageTypes) => void = vi.fn();
    fixture.componentInstance.damageRequested.subscribe(requested);
    const toggled: () => void = toggles();

    (host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();

    expect(requested).toHaveBeenCalledExactlyOnceWith(damageType);
    expect(toggled).not.toHaveBeenCalled();
  });

  it('shows the board position', () => {
    expect(text('[data-testid="token-position"]')).toBe('[3,4]');
  });

  it.each<[string]>([
    ['.legend-entry__avatar'],
    ['.legend-entry__name'],
    ['[data-testid="token-position"]'],
  ])('a click on %s toggles the selection', (selector) => {
    const toggled: () => void = toggles();

    (host.querySelector(selector) as HTMLElement).click();

    expect(toggled).toHaveBeenCalledOnce();
  });

  it('shows neither highlight nor action bar while not selected', () => {
    expect(host.classList).not.toContain('legend-entry--selected');
    expect(host.hasAttribute('aria-current')).toBe(false);
    expect(actionBar()).toBeNull();
  });

  it('shows highlight, aria-current and the action bar of the character when selected', () => {
    select(true);

    expect(host.classList).toContain('legend-entry--selected');
    expect(host.getAttribute('aria-current')).toBe('true');
    expect(actionBar()?.getAttribute('aria-label')).toBe('Aktionen für Ork');
  });

  it('hides the action bar again when the selection ends', () => {
    select(true);
    select(false);

    expect(host.hasAttribute('aria-current')).toBe(false);
    expect(actionBar()).toBeNull();
  });

  it.each<[boolean, boolean, number]>([
    [true, true, 1],
    [true, false, 0],
    [false, true, 0],
  ])(
    'scrolls into view only if selected on the board (selected %s, reveal %s)',
    (sel, reveal, n) => {
      fixture.componentRef.setInput('reveal', reveal);
      select(sel);

      expect(scrolledElements()).toEqual(Array<Element>(n).fill(host));
    },
  );

  it('does not toggle the selection on a click into the action bar', () => {
    select(true);
    const toggled: () => void = toggles();

    actionBar()?.click();

    expect(toggled).not.toHaveBeenCalled();
  });
});
