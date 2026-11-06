import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard } from '../../models/deck-state.model';
import { ModifiableStat, StatModifier } from '../../models/equipment.model';

/** Wirksame Werte eines Charakters: Grundwert plus Summe aller Modifikatoren, nie unter 0. */
export type EffectiveStats = Readonly<Record<ModifiableStat, number>>;

/** Eine Karte, die einen Wert verändert, z. B. „Turmschild +2“. */
export interface BonusSource {
  name: string;
  value: number;
}

/**
 * Einzige Berechnung der wirksamen Werte (Anzeige, Begrenzung von Leben/Rüstung, spätere Probenwürfe).
 * Die Grundwerte im `character` bleiben unverändert.
 */
export function effectiveStats(
  character: CharacterInfo,
  modifiers: readonly StatModifier[],
): EffectiveStats {
  const total: (stat: ModifiableStat) => number = (stat) =>
    Math.max(0, character[stat] + bonusOf(modifiers, stat));
  return {
    attack: total('attack'),
    defense: total('defense'),
    speed: total('speed'),
    maxHealth: total('maxHealth'),
    maxArmor: total('maxArmor'),
  };
}

/** Summe der Modifikatoren für einen Wert. */
export function bonusOf(modifiers: readonly StatModifier[], stat: ModifiableStat): number {
  return modifiers
    .filter((modifier) => modifier.stat === stat)
    .reduce((sum, modifier) => sum + modifier.value, 0);
}

/** Zugewiesene Karten eines Charakters. */
export function cardsOf(assigned: readonly AssignedCard[], characterId: string): AssignedCard[] {
  return assigned.filter((entry) => entry.characterId === characterId);
}

/** Alle Modifikatoren der übergebenen Karten. */
export function modifiersOf(cards: readonly AssignedCard[]): StatModifier[] {
  return cards.flatMap((entry) => entry.card.modifiers);
}

/** Karten, die einen Wert verändern, mit ihrem Beitrag. */
export function bonusSources(cards: readonly AssignedCard[], stat: ModifiableStat): BonusSource[] {
  return cards
    .map((entry) => ({ name: entry.card.name, value: bonusOf(entry.card.modifiers, stat) }))
    .filter((source) => source.value !== 0);
}
