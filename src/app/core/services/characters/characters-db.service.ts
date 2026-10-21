import { Injectable, Signal } from '@angular/core';
import { CharacterInfo } from '../../models/character-info.model';
import { PersistedState, persistedState } from '../../session-state/persisted-state';
import { SESSION_KEYS } from '../../session-state/session-keys';
import { SessionStateSlice } from '../../session-state/session-state-slice';

@Injectable({
  providedIn: 'root',
})
export class CharactersDbService implements SessionStateSlice<CharacterInfo[]> {
  private readonly _characters: PersistedState<CharacterInfo[]> = persistedState<CharacterInfo[]>(
    SESSION_KEYS.characters,
    () => [],
  );
  readonly characters: Signal<CharacterInfo[]> = this._characters.value;
  readonly sessionState: Signal<CharacterInfo[]> = this.characters;

  writeCharacter(characterInfo: CharacterInfo): void {
    this._characters.update((characters) =>
      characters.some((c) => c.id === characterInfo.id)
        ? characters.map((c) => (c.id === characterInfo.id ? characterInfo : c))
        : [...characters, characterInfo],
    );
  }

  removeCharacter(characterInfo: CharacterInfo): void {
    this._characters.update((characters) => characters.filter((c) => c.id !== characterInfo.id));
  }

  restore(characters: CharacterInfo[]): void {
    this._characters.set([...characters]);
  }

  reset(): void {
    this._characters.set([]);
  }
}
