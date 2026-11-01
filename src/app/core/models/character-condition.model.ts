/** Zustände, die der DM einem Charakter geben kann; neue nur mit Eintrag in `CONDITION_TEMPLATES`. */
export type ConditionId = 'poison' | 'dazed' | 'blind';

/**
 * Standardwerte eines Zustands. Alle Zeiten in InGame-Sekunden; `intervalSeconds` 0 = keine
 * Wirkmomente, nur Ablauf; `durationSeconds` 0 = unbegrenzt.
 */
export interface ConditionTemplate {
  id: ConditionId;
  label: string;
  /** Pfad zum einfarbigen Symbol unter `public/img/conditions/`. */
  icon: string;
  intervalSeconds: number;
  damagePerTick: number;
  durationSeconds: number;
  description: string;
}

/**
 * Aktiver Zustand eines Charakters mit seinen (pro Charakter anpassbaren) Werten.
 * `startedAt` und `lastTickAt` sind ISO-Spielzeiten; im Editor ist `startedAt` bis zum
 * „Übernehmen“ leer.
 */
export interface ActiveCondition {
  id: ConditionId;
  intervalSeconds: number;
  damagePerTick: number;
  durationSeconds: number;
  description: string;
  startedAt: string;
  lastTickAt: string;
}
