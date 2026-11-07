import { CardLocation } from '../../models/card-location.model';
import { CardRef, DeckState } from '../../models/deck-state.model';
import {
  createMoveState,
  deck1Ref,
  HAND_CARDS,
  occurrences,
  ORIGINS,
  TARGETS,
} from '../../testing/card-move.fixtures';
import { locateCard } from './card-location.util';
import { moveCard } from './card-move.util';

const MOVES: { cardId: string; from: CardLocation; to: CardLocation }[] = ORIGINS.flatMap(
  ({ cardId, location }) =>
    TARGETS.filter((target) => target.kind !== location.kind).map((to) => ({
      cardId,
      from: location,
      to,
    })),
);
// 30 Paare mit verschiedener Art; Slot → anderer Slot und Inventar → anderes Inventar kommen dazu, die
// übrigen 6 der 36 Kombinationen (gleicher Ort) prüft „where it already is“.
const SAME_KIND: { cardId: string; from: CardLocation; to: CardLocation }[] = [
  { cardId: 'h5', from: ORIGINS[4].location, to: TARGETS[4] },
  { cardId: 'h6', from: ORIGINS[5].location, to: TARGETS[5] },
];

describe('moveCard – every origin and target', () => {
  let s: DeckState;

  beforeEach(() => {
    s = createMoveState();
  });

  it.each([...MOVES, ...SAME_KIND])(
    'moves $cardId from $from.kind to $to.kind',
    ({ cardId, from, to }) => {
      const ref: CardRef = deck1Ref(cardId);
      const next: DeckState = moveCard(s, ref, to);

      expect(locateCard(next, ref)).toEqual(to);
      expect(occurrences(next, ref)).toBe(1);
      // Die zweite Instanz mit denselben Karten-IDs bleibt unberührt.
      expect(next.decks[1]).toBe(s.decks[1]);
      expect(next.assigned).toContainEqual(s.assigned[1]);
      expect(next.inventory).toContainEqual(s.inventory[1]);
      if (from.kind === 'hand') expect(next.hand).toEqual([]);
      if (to.kind === 'hand') {
        // Die Karte kommt ans Ende der Hand, h1 bleibt in der Hand und wird nicht abgelegt.
        expect(next.hand.map((entry) => entry.card.id)).toEqual(['h1', cardId]);
        expect(next.decks[0].discardPile).not.toContain(HAND_CARDS[0]);
      }
    },
  );

  it.each(ORIGINS)(
    'keeps the same state when $cardId moves to where it already is',
    ({ cardId, location }) => {
      expect(moveCard(s, deck1Ref(cardId), location)).toBe(s);
    },
  );
});
