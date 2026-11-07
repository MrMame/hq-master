import { CardLocation } from '../../core/models/card-location.model';
import { DeckInstance, DeckState } from '../../core/models/deck-state.model';
import { findCardAt, LocatedCard } from '../../core/services/card-deck/card-location.util';
import { findDeck } from '../../core/services/card-deck/deck-state.util';
import { CardActionContext, CardDraft, CardViewerContext } from '../models/card-action.model';
import { locationInDraft } from './card-draft.util';
import { CardRef } from '../../core/models/deck-state.model';

/**
 * Kontext der angesehenen Karte an ihrem aktuellen Ort, im Entwurf am Ort laut Entwurf. Karte oder Deck nicht
 * (mehr) vorhanden → `null`.
 */
export function viewerContext(
  s: DeckState,
  ref: CardRef,
  context: CardViewerContext,
): CardActionContext | null {
  const found: LocatedCard | null = findCardAt(s, ref);
  const deck: DeckInstance | undefined = findDeck(s, ref.deckId);
  if (!found || !deck) return null;
  const draft: CardDraft | null = context.mode === 'draft' ? context.draft : null;
  const location: CardLocation = draft
    ? locationInDraft(draft.characterId, draft.moves(), ref, found.location)
    : found.location;
  return { card: found.card, location, ref, deck, mode: context.mode, draft };
}
