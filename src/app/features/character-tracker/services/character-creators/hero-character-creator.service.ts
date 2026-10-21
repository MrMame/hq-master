import { Injectable } from '@angular/core';
import { CharacterInfo } from '../../models/character-info.model';
import { ElementalTypes } from '../../models/elemental-types.model';
import { CharacterAbilities } from '../../models/character-abilities.model';
import { HERO_IMAGES } from '../../models/character-images.model';

@Injectable({
  providedIn: 'root',
})
export class HeroCharacterCreatorService {
  CreateNewRandomHero(): CharacterInfo {
    // Holt alle String-Werte ('Feuer', 'Wasser', etc.) als Array
    const elemntalTypesArray: ElementalTypes[] = Object.values(ElementalTypes);
    const abilitiesArray: CharacterAbilities[] = Object.values(CharacterAbilities);

    const randomId: string = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomName: string = `Hero ${randomId}`;
    const randomType: ElementalTypes =
      elemntalTypesArray[Math.floor(Math.random() * elemntalTypesArray.length)];
    const randomHealth: number = Math.floor(Math.random() * 200) + 50;
    const randomArmor: number = Math.floor(Math.random() * 50) + 5;
    const randomAttack: number = Math.floor(Math.random() * 50) + 10;
    const randomDefense: number = Math.floor(Math.random() * 50) + 5;
    const randomSpeed: number = Math.floor(Math.random() * 30) + 5;
    const randomAbilities: CharacterAbilities[] = abilitiesArray.slice(
      0,
      Math.floor(Math.random() * abilitiesArray.length) + 1,
    );
    const randomImage: string = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
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
      description: randomDescription,
    };
  }
}
