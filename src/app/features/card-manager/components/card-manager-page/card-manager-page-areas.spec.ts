import { TestBed } from '@angular/core/testing';

import { TOOL_STATE_KEYS } from '../../../../core/session-state/tool-state-keys';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import {
  BASIC_CARD,
  createTwoDeckState,
  inventoryCard,
} from '../../../../core/testing/deck.fixtures';
import { DeckState } from '../../../../core/models/deck-state.model';
import { spyOnScrollIntoView } from '../../../../shared/testing/scroll-into-view.fixtures';
import {
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

/** Hand mit einer Karte, Gürtel des Barbaren mit einer Karte, Inventar nur für einen unbekannten Charakter. */
function tableState(): DeckState {
  return {
    ...createTwoDeckState(),
    hand: [{ deckId: 'deck-1', card: BASIC_CARD }],
    inventory: [inventoryCard(BASIC_CARD, 'x')],
    belt: [inventoryCard(BASIC_CARD, 'a', 'deck-2')],
  };
}

describe('CardManagerPage – table areas', () => {
  let harness: CardManagerPageHarness;
  let host: HTMLElement;
  const scrolled: () => Element[] = spyOnScrollIntoView();

  const areas: () => HTMLElement[] = () =>
    Array.from(host.querySelectorAll<HTMLElement>('.feature-page__main [role="region"]'));
  const area: (label: string) => HTMLElement | null = (label) =>
    host.querySelector<HTMLElement>(`[role="region"][aria-label="${label}"]`);
  const header: (label: string) => HTMLButtonElement = (label) =>
    area(label)!.querySelector<HTMLButtonElement>('.sidebar-section__toggle')!;
  const expanded: (buttons: HTMLButtonElement[]) => string[] = (buttons) =>
    buttons.map((button) => button.getAttribute('aria-expanded') ?? '');
  const navEntry: (label: string) => HTMLButtonElement = (label) =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('.area-nav__entry')).find((entry) =>
      entry.textContent?.trim().startsWith(label),
    )!;
  const click: (element: HTMLElement) => Promise<void> = async (element) => {
    element.click();
    await harness.fixture.whenStable();
  };

  async function setup(): Promise<void> {
    harness = await setupCardManagerPage();
    host = harness.host;
    TestBed.inject(CharactersDbService).writeCharacter({
      ...createTestCharacter('a'),
      name: 'Barbar',
    });
    await harness.render(tableState());
  }

  beforeEach(setup);

  it('shows only areas with cards plus the table, each with its count in the heading', () => {
    expect(areas().map((section) => section.querySelector('h3')?.textContent?.trim())).toEqual([
      'Hand des Dungeon Masters (1)',
      'Gürtel (1)',
      'Spieltisch (2)',
    ]);
    // Die Inventarkarte gehört keinem vorhandenen Charakter: keine leere Kopfzeile.
    expect(area('Inventar')).toBeNull();
    expect(area('Ausgerüstet')).toBeNull();
  });

  it('collapses an area via its heading and keeps it collapsed after a reload', async () => {
    await click(header('Gürtel'));

    expect(header('Gürtel').getAttribute('aria-expanded')).toBe('false');
    const content: HTMLElement = area('Gürtel')!.querySelector('.sidebar-section__content')!;
    expect(content.hidden).toBe(true);
    expect(content.querySelector('[data-testid="belt-card"]')).not.toBeNull();
    expect(JSON.parse(localStorage.getItem(TOOL_STATE_KEYS.sidebarSections)!)).toEqual([
      'card-manager-table.belt',
    ]);

    TestBed.resetTestingModule();
    await setup();
    expect(header('Gürtel').getAttribute('aria-expanded')).toBe('false');
    expect(header('Spieltisch').getAttribute('aria-expanded')).toBe('true');
  });

  it('collapses and expands only the main areas with their toggle-all button', async () => {
    const tableToggle: HTMLButtonElement = host.querySelector(
      '[data-testid="card-table-toggle-all"] button',
    )!;
    const sidebarHeaders: () => HTMLButtonElement[] = () =>
      Array.from(host.querySelectorAll('app-collapsible-sidebar .sidebar-section__toggle'));
    const areaHeaders: () => HTMLButtonElement[] = () =>
      areas().map((section) => section.querySelector('button')!);

    await click(tableToggle);
    expect(expanded(areaHeaders())).toEqual(['false', 'false', 'false']);
    expect(expanded(sidebarHeaders())).toEqual(['true', 'true', 'true']);
    expect(tableToggle.getAttribute('aria-label')).toBe('Alle Gruppen ausklappen');

    await click(host.querySelector('.general-sidebar__header button')!);
    expect(expanded(sidebarHeaders())).toEqual(['false', 'false', 'false']);
    await click(tableToggle);
    expect(expanded(areaHeaders())).toEqual(['true', 'true', 'true']);
    expect(expanded(sidebarHeaders())).toEqual(['false', 'false', 'false']);
  });

  it('jumps from "Bereiche" to an area: expands only it, collapses the others, scrolls and focuses it', async () => {
    await click(header('Gürtel'));
    await click(navEntry('Gürtel'));

    expect(header('Gürtel').getAttribute('aria-expanded')).toBe('true');
    expect(header('Hand des Dungeon Masters').getAttribute('aria-expanded')).toBe('false');
    expect(header('Spieltisch').getAttribute('aria-expanded')).toBe('false');
    expect(
      Array.from(host.querySelectorAll('app-collapsible-sidebar .sidebar-section__toggle')).map(
        (button) => button.getAttribute('aria-expanded'),
      ),
    ).toEqual(['true', 'true', 'true']);
    // Die Reihenfolge der gespeicherten IDs hat keine Bedeutung.
    expect(JSON.parse(localStorage.getItem(TOOL_STATE_KEYS.sidebarSections)!).sort()).toEqual([
      'card-manager-table.decks',
      'card-manager-table.hand',
    ]);
    expect(scrolled()).toEqual([area('Gürtel')]);
    expect(document.activeElement).toBe(header('Gürtel'));
    expect(harness.cardManager.state()).toEqual(tableState());
  });

  it('opens only the table and the chosen deck row when a deck is chosen in the deck list', async () => {
    await click(header('Spieltisch'));
    await click(host.querySelectorAll<HTMLButtonElement>('[data-testid="deck-list-entry"]')[1]);

    expect(header('Spieltisch').getAttribute('aria-expanded')).toBe('true');
    expect(header('Hand des Dungeon Masters').getAttribute('aria-expanded')).toBe('false');
    expect(header('Gürtel').getAttribute('aria-expanded')).toBe('false');
    const rows: HTMLElement[] = Array.from(host.querySelectorAll('[data-testid="deck-row"]'));
    expect(rows.map((row) => !!row.querySelector('app-deck-piles'))).toEqual([false, true]);
    expect(scrolled()).toEqual([rows[1]]);
  });

  it('disables entries of empty areas with a reason', () => {
    expect(navEntry('Inventar').disabled).toBe(true);
    expect(navEntry('Inventar').title).toBe('Keine Karten im Inventar');
    expect(navEntry('Spieltisch').textContent?.trim()).toBe('Spieltisch (2)');
  });
});
