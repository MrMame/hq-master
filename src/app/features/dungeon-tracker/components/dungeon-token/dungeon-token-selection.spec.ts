import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

import { DungeonToken } from './dungeon-token';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

/** Drag-Ende ohne Versatz (Stub, s. dungeon-token.spec.ts). */
const dragEnd: () => CdkDragEnd = (): CdkDragEnd =>
  ({
    source: { getFreeDragPosition: () => ({ x: 0, y: 0 }), reset: vi.fn() },
  }) as unknown as CdkDragEnd;

describe('DungeonToken – status and selection', () => {
  let fixture: ComponentFixture<DungeonToken>;
  let host: HTMLElement;

  const render: (selected: boolean) => void = (selected: boolean): void => {
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
  };

  const token: () => HTMLElement = (): HTMLElement =>
    host.querySelector('.dungeon-token') as HTMLElement;

  const damageButtons: () => HTMLButtonElement[] = (): HTMLButtonElement[] =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('button'));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonToken] });
    fixture = TestBed.createComponent(DungeonToken);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('position', { characterId: 'a', col: 0, row: 0 });
    fixture.componentRef.setInput('cellSize', 60);
    fixture.componentRef.setInput('character', {
      ...createTestCharacter('a'),
      health: 20,
      armor: 5,
    });
  });

  afterEach(() => vi.useRealTimers());

  it.each<[boolean]>([[false], [true]])('always shows health and armor (selected: %s)', (sel) => {
    render(sel);

    expect(host.querySelector('[aria-label="Leben"]')?.textContent?.trim()).toBe('20');
    expect(host.querySelector('[aria-label="Rüstung"]')?.textContent?.trim()).toBe('5');
  });

  it('shows no damage buttons and no highlight while not selected', () => {
    render(false);

    expect(damageButtons()).toHaveLength(0);
    expect(token().classList).not.toContain('dungeon-token--selected');
  });

  it('shows the health (left) and the armor (right) damage button and the highlight when selected', () => {
    render(true);

    expect(damageButtons().map((b) => b.getAttribute('aria-label'))).toEqual([
      'Schaden auf Leben',
      'Schaden auf Rüstung',
    ]);
    expect(token().classList).toContain('dungeon-token--selected');
  });

  it.each<[string, DamageTypes]>([
    ['Schaden auf Rüstung', DamageTypes.Normal],
    ['Schaden auf Leben', DamageTypes.Critical],
  ])('"%s" requests %s damage without reporting a selection', (label, damageType) => {
    render(true);
    const requested: (type: DamageTypes) => void = vi.fn();
    const selectedSpy: (id: string) => void = vi.fn();
    fixture.componentInstance.damageRequested.subscribe(requested);
    fixture.componentInstance.tokenSelected.subscribe(selectedSpy);

    (host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();

    expect(requested).toHaveBeenCalledExactlyOnceWith(damageType);
    expect(selectedSpy).not.toHaveBeenCalled();
  });

  it('does not open the editor on a double click on the damage buttons', () => {
    render(true);
    const doubleClicked: (id: string) => void = vi.fn();
    fixture.componentInstance.tokenDoubleClicked.subscribe(doubleClicked);

    damageButtons()[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

    expect(doubleClicked).not.toHaveBeenCalled();
  });

  it('reports the selection on click and keeps the click away from the board', () => {
    render(false);
    const selectedSpy: (id: string) => void = vi.fn();
    fixture.componentInstance.tokenSelected.subscribe(selectedSpy);
    const boardClick: () => void = vi.fn();
    host.addEventListener('click', boardClick);

    token().click();

    expect(selectedSpy).toHaveBeenCalledExactlyOnceWith('a');
    expect(boardClick).not.toHaveBeenCalled();
  });

  it('ignores the click that ends a drag, but not the next one', () => {
    vi.useFakeTimers();
    render(false);
    const selectedSpy: (id: string) => void = vi.fn();
    fixture.componentInstance.tokenSelected.subscribe(selectedSpy);
    const drag: DebugElement = fixture.debugElement.query(By.directive(CdkDrag));

    // Ein echter Drag lässt sich in jsdom nicht erzeugen; ausgelöst über die Template-Bindungen.
    drag.triggerEventHandler('cdkDragStarted', {});
    drag.triggerEventHandler('cdkDragEnded', dragEnd());
    token().click();
    expect(selectedSpy).not.toHaveBeenCalled();

    vi.runAllTimers();
    token().click();
    expect(selectedSpy).toHaveBeenCalledExactlyOnceWith('a');
  });
});
