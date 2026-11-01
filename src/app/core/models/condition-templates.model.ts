import { ConditionId, ConditionTemplate } from './character-condition.model';

/** Vorlagen der Zustände in der Reihenfolge des Editors; beim Ankreuzen kopiert. */
export const CONDITION_TEMPLATES: readonly ConditionTemplate[] = [
  {
    id: 'poison',
    label: 'Gift',
    icon: './img/conditions/poison.svg',
    intervalSeconds: 60,
    damagePerTick: 1,
    durationSeconds: 600,
    description: 'Verliert jede Minute 1 Leben, die Rüstung schützt nicht.',
  },
  {
    id: 'dazed',
    label: 'Benommen',
    icon: './img/conditions/dazed.svg',
    intervalSeconds: 0,
    damagePerTick: 0,
    durationSeconds: 30,
    description: 'Kann in seiner nächsten Runde nur eine Aktion ausführen.',
  },
  {
    id: 'blind',
    label: 'Blind',
    icon: './img/conditions/blind.svg',
    intervalSeconds: 0,
    damagePerTick: 0,
    durationSeconds: 60,
    description: 'Sieht nichts: Angriffe und Fernkampf nur mit Malus.',
  },
];

/** Vorlage zu einer ID; jede `ConditionId` hat genau einen Eintrag. */
export function conditionTemplate(id: ConditionId): ConditionTemplate {
  return CONDITION_TEMPLATES.find((template) => template.id === id) as ConditionTemplate;
}
