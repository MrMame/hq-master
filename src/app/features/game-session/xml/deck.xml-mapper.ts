import { DeckState } from '../../../core/models/deck-state.model';
import { migrateLegacyDeck } from '../../../core/services/card-deck/deck-state-migration.util';
import { withNormalizedCards } from '../../../core/services/card-deck/card-normalize.util';
import { withoutDanglingRefs } from '../../../core/services/card-deck/deck-state.util';
import { childElements, firstChild } from '../../../shared/utils/xml.util';
import { readAssignedCards, writeAssignedCards } from './assigned-cards.xml-mapper';
import { readCardList } from './card.xml-mapper';
import {
  readDeckConfig,
  readDeckInstance,
  readDeckPiles,
  writeDeckInstance,
} from './deck-instance.xml-mapper';
import { readHand, writeHand } from './hand.xml-mapper';
import { readInventory, writeInventory } from './inventory.xml-mapper';
import { readBelt, writeBelt } from './belt.xml-mapper';

/** `<cardDeck>` mit allen Decks in Tischreihenfolge, der Hand des Dungeon Masters, den Zuweisungen, dem Inventar und dem Gürtel. */
export function writeDeck(doc: XMLDocument, state: DeckState): Element {
  const el: Element = doc.createElement('cardDeck');
  state.decks.forEach((deck) => writeDeckInstance(el, deck));
  writeHand(el, state.hand);
  writeAssignedCards(el, state.assigned);
  writeInventory(el, state.inventory);
  writeBelt(el, state.belt);
  return el;
}

/**
 * Ältere Spielstände mit einem Deck (`<config>` direkt in `<cardDeck>`) laden als eine Instanz, eine aktive
 * Karte (`<activeCard>`) als einzige Handkarte. Ohne `<inventory>` bzw. `<belt>` sind sie leer. Hand-, Slot-,
 * Inventar- und Gürtelkarten fehlender Instanzen werden verworfen; Karten ohne `backImage` erhalten die Rückseite ihres Decks.
 */
export function readDeck(el: Element): DeckState {
  if (firstChild(el, 'config')) return withNormalizedCards(readLegacyDeck(el));
  return withNormalizedCards(
    withoutDanglingRefs({
      decks: childElements(el, 'deck').map(readDeckInstance),
      hand: readHand(el),
      assigned: readAssignedCards(el),
      inventory: readInventory(el),
      belt: readBelt(el),
    }),
  );
}

function readLegacyDeck(el: Element): DeckState {
  return migrateLegacyDeck({
    config: readDeckConfig(firstChild(el, 'config')),
    ...readDeckPiles(el),
    activeCard: readCardList(el, 'activeCard')[0] ?? null,
    assigned: readAssignedCards(el),
  });
}
