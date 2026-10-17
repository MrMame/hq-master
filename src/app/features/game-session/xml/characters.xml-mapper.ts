import { CharacterInfo } from '../../character-tracker/models/character-info.model';
import {
  appendTextElement,
  childElements,
  firstChild,
  readNumber,
  readString,
  setAttributes,
  textOf,
} from './xml.util';

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
    armor: c.armor,
    attack: c.attack,
    defense: c.defense,
    speed: c.speed,
    image: c.image,
  });
  appendTextElement(el, 'description', c.description);
  c.abilities.forEach((ability) => appendTextElement(el, 'ability', ability));
  return el;
}

function readCharacter(el: Element): CharacterInfo {
  return {
    id: readString(el, 'id'),
    name: readString(el, 'name'),
    type: readString(el, 'type'),
    health: readNumber(el, 'health'),
    armor: readNumber(el, 'armor'),
    attack: readNumber(el, 'attack'),
    defense: readNumber(el, 'defense'),
    speed: readNumber(el, 'speed'),
    abilities: childElements(el, 'ability').map(textOf),
    image: readString(el, 'image'),
    description: textOf(firstChild(el, 'description')),
  };
}
