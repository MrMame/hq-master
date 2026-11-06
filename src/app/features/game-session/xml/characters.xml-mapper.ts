import { CharacterInfo } from '../../../core/models/character-info.model';
import {
  appendTextElement,
  childElements,
  firstChild,
  readBoolean,
  readNumber,
  readString,
  setAttributes,
  textOf,
} from '../../../shared/utils/xml.util';
import { withinLimits } from '../../../core/services/characters/character-limits.util';
import { readConditions, writeConditions } from './conditions.xml-mapper';

export function writeCharacters(doc: XMLDocument, characters: CharacterInfo[]): Element {
  const root: Element = doc.createElement('characters');
  for (const character of characters) {
    root.appendChild(writeCharacter(doc, character));
  }
  return root;
}

export function readCharacters(root: Element): CharacterInfo[] {
  return childElements(root, 'character').map(readCharacter);
}

function writeCharacter(doc: XMLDocument, c: CharacterInfo): Element {
  const el: Element = doc.createElement('character');
  setAttributes(el, {
    id: c.id,
    name: c.name,
    type: c.type,
    health: c.health,
    maxHealth: c.maxHealth,
    armor: c.armor,
    maxArmor: c.maxArmor,
    attack: c.attack,
    defense: c.defense,
    speed: c.speed,
    image: c.image,
    movedThisRound: c.movedThisRound,
  });
  appendTextElement(el, 'description', c.description);
  c.abilities.forEach((ability) => appendTextElement(el, 'ability', ability));
  writeConditions(el, c.conditions);
  return el;
}

/** Ältere Spielstände ohne Maximum: Maximum = gespeicherter aktueller Wert. */
function readCharacter(el: Element): CharacterInfo {
  const health: number = readNumber(el, 'health');
  const armor: number = readNumber(el, 'armor');
  return withinLimits({
    id: readString(el, 'id'),
    name: readString(el, 'name'),
    type: readString(el, 'type'),
    health,
    maxHealth: readNumber(el, 'maxHealth', health),
    armor,
    maxArmor: readNumber(el, 'maxArmor', armor),
    attack: readNumber(el, 'attack'),
    defense: readNumber(el, 'defense'),
    speed: readNumber(el, 'speed'),
    abilities: childElements(el, 'ability').map(textOf),
    image: readString(el, 'image'),
    description: textOf(firstChild(el, 'description')),
    conditions: readConditions(el),
    movedThisRound: readBoolean(el, 'movedThisRound'),
  });
}
