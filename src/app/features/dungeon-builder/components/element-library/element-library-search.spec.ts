import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOOL_STATE_KEYS } from '../../../../core/session-state/tool-state-keys';
import { SidebarSectionStateService } from '../../../../shared/services/sidebar-section-state.service';
import { BuilderUiService } from '../../services/builder-ui.service';
import { builderProviders } from '../../testing/builder-services.fixtures';
import { libraryButton, sectionHeadings } from '../../testing/element-library.fixtures';
import { ElementLibrary } from './element-library';

describe('ElementLibrary – search and recent elements', () => {
  let fixture: ComponentFixture<ElementLibrary>;
  let host: HTMLElement;

  const field: () => HTMLInputElement = () =>
    host.querySelector('input[type="search"]') as HTMLInputElement;
  const expanded: () => (string | null)[] = () =>
    Array.from(host.querySelectorAll('h3 button')).map((b) => b.getAttribute('aria-expanded'));

  async function render(): Promise<void> {
    TestBed.configureTestingModule({ imports: [ElementLibrary], providers: builderProviders() });
    fixture = TestBed.createComponent(ElementLibrary);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  async function search(term: string): Promise<void> {
    field().value = term;
    field().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('should show only matching entries, open their groups and keep the stored state', async () => {
    localStorage.setItem(
      TOOL_STATE_KEYS.sidebarSections,
      JSON.stringify(['dungeon-builder.library.Möbel']),
    );
    await render();
    expect(expanded()).toEqual(['true', 'true', 'false', 'true']);

    await search('TR');

    expect(sectionHeadings(host)).toEqual(['Möbel (1)']);
    expect(expanded()).toEqual(['true']);
    expect(libraryButton(host, 'Truhe (1 × 1)')).toBeTruthy();
    expect(
      TestBed.inject(SidebarSectionStateService).isCollapsed('dungeon-builder.library.Möbel'),
    ).toBe(true);

    await search('');
    expect(sectionHeadings(host)).toHaveLength(4);
    expect(expanded()[2]).toBe('false');
  });

  it('should say so when nothing matches', async () => {
    await render();
    expect(host.querySelector('[data-testid="library-no-results"]')).toBeNull();

    await search('xyz');

    expect(sectionHeadings(host)).toEqual([]);
    expect(host.querySelector('[data-testid="library-no-results"]')?.textContent).toContain(
      'Keine Elemente gefunden',
    );
  });

  it('should show recently used elements first, hidden while empty or searching', async () => {
    await render();
    expect(sectionHeadings(host)[0]).toBe('Boden (3)');

    libraryButton(host, 'Truhe (1 × 1)').click();
    libraryButton(host, 'Tür').click();
    await fixture.whenStable();

    expect(sectionHeadings(host)[0]).toBe('Zuletzt verwendet (2)');
    expect(libraryButton(host, 'Tür – zuletzt verwendet').getAttribute('aria-pressed')).toBe(
      'true',
    );

    await search('tisch');
    expect(sectionHeadings(host)).toEqual(['Möbel (1)']);
  });

  it('should make a recent element the stamp on a tap', async () => {
    localStorage.setItem(TOOL_STATE_KEYS.dungeonBuilderRecent, JSON.stringify(['table', 'gone']));
    await render();
    expect(sectionHeadings(host)[0]).toBe('Zuletzt verwendet (1)');

    libraryButton(host, 'Tisch (3 × 2) – zuletzt verwendet').click();

    expect(TestBed.inject(BuilderUiService).tool()).toEqual({ kind: 'stamp', catalogId: 'table' });
  });
});
