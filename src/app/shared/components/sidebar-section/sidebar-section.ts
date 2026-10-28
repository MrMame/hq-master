import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
  untracked,
} from '@angular/core';
import { SidebarSectionStateService } from '../../services/sidebar-section-state.service';

/** Fortlaufende Nummer, damit `aria-controls` je Instanz auf den eigenen Inhalt zeigt. */
let nextSectionId: number = 0;

/**
 * Auf- und zuklappbare Gruppe in der Seitenleiste (`.general-sidebar`). Die Überschrift ist der Schalter.
 * Zugeklappt bleibt der Inhalt im DOM und behält seinen Zustand. Der Zustand wird je `sectionId` gespeichert.
 */
@Component({
  selector: 'app-sidebar-section',
  template: `
    <h3 class="sidebar-section__heading">
      <button
        type="button"
        class="general-sidebar__heading sidebar-section__toggle"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="contentId"
        [disabled]="forceExpanded()"
        (click)="toggle()"
      >
        <span class="sidebar-section__arrow" aria-hidden="true"></span>
        {{ heading() }}
      </button>
    </h3>
    <div class="sidebar-section__content" [id]="contentId" [hidden]="!expanded()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .sidebar-section__toggle {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition-property: color;
      transition-duration: var(--transition-duration);
      transition-timing-function: var(--transition-ease);

      &[aria-expanded='true'] .sidebar-section__arrow {
        rotate: 90deg;
      }

      &:hover:enabled {
        color: var(--color-yellow-400);
      }

      &:disabled {
        cursor: default;
      }
    }

    /* Pfeil ▸ (zu) bzw. ▾ (offen); nicht Teil des barrierefreien Namens */
    .sidebar-section__arrow {
      transition-property: rotate;
      transition-duration: var(--transition-duration);
      transition-timing-function: var(--transition-ease);

      &::before {
        content: '▸';
      }
    }

    .sidebar-section__content[hidden] {
      display: none;
    }
  `,
})
export class SidebarSection {
  private readonly state: SidebarSectionStateService = inject(SidebarSectionStateService);

  readonly title: InputSignal<string> = input.required<string>();
  /** Stabiler Schlüssel `<bereich>.<abschnitt>`, z. B. `dungeon-builder.layout`. */
  readonly sectionId: InputSignal<string> = input.required<string>();
  /** Anzahl der Einträge, z. B. „Möbel (12)“; `null` blendet sie aus. */
  readonly count: InputSignal<number | null> = input<number | null>(null);
  /** Hält den Abschnitt offen (z. B. bei Suchtreffern), ohne den gespeicherten Zustand zu ändern. */
  readonly forceExpanded: InputSignal<boolean> = input<boolean>(false);

  protected readonly contentId: string = `sidebar-section-${nextSectionId++}`;

  protected readonly expanded: Signal<boolean> = computed(
    () => this.forceExpanded() || !this.state.isCollapsed(this.sectionId()),
  );

  protected readonly heading: Signal<string> = computed(() => {
    const count: number | null = this.count();
    return count === null ? this.title() : `${this.title()} (${count})`;
  });

  constructor() {
    // Angezeigte Abschnitte melden sich für „alle auf-/zuklappen“ an und beim Entfernen wieder ab.
    effect((onCleanup) => {
      const sectionId: string = this.sectionId();
      untracked(() => this.state.register(sectionId));
      onCleanup(() => this.state.unregister(sectionId));
    });
  }

  protected toggle(): void {
    this.state.toggle(this.sectionId());
  }
}
