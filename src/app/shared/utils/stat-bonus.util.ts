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

/**
 * Zusammensetzung eines festen Werts aus den wirkenden Karten, z. B. Grundwert 20, `+30`, Endwert 50 mit Tooltip
 * „Kettenhemd +30“.
 */
export interface StatBonusView {
  /** Grundwert ohne Karten; bei Leben/Ruestung nach Schaden auch negativ. */
  base: number;
  /** Summe der Karten als Zahl. */
  amount: number;
  /** Bonus mit Vorzeichen, z. B. `+2` oder `−1`. */
  bonus: string;
  /** Endwert (Grundwert plus Bonus). */
  effective: number;
  /** Quellen für den Tooltip. */
  sources: string;
  positive: boolean;
}

/**
 * Bonus, Grundwert und Endwert eines festen Werts; `null`, wenn keine wirkende Karte ihn verändert.
 * Leben/Ruestung speichern den Endwert (die Karten änderten ihn beim Wirksamwerden), der Grundwert ist der Rest.
 * Tempo speichert den Grundwert, der Endwert ist nie unter 0.
 */
export function statBonusView(
  character: CharacterInfo,
  cards: readonly Card[],
  stat: FixedProperty,
): StatBonusView | null {
  const properties: CardProperty[] = propertiesOf(cards);
  const amount: number = bonusOf(properties, stat);
  if (amount === 0) return null;
  const tempo: boolean = stat === 'Tempo';
  return {
    base: tempo ? character.Tempo : character[stat] - amount,
    amount,
    bonus: formatBonus(amount),
    effective: tempo ? effectiveStats(character, cards).Tempo : character[stat],
    sources: bonusSourcesText(bonusSources(cards, stat)),
    positive: amount > 0,
  };
}

/** Eingabefeld eines festen Werts im Editor: zeigt immer den Grundwert. */
export interface StatField {
  key: FixedProperty;
  /** Angezeigter Grundwert; eine ungültige Eingabe (z. B. leer) bleibt stehen. */
  value: number;
  /** Kleinster gültiger Grundwert: Der Endwert von Leben/Ruestung darf nicht unter 0 fallen. */
  min: number;
  /** Abstand zwischen Feld und gespeichertem Wert (Bonus bei Leben/Ruestung, sonst 0). */
  offset: number;
  bonus: StatBonusView | null;
}

/** Feld zu einem festen Wert; Leben/Ruestung speichern den Endwert, das Feld zeigt ihn ohne Karten. */
export function statField(
  character: CharacterInfo,
  cards: readonly Card[],
  stat: FixedProperty,
): StatField {
  const stored: number = character[stat];
  const valid: boolean = Number.isFinite(stored);
  const offset: number = stat === 'Tempo' ? 0 : bonusOf(propertiesOf(cards), stat);
  return {
    key: stat,
    value: valid ? stored - offset : stored,
    min: offset === 0 ? 0 : -offset,
    offset,
    bonus: valid ? statBonusView(character, cards, stat) : null,
  };
}

/** Gespeicherter Wert zu einer Eingabe im Feld; ungültige Eingaben bleiben unverändert. */
export function storedValue(field: StatField, input: number): number {
  return Number.isFinite(input) ? input + field.offset : input;
}

/** Grundwert mit typografischem Minus, z. B. `−20`. */
export function formatBase(value: number): string {
  return value < 0 ? `−${Math.abs(value)}` : String(value);
}

/** Aufschlüsselung als Text für Tooltips, z. B. „Leben: 20 +30 = 50 (Kettenhemd +30)“. */
export function statBreakdownText(stat: FixedProperty, view: StatBonusView): string {
  return `${stat}: ${formatBase(view.base)} ${view.bonus} = ${view.effective} (${view.sources})`;
}

/** Aufschlüsselung eines festen Werts als Tooltip-Text; `null`, wenn keine wirkende Karte ihn verändert. */
export function statBreakdownOf(
  character: CharacterInfo,
  cards: readonly Card[],
  stat: FixedProperty,
): string | null {
  const view: StatBonusView | null = statBonusView(character, cards, stat);
  return view ? statBreakdownText(stat, view) : null;
}
