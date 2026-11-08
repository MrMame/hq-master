import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { CarriedKind } from '../../../../core/models/card-location.model';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DeckInstance, InventoryCard } from '../../../../core/models/deck-state.model';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { toCardRef } from '../../../../core/services/card-deck/deck-state.util';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CardDisplay } from '../../../../shared/components/card-display/card-display';
import { CardViewerService } from '../../../../shared/services/card-viewer.service';

/** Inventar- bzw. Gürtelkarten eines Charakters mit seinem aktuellen Namen. */
interface InventoryGroup {
  characterId: string;
  name: string;
  cards: InventoryCard[];
}

/** Überschrift je Ort; die Gruppe heißt „<Überschrift> von <Name>“. */
const CAPTIONS: Readonly<Record<CarriedKind, string>> = { inventory: 'Inventar', belt: 'Gürtel' };

/**
 * Bereich „Inventar“ unter „Ausgerüstet“ bzw. mit `kind` = `belt` „Gürtel“ darunter: die Karten aller Charaktere, gruppiert nach Charakter in
 * Reihenfolge der Session (Name mit Anzahl, Karten mit Herkunftsdeck). Charaktere ohne Inventarkarten fehlen,
 * ohne Inventarkarten ist der Bereich ausgeblendet. Höhe begrenzt, weitere Inhalte scrollen in sich; ein
 * Klick öffnet die Karte im Card Viewer.
 */
@Component({
  selector: 'app-inventory-cards',
  imports: [CardDisplay],
  host: { '[class.inventory--empty]': 'groups().length === 0' },
  templateUrl: './inventory-cards.html',
  styleUrl: './inventory-cards.css',
})
export class InventoryCards {
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly cardViewer: CardViewerService = inject(CardViewerService);
  private readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;

  readonly kind: InputSignal<CarriedKind> = input<CarriedKind>('inventory');
  protected readonly caption: Signal<string> = computed(() => CAPTIONS[this.kind()]);

  protected readonly groups: Signal<InventoryGroup[]> = computed(() => {
    const inventory: InventoryCard[] =
      this.kind() === 'belt' ? this.cardManager.belt() : this.cardManager.inventory();
    return this.characters()
      .map((character) => ({
        characterId: character.id,
        name: character.name,
        cards: inventory.filter((entry) => entry.characterId === character.id),
      }))
      .filter((group) => group.cards.length > 0);
  });
  protected readonly decksById: Signal<ReadonlyMap<string, DeckInstance>> = computed(
    () => new Map(this.cardManager.decks().map((deck) => [deck.id, deck])),
  );

  protected view(entry: InventoryCard): void {
    this.cardViewer.open(toCardRef(entry));
  }
}
