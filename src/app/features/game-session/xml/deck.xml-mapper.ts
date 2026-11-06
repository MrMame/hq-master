import { Card } from '../../../core/models/card.model';
import { ActiveCard, DeckState } from '../../../core/models/deck-state.model';
import { migrateLegacyDeck } from '../../../core/services/card-deck/deck-state-migration.util';
import { withoutDanglingRefs } from '../../../core/services/card-deck/deck-state.util';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readAssignedCards, writeAssignedCards } from './assigned-cards.xml-mapper';
import { readCard, readCardList, writeCard } from './card.xml-mapper';
import {
  readDeckConfig,
  readDeckInstance,
  readDeckPiles,
  writeDeckInstance,
} from './deck-instance.xml-mapper';

/** `<cardDeck>` mit allen Decks in Tischreihenfolge, der aktiven Karte und den Zuweisungen. */
export function writeDeck(doc: XMLDocument, state: DeckState): Element {
  const el: Element = doc.createElement('cardDeck');
  state.decks.forEach((deck) => writeDeckInstance(el, deck));
  const activeEl: Element = appendElement(el, 'activeCard');
  if (state.activeCard) {
    setAttributes(activeEl, { deckId: state.activeCard.deckId });
    writeCard(activeEl, state.activeCard.card);
  }
  writeAssignedCards(el, state.assigned);
  return el;
}

/**
 * Ältere Spielstände mit einem Deck (`<config>` direkt in `<cardDeck>`) laden als eine Instanz.
 * Aktive Karte und Zuweisungen auf fehlende Instanzen werden verworfen.
 */
export function readDeck(el: Element): DeckState {
  if (firstChild(el, 'config')) return readLegacyDeck(el);
  return withoutDanglingRefs({
    decks: childElements(el, 'deck').map(readDeckInstance),
    activeCard: readActiveCard(firstChild(el, 'activeCard')),
    assigned: readAssignedCards(el),
  });
}

function readActiveCard(el: Element | null): ActiveCard | null {
  const card: Card | undefined = el ? childElements(el, 'card').map(readCard)[0] : undefined;
  return el && card ? { deckId: readString(el, 'deckId'), card } : null;
}

function readLegacyDeck(el: Element): DeckState {
  return migrateLegacyDeck({
    config: readDeckConfig(firstChild(el, 'config')),
    ...readDeckPiles(el),
    activeCard: readCardList(el, 'activeCard')[0] ?? null,
    assigned: readAssignedCards(el),
  });
}
