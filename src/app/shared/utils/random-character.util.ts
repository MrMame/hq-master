import { CharacterInfo } from '../../core/models/character-info.model';
import { ElementalTypes } from '../../core/models/elemental-types.model';
import { CharacterAbilities } from '../../core/models/character-abilities.model';
import { CHARACTER_IMAGES } from '../../core/models/character-images.model';
import { CharacterNameList } from '../../core/models/character-names/character-name-list.model';
import { CHARACTER_NAMES_BY_IMAGE } from '../../core/models/character-names/character-names.model';

/** Kürzere Kombinationen aus Vor- und Nachname werden neu gezogen. */
const MIN_NAME_LENGTH: number = 12;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Ganzzahl von `min` bis `min + count - 1`. */
function randomInt(min: number, count: number): number {
  return Math.floor(Math.random() * count) + min;
}

/** Vor- und Nachname aus der Liste einer Charakterklasse, mindestens 12 Zeichen lang. */
export function createRandomName(names: CharacterNameList): string {
  let name: string;
  do {
    name = `${pick(names.firstNames)} ${pick(names.lastNames)}`;
  } while (name.length < MIN_NAME_LENGTH);
  return name;
}

/**
 * Zufälliger Charakter mit Bild aus `CHARACTER_IMAGES` und einem Namen passend zur Klasse des Bildes.
 * Die `id` wird übernommen, damit die Arbeitskopie im Editor ihre ID behält.
 */
export function createRandomCharacter(id: string): CharacterInfo {
  const abilities: CharacterAbilities[] = Object.values(CharacterAbilities);
  const image: string = pick(CHARACTER_IMAGES);
  const name: string = createRandomName(CHARACTER_NAMES_BY_IMAGE[image]);

  return {
    id,
    name,
    type: pick(Object.values(ElementalTypes)),
    health: randomInt(50, 200),
    armor: randomInt(5, 50),
    attack: randomInt(10, 50),
    defense: randomInt(5, 50),
    speed: randomInt(5, 30),
    abilities: abilities.slice(0, randomInt(1, abilities.length)),
    image,
    description: `Dies ist eine zufällige Beschreibung für ${name}.`,
  };
}
