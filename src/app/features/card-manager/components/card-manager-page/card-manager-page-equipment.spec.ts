import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import {
  assignedCard,
  BASIC_CARD,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../../../core/testing/deck.fixtures';
import { DeckState } from '../../../../core/models/deck-state.model';
import {
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

describe('CardManagerPage – hand and equipment', () => {
  let harness: CardManagerPageHarness;
  let host: HTMLElement;

  const overlay: () => HTMLElement = () => TestBed.inject(OverlayContainer).getContainerElement();
  const section: (label: string) => HTMLElement | null = (label) =>
    host.querySelector(`[role="region"][aria-label="${label}"]`);
  const follows: (first: Element, second: Element) => boolean = (first, second) =>
    !!(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);

  beforeEach(async () => {
    harness = await setupCardManagerPage();
    host = harness.host;
  });

  it('shows equipped cards of all decks with owner and origin deck', async () => {
    harness.assignment.ownerNames.set(new Map([['a', 'Barbar']]));
    const state: DeckState = {
      ...createTwoDeckState(),
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand', 'deck-2')],
    };
    await harness.render(state);

    const equipped: HTMLElement | null = section('Ausgerüstet');
    expect(equipped?.querySelector('h3')?.textContent?.trim()).toBe('Ausgerüstet (1)');
    expect(equipped?.querySelector('.card-owner')?.textContent).toBe('Im Besitz von Barbar');
    expect(equipped?.querySelector('.card-origin')?.textContent).toBe('aus Testdeck (2)');
  });

  it('hides hand and equipped area without cards', async () => {
    await harness.render(createTwoDeckState());
    expect(section('Hand des Dungeon Masters')).toBeNull();
    expect(section('Ausgerüstet')).toBeNull();
  });

  it('places the hand above the equipped area and both above the card table', async () => {
    await harness.render({
      ...createTwoDeckState(),
      hand: [{ deckId: 'deck-1', card: BASIC_CARD }],
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
    });
    const hand: HTMLElement = section('Hand des Dungeon Masters')!;
    const equipped: HTMLElement = section('Ausgerüstet')!;
    expect(follows(hand, equipped)).toBe(true);
    expect(follows(equipped, section('Spieltisch')!)).toBe(true);
  });

  it('keeps all drawn cards of two decks in the hand and shows no floating card', async () => {
    await harness.render(createTwoDeckState());
    harness.cardManager.draw('deck-1');
    harness.cardManager.draw('deck-2');
    harness.cardManager.draw('deck-2');
    await harness.fixture.whenStable();

    expect(section('Hand des Dungeon Masters')?.querySelector('h3')?.textContent?.trim()).toBe(
      'Hand des Dungeon Masters (3)',
    );
    expect(harness.cardManager.decks().map((deck) => deck.discardPile)).toEqual([[], []]);
    expect(overlay().querySelector('app-card-display')).toBeNull();
  });
});
