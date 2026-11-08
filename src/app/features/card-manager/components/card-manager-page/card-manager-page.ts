import {
  afterNextRender,
  Component,
  computed,
  inject,
  Injector,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CardManagerService } from '../../../../core/services/card-deck/card-manager.service';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { AddDeckForm } from '../add-deck-form/add-deck-form';
import { DeckList } from '../deck-list/deck-list';
import { DeckRow } from '../deck-row/deck-row';
import { DmHand } from '../dm-hand/dm-hand';
import { EquippedCards } from '../equipped-cards/equipped-cards';
import { InventoryCards } from '../inventory-cards/inventory-cards';
import { CollapsibleSidebar } from '../../../../shared/components/collapsible-sidebar/collapsible-sidebar';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { SidebarSectionToggleAll } from '../../../../shared/components/sidebar-section-toggle-all/sidebar-section-toggle-all';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { SidebarSectionStateService } from '../../../../shared/services/sidebar-section-state.service';
import { revealSection } from '../../../../shared/utils/reveal-section.util';
import { CardTableArea } from '../../models/card-table-area.model';
import { CARD_TABLE_SCOPE, cardTableAreas, ownedCount } from '../../utils/card-table-areas.util';
import { TableAreaNav } from '../table-area-nav/table-area-nav';

/**
 * Spieltisch mit beliebig vielen Decks als kompakte Reihen (höchstens eine aufgeklappt), darüber Hand, „Ausgerüstet“,
 * „Inventar“ und „Gürtel“. Jeder Bereich ist eine auf-/zuklappbare Fläche (leere Kartenbereiche ausgeblendet); die
 * Gruppe „Bereiche“ der Seitenleiste springt zu ihnen. Karten zeigt der app-weite Card Viewer. Welche Reihe offen
 * ist, ist UI-Zustand ohne Speicherung.
 */
@Component({
  selector: 'app-card-manager-page',
  imports: [
    AddDeckForm,
    DeckList,
    DeckRow,
    DmHand,
    EquippedCards,
    InventoryCards,
    CollapsibleSidebar,
    SidebarSection,
    SidebarSectionToggleAll,
    TableAreaNav,
  ],
  templateUrl: './card-manager-page.html',
  styleUrl: './card-manager-page.css',
})
export class CardManagerPage {
  private readonly cardManagerService: CardManagerService = inject(CardManagerService);
  private readonly injector: Injector = inject(Injector);
  private readonly sectionState: SidebarSectionStateService = inject(SidebarSectionStateService);
  private readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;
  private readonly characterIds: Signal<string[]> = computed(() =>
    this.characters().map((character) => character.id),
  );

  readonly decks: Signal<DeckInstance[]> = this.cardManagerService.decks;
  protected readonly tableScope: string = CARD_TABLE_SCOPE;

  /** Alle Bereiche mit Anzahl; Inventar und Gürtel zählen wie ihre Gruppen nur vorhandene Charaktere. */
  protected readonly areas: Signal<CardTableArea[]> = computed(() =>
    cardTableAreas({
      hand: this.cardManagerService.hand().length,
      equipped: this.cardManagerService.assigned().length,
      inventory: ownedCount(this.cardManagerService.inventory(), this.characterIds()),
      belt: ownedCount(this.cardManagerService.belt(), this.characterIds()),
      decks: this.decks().length,
    }),
  );
  /** Angezeigte Bereiche; leere Kartenbereiche fehlen ganz, ohne leere Kopfzeile. */
  protected readonly shownAreas: Signal<CardTableArea[]> = computed(() =>
    this.areas().filter((area) => area.emptyReason === null),
  );

  private readonly _expandedDeckId: WritableSignal<string | null> = signal<string | null>(null);
  readonly expandedDeckId: Signal<string | null> = this._expandedDeckId.asReadonly();

  /** Klappt die Reihe auf bzw. zu; eine andere offene Reihe klappt dabei zu. */
  onToggle(deckId: string): void {
    this._expandedDeckId.update((current) => (current === deckId ? null : deckId));
  }

  /**
   * Aus der Gruppe „Bereiche“: klappt nur diesen Bereich auf und alle anderen des Hauptbereichs zu (gespeichert),
   * scrollt zu ihm und fokussiert ihn.
   */
  onJump(area: CardTableArea): void {
    this.sectionState.expandOnly(CARD_TABLE_SCOPE, area.sectionId);
    afterNextRender(() => revealSection(document.getElementById(area.elementId)), {
      injector: this.injector,
    });
  }

  /**
   * Aus der Deckliste: Nur der Spieltisch bleibt offen (alle anderen Bereiche klappen zu, gespeichert), die Reihe
   * klappt auf und wird nach dem Rendern ins Bild gescrollt; Karten bleiben.
   */
  onReveal(deckId: string): void {
    this.sectionState.expandOnly(CARD_TABLE_SCOPE, `${CARD_TABLE_SCOPE}.decks`);
    this._expandedDeckId.set(deckId);
    afterNextRender(
      () =>
        document
          .getElementById(`deck-row-${deckId}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      { injector: this.injector },
    );
  }
}
