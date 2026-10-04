import { Injectable } from '@angular/core';
import { CharacterInfo } from '../../models/CharacterInfo';
import { ElementalTypes } from '../../models/ElementalTypes';
import { CharacterAbilities } from '../../models/CharacterAbilities';

@Injectable({
  providedIn: 'root',
})
export class MonsterCharacterCreatorService {

  private images :string[]= ['./img/monster-icon-ChaosWarrior.png',
                             './img/monster-icon-FimirAbomination.png',
                             './img/monster-icon-Gargoyle.png',
                             './img/monster-icon-Goblin.png',
                             './img/monster-icon-Hexer.png',
                             './img/monster-icon-Mummy.png',
                             './img/monster-icon-Orc.png',
                             './img/monster-icon-Skeleton.png',
                             './img/monster-icon-Zombie.png',
                            ];

  CreateNewRandomMonster():CharacterInfo {

    // Holt alle String-Werte ('Feuer', 'Wasser', etc.) als Array
    const elemntalTypesArray: ElementalTypes[] = Object.values(ElementalTypes);
    const abilitiesArray: CharacterAbilities[] = Object.values(CharacterAbilities);

    const randomId: string = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomName: string = `Monster ${randomId}`;
    const randomType: ElementalTypes = elemntalTypesArray[Math.floor(Math.random() * elemntalTypesArray.length)];
    const randomHealth: number = Math.floor(Math.random() * 200) + 50;
    const randomArmor: number = Math.floor(Math.random() * 50) + 5;
    const randomAttack: number = Math.floor(Math.random() * 50) + 10;
    const randomDefense: number = Math.floor(Math.random() * 50) + 5;
    const randomSpeed: number = Math.floor(Math.random() * 30) + 5;
    const randomAbilities: CharacterAbilities[] = abilitiesArray.slice(0, Math.floor(Math.random() * abilitiesArray.length) + 1);
    const randomImage: string = this.images[Math.floor(Math.random() * this.images.length)];
    const randomDescription: string = `Dies ist eine zufällige Beschreibung für ${randomName}.`;

    return {
      id: randomId,
      name: randomName,
      type: randomType,
      health: randomHealth,
      armor: randomArmor,
      attack: randomAttack,
      defense: randomDefense,
      speed: randomSpeed,
      abilities: randomAbilities,
      image: randomImage,
      description: randomDescription
    };
  }

  getInitMonsterCharacters(): CharacterInfo[] {
    return [
      { id: "1", name: 'Monster A', type: 'Feuer', health: 100, armor: 10, attack: 20, defense: 10, speed: 15, abilities: ['Flammenwerfer'], image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für Monster A.' },
      { id: "2", name: 'Monster B', type: 'Wasser', health: 120, armor: 20, attack: 15, defense: 25, speed: 10, abilities: ['Aquatische Angriffe'], image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für Monster B.' }
    ];
  }

}
