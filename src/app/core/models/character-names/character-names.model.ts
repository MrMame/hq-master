import { BARBARIAN_NAMES } from './barbarian-names.model';
import { CHAOS_WARRIOR_NAMES } from './chaos-warrior-names.model';
import { CharacterNameList } from './character-name-list.model';
import { DWARF_NAMES } from './dwarf-names.model';
import { FIMIR_ABOMINATION_NAMES } from './fimir-abomination-names.model';
import { GARGOYLE_NAMES } from './gargoyle-names.model';
import { GOBLIN_NAMES } from './goblin-names.model';
import { HEXER_NAMES } from './hexer-names.model';
import { MUMMY_NAMES } from './mummy-names.model';
import { ORC_NAMES } from './orc-names.model';
import { ROGUE_NAMES } from './rogue-names.model';
import { SKELETON_NAMES } from './skeleton-names.model';
import { WIZARD_NAMES } from './wizard-names.model';
import { ZOMBIE_NAMES } from './zombie-names.model';

/** Namensliste je Charakterbild aus `CHARACTER_IMAGES`; das Bild bestimmt die Charakterklasse. */
export const CHARACTER_NAMES_BY_IMAGE: Record<string, CharacterNameList> = {
  './img/hero-icon-barbarian.jpeg': BARBARIAN_NAMES,
  './img/hero-icon-dwarf.jpeg': DWARF_NAMES,
  './img/hero-icon-rogue.jpeg': ROGUE_NAMES,
  './img/hero-icon-wizard.jpeg': WIZARD_NAMES,
  './img/monster-icon-ChaosWarrior.png': CHAOS_WARRIOR_NAMES,
  './img/monster-icon-FimirAbomination.png': FIMIR_ABOMINATION_NAMES,
  './img/monster-icon-Gargoyle.png': GARGOYLE_NAMES,
  './img/monster-icon-Goblin.png': GOBLIN_NAMES,
  './img/monster-icon-Hexer.png': HEXER_NAMES,
  './img/monster-icon-Mummy.png': MUMMY_NAMES,
  './img/monster-icon-Orc.png': ORC_NAMES,
  './img/monster-icon-Skeleton.png': SKELETON_NAMES,
  './img/monster-icon-Zombie.png': ZOMBIE_NAMES,
};
