import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckList } from './deck-list';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { BASIC_CARD, createDeckInstance } from '../../../../core/testing/deck.fixtures';
import { configureCardManagerTestbed } from '../../testing/card-manager-page.fixtures';

describe('DeckList', () => {
  let fixture: ComponentFixture<DeckList>;
  let host: HTMLElement;
  let selected: string[];

  const decks: DeckInstance[] = [
    createDeckInstance('d1', { name: 'Monster', drawPile: [BASIC_CARD] }),
    createDeckInstance('d2', { name: 'Schätze' }),
    createDeckInstance('d3', { name: 'Monster (2)' }),
  ];
  const entries: () => HTMLButtonElement[] = () =>
    Array.from(host.querySelectorAll<HTMLButtonElement>('[data-testid="deck-list-entry"]'));
  const search: (term: string) => Promise<void> = async (term) => {
    const field: HTMLInputElement = host.querySelector('input[type="search"]')!;
    field.value = term;
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  async function render(list: DeckInstance[]): Promise<void> {
    fixture.componentRef.setInput('decks', list);
    await fixture.whenStable();
  }

  beforeEach(() => {
    configureCardManagerTestbed();
    fixture = TestBed.createComponent(DeckList);
    host = fixture.nativeElement as HTMLElement;
    selected = [];
    fixture.componentInstance.selected.subscribe((id) => selected.push(id));
  });

  it('lists all decks in table order with their draw pile count', async () => {
    await render(decks);
    const cells: (selector: string) => (string | undefined)[] = (selector) =>
      entries().map((entry) => entry.querySelector(selector)?.textContent?.trim());
    expect(cells('.deck-list__name')).toEqual(['Monster', 'Schätze', 'Monster (2)']);
    expect(cells('.deck-list__count')).toEqual(['1', '0', '0']);
  });

  it('filters the list by name and reports when nothing matches', async () => {
    await render(decks);
    await search('monster');
    expect(entries()).toHaveLength(2);
    await search('drache');
    expect(entries()).toHaveLength(0);
    expect(host.textContent).toContain('Kein Deck gefunden.');
  });

  it('reports the clicked deck', async () => {
    await render(decks);
    entries()[1].click();
    expect(selected).toEqual(['d2']);
  });

  it('shows a hint, but no search without decks', async () => {
    await render([]);
    expect(host.textContent).toContain('Noch keine Decks.');
    expect(host.querySelector('input[type="search"]')).toBeNull();
    expect(host.querySelector('app-add-deck-form')).toBeNull();
  });
});
