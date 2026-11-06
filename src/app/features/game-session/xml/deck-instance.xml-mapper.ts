import { DeckConfig } from '../../../core/models/deck-config.model';
import { DeckInstance } from '../../../core/models/deck-state.model';
import {
  appendElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
} from '../../../shared/utils/xml.util';
import { readCard, readCardList, readCardType, writeCard, writeCardList } from './card.xml-mapper';

/** `<deck id name source><config …/><drawPile/><discardPile/><bank/></deck>` */
export function writeDeckInstance(parent: Element, deck: DeckInstance): void {
  const el: Element = appendElement(parent, 'deck');
  setAttributes(el, { id: deck.id, name: deck.name, source: deck.source });
  writeDeckConfig(el, deck.config);
  writeDeckPiles(el, deck);
}

export function readDeckInstance(el: Element): DeckInstance {
  const config: DeckConfig = readDeckConfig(firstChild(el, 'config'));
  return {
    id: readString(el, 'id'),
    name: readString(el, 'name', config.name),
    source: readString(el, 'source'),
    config,
    ...readDeckPiles(el),
  };
}

/** Stapel und Bank; fehlende Listen sind leer. Auch für ältere Spielstände mit einem Deck. */
export function readDeckPiles(
  el: Element,
): Pick<DeckInstance, 'drawPile' | 'discardPile' | 'bank'> {
  return {
    drawPile: readCardList(el, 'drawPile'),
    discardPile: readCardList(el, 'discardPile'),
    bank: readCardList(el, 'bank'),
  };
}

/** Fehlendes `<config>` → leere Konfiguration. */
export function readDeckConfig(configEl: Element | null): DeckConfig {
  return {
    id: configEl ? readString(configEl, 'id') : '',
    name: configEl ? readString(configEl, 'name') : '',
    backImagePath: configEl ? readString(configEl, 'backImage') : '',
    defaultCardType: configEl ? readCardType(configEl, 'defaultCardType') : 'basic',
    cards: configEl ? childElements(configEl, 'card').map(readCard) : [],
  };
}

function writeDeckConfig(parent: Element, config: DeckConfig): void {
  const configEl: Element = appendElement(parent, 'config');
  setAttributes(configEl, {
    id: config.id,
    name: config.name,
    backImage: config.backImagePath,
    defaultCardType: config.defaultCardType,
  });
  config.cards.forEach((card) => writeCard(configEl, card));
}

function writeDeckPiles(el: Element, deck: DeckInstance): void {
  writeCardList(el, 'drawPile', deck.drawPile);
  writeCardList(el, 'discardPile', deck.discardPile);
  writeCardList(el, 'bank', deck.bank);
}
