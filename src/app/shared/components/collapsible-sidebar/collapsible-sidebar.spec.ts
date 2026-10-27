import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleSidebar } from './collapsible-sidebar';

@Component({
  standalone: true,
  imports: [CollapsibleSidebar],
  template: `
    <app-collapsible-sidebar><h2 class="projected">Titel</h2></app-collapsible-sidebar>
    <app-collapsible-sidebar><p>Zweite Leiste</p></app-collapsible-sidebar>
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
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

  it('should not store the state', async () => {
    await clickToggle();

    expect(localStorage.length).toBe(0);
  });
});
