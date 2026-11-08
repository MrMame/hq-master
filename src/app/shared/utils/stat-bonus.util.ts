import { CharacterInfo, FixedProperty } from '../../core/models/character-info.model';
import { Card } from '../../core/models/card.model';
import { CardProperty } from '../../core/models/card-property.model';
import {
  bonusOf,
  bonusSources,
  effectiveStats,
  propertiesOf,
} from '../../core/services/equipment/effective-stats.util';
import { bonusSourcesText, formatBonus } from '../../core/services/equipment/equipment-text.util';

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

/** Leben und Rüstung haben keinen Bonus: Ausrüstung ändert beim Anlegen direkt den Wert. */
function isBonusStat(stat: FixedProperty): stat is 'Tempo' {
  return stat === 'Tempo';
}

/** Bonus und wirksamer Wert eines Grundwerts aus den wirkenden Karten; `null`, wenn keine ihn verändert. */
export function statBonusView(
  character: CharacterInfo,
  cards: readonly Card[],
  stat: FixedProperty,
): StatBonusView | null {
  if (!isBonusStat(stat)) return null;
  const properties: CardProperty[] = propertiesOf(cards);
  const bonus: number = bonusOf(properties, stat);
  if (bonus === 0) return null;
  return {
    bonus: formatBonus(bonus),
    effective: effectiveStats(character, cards)[stat],
    sources: bonusSourcesText(bonusSources(cards, stat)),
    positive: bonus > 0,
  };
}
