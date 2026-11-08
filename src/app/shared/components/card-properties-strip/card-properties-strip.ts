import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { CardProperty } from '../../../core/models/card-property.model';
import { formatBonus } from '../../../core/services/equipment/equipment-text.util';

type PropertySign = 'positive' | 'negative' | 'neutral';

/** Vorzeichen eines Werts nach `Math.sign`. */
const SIGNS: Readonly<Record<number, PropertySign>> = {
  1: 'positive',
  [-1]: 'negative',
  0: 'neutral',
};

interface PropertyChip {
  text: string;
  sign: PropertySign;
}

/**
 * Eigenschaften einer Karte als Chips in XML-Reihenfolge, z. B. „Leben +30“ (positiv grün, negativ orange, 0
 * neutral). Ohne Eigenschaften bleibt die Leiste leer und nimmt keinen Platz ein.
 */
@Component({
  selector: 'app-card-properties-strip',
  host: { role: 'list', 'aria-label': 'Eigenschaften der Karte' },
  template: `
    @for (chip of chips(); track $index) {
      <span
        role="listitem"
        class="card-properties-strip__chip"
        data-testid="card-viewer-property"
        [class.card-properties-strip__chip--positive]="chip.sign === 'positive'"
        [class.card-properties-strip__chip--negative]="chip.sign === 'negative'"
        >{{ chip.text }}</span
      >
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-1) var(--space-2);
      max-width: 100%;
    }

    :host:empty {
      display: none;
    }

    .card-properties-strip__chip {
      padding: var(--space-1) var(--space-3);
      border: 1px solid var(--color-gray-600);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-900);
      color: var(--color-gray-100);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      font-weight: 600;
    }

    .card-properties-strip__chip--positive {
      color: var(--color-green-400);
    }

    .card-properties-strip__chip--negative {
      color: var(--color-orange-300);
    }
  `,
})
export class CardPropertiesStrip {
  readonly properties: InputSignal<readonly CardProperty[]> =
    input.required<readonly CardProperty[]>();

  protected readonly chips: Signal<PropertyChip[]> = computed(() =>
    this.properties().map(({ name, value }) => ({
      text: `${name} ${formatBonus(value)}`,
      sign: SIGNS[Math.sign(value)],
    })),
  );
}
