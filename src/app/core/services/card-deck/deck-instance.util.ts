import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { DeckInstance, DeckState } from '../../models/deck-state.model';
import { findDeck, unassignedCards, updateDeck } from './deck-state.util';
import { shuffled } from './shuffle.util';

/** Vergebener Name bekommt die nächste freie Nummer, z. B. „Monster (2)“. */
export function uniqueDeckName(name: string, taken: readonly string[]): string {
  if (!taken.includes(name)) return name;
  let n: number = 2;
  while (taken.includes(`${name} (${n})`)) n++;
  return `${name} (${n})`;
}

/** Neue Instanz am Ende des Tischs: alle Karten gemischt im Nachziehstapel. */
export function addDeck(s: DeckState, config: DeckConfig, source: string, id: string): DeckState {
  const taken: string[] = s.decks.map((d) => d.name);
  const deck: DeckInstance = {
    id,
    name: uniqueDeckName(config.name.trim() || 'Deck', taken),
    source,
    config,
    drawPile: shuffled(config.cards),
    discardPile: [],
    bank: [],
  };
  return { ...s, decks: [...s.decks, deck] };
}

/** Leerer Name → unverändert. */
export function renameDeck(s: DeckState, deckId: string, name: string): DeckState {
  const trimmed: string = name.trim();
  if (!trimmed) return s;
  return updateDeck(s, deckId, (d) => (d.name === trimmed ? d : { ...d, name: trimmed }));
}

/** Entfernt die Instanz samt ihrer Hand- und zugewiesenen Karten. */
export function removeDeck(s: DeckState, deckId: string): DeckState {
  if (!findDeck(s, deckId)) return s;
  return {
    decks: s.decks.filter((d) => d.id !== deckId),
    hand: s.hand.filter((entry) => entry.deckId !== deckId),
    assigned: s.assigned.filter((entry) => entry.deckId !== deckId),
  };
}

/** Verschiebt die Instanz um `offset` Plätze; über den Rand hinaus → unverändert. */
export function moveDeck(s: DeckState, deckId: string, offset: number): DeckState {
  const from: number = s.decks.findIndex((d) => d.id === deckId);
  const to: number = from + offset;
  if (from < 0 || offset === 0 || to < 0 || to >= s.decks.length) return s;
  const decks: DeckInstance[] = [...s.decks];
  const [deck] = decks.splice(from, 1);
  decks.splice(to, 0, deck);
  return { ...s, decks };
}

export function shuffleDrawPile(s: DeckState, deckId: string): DeckState {
  return updateDeck(s, deckId, (d) => ({ ...d, drawPile: shuffled(d.drawPile) }));
}

/** Stapel, Ablage, Bank und Handkarten der Instanz zurück in den Nachziehstapel; Zuweisungen bleiben. */
export function resetDeck(s: DeckState, deckId: string): DeckState {
  if (!findDeck(s, deckId)) return s;
  const drawPile: Card[] = shuffled(unassignedCards(s, deckId));
  const next: DeckState = updateDeck(s, deckId, (d) => ({
    ...d,
    drawPile,
    discardPile: [],
    bank: [],
  }));
  return { ...next, hand: s.hand.filter((entry) => entry.deckId !== deckId) };
}
