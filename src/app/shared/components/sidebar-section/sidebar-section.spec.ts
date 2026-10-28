import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOOL_STATE_KEYS } from '../../../core/session-state/tool-state-keys';
import { SidebarSectionStateService } from '../../services/sidebar-section-state.service';
import { SidebarSection } from './sidebar-section';

@Component({
  imports: [SidebarSection],
  template: `
    @if (shown()) {
      <app-sidebar-section
        title="Möbel"
        sectionId="test.furniture"
        [count]="count()"
        [forceExpanded]="forced()"
      >
        <p class="projected">Tisch</p>
      </app-sidebar-section>
    }
    <app-sidebar-section title="Layout" sectionId="test.layout"><p>Breite</p></app-sidebar-section>
  `,
})
class TestHost {
  readonly shown: WritableSignal<boolean> = signal<boolean>(true);
  readonly count: WritableSignal<number | null> = signal<number | null>(12);
  readonly forced: WritableSignal<boolean> = signal<boolean>(false);
}

describe('SidebarSection', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: HTMLElement;
  let state: SidebarSectionStateService;

  const sections: () => HTMLElement[] = () =>
    Array.from(host.querySelectorAll('app-sidebar-section'));
  const toggle: (index?: number) => HTMLButtonElement = (index = 0) =>
    sections()[index].querySelector('h3 button') as HTMLButtonElement;
  const content: (index?: number) => HTMLElement = (index = 0) =>
    sections()[index].querySelector('.sidebar-section__content') as HTMLElement;

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement as HTMLElement;
    state = TestBed.inject(SidebarSectionStateService);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TestHost] });
    await render();
  });

  it('should show the title with the count and start expanded', () => {
    expect(toggle().textContent?.trim()).toBe('Möbel (12)');
    expect(toggle(1).textContent?.trim()).toBe('Layout');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(content().hidden).toBe(false);
  });

  it('should collapse on click, keep the content in the DOM and store the state', async () => {
    toggle().click();
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(content().hidden).toBe(true);
    expect(content().querySelector('.projected')).not.toBeNull();
    expect(JSON.parse(localStorage.getItem(TOOL_STATE_KEYS.sidebarSections)!)).toEqual([
      'test.furniture',
    ]);

    toggle().click();
    await fixture.whenStable();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('should start collapsed when the section was collapsed before', async () => {
    localStorage.setItem(TOOL_STATE_KEYS.sidebarSections, JSON.stringify(['test.layout']));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TestHost] });
    await render();

    expect(toggle(1).getAttribute('aria-expanded')).toBe('false');
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('should hide the count when there is none', async () => {
    fixture.componentInstance.count.set(null);
    await fixture.whenStable();
    expect(toggle().textContent?.trim()).toBe('Möbel');
  });

  it('should stay open while forced, without changing the stored state', async () => {
    toggle().click();
    fixture.componentInstance.forced.set(true);
    await fixture.whenStable();

    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(toggle().disabled).toBe(true);
    expect(state.isCollapsed('test.furniture')).toBe(true);

    fixture.componentInstance.forced.set(false);
    await fixture.whenStable();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('should point aria-controls at its own content, unique per instance', () => {
    const ids: string[] = sections().map((_, i) => content(i).id);
    sections().forEach((_, i) => expect(toggle(i).getAttribute('aria-controls')).toBe(ids[i]));
    expect(new Set(ids).size).toBe(2);
  });

  it('should register while shown and unregister when removed', async () => {
    state.toggle('test.layout');
    expect(state.allCollapsed('test')).toBe(false);

    fixture.componentInstance.shown.set(false);
    await fixture.whenStable();
    expect(state.allCollapsed('test')).toBe(true);
  });
});
