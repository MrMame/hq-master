import { DeckConfig } from '../../../core/models/deck-config.model';
import { DeckState } from '../../../core/models/deck-state.model';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readAssignedCards, writeAssignedCards } from './assigned-cards.xml-mapper';
import { readCard, readCardList, readCardType, writeCard, writeCardList } from './card.xml-mapper';

/** Ein leeres `<cardDeck/>` steht für "kein Deck geladen". */
export function writeDeck(doc: XMLDocument, deck: DeckState | null): Element {
  const el: Element = doc.createElement('cardDeck');
  if (!deck) return el;
  const { config }: DeckState = deck;
  const configEl: Element = appendElement(el, 'config');
  setAttributes(configEl, {
    id: config.id,
    name: config.name,
    backImage: config.backImagePath,
    defaultCardType: config.defaultCardType,
  });
  config.cards.forEach((card) => writeCard(configEl, card));
  writeCardList(el, 'drawPile', deck.drawPile);
  writeCardList(el, 'discardPile', deck.discardPile);
  writeCardList(el, 'activeCard', deck.activeCard ? [deck.activeCard] : []);
  writeCardList(el, 'bank', deck.bank);
  writeAssignedCards(el, deck.assigned);
  return el;
}

export function readDeck(el: Element): DeckState | null {
  const configEl: Element | null = firstChild(el, 'config');
  if (!configEl) return null;
  const config: DeckConfig = {
    id: readString(configEl, 'id'),
    name: readString(configEl, 'name'),
    backImagePath: readString(configEl, 'backImage'),
    defaultCardType: readCardType(configEl, 'defaultCardType'),
    cards: childElements(configEl, 'card').map(readCard),
  };
  return {
    config,
    drawPile: readCardList(el, 'drawPile'),
    discardPile: readCardList(el, 'discardPile'),
    activeCard: readCardList(el, 'activeCard')[0] ?? null,
    bank: readCardList(el, 'bank'),
    assigned: readAssignedCards(el),
  };
}
