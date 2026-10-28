import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSectionStateService } from '../../services/sidebar-section-state.service';
import { SidebarSection } from '../sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from './sidebar-section-toggle-all';

@Component({
  imports: [SidebarSection, SidebarSectionToggleAll],
  template: `
    <app-sidebar-section-toggle-all scope="builder" />
    <app-sidebar-section title="Datei" sectionId="builder.file"><p>Neu</p></app-sidebar-section>
    <app-sidebar-section title="Layout" sectionId="builder.layout"
      ><p>Breite</p></app-sidebar-section
    >
    <app-sidebar-section title="Raster" sectionId="tracker.grid"><p>Zelle</p></app-sidebar-section>
  `,
})
class TestHost {}

describe('SidebarSectionToggleAll', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: HTMLElement;
  let state: SidebarSectionStateService;

  const toggleAll: () => HTMLButtonElement = () =>
    host.querySelector('app-sidebar-section-toggle-all button') as HTMLButtonElement;
  const expanded: () => (string | null)[] = () =>
    Array.from(host.querySelectorAll('h3 button')).map((b) => b.getAttribute('aria-expanded'));

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement as HTMLElement;
    state = TestBed.inject(SidebarSectionStateService);
    await fixture.whenStable();
  });

  it('should collapse all sections of its scope and then expand them again', async () => {
    expect(toggleAll().getAttribute('aria-label')).toBe('Alle Gruppen einklappen');

    toggleAll().click();
    await fixture.whenStable();
    expect(expanded()).toEqual(['false', 'false', 'true']);
    expect(toggleAll().getAttribute('aria-label')).toBe('Alle Gruppen ausklappen');
    expect(toggleAll().textContent?.trim()).toBe('⊞');

    toggleAll().click();
    await fixture.whenStable();
    expect(expanded()).toEqual(['true', 'true', 'true']);
    expect(toggleAll().getAttribute('aria-label')).toBe('Alle Gruppen einklappen');
  });

  it('should offer to expand once the last open section is collapsed by hand', async () => {
    state.toggle('builder.file');
    state.toggle('builder.layout');
    await fixture.whenStable();

    expect(toggleAll().getAttribute('aria-label')).toBe('Alle Gruppen ausklappen');
  });
});
