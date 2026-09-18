import { inject, Injectable } from '@angular/core';
import { CharacterInfo } from '../../../features/character-tracker/models/CharacterInfo';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class CharactersDbService {

  private readonly TABLENAME_CHARACTERS = 'characters';
  private storageService = inject(StorageService);

  readCharacters(): CharacterInfo[]|null {
    return this.storageService.readTableFromLocalStorage(this.TABLENAME_CHARACTERS); // || this.monsterCharacters;
  }
  writeCharacters(characterInfos: CharacterInfo[]): void {
    this.storageService.writeTableToLocalStorage(this.TABLENAME_CHARACTERS, characterInfos);
  }
  writeCharacter(characterInfo: CharacterInfo): void {
    const characters = this.readCharacters() || [];
    const index = characters.findIndex(c => c.id === characterInfo.id);
    if (index !== -1) {
      characters[index] = characterInfo;
    } else {
      characters.push(characterInfo);
    }
    this.writeCharacters(characters);
  }

  removeCharacter(characterInfo: CharacterInfo): void {
    const characters = this.readCharacters() || [];
    const updatedCharacters = characters.filter(c => c.id !== characterInfo.id);
    this.writeCharacters(updatedCharacters);
  }

}
