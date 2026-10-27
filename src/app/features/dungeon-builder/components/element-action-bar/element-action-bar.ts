import { Component, inject } from '@angular/core';
import { ElementSelection } from '../../models/element-selection.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';

/**
 * Menüleiste unter dem markierten Element: Drehen und Löschen. Zeigerereignisse gehen nicht an den
 * Plan weiter, damit ein Tipp weder den Ausschnitt verschiebt noch die Markierung ändert.
 */
@Component({
  selector: 'app-element-action-bar',
  host: {
    role: 'toolbar',
    'aria-label': 'Aktionen für das markierte Element',
    '(pointerdown)': '$event.stopPropagation()',
    '(click)': '$event.stopPropagation()',
  },
  template: `
    <button
      type="button"
      class="action-bar__button"
      aria-label="Drehen"
      title="Drehen (R)"
      (click)="rotate()"
    >
      <img src="./img/rotate.svg" alt="" class="action-bar__icon" />
    </button>
    <button
      type="button"
      class="action-bar__button action-bar__button--remove"
      aria-label="Löschen"
      title="Löschen (Entf)"
      (click)="remove()"
    >
      <img src="./img/delete.svg" alt="" class="action-bar__icon" />
    </button>
  `,
  styles: `
    :host {
      display: flex;
      gap: var(--space-1);
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      background-color: color-mix(in oklab, var(--color-gray-900) 85%, transparent);
    }

    .action-bar__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-8);
      height: var(--space-8);
      border-radius: var(--radius-sm);
      background-color: var(--color-gray-700);
      cursor: pointer;

      &:hover {
        background-color: var(--color-gray-600);
      }
    }

    .action-bar__button--remove {
      background-color: var(--color-red-600);

      &:hover {
        background-color: var(--color-red-700);
      }
    }

    .action-bar__icon {
      width: var(--space-6);
      height: var(--space-6);
    }
  `,
})
export class ElementActionBar {
  private readonly ui: BuilderUiService = inject(BuilderUiService);
  private readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);

  protected rotate(): void {
    const selection: ElementSelection | null = this.ui.selection();
    if (selection) this.layoutService.rotateElement(selection);
  }

  protected remove(): void {
    const selection: ElementSelection | null = this.ui.selection();
    if (selection) this.layoutService.removeElement(selection);
  }
}
