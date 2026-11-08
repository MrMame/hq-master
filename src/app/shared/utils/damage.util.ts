import { CharacterInfo } from '../../core/models/character-info.model';
import { DamageTypes } from '../../core/models/damage-types.model';

const CRITICAL_DAMAGE_MULTIPLIER: number = 1.0;

/** Liefert den Charakter nach dem Treffer als neues Objekt; das Original bleibt unverändert. */
export function applyDamage(
  character: CharacterInfo,
  damageType: DamageTypes,
  rawDamage: number,
): CharacterInfo {
  if (rawDamage <= 0) return character;
  switch (damageType) {
    case DamageTypes.Normal:
      return applyNormalDamage(character, rawDamage);
    case DamageTypes.Critical:
      return applyCriticalDamage(character, rawDamage);
  }
}

/** Rüstung fängt den Schaden zuerst ab, der Rest geht auf die Lebenspunkte. */
function applyNormalDamage(character: CharacterInfo, damage: number): CharacterInfo {
  const absorbed: number = Math.min(character.Ruestung, damage);
  return {
    ...character,
    Ruestung: character.Ruestung - absorbed,
    Leben: Math.max(0, character.Leben - (damage - absorbed)),
  };
}

/** Kritischer Schaden ignoriert die Rüstung und geht direkt auf die Lebenspunkte. */
function applyCriticalDamage(character: CharacterInfo, damage: number): CharacterInfo {
  const finalDamage: number = Math.round(damage * CRITICAL_DAMAGE_MULTIPLIER);
  return { ...character, Leben: Math.max(0, character.Leben - finalDamage) };
}
