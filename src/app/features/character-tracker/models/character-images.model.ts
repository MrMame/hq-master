/** Bilder der Helden-Creator; Reihenfolge bestimmt die Zufallsauswahl. */
export const HERO_IMAGES: string[] = [
  './img/hero-icon-barbarian.jpeg',
  './img/hero-icon-dwarf.jpeg',
  './img/hero-icon-rogue.jpeg',
  './img/hero-icon-wizard.jpeg',
];

/** Bilder der Monster-Creator; Reihenfolge bestimmt die Zufallsauswahl. */
export const MONSTER_IMAGES: string[] = [
  './img/monster-icon-ChaosWarrior.png',
  './img/monster-icon-FimirAbomination.png',
  './img/monster-icon-Gargoyle.png',
  './img/monster-icon-Goblin.png',
  './img/monster-icon-Hexer.png',
  './img/monster-icon-Mummy.png',
  './img/monster-icon-Orc.png',
  './img/monster-icon-Skeleton.png',
  './img/monster-icon-Zombie.png',
];

/** Alle wählbaren Charakterbilder (Bildauswahl im Charakter-Editor). */
export const CHARACTER_IMAGES: string[] = [...HERO_IMAGES, ...MONSTER_IMAGES];
