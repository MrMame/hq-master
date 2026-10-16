import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CharacterInfo } from '../../../features/character-tracker/models/CharacterInfo';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class CharactersDbService {
  private readonly TABLENAME_CHARACTERS: string = 'characters';
  private storageService: StorageService = inject(StorageService);

  private readonly _characters: WritableSignal<CharacterInfo[]> = signal<CharacterInfo[]>(
    this.readCharacters() ?? [],
  );
  readonly characters: Signal<CharacterInfo[]> = this._characters.asReadonly();

  readCharacters(): CharacterInfo[] | null {
    return this.storageService.readTableFromLocalStorage(this.TABLENAME_CHARACTERS);
  }
  writeCharacters(characterInfos: CharacterInfo[]): void {
    this._characters.set(characterInfos);
    this.storageService.writeTableToLocalStorage(this.TABLENAME_CHARACTERS, characterInfos);
  }
  writeCharacter(characterInfo: CharacterInfo): void {
    const characters: CharacterInfo[] = this._characters();
    const exists: boolean = characters.some((c) => c.id === characterInfo.id);
    this.writeCharacters(
      exists
        ? characters.map((c) => (c.id === characterInfo.id ? characterInfo : c))
        : [...characters, characterInfo],
    );
  }

  removeCharacter(characterInfo: CharacterInfo): void {
    this.writeCharacters(this._characters().filter((c) => c.id !== characterInfo.id));
  }
}
