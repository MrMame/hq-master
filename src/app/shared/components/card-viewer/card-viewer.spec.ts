import { CardRef, DeckState } from '../../../core/models/deck-state.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  assignedCard,
  SWORD_CARD,
  createTwoDeckState,
  TOWER_SHIELD,
} from '../../../core/testing/deck.fixtures';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { TestBed } from '@angular/core/testing';
import { CardViewerSetup, setupCardViewer } from '../../testing/card-viewer.fixtures';

const DRAW_CARD: CardRef = { deckId: 'deck-2', cardId: 'c1' };

describe('CardViewer', () => {
  let setup: CardViewerSetup;
  let state: DeckState;

  beforeEach(async () => {
    state = {
      ...createTwoDeckState(),
      assigned: [assignedCard(TOWER_SHIELD, 'a', 'leftHand', 'deck-2')],
    };
    setup = await setupCardViewer(state);
  });

  it('shows nothing until a card is viewed', () => {
    expect(setup.overlay.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows the front of a draw pile card with deck and location', async () => {
    await setup.open(DRAW_CARD);

    const dialog: Element | null = setup.overlay.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-label')).toBe('Card Viewer');
    expect(setup.location()).toBe('Testdeck (2) · Nachziehstapel');
    expect(dialog?.querySelector<HTMLImageElement>('.card-front img')?.alt).toBe(SWORD_CARD.name);
    expect(dialog?.querySelector('.card-back')).toBeNull();
    expect(setup.overlay.querySelector('.cdk-overlay-backdrop')).not.toBeNull();
  });

  it('names the owner and slot of an equipped card', async () => {
    TestBed.inject(CharactersDbService).writeCharacter({
      ...createTestCharacter('a'),
      name: 'Barbar',
    });
    await setup.open({ deckId: 'deck-2', cardId: 'e2' });
    expect(setup.location()).toBe('Testdeck (2) · Barbar · Linke Hand');
  });

  it('shows the new location after the card was moved', async () => {
    await setup.open(DRAW_CARD);
    setup.cardManager.moveCard(DRAW_CARD, { kind: 'hand' });
    await setup.stable();
    expect(setup.location()).toBe('Testdeck (2) · Hand');
  });

  it.each([
    [
      'the close button',
      (s: CardViewerSetup): void =>
        s.overlay.querySelector<HTMLButtonElement>('button[aria-label="Schließen"]')!.click(),
    ],
    [
      'a click next to the card',
      (s: CardViewerSetup): void =>
        s.overlay.querySelector<HTMLElement>('.cdk-overlay-backdrop')!.click(),
    ],
    [
      'Escape',
      (): boolean =>
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
    ],
  ])('closes on %s without moving the card', async (_name, close) => {
    await setup.open(DRAW_CARD);

    close(setup);
    await setup.stable();

    expect(setup.viewer.viewed()).toBeNull();
    expect(setup.overlay.querySelector('[role="dialog"]')).toBeNull();
    expect(setup.cardManager.state()).toEqual(state);
  });

  it('does nothing on a click on the card itself', async () => {
    await setup.open(DRAW_CARD);
    setup.overlay.querySelector<HTMLElement>('.card-viewer__card .card-display')!.click();
    await setup.stable();
    expect(setup.viewer.viewed()?.ref).toEqual(DRAW_CARD);
    expect(setup.cardManager.state()).toEqual(state);
  });

  it('closes when the card disappears, e.g. because its deck was removed', async () => {
    await setup.open(DRAW_CARD);
    setup.cardManager.removeDeck('deck-2');
    await setup.stable();
    expect(setup.viewer.viewed()).toBeNull();
    expect(setup.overlay.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes for an unknown card and shows no actions without registered ones', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 'unknown' });
    expect(setup.viewer.viewed()).toBeNull();

    await setup.open(DRAW_CARD);
    expect(setup.menuLabels()).toEqual([]);
    expect(setup.overlay.textContent).toContain('Keine Aktionen');
  });
});
