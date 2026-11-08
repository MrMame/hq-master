import { Card } from '../../models/card.model';
import { CardProperty } from '../../models/card-property.model';
import { CharacterInfo, FIXED_PROPERTIES } from '../../models/character-info.model';
import { AssignedCard, DeckState } from '../../models/deck-state.model';
import { EQUIPMENT_SLOTS } from '../../models/equipment.model';
import { CardInDeck } from '../card-deck/deck-state.util';

/**
 * Wirksame Werte eines Charakters, nie unter 0: Tempo = Grundwert plus Bonus; dynamische Eigenschaften (alle
 * Namen außer `Leben`, `Ruestung`, `Tempo`) = Summe der wirkenden Karten, in Reihenfolge ihres ersten Auftretens.
 */
export interface EffectiveStats {
  readonly Tempo: number;
  readonly dynamic: ReadonlyMap<string, number>;
}

/** Teile des Deck-Zustands, in denen Karten bei einem Charakter wirken. */
export type ActiveState = Pick<DeckState, 'assigned' | 'belt'>;

/** Eine Karte, die einen Wert verändert, z. B. „Turmschild +2“. */
export interface BonusSource {
  name: string;
  value: number;
}

/**
 * Einzige Liste der Karten, die bei einem Charakter wirken: Slots in `EQUIPMENT_SLOTS`-Reihenfolge, danach der
 * Gürtel. Karten im Inventar wirken nicht.
 */
export function activeEntriesOf(state: ActiveState, characterId: string): CardInDeck[] {
  const slots: CardInDeck[] = EQUIPMENT_SLOTS.flatMap((slot) =>
    state.assigned.filter((entry) => entry.characterId === characterId && entry.slot === slot),
  );
  const belt: CardInDeck[] = state.belt.filter((entry) => entry.characterId === characterId);
  return [...slots, ...belt].map(({ deckId, card }) => ({ deckId, card }));
}

/** Wirkende Karten eines Charakters (siehe `activeEntriesOf`). */
export function activeCardsOf(state: ActiveState, characterId: string): Card[] {
  return activeEntriesOf(state, characterId).map((entry) => entry.card);
}

/**
 * Einzige Berechnung der wirksamen Werte (Anzeige; dynamische Eigenschaften nur zur Anzeige).
 * Die Grundwerte im `character` bleiben unverändert.
 */
export function effectiveStats(character: CharacterInfo, cards: readonly Card[]): EffectiveStats {
  const properties: CardProperty[] = propertiesOf(cards);
  return {
    Tempo: Math.max(0, character.Tempo + bonusOf(properties, 'Tempo')),
    dynamic: dynamicProperties(properties),
  };
}

function isFixed(name: string): boolean {
  return FIXED_PROPERTIES.some((fixed) => fixed === name);
}

/** Summen der dynamischen Eigenschaften in Reihenfolge des ersten Auftretens, nie unter 0. */
function dynamicProperties(properties: readonly CardProperty[]): ReadonlyMap<string, number> {
  const totals: Map<string, number> = new Map<string, number>();
  properties
    .filter((property) => !isFixed(property.name))
    .forEach(({ name, value }) => totals.set(name, (totals.get(name) ?? 0) + value));
  return new Map(Array.from(totals, ([name, total]) => [name, Math.max(0, total)]));
}

/** Summe der Eigenschaften mit genau diesem Namen (Groß-/Kleinschreibung zählt). */
export function bonusOf(properties: readonly CardProperty[], name: string): number {
  return properties
    .filter((property) => property.name === name)
    .reduce((sum, property) => sum + property.value, 0);
}

/** Zugewiesene Karten eines Charakters. */
export function cardsOf(assigned: readonly AssignedCard[], characterId: string): AssignedCard[] {
  return assigned.filter((entry) => entry.characterId === characterId);
}

/** Alle Eigenschaften der übergebenen Karten. */
export function propertiesOf(cards: readonly Card[]): CardProperty[] {
  return cards.flatMap((card) => card.properties);
}

/** Karten, die eine Eigenschaft verändern, mit ihrem Beitrag (Tooltip). */
export function bonusSources(cards: readonly Card[], name: string): BonusSource[] {
  return cards
    .map((card) => ({ name: card.name, value: bonusOf(card.properties, name) }))
    .filter((source) => source.value !== 0);
}
