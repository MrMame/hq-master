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
    const elemntalTypesArray = Object.values(ElementalTypes);
    const abilitiesArray = Object.values(CharacterAbilities);

    const randomId: string = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomName = `Monster ${randomId}`;
    const randomType = elemntalTypesArray[Math.floor(Math.random() * elemntalTypesArray.length)];
    const randomHealth = Math.floor(Math.random() * 200) + 50;
    const randomAttack = Math.floor(Math.random() * 50) + 10;
    const randomDefense = Math.floor(Math.random() * 50) + 5;
    const randomSpeed = Math.floor(Math.random() * 30) + 5;
    const randomAbilities = abilitiesArray.slice(0, Math.floor(Math.random() * abilitiesArray.length) + 1);
    const randomImage = this.images[Math.floor(Math.random() * this.images.length)];
    const randomDescription = `Dies ist eine zufällige Beschreibung für ${randomName}.`;

    return {
      id: randomId,
      name: randomName,
      type: randomType,
      health: randomHealth,
      attack: randomAttack,
      defense: randomDefense,
      speed: randomSpeed,
      abilities: randomAbilities,
      image: randomImage,
      description: randomDescription
    };
  }


}
