import { DamageTypes } from '../models/damage-types.model';
import { GameLogEntry } from '../models/game-log-entry.model';

/** Log-Eintrag „Zeitschritt +10 s“ um 12:00:10; Werte über `overrides` anpassbar (nur für Specs). */
export function createTestLogEntry(overrides: Partial<GameLogEntry> = {}): GameLogEntry {
  return {
    id: 'log-1',
    type: 'time',
    gameTime: new Date(2381, 0, 1, 12, 0, 10).toISOString(),
    value: 10,
    text: '+10 s (12:00:00 → 12:00:10)',
    ...overrides,
  };
}

/** Ein Eintrag je Art mit allen optionalen Feldern, z. B. für den XML-Round-Trip (nur für Specs). */
export function createTestLog(): GameLogEntry[] {
  return [
    createTestLogEntry(),
    createTestLogEntry({
      id: 'log-2',
      type: 'condition-damage',
      characterId: 'a',
      characterName: 'Ork <&>',
      conditionId: 'poison',
      value: 1,
      text: 'Ork <&>: 1 Schaden durch Gift',
    }),
    createTestLogEntry({
      id: 'log-3',
      type: 'damage',
      characterId: 'a',
      characterName: 'Ork <&>',
      value: 3,
      damageType: DamageTypes.Normal,
      text: 'Ork <&>: 3 Schaden auf Rüstung',
    }),
    {
      id: 'log-4',
      type: 'condition-set',
      gameTime: new Date(2381, 0, 1, 12, 0, 10).toISOString(),
      characterId: 'a',
      characterName: 'Ork <&>',
      conditionId: 'blind',
      text: 'Blind bei Ork <&> gesetzt',
    },
  ];
}
