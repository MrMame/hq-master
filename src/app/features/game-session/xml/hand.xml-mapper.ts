import { Card } from '../../../core/models/card.model';
import { HandCard } from '../../../core/models/deck-state.model';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readCard, writeCard } from './card.xml-mapper';

/** `<hand><handCard deckId><card …/></handCard></hand>` in Reihenfolge der Hand. */
export function writeHand(parent: Element, hand: readonly HandCard[]): void {
  const list: Element = appendElement(parent, 'hand');
  hand.forEach(({ deckId, card }) => {
    const el: Element = appendElement(list, 'handCard');
    setAttributes(el, { deckId });
    writeCard(el, card);
  });
}

/**
 * Hand aus `<hand>`; ältere Spielstände mit `<activeCard deckId>` laden diese Karte als einzige Handkarte.
 * Einträge ohne Karte werden verworfen, Verweise auf fehlende Decks verwirft der Aufrufer.
 */
export function readHand(parent: Element): HandCard[] {
  const list: Element | null = firstChild(parent, 'hand');
  if (list) return childElements(list, 'handCard').flatMap(readHandCard);
  const active: Element | null = firstChild(parent, 'activeCard');
  return active ? readHandCard(active) : [];
}

function readHandCard(el: Element): HandCard[] {
  const cardEl: Element | null = firstChild(el, 'card');
  const card: Card | null = cardEl ? readCard(cardEl) : null;
  return card ? [{ deckId: readString(el, 'deckId'), card }] : [];
}
