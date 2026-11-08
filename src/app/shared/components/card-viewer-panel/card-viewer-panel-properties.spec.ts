import { provideDefaultCardActions } from '../../card-actions/default-card-actions';
import { CardViewerSetup, setupCardViewer } from '../../testing/card-viewer.fixtures';
import { Card } from '../../../core/models/card.model';
import { DeckInstance, DeckState } from '../../../core/models/deck-state.model';
import {
  BASIC_CARD,
  createDeckInstance,
  createPropertyCard,
} from '../../../core/testing/deck.fixtures';

const AXE: Card = createPropertyCard('p1', 'Axt', [
  { name: 'Angriff', value: 2 },
  { name: 'Tempo', value: -1 },
]);

/** deck-1: Axt (zwei Eigenschaften) und Fackel (keine) in der Hand. */
function handState(): DeckState {
  const deck: DeckInstance = createDeckInstance('deck-1');
  return {
    decks: [{ ...deck, config: { ...deck.config, cards: [AXE, BASIC_CARD] } }],
    hand: [AXE, BASIC_CARD].map((card) => ({ deckId: 'deck-1', card })),
    assigned: [],
    inventory: [],
    belt: [],
  };
}

describe('CardViewerPanel – properties', () => {
  let setup: CardViewerSetup;

  const chips: () => string[] = () =>
    Array.from(
      setup.overlay.querySelectorAll('[data-testid="card-viewer-property"]'),
      (chip) => chip.textContent?.trim() ?? '',
    );
  const button: (label: string) => HTMLButtonElement = (label) =>
    Array.from(setup.overlay.querySelectorAll<HTMLButtonElement>('button')).find(
      (candidate) =>
        candidate.textContent?.trim() === label || candidate.getAttribute('aria-label') === label,
    )!;

  async function click(element: HTMLElement): Promise<void> {
    element.click();
    for (let i: number = 0; i < 3; i++) await setup.stable();
  }

  beforeEach(async () => {
    setup = await setupCardViewer(handState(), provideDefaultCardActions());
  });

  it('shows the properties of the card below it, also on the back', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 'p1' });
    expect(chips()).toEqual(['Angriff +2', 'Tempo −1']);
    expect(
      setup.overlay.querySelector('.card-viewer__stage + app-card-properties-strip'),
    ).not.toBeNull();

    await click(button('Umdrehen'));
    expect(chips()).toEqual(['Angriff +2', 'Tempo −1']);
  });

  it('shows no properties for a card without any after browsing to it', async () => {
    await setup.open({ deckId: 'deck-1', cardId: 'p1' });
    await click(button('Nächste Karte'));

    expect(chips()).toEqual([]);
  });
});
