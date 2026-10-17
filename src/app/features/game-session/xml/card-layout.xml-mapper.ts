import {
  CardLayout,
  CardLayoutState,
  DEFAULT_CARD_LAYOUT,
  DEFAULT_CARD_LAYOUT_STATE,
} from '../../character-tracker/models/card-layout.model';
import {
  appendElement,
  childElements,
  readBoolean,
  readNumber,
  readString,
  setAttributes,
} from './xml.util';

export function writeCardLayouts(doc: XMLDocument, layout: CardLayoutState): Element {
  const el: Element = doc.createElement('characterCards');
  setAttributes(el, { topCardId: layout.topCardId });
  for (const [characterId, card] of Object.entries(layout.cards)) {
    setAttributes(appendElement(el, 'card'), {
      characterId,
      x: card.x,
      y: card.y,
      minimised: card.isMinimised,
    });
  }
  return el;
}

/** Ältere Spielstände ohne `<characterCards>` liefern ein leeres Layout. */
export function readCardLayouts(el: Element | null): CardLayoutState {
  if (!el) return { ...DEFAULT_CARD_LAYOUT_STATE };
  const cards: Record<string, CardLayout> = {};
  for (const card of childElements(el, 'card')) {
    cards[readString(card, 'characterId')] = {
      x: readNumber(card, 'x', DEFAULT_CARD_LAYOUT.x),
      y: readNumber(card, 'y', DEFAULT_CARD_LAYOUT.y),
      isMinimised: readBoolean(card, 'minimised'),
    };
  }
  return { cards, topCardId: el.getAttribute('topCardId') };
}
