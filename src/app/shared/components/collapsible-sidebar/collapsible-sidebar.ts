import { Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { CollapsibleSidebarStateService } from '../../services/collapsible-sidebar-state.service';

/** Fortlaufende Nummer, damit `aria-controls` je Instanz auf die eigene Leiste zeigt. */
let nextSidebarId: number = 0;

/**
 * Gemeinsame Seitenleiste (`.general-sidebar`) mit Griff am rechten Rand zum Ein- und Ausklappen.
 * Eingeklappt bleibt nur der Griff sichtbar; der Inhalt bleibt im DOM und behält seinen Zustand.
 * Der Zustand wird je `stateId` (Feature) gespeichert; ohne gespeicherten Wert startet die Leiste ausgeklappt.
 */
@Component({
  selector: 'app-collapsible-sidebar',
  standalone: true,
  host: { '[class.collapsible-sidebar--collapsed]': 'collapsed()' },
  template: `
    <aside class="general-sidebar" [id]="sidebarId">
      <ng-content />
    </aside>
    <button
      type="button"
      class="collapsible-sidebar__toggle"
      [attr.aria-controls]="sidebarId"
      [attr.aria-expanded]="!collapsed()"
      [attr.aria-label]="collapsed() ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'"
      (click)="toggle()"
    >
      {{ collapsed() ? '›' : '‹' }}
    </button>
  `,
  styles: `
    :host {
      display: flex;
      flex-shrink: 0;
      align-self: stretch;
    }

    :host(.collapsible-sidebar--collapsed) .general-sidebar {
      display: none;
    }

    .collapsible-sidebar__toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-8);
      border-left: 1px solid var(--color-gray-600);
      background-color: var(--color-general-sidebar);
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
export class CollapsibleSidebar {
  protected readonly sidebarId: string = `collapsible-sidebar-${nextSidebarId++}`;

  private readonly sidebarState: CollapsibleSidebarStateService = inject(
    CollapsibleSidebarStateService,
  );

  /** Feature-ID, unter der der Zustand gespeichert wird, z. B. `dungeon-tracker`. */
  readonly stateId: InputSignal<string> = input.required<string>();

  readonly collapsed: Signal<boolean> = computed(() =>
    this.sidebarState.isCollapsed(this.stateId()),
  );

  protected toggle(): void {
    this.sidebarState.toggle(this.stateId());
  }
}
