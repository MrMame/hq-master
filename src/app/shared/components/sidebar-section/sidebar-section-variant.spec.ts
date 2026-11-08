import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSectionStateService } from '../../services/sidebar-section-state.service';
import { SidebarSection } from './sidebar-section';

@Component({
  imports: [SidebarSection],
  template: `
    <app-sidebar-section variant="area" title="Gürtel" sectionId="table.belt" [count]="3">
      <p>Karten</p>
    </app-sidebar-section>
    <app-sidebar-section title="Decks" sectionId="side.decks"><p>Liste</p></app-sidebar-section>
  `,
})
class TestHost {}

describe('SidebarSection – area variant', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: HTMLElement;

  const sections: () => HTMLElement[] = () =>
    Array.from(host.querySelectorAll('app-sidebar-section'));

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders an area as a named region with its own surface', () => {
    const [area, sidebar] = sections();
    expect(area.getAttribute('role')).toBe('region');
    expect(area.getAttribute('aria-label')).toBe('Gürtel');
    expect(area.classList).toContain('sidebar-section--area');
    expect(sidebar.getAttribute('role')).toBeNull();
    expect(sidebar.getAttribute('aria-label')).toBeNull();
    expect(sidebar.classList).not.toContain('sidebar-section--area');
  });

  it('collapses an area like a sidebar group, keeping the region name without the count', async () => {
    const toggle: HTMLButtonElement = sections()[0].querySelector('button')!;
    expect(toggle.textContent?.trim()).toBe('Gürtel (3)');

    toggle.click();
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(TestBed.inject(SidebarSectionStateService).isCollapsed('table.belt')).toBe(true);
    expect(sections()[0].getAttribute('aria-label')).toBe('Gürtel');
  });
});
