import { Component, computed, ElementRef, inject, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CardDeckService } from '../../services/card-deck';
import { DeckXmlLoaderService } from '../../services/deck-xml-loader';
import { Card } from '../../models/card.model';
import { DeckConfig } from '../../models/deck-config.model';
import { STAGING_SLOT_COUNT, StagingSlot } from '../../models/card-deck-state.model';
import { CardStack } from '../card-stack/card-stack';
import { PlayingCard } from '../playing-card/playing-card';
import { StagingArea } from '../staging-area/staging-area';
import { CardFocusView } from '../card-focus-view/card-focus-view';

@Component({
  selector: 'app-card-deck-page',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CardStack, PlayingCard, StagingArea, CardFocusView],
  templateUrl: './card-deck-page.html',
  styleUrl: './card-deck-page.scss',
})
export class CardDeckPage {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  protected readonly service: CardDeckService = inject(CardDeckService);
  private readonly loader: DeckXmlLoaderService = inject(DeckXmlLoaderService);

  readonly drawPile: Signal<Card[]> = this.service.drawPile;
  readonly discardPile: Signal<Card[]> = this.service.discardPile;
  readonly stagingSlots: Signal<StagingSlot[]> = this.service.stagingSlots;

  readonly deckBackImagePath: Signal<string> = computed(() => this.service.currentDeck()?.backImagePath ?? '');
  readonly totalCards: Signal<number> = computed(() =>
    this.drawPile().length + this.discardPile().length +
    this.stagingSlots().filter((s: StagingSlot) => s !== null).length
  );
  readonly stagingIds: string[] = Array.from({ length: STAGING_SLOT_COUNT }, (_: unknown, i: number) => `staging-${i}`);

  readonly focusedCard: WritableSignal<Card | null> = signal<Card | null>(null);
  private focusSource: 'draw' | 'discard' | 'staging' = 'discard';
  private drawClickTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (this.service.currentDeck() === null) {
      this.loader.loadFromUrl('/decks/ereignisse.xml')
        .then((config: DeckConfig) => { this.service.loadDeck(config); })
        .catch((err: Error) => { console.warn('Auto-load failed:', err.message); });
    }
  }

  onDrawPileClick(): void {
    if (this.drawClickTimer !== null) clearTimeout(this.drawClickTimer);
    this.drawClickTimer = setTimeout(() => {
      this.drawClickTimer = null;
      this.service.drawCard();
    }, 240);
  }

  onDrawPileDblClick(): void {
    if (this.drawClickTimer !== null) { clearTimeout(this.drawClickTimer); this.drawClickTimer = null; }
    const card: Card | undefined = this.drawPile()[0];
    if (card) this.openFocus(card, 'draw');
  }

  onEmptyDrawPileClick(): void {
    this.service.reshuffleDiscardToDraw();
  }

  openFocus(card: Card, source: 'draw' | 'discard' | 'staging'): void {
    this.focusSource = source;
    this.focusedCard.set(card);
  }

  closeFocus(): void {
    if (this.focusSource === 'draw') this.service.drawCard();
    this.focusedCard.set(null);
  }

  onDroppedToDiscard(event: CdkDragDrop<unknown>): void {
    if (!event.previousContainer.id.startsWith('staging-')) return;
    const { slotIndex } = event.item.data as { card: Card; slotIndex: number };
    this.service.returnFromStagingToDiscard(slotIndex);
  }

  onDroppedToDraw(event: CdkDragDrop<unknown>): void {
    if (!event.previousContainer.id.startsWith('staging-')) return;
    const { slotIndex } = event.item.data as { card: Card; slotIndex: number };
    this.service.returnFromStagingToDrawPile(slotIndex);
  }

  triggerLoadDeck(): void {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  async onFileLoaded(event: Event): Promise<void> {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) return;
    const text: string = await file.text();
    try {
      const config: DeckConfig = this.loader.parseXml(text);
      this.service.loadDeck(config);
    } catch (err: unknown) {
      alert('Fehler beim Laden des Decks: ' + (err instanceof Error ? err.message : 'Unbekannter Fehler'));
    }
  }

  shuffleDrawPile(): void { this.service.shuffleDrawPile(); }
  shuffleDiscardPile(): void { this.service.shuffleDiscardPile(); }
  combineAndShuffle(): void { this.service.combineAndShuffle(); }
}
