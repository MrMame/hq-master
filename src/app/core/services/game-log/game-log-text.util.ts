import { ConditionId } from '../../models/character-condition.model';
import { conditionTemplate } from '../../models/condition-templates.model';
import { DamageTypes } from '../../models/damage-types.model';

const UNNAMED: string = 'Unbenannt';

/** Art der Zeitänderung: Zeitschritt (`add`) oder direkt gesetzte Spielzeit (`set`). */
export type TimeChange = 'add' | 'set';

/** Art eines Zustands-Ereignisses im Log. */
export type ConditionLogKind = 'damage' | 'expired' | 'set' | 'removed';

/** Uhrzeit der Spielzeit als `HH:MM:SS`. */
export function formatClock(time: Date): string {
  return [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map((part) => part.toString().padStart(2, '0'))
    .join(':');
}

/** Zeitspanne in Sekunden als „1 h 2 min 3 s“; Teile mit 0 entfallen, 0 → „0 s“. */
export function formatSpan(totalSeconds: number): string {
  const seconds: number = Math.abs(totalSeconds);
  const parts: [number, string][] = [
    [Math.floor(seconds / 3600), 'h'],
    [Math.floor((seconds % 3600) / 60), 'min'],
    [seconds % 60, 's'],
  ];
  const text: string = parts
    .filter(([amount]) => amount > 0)
    .map(([amount, unit]) => `${amount} ${unit}`)
    .join(' ');
  return text || '0 s';
}

/** z. B. „+1 h (12:00:00 → 13:00:00)“ bzw. „Spielzeit gesetzt (12:00:00 → 08:00:00)“. */
export function timeChangeText(from: Date, to: Date, change: TimeChange): string {
  const range: string = `(${formatClock(from)} → ${formatClock(to)})`;
  if (change === 'set') return `Spielzeit gesetzt ${range}`;
  const seconds: number = Math.round((to.getTime() - from.getTime()) / 1000);
  return `${seconds < 0 ? '−' : '+'}${formatSpan(seconds)} ${range}`;
}

/** z. B. „Grimgor: 1 Schaden durch Gift“, „Blind bei Lyra abgelaufen“. */
export function conditionText(
  kind: ConditionLogKind,
  characterName: string | undefined,
  conditionId: ConditionId,
  damage: number = 0,
): string {
  const name: string = characterName || UNNAMED;
  const label: string = conditionTemplate(conditionId).label;
  switch (kind) {
    case 'damage':
      return `${name}: ${damage} Schaden durch ${label}`;
    case 'expired':
      return `${label} bei ${name} abgelaufen`;
    case 'set':
      return `${label} bei ${name} gesetzt`;
    case 'removed':
      return `${label} bei ${name} entfernt`;
  }
}

/** z. B. „Grimgor: 3 Schaden auf Rüstung“ (Normal) bzw. „auf Leben“ (Kritisch). */
export function damageText(
  characterName: string | undefined,
  damage: number,
  damageType: DamageTypes,
): string {
  const target: string = damageType === DamageTypes.Normal ? 'Rüstung' : 'Leben';
  return `${characterName || UNNAMED}: ${damage} Schaden auf ${target}`;
}

/** z. B. „Barbar der Rote erhält Runenrüstung (Körper)“ bzw. „Barbar der Rote legt Runenrüstung ab“. */
export function equipmentText(
  characterName: string | undefined,
  cardName: string,
  slotLabel: string | null,
): string {
  const name: string = characterName || UNNAMED;
  return slotLabel === null
    ? `${name} legt ${cardName} ab`
    : `${name} erhält ${cardName} (${slotLabel})`;
}

/** Wohin bzw. woher eine mitgeführte Karte kommt: Inventar oder Gürtel. */
const CARRIED_TEXTS: Readonly<Record<'inventory' | 'belt', { into: string; out: string }>> = {
  inventory: { into: 'ins Inventar', out: 'aus dem Inventar' },
  belt: { into: 'in den Gürtel', out: 'aus dem Gürtel' },
};

/**
 * z. B. „Heiltrank ins Inventar von Zwerg“, „Heiltrank von Barbar ins Inventar von Zwerg“ bzw. mit
 * `container` = `belt` „Heiltrank in den Gürtel von Zwerg“.
 */
export function inventoryAddedText(
  cardName: string,
  receiverName: string | undefined,
  giverName: string | null,
  container: 'inventory' | 'belt' = 'inventory',
): string {
  const from: string = giverName === null ? '' : ` von ${giverName || UNNAMED}`;
  return `${cardName}${from} ${CARRIED_TEXTS[container].into} von ${receiverName || UNNAMED}`;
}

/**
 * z. B. „Runenrüstung von Barbar aus dem Inventar angelegt“ (`destination` = `null`, eigener Slot) bzw.
 * „Heiltrank aus dem Inventar von Zwerg in die Hand“.
 */
export function inventoryRemovedText(
  cardName: string,
  ownerName: string | undefined,
  destination: string | null,
  container: 'inventory' | 'belt' = 'inventory',
): string {
  const owner: string = ownerName || UNNAMED;
  const out: string = CARRIED_TEXTS[container].out;
  return destination === null
    ? `${cardName} von ${owner} ${out} angelegt`
    : `${cardName} ${out} von ${owner} ${destination}`;
}
