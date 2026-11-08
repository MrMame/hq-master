import { BeltCard } from '../../../core/models/deck-state.model';
import { readCarriedCards, writeCarriedCards } from './inventory.xml-mapper';

/** `<belt><item deckId characterId><card …/></item></belt>`, wie `<inventory>`. */
export function writeBelt(parent: Element, belt: BeltCard[]): void {
  writeCarriedCards(parent, 'belt', belt);
}

/** Ältere Spielstände ohne `<belt>` → leerer Gürtel. */
export function readBelt(parent: Element): BeltCard[] {
  return readCarriedCards(parent, 'belt');
}
