import { Injectable } from '@angular/core';
import { MonsterInfo } from '../models/MonsterInfo';

@Injectable({
  providedIn: 'root',
})
export class Monsters {

  CreateNewRandomMonster():MonsterInfo {
    const randomId: string = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomName = `Monster ${randomId}`;
    const randomType = ['Feuer', 'Wasser', 'Erde', 'Luft'][Math.floor(Math.random() * 4)];
    const randomHealth = Math.floor(Math.random() * 200) + 50;
    const randomAttack = Math.floor(Math.random() * 50) + 10;
    const randomDefense = Math.floor(Math.random() * 50) + 5;
    const randomSpeed = Math.floor(Math.random() * 30) + 5;
    const randomAbilities = ['Flammenwerfer', 'Aquatische Angriffe', 'Erdbeben', 'Windstoß'].slice(0, Math.floor(Math.random() * 3) + 1);
    const randomImage = './img/monster-icon-Gargoyle.png';
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
