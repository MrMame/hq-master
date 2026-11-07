import {
  Component,
  computed,
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injector,
  Signal,
  TemplateRef,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { createGlobalPositionStrategy, createOverlayRef, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { DeckInstance, DeckState } from '../../../core/models/deck-state.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { findCardAt, LocatedCard } from '../../../core/services/card-deck/card-location.util';
import { findDeck, isSameRef } from '../../../core/services/card-deck/deck-state.util';
import { CharactersDbService } from '../../../core/services/characters/characters-db.service';
import { CARD_ACTIONS, CardAction, CardActionContext } from '../../models/card-action.model';
import { CardViewerService, ViewedCard } from '../../services/card-viewer.service';
import { cardMenuEntries, CardMenuEntry } from '../../utils/card-menu-entries.util';
import { cardViewerTitle } from '../../utils/card-viewer-title.util';
import { CardActionMenu } from '../card-action-menu/card-action-menu';
import { CardDisplay } from '../card-display/card-display';

/**
 * App-weiter Card Viewer, einmal im App-Template: zeigt die angesehene Karte groß (immer die Vorderseite) mit
 * Deck, Ort und dem Menü aller registrierten Aktionen. Er liegt mit abgedunkeltem Hintergrund über allem, auch
 * über offenen Dialogen. Klick daneben, „Schließen“ oder Escape schließen ihn, ohne die Karte zu bewegen.
 * Den Ort bestimmt er bei jeder Änderung neu; verschwindet die Karte, schließt er sich.
 */
@Component({
  selector: 'app-card-viewer',
  imports: [CardActionMenu, CardDisplay, CdkTrapFocus],
  templateUrl: './card-viewer.html',
  styleUrl: './card-viewer.css',
})
export class CardViewer {
  private readonly viewer: CardViewerService = inject(CardViewerService);
  private readonly cardManager: CardManagerService = inject(CardManagerService);
  private readonly characters: Signal<CharacterInfo[]> = inject(CharactersDbService).characters;
  private readonly actions: readonly CardAction[] = inject(CARD_ACTIONS, { optional: true }) ?? [];
  private readonly injector: Injector = inject(Injector);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly viewerTemplate: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('viewerTemplate');
  private overlayRef: OverlayRef | null = null;

  /** Karte an ihrem aktuellen Ort; `null` ohne angesehene oder nicht mehr vorhandene Karte. */
  protected readonly context: Signal<CardActionContext | null> = computed(() => {
    const viewed: ViewedCard | null = this.viewer.viewed();
    if (!viewed) return null;
    const state: DeckState = this.cardManager.state();
    const found: LocatedCard | null = findCardAt(state, viewed.ref);
    const deck: DeckInstance | undefined = findDeck(state, viewed.ref.deckId);
    if (!found || !deck) return null;
    const { context } = viewed;
    return {
      ...found,
      ref: viewed.ref,
      deck,
      mode: context.mode,
      draft: context.mode === 'draft' ? context.draft : null,
    };
  });

  protected readonly title: Signal<string> = computed(() => {
    const context: CardActionContext | null = this.context();
    if (!context) return '';
    const { location, draft, ref } = context;
    const owner: string | undefined =
      location.kind === 'equipped'
        ? this.characters().find((character) => character.id === location.characterId)?.name
        : undefined;
    const discarded: boolean = !!draft?.discarded().some((entry) => isSameRef(entry, ref));
    return cardViewerTitle(context.deck.name, location, owner, discarded);
  });

  protected readonly entries: Signal<CardMenuEntry[]> = computed(() => {
    const context: CardActionContext | null = this.context();
    return context ? cardMenuEntries(this.actions, context) : [];
  });

  private readonly syncOverlay: EffectRef = effect(() => {
    // Auch `viewed` lesen: Eine unbekannte Karte ergibt vor und nach dem Öffnen `context` = `null`.
    const viewed: ViewedCard | null = this.viewer.viewed();
    const visible: boolean = this.context() !== null;
    untracked(() => {
      if (visible) {
        this.attach();
        return;
      }
      this.detach();
      // Karte verschwunden (Deck entfernt, Spielstand geladen) oder unbekannt: der Viewer schließt.
      if (viewed) this.viewer.close();
    });
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detach());
  }

  protected close(): void {
    this.viewer.close();
  }

  protected run(action: CardAction): void {
    const context: CardActionContext | null = this.context();
    if (context) void action.run(context);
  }

  private attach(): void {
    if (this.overlayRef) return;
    const overlayRef: OverlayRef = createOverlayRef(this.injector, {
      hasBackdrop: true,
      positionStrategy: createGlobalPositionStrategy(this.injector)
        .centerHorizontally()
        .centerVertically(),
    });
    overlayRef.backdropClick().subscribe(() => this.close());
    overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      this.close();
    });
    overlayRef.attach(new TemplatePortal(this.viewerTemplate(), this.viewContainerRef));
    this.overlayRef = overlayRef;
  }

  private detach(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
