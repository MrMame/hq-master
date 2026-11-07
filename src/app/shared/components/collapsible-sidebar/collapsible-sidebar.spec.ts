import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';
import { CollapsibleSidebar } from './collapsible-sidebar';

@Component({
  standalone: true,
  imports: [CollapsibleSidebar],
  template: `
    <app-collapsible-sidebar stateId="first"
      ><h2 class="projected">Titel</h2></app-collapsible-sidebar
    >
    <app-collapsible-sidebar stateId="second"><p>Zweite Leiste</p></app-collapsible-sidebar>
  `,
})
class TestHost {}

describe('CollapsibleSidebar', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: HTMLElement;

  const sidebar: () => HTMLElement = (): HTMLElement =>
    host.querySelector('app-collapsible-sidebar') as HTMLElement;
  const aside: () => HTMLElement = (): HTMLElement => sidebar().querySelector('aside')!;
  const toggleButton: () => HTMLButtonElement = (): HTMLButtonElement =>
    sidebar().querySelector('button') as HTMLButtonElement;

  const clickToggle: () => Promise<void> = async (): Promise<void> => {
    toggleButton().click();
    await fixture.whenStable();
  };

  const createHost: () => Promise<void> = async (): Promise<void> => {
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    await createHost();
  });

  it('should start expanded and show the projected content inside the sidebar', () => {
    expect(aside().classList).toContain('general-sidebar');
    expect(aside().querySelector('.projected')?.textContent).toBe('Titel');
    expect(sidebar().classList).not.toContain('collapsible-sidebar--collapsed');
    expect(toggleButton().getAttribute('aria-expanded')).toBe('true');
    expect(toggleButton().getAttribute('aria-label')).toBe('Seitenleiste einklappen');
    expect(toggleButton().textContent?.trim()).toBe('‹');
  });

  it('should collapse on click and keep the content in the DOM', async () => {
    await clickToggle();

    expect(sidebar().classList).toContain('collapsible-sidebar--collapsed');
    expect(aside().querySelector('.projected')).not.toBeNull();
    expect(toggleButton().getAttribute('aria-expanded')).toBe('false');
    expect(toggleButton().getAttribute('aria-label')).toBe('Seitenleiste ausklappen');
    expect(toggleButton().textContent?.trim()).toBe('›');
  });

  it('should expand again on a second click', async () => {
    await clickToggle();
    await clickToggle();

    expect(sidebar().classList).not.toContain('collapsible-sidebar--collapsed');
    expect(toggleButton().getAttribute('aria-expanded')).toBe('true');
  });

  it('should point aria-controls at its own sidebar, unique per instance', () => {
    const sidebars: HTMLElement[] = Array.from(host.querySelectorAll('app-collapsible-sidebar'));
    const ids: string[] = sidebars.map((s) => s.querySelector('aside')!.id);

    sidebars.forEach((s, i) =>
      expect(s.querySelector('button')!.getAttribute('aria-controls')).toBe(ids[i]),
    );
    expect(new Set(ids).size).toBe(2);
  });

  it('should store the collapsed state under its own stateId', async () => {
    await clickToggle();

    expect(JSON.parse(localStorage.getItem(TOOL_STATE_KEYS.collapsedSidebars)!)).toEqual(['first']);
  });

  it('should keep the other sidebar expanded when one is collapsed', async () => {
    await clickToggle();
    const second: HTMLElement = host.querySelectorAll<HTMLElement>('app-collapsible-sidebar')[1];

    expect(second.classList).not.toContain('collapsible-sidebar--collapsed');
  });

  it('should start collapsed when its stateId was stored as collapsed', async () => {
    localStorage.setItem(TOOL_STATE_KEYS.collapsedSidebars, JSON.stringify(['first']));
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    await createHost();

    expect(sidebar().classList).toContain('collapsible-sidebar--collapsed');
    expect(toggleButton().getAttribute('aria-expanded')).toBe('false');
  });
});
