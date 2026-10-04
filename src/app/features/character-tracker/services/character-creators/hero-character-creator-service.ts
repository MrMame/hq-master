import { Injectable } from '@angular/core';
import { CharacterInfo } from '../../models/CharacterInfo';
import { ElementalTypes } from '../../models/ElementalTypes';
import { CharacterAbilities } from '../../models/CharacterAbilities';

@Injectable({
  providedIn: 'root',
})
export class HeroCharacterCreatorService {

  private images :string[]= ['./img/hero-icon-barbarian.jpeg',
                             './img/hero-icon-dwarf.jpeg',
                             './img/hero-icon-rogue.jpeg',
                             './img/hero-icon-wizard.jpeg'
                            ];

  CreateNewRandomHero():CharacterInfo {

    // Holt alle String-Werte ('Feuer', 'Wasser', etc.) als Array
    const elemntalTypesArray: ElementalTypes[] = Object.values(ElementalTypes);
    const abilitiesArray: CharacterAbilities[] = Object.values(CharacterAbilities);


    const randomId: string = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomName: string = `Hero ${randomId}`;
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



}
