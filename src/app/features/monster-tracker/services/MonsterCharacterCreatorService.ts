import { Injectable } from '@angular/core';
import { CharacterInfo } from '../models/CharacterInfo';

@Injectable({
  providedIn: 'root',
})
export class MonsterCharacterCreatorService {

  private types :string[]= ['Feuer',
                            'Wasser',
                            'Erde',
                            'Luft'
                          ];
  private abilities :string[]= ['Flammenwerfer',
                                'Aquatische Angriffe',
                                'Erdbeben',
                                'Windstoß'
                              ];
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
    const randomId: string = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomName = `Monster ${randomId}`;
    const randomType = this.types[Math.floor(Math.random() * this.types.length)];
    const randomHealth = Math.floor(Math.random() * 200) + 50;
    const randomAttack = Math.floor(Math.random() * 50) + 10;
    const randomDefense = Math.floor(Math.random() * 50) + 5;
    const randomSpeed = Math.floor(Math.random() * 30) + 5;
    const randomAbilities = this.abilities.slice(0, Math.floor(Math.random() * this.abilities.length) + 1);
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
