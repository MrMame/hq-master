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
// 20 Paare mit verschiedener Art; Slot → anderer Slot ist die 21. Bewegung, die übrigen 4 der 25
// Kombinationen (gleiche Art) prüft „where it already is“.
const SLOT_TO_SLOT: { cardId: string; from: CardLocation; to: CardLocation } = {
  cardId: 'h5',
  from: ORIGINS[4].location,
  to: TARGETS[4],
};

describe('moveCard – every origin and target', () => {
  let s: DeckState;

  beforeEach(() => {
    s = createMoveState();
  });

  it.each([...MOVES, SLOT_TO_SLOT])(
    'moves $cardId from $from.kind to $to.kind',
    ({ cardId, from, to }) => {
      const ref: CardRef = deck1Ref(cardId);
      const next: DeckState = moveCard(s, ref, to);

      expect(locateCard(next, ref)).toEqual(to);
      expect(occurrences(next, ref)).toBe(1);
      // Die zweite Instanz mit denselben Karten-IDs bleibt unberührt.
      expect(next.decks[1]).toBe(s.decks[1]);
      expect(next.assigned).toContainEqual(s.assigned[1]);
      if (from.kind === 'active') expect(next.activeCard).toBeNull();
      if (to.kind === 'active') {
        // Die bisher aktive Karte h1 kommt in den Ablagestapel ihres Decks.
        expect(next.decks[0].discardPile.at(-1)).toBe(HAND_CARDS[0]);
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
