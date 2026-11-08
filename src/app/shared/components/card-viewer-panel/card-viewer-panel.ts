import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  linkedSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { CardRef } from '../../../core/models/deck-state.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { ownerOf } from '../../../core/services/card-deck/card-location.util';
import { isSameRef } from '../../../core/services/card-deck/deck-state.util';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { CARD_ACTIONS, CardAction, CardActionContext } from '../../models/card-action.model';
import { CardUndoService } from '../../services/card-undo.service';
import { CardViewerService } from '../../services/card-viewer.service';
import { draftMoveOf } from '../../utils/card-draft.util';
import { cardMenuEntries, CardMenuEntry, CardMenuRun } from '../../utils/card-menu-entries.util';
import {
  cardAfterMove,
  cardsAtPlace,
  placePosition,
  PlacePosition,
} from '../../utils/card-place.util';
import { cardViewerTitle } from '../../utils/card-viewer-title.util';
import { CardActionMenu } from '../card-action-menu/card-action-menu';
import { CardDisplay, CardSide } from '../card-display/card-display';
import { CardPropertiesStrip } from '../card-properties-strip/card-properties-strip';

/**
 * Inhalt des Card Viewers: eine Leiste über der Karte (Deck und Ort, Blättern am Ort nur `live`, „Umdrehen“,
 * „Aktionen“, Schließen), die Karte so groß wie das Fenster erlaubt und darunter ihre Eigenschaften. Das Aktionsmenü klappt über der Karte
 * auf; es ist bei jedem Öffnen zugeklappt und bleibt, solange der Viewer offen ist, wie eingestellt
 * (auch nach einer Aktion und beim Blättern). Aktionen im Modus `live` laufen mit „Rückgängig“; verlässt die Karte dabei ihren Ort,
 * zeigt der Viewer die nachrückende Karte desselben Ortes. „Umdrehen“ wechselt nur die Ansicht (keine Bewegung,
 * kein Log); jede andere Karte und jede Aktion zeigt wieder die Vorderseite.
 */
@Component({
  selector: 'app-card-viewer-panel',
  imports: [CardActionMenu, CardDisplay, CardPropertiesStrip, CdkTrapFocus],
  templateUrl: './card-viewer-panel.html',
  styleUrl: './card-viewer-panel.css',
})
export class CardViewerPanel {
  private readonly viewer: CardViewerService = inject(CardViewerService);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly undo: CardUndoService = inject(CardUndoService);
  private readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;
  private readonly actions: readonly CardAction[] = inject(CARD_ACTIONS, { optional: true }) ?? [];

  readonly context: InputSignal<CardActionContext> = input.required<CardActionContext>();
  readonly closed: OutputEmitterRef<void> = output<void>();

  /** Aufgeklapptes Aktionsmenü; gehört zum geöffneten Viewer und wird nicht gespeichert. */
  protected readonly menuExpanded: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly cardKey: Signal<string> = computed(
    () => `${this.context().ref.deckId}/${this.context().ref.cardId}`,
  );

  /** Angezeigte Seite; eine andere Karte öffnet mit der Vorderseite. */
  protected readonly side: WritableSignal<CardSide> = linkedSignal<string, CardSide>({
    source: this.cardKey,
    computation: () => 'front',
  });

  protected readonly title: Signal<string> = computed(() => {
    const { location, draft, ref, deck } = this.context();
    const ownerId: string | undefined = ownerOf(location);
    const owner: string | undefined = this.characters().find((c) => c.id === ownerId)?.name;
    const discarded: boolean =
      !!draft && draftMoveOf(draft.moves(), ref)?.target.kind === 'discardPile';
    return cardViewerTitle(deck.name, location, owner, discarded);
  });

  protected readonly entries: Signal<CardMenuEntry[]> = computed(() =>
    cardMenuEntries(this.actions, this.context()),
  );

  /** Karten am Ort der angesehenen; im Entwurf wird nicht geblättert. */
  private readonly place: Signal<CardRef[]> = computed(() => {
    const { mode, ref, location } = this.context();
    return mode === 'live' ? cardsAtPlace(this.cardManager.state(), ref.deckId, location) : [];
  });

  /** Stelle am Ort; `null` = keine Pfeile (Entwurf oder einzige Karte am Ort). */
  protected readonly position: Signal<PlacePosition | null> = computed(() => {
    const position: PlacePosition | null = placePosition(this.place(), this.context().ref);
    return position && position.total > 1 ? position : null;
  });

  /** Klick auf leere Flächen um Leiste und Karte wirkt wie ein Klick auf den Hintergrund. */
  protected closeOnBackground(event: MouseEvent): void {
    if (event.target === event.currentTarget || isStage(event.target)) this.closed.emit();
  }

  protected flip(): void {
    this.side.update((side) => (side === 'front' ? 'back' : 'front'));
  }

  protected toggleMenu(): void {
    this.menuExpanded.update((expanded) => !expanded);
  }

  protected step(offset: number): void {
    const target: CardRef | undefined = this.place()[(this.position()?.index ?? 0) + offset];
    if (target) this.viewer.open(target);
  }

  protected async run(run: CardMenuRun): Promise<void> {
    const { mode, ref, location } = this.context();
    this.side.set('front');
    if (mode === 'draft') {
      await run();
      return;
    }
    const index: number = placePosition(this.place(), ref)?.index ?? 0;
    await this.undo.track(ref, run);
    const stillViewed: boolean =
      !!this.viewer.viewed() && isSameRef(this.viewer.viewed()!.ref, ref);
    const next: CardRef = cardAfterMove(
      cardsAtPlace(this.cardManager.state(), ref.deckId, location),
      index,
      ref,
    );
    if (stillViewed && !isSameRef(next, ref)) this.viewer.open(next);
  }
}

function isStage(target: EventTarget | null): boolean {
  return target instanceof Element && target.classList.contains('card-viewer__stage');
}
