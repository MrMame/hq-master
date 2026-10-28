import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { SidebarSectionStateService } from '../../services/sidebar-section-state.service';

/**
 * Klappt alle Abschnitte eines Bereichs der Seitenleiste zu; sind alle zu, klappt er alle auf.
 * Steht neben dem Titel in `.general-sidebar__header`.
 */
@Component({
  selector: 'app-sidebar-section-toggle-all',
  template: `
    <button
      type="button"
      class="toggle-all"
      [attr.aria-label]="allCollapsed() ? 'Alle Gruppen ausklappen' : 'Alle Gruppen einklappen'"
      [title]="allCollapsed() ? 'Alle Gruppen ausklappen' : 'Alle Gruppen einklappen'"
      (click)="toggleAll()"
    >
      {{ allCollapsed() ? '⊞' : '⊟' }}
    </button>
  `,
  styles: `
    .toggle-all {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-8);
      height: var(--space-8);
      border-radius: var(--radius-sm);
      color: var(--color-gray-400);
      font-size: var(--text-lg);
      line-height: var(--text-lg--line-height);
      cursor: pointer;
      transition-property: color;
      transition-duration: var(--transition-duration);
      transition-timing-function: var(--transition-ease);

      &:hover {
        color: var(--color-yellow-400);
      }
    }
  `,
})
export class SidebarSectionToggleAll {
  private readonly state: SidebarSectionStateService = inject(SidebarSectionStateService);

  /** Bereich, z. B. `dungeon-builder`: wirkt auf alle Abschnitte mit `sectionId` `dungeon-builder.…`. */
  readonly scope: InputSignal<string> = input.required<string>();

  protected readonly allCollapsed: Signal<boolean> = computed(() =>
    this.state.allCollapsed(this.scope()),
  );

  protected toggleAll(): void {
    this.state.setAll(this.scope(), !this.allCollapsed());
  }
}
