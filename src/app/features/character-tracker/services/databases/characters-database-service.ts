import { Injectable } from '@angular/core';
import { CharacterInfo } from '../../models/CharacterInfo';

@Injectable({
  providedIn: 'root',
})
export class CharactersDbService {
  private monsterCharacters: CharacterInfo[] = [
    { id: "1", name: 'Monster A', type: 'Feuer', health: 100, attack: 20, defense: 10, speed: 15, abilities: ['Flammenwerfer'], image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für Monster A.' },
    { id: "2", name: 'Monster B', type: 'Wasser', health: 120, attack: 15, defense: 25, speed: 10, abilities: ['Aquatische Angriffe'], image: './img/monster-icon-Gargoyle.png', description: 'Dies ist ein Beschreibung für Monster B.' },
    // Weitere Monster können hier hinzugefügt werden
  ];

  getMonsters() {
    return this.monsterCharacters;
  }
}
