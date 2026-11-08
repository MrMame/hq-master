import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { Card } from '../../../core/models/card.model';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import {
  activeCardsOf,
  bonusSources,
  effectiveStats,
} from '../../../core/services/equipment/effective-stats.util';
import { bonusSourcesText } from '../../../core/services/equipment/equipment-text.util';

/** Ort der Anzeige: Editor unter den Eingabefeldern, Zeile in der Legende, unter dem markierten Token. */
export type PropertiesVariant = 'editor' | 'legend' | 'selected';

interface PropertyView {
  name: string;
  value: number;
  /** Quellkarten mit Beitrag, z. B. „Stachelhandschuh +2, Ring +1“. */
  sources: string;
}

/**
 * Dynamische Eigenschaften eines Charakters nur zur Anzeige, z. B. „Angriff 3“, mit den Quellkarten im Tooltip.
 * Ohne `cards` zählen die Karten, die in der Session bei ihm wirken (Slots, Gürtel); der Editor übergibt die
 * Karten laut Entwurf. Ohne dynamische Eigenschaften bleibt die Komponente leer.
 */
@Component({
  selector: 'app-character-properties',
  host: { '[class]': '"character-properties character-properties--" + variant()' },
  template: `
    @for (property of properties(); track property.name) {
      <span
        class="character-properties__item"
        data-testid="character-property"
        [title]="property.sources"
        >{{ property.name }}
        <span class="character-properties__value">{{ property.value }}</span></span
      >
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1) var(--space-2);
      color: var(--color-gray-400);
      font-size: var(--text-xs);
    }

    /* Ohne dynamische Eigenschaften nimmt die Komponente keinen Platz ein. */
    :host:empty {
      display: none;
    }

    :host(.character-properties--editor) {
      font-size: var(--text-sm);
    }

    :host(.character-properties--selected) {
      justify-content: center;
      padding: 0 var(--space-1);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-900);
    }

    .character-properties__value {
      color: var(--color-gray-100);
      font-weight: 600;
    }
  `,
})
export class CharacterProperties {
  private readonly cardManager: CardManagerService = inject(CardManagerService);

  readonly character: InputSignal<CharacterInfo> = input.required<CharacterInfo>();
  /** Wirkende Karten; ohne Angabe die der Session. */
  readonly cards: InputSignal<readonly Card[] | null> = input<readonly Card[] | null>(null);
  readonly variant: InputSignal<PropertiesVariant> = input<PropertiesVariant>('legend');

  private readonly activeCards: Signal<readonly Card[]> = computed(
    () => this.cards() ?? activeCardsOf(this.cardManager.state(), this.character().id),
  );

  protected readonly properties: Signal<PropertyView[]> = computed(() => {
    const cards: readonly Card[] = this.activeCards();
    return Array.from(effectiveStats(this.character(), cards).dynamic, ([name, value]) => ({
      name,
      value,
      sources: bonusSourcesText(bonusSources(cards, name)),
    }));
  });
}
