import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CardAction } from '../../models/card-action.model';
import { CardMenuEntry } from '../../utils/card-menu-entries.util';

/** Aktionsmenü des Card Viewers: Einträge mit Trennlinien zwischen Gruppen, ausgegraute mit Tooltip. */
@Component({
  selector: 'app-card-action-menu',
  imports: [],
  template: `
    <ul class="card-action-menu" role="menu" aria-label="Kartenaktionen">
      @for (entry of entries(); track entry.action.id) {
        @if (entry.dividerBefore) {
          <li class="card-action-menu__divider" role="separator"></li>
        }
        <!-- Der Tooltip hängt am Eintrag, weil deaktivierte Buttons in manchen Browsern keinen zeigen. -->
        <li role="none" [attr.title]="entry.disabledReason">
          <button
            type="button"
            class="card-action-menu__item"
            role="menuitem"
            [disabled]="entry.disabledReason !== null"
            (click)="run.emit(entry.action)"
          >
            {{ entry.action.label }}
          </button>
        </li>
      } @empty {
        <li class="card-action-menu__empty" role="none">Keine Aktionen</li>
      }
    </ul>
  `,
  styles: `
    .card-action-menu {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 14rem;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      background-color: var(--color-gray-900);
      box-shadow: var(--shadow-card-floating);
    }

    .card-action-menu__item {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      background: none;
      color: var(--color-white);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      text-align: left;
      cursor: pointer;

      &:hover:not(:disabled),
      &:focus-visible {
        background-color: var(--color-gray-700);
      }

      &:disabled {
        color: var(--color-gray-500);
        cursor: not-allowed;
      }
    }

    .card-action-menu__divider {
      margin: var(--space-1) 0;
      border-top: 1px solid var(--color-gray-700);
    }

    .card-action-menu__empty {
      padding: var(--space-2) var(--space-3);
      color: var(--color-gray-400);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }
  `,
})
export class CardActionMenu {
  readonly entries: InputSignal<readonly CardMenuEntry[]> =
    input.required<readonly CardMenuEntry[]>();
  /** Ein Eintrag wurde gewählt; ausgeführt wird im Viewer mit dem aktuellen Kontext. */
  readonly run: OutputEmitterRef<CardAction> = output<CardAction>();
}
