import { effect, inject, Injectable, untracked } from '@angular/core';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard, CardRef, InventoryCard } from '../../models/deck-state.model';
import { CardManagerService } from '../card-deck/card-manager.service';
import { orphanedCards } from '../card-deck/deck-assignment.util';
import { CharactersDbService } from '../characters/characters-db.service';
import { withinLimits } from '../characters/character-limits.util';
import { cardsOf, modifiersOf } from './effective-stats.util';

/**
 * Hält Deck und Charaktere stimmig, egal woher die Änderung kommt:
 * - Slot- und Inventarkarten gelöschter oder nach dem Laden fehlender Charaktere kommen in den Ablagestapel.
 * - Leben und Rüstung über dem wirksamen Maximum (z. B. nach „Deck laden“) werden darauf gesenkt.
 * Wird app-weit beim Start erzeugt (`app.config.ts`). Kein eigener Zustand.
 */
@Injectable({
  providedIn: 'root',
})
export class EquipmentSyncService {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly charactersDb: CharactersDbService = inject(CharactersDbService);

  constructor() {
    // Die Schreibvorgänge laufen untracked; sie ändern nur, was noch nicht stimmt, daher endet die Schleife.
    effect(() => {
      const characters: CharacterInfo[] = this.charactersDb.characters();
      const assigned: AssignedCard[] = this.cardManager.assigned();
      const inventory: InventoryCard[] = this.cardManager.inventory();
      untracked(() => this.sync(characters, assigned, inventory));
    });
  }

  private sync(
    characters: CharacterInfo[],
    assigned: AssignedCard[],
    inventory: InventoryCard[],
  ): void {
    const orphans: CardRef[] = orphanedCards(
      { assigned, inventory },
      characters.map((character) => character.id),
    );
    if (orphans.length > 0) this.cardManager.discardOwnedCards(orphans);
    characters.forEach((character) => {
      const limited: CharacterInfo = withinLimits(
        character,
        modifiersOf(cardsOf(assigned, character.id)),
      );
      if (limited.health !== character.health || limited.armor !== character.armor) {
        this.charactersDb.writeCharacter(limited);
      }
    });
  }
}
