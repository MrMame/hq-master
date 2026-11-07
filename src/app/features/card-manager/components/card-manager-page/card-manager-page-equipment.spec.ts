import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import {
  assignedCard,
  createEquipmentDeckState,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../../../core/testing/deck.fixtures';
import { DeckState } from '../../../../core/models/deck-state.model';
import {
  CardManagerPageHarness,
  setupCardManagerPage,
} from '../../testing/card-manager-page.fixtures';

describe('CardManagerPage – active card and equipment', () => {
  let harness: CardManagerPageHarness;
  let host: HTMLElement;

  const overlay: () => HTMLElement = () => TestBed.inject(OverlayContainer).getContainerElement();
  const equipped: () => HTMLElement | null = () =>
    host.querySelector('section[aria-label="Ausgerüstet"]');

  beforeEach(async () => {
    harness = await setupCardManagerPage();
    host = harness.host;
  });

  it('shows the active card with the name and card back of its deck', async () => {
    await harness.render({
      ...createTwoDeckState(),
      activeCard: { deckId: 'deck-2', card: TOWER_SHIELD },
    });
    expect(overlay().querySelector('[data-testid="active-card-deck"]')?.textContent).toBe(
      'Testdeck (2)',
    );
    expect(overlay().textContent).toContain('Turmschild');
  });

  it('discards the active card into its own deck when clicked', async () => {
    await harness.render({
      ...createTwoDeckState(),
      activeCard: { deckId: 'deck-2', card: TOWER_SHIELD },
    });
    overlay().querySelector<HTMLElement>('.card-display')!.click();
    await harness.fixture.whenStable();

    expect(harness.cardManager.state().activeCard).toBeNull();
    expect(harness.cardManager.decks()[1].discardPile).toEqual([TOWER_SHIELD]);
    expect(overlay().querySelector('app-card-display')).toBeNull();
  });

  it('shows equipped cards of all decks with owner and origin deck', async () => {
    harness.assignment.ownerNames.set(new Map([['a', 'Barbar']]));
    const state: DeckState = {
      ...createTwoDeckState(),
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand', 'deck-2')],
    };
    await harness.render(state);

    expect(equipped()?.querySelector('h2')?.textContent).toBe('Ausgerüstet (1)');
    expect(equipped()?.querySelector('.card-owner')?.textContent).toBe('Im Besitz von Barbar');
    expect(equipped()?.querySelector('.card-origin')?.textContent).toBe('aus Testdeck (2)');
  });

  it('hides the equipped area without assignments', async () => {
    await harness.render(createTwoDeckState());
    expect(equipped()).toBeNull();
  });

  it('starts the assignment from the floating card', async () => {
    await harness.render(createEquipmentDeckState('a'));
    overlay().querySelector<HTMLButtonElement>('.floating-card__assign')!.click();

    expect(harness.assignment.assignCard).toHaveBeenCalledExactlyOnceWith({
      deckId: 'deck-1',
      cardId: 'e1',
    });
    expect(harness.cardManager.state().activeCard).not.toBeNull();
  });

  it('passes the reason for a disabled assignment to the floating card', async () => {
    harness.assignment.assignDisabledReason.set('Keine Charaktere in der Session');
    await harness.render(createEquipmentDeckState('a'));

    const button: HTMLButtonElement = overlay().querySelector('.floating-card__assign')!;
    expect(button.disabled).toBe(true);
    expect(button.parentElement?.title).toBe('Keine Charaktere in der Session');
  });

  it('places the equipped area above the card table', async () => {
    await harness.render({
      ...createTwoDeckState(),
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand')],
    });
    const table: Element = host.querySelector('section[aria-label="Spieltisch"]')!;
    expect(
      equipped()!.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
