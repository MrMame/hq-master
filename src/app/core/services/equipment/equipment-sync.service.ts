import { effect, inject, Injectable, untracked } from '@angular/core';
import { CharacterInfo } from '../../models/character-info.model';
import { AssignedCard, BeltCard, CardRef, InventoryCard } from '../../models/deck-state.model';
import { CardManagerService } from '../card-deck/card-manager.service';
import { orphanedCards } from '../card-deck/deck-assignment.util';
import { CharactersDbService } from '../characters/characters-db.service';
import { withinLimits } from '../characters/character-limits.util';

/**
 * Hält Deck und Charaktere stimmig, egal woher die Änderung kommt:
 * - Slot-, Inventar- und Gürtelkarten gelöschter oder nach dem Laden fehlender Charaktere kommen in den Ablagestapel.
 * - Leben und Rüstung werden ganze Zahlen ≥ 0.
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
      const belt: BeltCard[] = this.cardManager.belt();
      untracked(() => this.sync(characters, { assigned, inventory, belt }));
    });
  }

  private sync(
    characters: CharacterInfo[],
    owned: { assigned: AssignedCard[]; inventory: InventoryCard[]; belt: BeltCard[] },
  ): void {
    const orphans: CardRef[] = orphanedCards(
      owned,
      characters.map((character) => character.id),
    );
    if (orphans.length > 0) this.cardManager.discardOwnedCards(orphans);
    characters.forEach((character) => {
      const limited: CharacterInfo = withinLimits(character);
      if (limited.Leben !== character.Leben || limited.Ruestung !== character.Ruestung) {
        this.charactersDb.writeCharacter(limited);
      }
    });
  }
}
