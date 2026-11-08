import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';
import { CollapsibleSidebar } from './collapsible-sidebar';

@Component({
  standalone: true,
  imports: [CollapsibleSidebar],
  template: `
    <app-collapsible-sidebar stateId="first"><p>Erste</p></app-collapsible-sidebar>
    <app-collapsible-sidebar stateId="second"><p>Zweite</p></app-collapsible-sidebar>
  `,
})
class TestHost {}

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
}

describe('CollapsibleSidebar – resize', () => {
  let fixture: ComponentFixture<TestHost>;
  let root: HTMLElement;

  const sidebar: (index?: number) => HTMLElement = (index: number = 0): HTMLElement =>
    root.querySelectorAll<HTMLElement>('app-collapsible-sidebar')[index];
  const aside: (index?: number) => HTMLElement = (index: number = 0): HTMLElement =>
    sidebar(index).querySelector('aside')!;
  const handle: () => HTMLButtonElement = (): HTMLButtonElement =>
    sidebar().querySelector('button') as HTMLButtonElement;
  const shownWidth: (index?: number) => string = (index: number = 0): string =>
    aside(index).style.getPropertyValue('--sidebar-width');
  const storedWidths: () => Record<string, number> | null = () =>
    JSON.parse(localStorage.getItem(TOOL_STATE_KEYS.sidebarWidths) ?? 'null');

  const pointer: (type: string, x: number) => void = (type: string, x: number): void => {
    handle().dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, pointerId: 1 }));
  };

  /** Ziehen am Griff inkl. des Klicks, den der Browser nach dem Loslassen schickt. */
  const drag: (from: number, to: number) => Promise<void> = async (from, to) => {
    pointer('pointerdown', from);
    pointer('pointermove', to);
    pointer('pointerup', to);
    handle().dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    await fixture.whenStable();
  };

  const createHost: () => Promise<void> = async (): Promise<void> => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    root = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    // jsdom hat kein Layout: Breite laut gesetzter Variable, sonst Standard 256px.
    aside().getBoundingClientRect = (): DOMRect =>
      ({ width: parseFloat(shownWidth()) || 256 }) as DOMRect;
    handle().setPointerCapture = vi.fn();
  };

  beforeEach(async () => {
    setViewportWidth(1280);
    await createHost();
  });

  it('should use the default width from CSS while nothing was dragged', () => {
    expect(shownWidth()).toBe('');
  });

  it('should follow the pointer live and store only on release', async () => {
    pointer('pointerdown', 300);
    pointer('pointermove', 360);
    await fixture.whenStable();

    expect(shownWidth()).toBe('316px');
    expect(storedWidths()).toBeNull();

    pointer('pointerup', 380);
    await fixture.whenStable();

    expect(shownWidth()).toBe('336px');
    expect(storedWidths()).toEqual({ first: 336 });
  });

  it('should not collapse after a drag, but collapse on a click without movement', async () => {
    await drag(300, 340);
    expect(sidebar().classList).not.toContain('collapsible-sidebar--collapsed');

    await drag(300, 302);
    expect(sidebar().classList).toContain('collapsible-sidebar--collapsed');
  });

  it('should stop at 200px and at half of the window', async () => {
    await drag(300, 100);
    expect(shownWidth()).toBe('200px');

    await drag(300, 1200);
    expect(shownWidth()).toBe('640px');
    expect(storedWidths()).toEqual({ first: 640 });
  });

  it('should cut the shown width when the window shrinks and keep the stored one', async () => {
    await drag(300, 500);
    setViewportWidth(600);
    window.dispatchEvent(new Event('resize'));
    await fixture.whenStable();

    expect(shownWidth()).toBe('300px');
    expect(storedWidths()).toEqual({ first: 456 });

    setViewportWidth(1280);
    window.dispatchEvent(new Event('resize'));
    await fixture.whenStable();
    expect(shownWidth()).toBe('456px');
  });

  it('should keep the width when collapsing and expanding', async () => {
    await drag(300, 380);
    handle().click();
    await fixture.whenStable();
    handle().click();
    await fixture.whenStable();

    expect(shownWidth()).toBe('336px');
  });

  it('should not resize while collapsed; a click only expands', async () => {
    handle().click();
    await fixture.whenStable();

    await drag(300, 400);

    expect(storedWidths()).toBeNull();
    expect(sidebar().classList).not.toContain('collapsible-sidebar--collapsed');
  });

  it('should restore each stored width per stateId after reload', async () => {
    localStorage.setItem(TOOL_STATE_KEYS.sidebarWidths, JSON.stringify({ second: 150 }));
    await createHost();
    await drag(300, 400);
    await createHost();

    expect(shownWidth(0)).toBe('356px');
    expect(shownWidth(1)).toBe('200px');
  });
});
