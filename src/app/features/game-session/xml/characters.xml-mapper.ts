import { CharacterInfo, FIXED_PROPERTIES } from '../../../core/models/character-info.model';
import { warnInvalidCharacter } from '../../../core/services/characters/characters-codec.util';
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

/** Charaktere ohne gültige Zahl in `Leben`, `Ruestung` oder `Tempo` werden mit Konsolenwarnung verworfen. */
export function readCharacters(root: Element): CharacterInfo[] {
  return childElements(root, 'character').filter(hasFixedProperties).map(readCharacter);
}

function hasFixedProperties(el: Element): boolean {
  const valid: boolean = FIXED_PROPERTIES.every((name) =>
    Number.isFinite(readNumber(el, name, NaN)),
  );
  if (!valid) warnInvalidCharacter(el.getAttribute('id'));
  return valid;
}

function writeCharacter(doc: XMLDocument, c: CharacterInfo): Element {
  const el: Element = doc.createElement('character');
  setAttributes(el, {
    id: c.id,
    name: c.name,
    Leben: c.Leben,
    Ruestung: c.Ruestung,
    Tempo: c.Tempo,
    image: c.image,
    movedThisRound: c.movedThisRound,
  });
  appendTextElement(el, 'description', c.description);
  writeConditions(el, c.conditions);
  return el;
}

/**
 * Alte Attribute (`type`, `maxHealth`, `maxArmor`, `attack`, `defense`, `health`, `armor`, `speed`) und
 * `<ability>`-Elemente werden ignoriert.
 */
function readCharacter(el: Element): CharacterInfo {
  return withinLimits({
    id: readString(el, 'id'),
    name: readString(el, 'name'),
    Leben: readNumber(el, 'Leben'),
    Ruestung: readNumber(el, 'Ruestung'),
    Tempo: readNumber(el, 'Tempo'),
    image: readString(el, 'image'),
    description: textOf(firstChild(el, 'description')),
    conditions: readConditions(el),
    movedThisRound: readBoolean(el, 'movedThisRound'),
  });
}
