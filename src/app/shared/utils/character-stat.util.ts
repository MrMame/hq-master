import { CharacterInfo } from '../../core/models/character-info.model';

/** Zahlenwerte eines Charakters, die der Charakter-Editor als Eingabefeld anbietet. */
export type CharacterStat =
  'health' | 'maxHealth' | 'armor' | 'maxArmor' | 'attack' | 'defense' | 'speed';

/** Maximum, das beim Anlegen dem aktuellen Wert folgt. */
const LINKED_MAXIMUM: Partial<Record<CharacterStat, 'maxHealth' | 'maxArmor'>> = {
  health: 'maxHealth',
  armor: 'maxArmor',
};

/**
 * Setzt einen Zahlenwert als neues Objekt. Mit `linkMaximum` (neuer Charakter) übernimmt das Maximum den
 * eingegebenen Startwert von Leben bzw. Rüstung; danach lässt es sich noch getrennt ändern.
 */
export function withStat(
  character: CharacterInfo,
  stat: CharacterStat,
  value: number,
  linkMaximum: boolean,
): CharacterInfo {
  const maximum: 'maxHealth' | 'maxArmor' | undefined = LINKED_MAXIMUM[stat];
  return {
    ...character,
    [stat]: value,
    ...(linkMaximum && maximum ? { [maximum]: value } : {}),
  };
}
