import { CharacterInfo } from '../../core/models/character-info.model';
import { AssignedCard } from '../../core/models/deck-state.model';
import { MODIFIABLE_STATS, ModifiableStat, StatModifier } from '../../core/models/equipment.model';
import {
  bonusOf,
  bonusSources,
  effectiveStats,
  modifiersOf,
} from '../../core/services/equipment/effective-stats.util';
import { bonusSourcesText, formatBonus } from '../../core/services/equipment/equipment-text.util';
import { CharacterStat } from './character-stat.util';

/** Anzeige neben einem Grundwert im Editor, z. B. `+2 = 6` mit Tooltip „Turmschild +2“. */
export interface StatBonusView {
  /** Bonus mit Vorzeichen, z. B. `+2` oder `−1`. */
  bonus: string;
  /** Wirksamer Wert (Grundwert plus Bonus). */
  effective: number;
  /** Quellen für den Tooltip. */
  sources: string;
  positive: boolean;
}

function isModifiable(stat: CharacterStat): stat is ModifiableStat {
  return MODIFIABLE_STATS.some((modifiable) => modifiable === stat);
}

/** Bonus und wirksamer Wert eines Grundwerts; `null`, wenn keine Karte ihn verändert. */
export function statBonusView(
  character: CharacterInfo,
  cards: readonly AssignedCard[],
  stat: CharacterStat,
): StatBonusView | null {
  if (!isModifiable(stat)) return null;
  const modifiers: StatModifier[] = modifiersOf(cards);
  const bonus: number = bonusOf(modifiers, stat);
  if (bonus === 0) return null;
  return {
    bonus: formatBonus(bonus),
    effective: effectiveStats(character, modifiers)[stat],
    sources: bonusSourcesText(bonusSources(cards, stat)),
    positive: bonus > 0,
  };
}
