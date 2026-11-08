import { CardProperty } from './card-property.model';

/**
 * Eine Karte ist genau zwei Grafiken; die App zeichnet nichts auf sie. Es gibt nur einen Kartentyp: Jede Karte
 * kann in Hand, Stapel, Bank, Inventar, Gürtel oder in jedem Slot eines Charakters liegen.
 */
export interface Card {
  id: string;
  name: string;
  /** Vorderseite, relativ zu `public/`. */
  imagePath: string;
  /** Wirksame Rückseite: karteneigene oder die des Decks. */
  backImagePath: string;
  /** Notiz des DM aus dem Deck-XML; wird nicht angezeigt. */
  description: string;
  /** Eigenschaften aus `<property>`; sie wirken am Charakter, solange die Karte bei ihm wirkt. */
  properties: CardProperty[];
}
