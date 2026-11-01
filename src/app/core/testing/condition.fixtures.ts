import { ActiveCondition } from '../models/character-condition.model';
import { CharacterInfo } from '../models/character-info.model';
import { createTestCharacter } from './character.fixtures';

/** Startzeit der Test-Zustände: 12:00:00 Spielzeit. */
export const TEST_CONDITION_START: Date = new Date(2381, 0, 1, 12, 0, 0);

/** Spielzeit `seconds` nach `TEST_CONDITION_START`. */
export function afterStart(seconds: number): Date {
  return new Date(TEST_CONDITION_START.getTime() + seconds * 1000);
}

/** Gift mit Standardwerten (60 s / 1 Schaden / 10 min), gestartet um 12:00:00 (nur für Specs). */
export function createTestCondition(overrides: Partial<ActiveCondition> = {}): ActiveCondition {
  return {
    id: 'poison',
    intervalSeconds: 60,
    damagePerTick: 1,
    durationSeconds: 600,
    description: 'Gift <&>',
    startedAt: TEST_CONDITION_START.toISOString(),
    lastTickAt: TEST_CONDITION_START.toISOString(),
    ...overrides,
  };
}

/** Test-Charakter (12 Leben) mit den angegebenen Zuständen. */
export function createConditionedCharacter(
  id: string,
  conditions: ActiveCondition[] = [createTestCondition()],
): CharacterInfo {
  return { ...createTestCharacter(id), conditions };
}
