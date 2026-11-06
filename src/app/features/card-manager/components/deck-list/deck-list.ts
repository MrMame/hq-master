import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { SearchField } from '../../../../shared/components/search-field/search-field';
import { matchesSearch } from '../../../../shared/utils/text-search.util';

/** Gruppe „Decks“ der Seitenleiste: Suche und alle Decks in Tischreihenfolge. */
@Component({
  selector: 'app-deck-list',
  imports: [SearchField],
  template: `
    @if (decks().length > 0) {
      <app-search-field label="Deck suchen" [(term)]="search" />
    }
    <ul class="deck-list">
      @for (deck of visibleDecks(); track deck.id) {
        <li>
          <button
            type="button"
            class="deck-list__entry"
            data-testid="deck-list-entry"
            (click)="selected.emit(deck.id)"
          >
            <span class="deck-list__name">{{ deck.name }}</span>
            <span class="deck-list__count" title="Karten im Nachziehstapel">{{
              deck.drawPile.length
            }}</span>
          </button>
        </li>
      }
    </ul>
    @if (decks().length === 0) {
      <p class="empty-hint">Noch keine Decks.</p>
    } @else if (visibleDecks().length === 0) {
      <p class="empty-hint">Kein Deck gefunden.</p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .deck-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .deck-list__entry {
      display: flex;
      justify-content: space-between;
      gap: var(--space-2);
      width: 100%;
      padding: var(--space-2);
      border-radius: var(--radius-sm);
      background-color: color-mix(in oklab, var(--color-gray-700) 60%, transparent);
      color: var(--color-white);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      text-align: left;
      cursor: pointer;

      &:hover {
        background-color: var(--color-gray-700);
      }
    }

    .deck-list__name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .deck-list__count {
      color: var(--color-gray-400);
    }
  `,
})
export class DeckList {
  readonly decks: InputSignal<DeckInstance[]> = input.required<DeckInstance[]>();
  /** Ein Eintrag wurde angeklickt: das Deck soll aufklappen und ins Bild scrollen. */
  readonly selected: OutputEmitterRef<string> = output<string>();

  protected readonly search: WritableSignal<string> = signal<string>('');
  protected readonly visibleDecks: Signal<DeckInstance[]> = computed(() =>
    this.decks().filter((deck) => matchesSearch(deck.name, this.search())),
  );
}
