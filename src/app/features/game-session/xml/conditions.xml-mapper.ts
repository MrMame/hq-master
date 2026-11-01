import { ActiveCondition, ConditionId } from '../../../core/models/character-condition.model';
import { CONDITION_TEMPLATES } from '../../../core/models/condition-templates.model';
import {
  appendElement,
  appendTextElement,
  childElements,
  firstChild,
  readNumber,
  readString,
  setAttributes,
  textOf,
} from '../../../shared/utils/xml.util';

/** Hängt je aktivem Zustand ein `<condition>` mit `<description>` an das Charakter-Element. */
export function writeConditions(characterEl: Element, conditions: ActiveCondition[]): void {
  for (const condition of conditions) {
    const el: Element = appendElement(characterEl, 'condition');
    setAttributes(el, {
      id: condition.id,
      interval: condition.intervalSeconds,
      damage: condition.damagePerTick,
      duration: condition.durationSeconds,
      startedAt: condition.startedAt,
      lastTickAt: condition.lastTickAt,
    });
    appendTextElement(el, 'description', condition.description);
  }
}

/** Ältere Spielstände ohne `<condition>` ergeben `[]`; unbekannte Zustände werden übersprungen. */
export function readConditions(characterEl: Element): ActiveCondition[] {
  return childElements(characterEl, 'condition')
    .filter((el) => CONDITION_TEMPLATES.some((template) => template.id === el.getAttribute('id')))
    .map(readCondition);
}

function readCondition(el: Element): ActiveCondition {
  const startedAt: string = readString(el, 'startedAt');
  return {
    id: readString(el, 'id') as ConditionId,
    intervalSeconds: readNumber(el, 'interval'),
    damagePerTick: readNumber(el, 'damage'),
    durationSeconds: readNumber(el, 'duration'),
    description: textOf(firstChild(el, 'description')),
    startedAt,
    lastTickAt: readString(el, 'lastTickAt', startedAt),
  };
}
