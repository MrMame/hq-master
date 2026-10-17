import { BaseCard, Card, CardType } from '../../card-manager/models/card.model';
import { DeckConfig } from '../../card-manager/models/deck-config.model';
import { DeckState } from '../../card-manager/models/deck-state.model';
import {
  appendElement,
  appendTextElement,
  childElements,
  firstChild,
  readNumber,
  readString,
  setAttributes,
  textOf,
} from './xml.util';

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
  };
}

function writeCardList(parent: Element, name: string, cards: Card[]): void {
  const list: Element = appendElement(parent, name);
  cards.forEach((card) => writeCard(list, card));
}

function writeCard(parent: Element, card: Card): void {
  const el: Element = appendElement(parent, 'card');
  setAttributes(el, {
    id: card.id,
    name: card.name,
    image: card.imagePath,
    type: card.cardType,
    attack: card.cardType === 'combat' ? card.attack : null,
    defense: card.cardType === 'combat' ? card.defense : null,
  });
  appendTextElement(el, 'description', card.description);
}

function readCardList(parent: Element, name: string): Card[] {
  const list: Element | null = firstChild(parent, name);
  return list ? childElements(list, 'card').map(readCard) : [];
}

function readCard(el: Element): Card {
  const base: BaseCard = {
    id: readString(el, 'id'),
    name: readString(el, 'name'),
    imagePath: readString(el, 'image'),
    description: textOf(firstChild(el, 'description')),
    cardType: readCardType(el, 'type'),
  };
  if (base.cardType === 'combat') {
    return {
      ...base,
      cardType: 'combat',
      attack: readNumber(el, 'attack'),
      defense: readNumber(el, 'defense'),
    };
  }
  return { ...base, cardType: 'basic' };
}

function readCardType(el: Element, name: string): CardType {
  return el.getAttribute(name) === 'combat' ? 'combat' : 'basic';
}
