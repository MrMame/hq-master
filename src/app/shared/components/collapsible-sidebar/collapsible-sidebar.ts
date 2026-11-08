import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { SidebarResize } from '../../directives/sidebar-resize';
import { CollapsibleSidebarStateService } from '../../services/collapsible-sidebar-state.service';
import { SidebarWidthService } from '../../services/sidebar-width.service';
import { clampSidebarWidth } from '../../utils/sidebar-width.util';

/** Fortlaufende Nummer, damit `aria-controls` je Instanz auf die eigene Leiste zeigt. */
let nextSidebarId: number = 0;

/**
 * Gemeinsame Seitenleiste (`.general-sidebar`) mit Griff am rechten Rand zum Ein- und Ausklappen.
 * Eingeklappt bleibt nur der Griff sichtbar; der Inhalt bleibt im DOM und behält seinen Zustand.
 * Der Zustand wird je `stateId` (Feature) gespeichert; ohne gespeicherten Wert startet die Leiste ausgeklappt.
 * Ausgeklappt ist der Griff zugleich Ziehgriff für die Breite (je `stateId` gespeichert, begrenzt auf
 * 200px … max(200px, 50 % Fenster)); ohne gespeicherte Breite gilt die Standardbreite aus `sidebar.css`.
 */
@Component({
  selector: 'app-collapsible-sidebar',
  standalone: true,
  imports: [SidebarResize],
  host: {
    '[class.collapsible-sidebar--collapsed]': 'collapsed()',
    '(window:resize)': 'onViewportResize()',
  },
  template: `
    <aside #aside class="general-sidebar" [id]="sidebarId" [style.--sidebar-width]="widthStyle()">
      <ng-content />
    </aside>
    <button
      type="button"
      class="collapsible-sidebar__toggle"
      [attr.aria-controls]="sidebarId"
      [attr.aria-expanded]="!collapsed()"
      [attr.aria-label]="collapsed() ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'"
      [appSidebarResize]="aside"
      [resizeEnabled]="!collapsed()"
      (widthChange)="dragWidth.set($event)"
      (widthCommit)="commitWidth($event)"
      (activate)="toggle()"
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

    :host(:not(.collapsible-sidebar--collapsed)) .collapsible-sidebar__toggle {
      cursor: col-resize;
      touch-action: none;
    }
  `,
})
export class CollapsibleSidebar {
  protected readonly sidebarId: string = `collapsible-sidebar-${nextSidebarId++}`;

  private readonly sidebarState: CollapsibleSidebarStateService = inject(
    CollapsibleSidebarStateService,
  );
  private readonly sidebarWidths: SidebarWidthService = inject(SidebarWidthService);

  /** Breite während des Ziehens (UI-Zustand, erst beim Loslassen gespeichert). */
  protected readonly dragWidth: WritableSignal<number | null> = signal<number | null>(null);
  protected readonly viewportWidth: WritableSignal<number> = signal<number>(window.innerWidth);

  /** Feature-ID, unter der der Zustand gespeichert wird, z. B. `dungeon-tracker`. */
  readonly stateId: InputSignal<string> = input.required<string>();

  readonly collapsed: Signal<boolean> = computed(() =>
    this.sidebarState.isCollapsed(this.stateId()),
  );

  /** Angezeigte Breite: gezogen bzw. gespeichert, auf das aktuelle Fenster begrenzt; sonst CSS-Standard. */
  protected readonly widthStyle: Signal<string | null> = computed(() => {
    const width: number | null = this.dragWidth() ?? this.sidebarWidths.widthOf(this.stateId());
    return width === null ? null : `${clampSidebarWidth(width, this.viewportWidth())}px`;
  });

  protected onViewportResize(): void {
    this.viewportWidth.set(window.innerWidth);
  }

  protected commitWidth(width: number): void {
    this.sidebarWidths.setWidth(this.stateId(), clampSidebarWidth(width, this.viewportWidth()));
    this.dragWidth.set(null);
  }

  protected toggle(): void {
    this.sidebarState.toggle(this.stateId());
  }
}
