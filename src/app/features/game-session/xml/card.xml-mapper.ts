import { Card } from '../../../core/models/card.model';
import {
  readCardProperties,
  writeCardProperties,
} from '../../../core/services/card-deck/card-property-xml.util';
import {
  appendElement,
  appendTextElement,
  childElements,
  firstChild,
  readString,
  setAttributes,
  textOf,
} from '../../../shared/utils/xml.util';

export function writeCardList(parent: Element, name: string, cards: Card[]): void {
  const list: Element = appendElement(parent, name);
  cards.forEach((card) => writeCard(list, card));
}

export function readCardList(parent: Element, name: string): Card[] {
  const list: Element | null = firstChild(parent, name);
  return list ? childElements(list, 'card').map(readCard) : [];
}

export function writeCard(parent: Element, card: Card): Element {
  const el: Element = appendElement(parent, 'card');
  setAttributes(el, {
    id: card.id,
    name: card.name,
    image: card.imagePath,
    backImage: card.backImagePath,
  });
  appendTextElement(el, 'description', card.description);
  writeCardProperties(el, card.properties);
  return el;
}

/**
 * Attribute `type` und `slot` älterer Spielstände sowie `<modifier>` werden ignoriert. Fehlt `backImage`, ergänzt
 * `readDeck` die Rückseite des Decks.
 */
export function readCard(el: Element): Card {
  const id: string = readString(el, 'id');
  return {
    id,
    name: readString(el, 'name'),
    imagePath: readString(el, 'image'),
    backImagePath: readString(el, 'backImage'),
    description: textOf(firstChild(el, 'description')),
    properties: readCardProperties(el, id),
  };
}
