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

/** `sidebar`: Gruppe der Seitenleiste; `area`: abgesetzter Bereich im Hauptbereich (z. B. Card Manager). */
export type SidebarSectionVariant = 'sidebar' | 'area';

/**
 * Auf- und zuklappbare Gruppe in der Seitenleiste (`.general-sidebar`) bzw. mit `variant="area"` Bereich im
 * Hauptbereich. Die Überschrift ist der Schalter.
 * Zugeklappt bleibt der Inhalt im DOM und behält seinen Zustand. Der Zustand wird je `sectionId` gespeichert.
 */
@Component({
  selector: 'app-sidebar-section',
  // Im Hauptbereich ist der Abschnitt eine eigene Fläche und eine benannte Region.
  host: {
    '[class.sidebar-section--area]': "variant() === 'area'",
    '[attr.role]': "variant() === 'area' ? 'region' : null",
    '[attr.aria-label]': "variant() === 'area' ? title() : null",
  },
  template: `
    <h3 class="sidebar-section__heading">
      <button
        type="button"
        class="section-heading sidebar-section__toggle"
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
  styleUrl: './sidebar-section.css',
})
export class SidebarSection {
  private readonly state: SidebarSectionStateService = inject(SidebarSectionStateService);

  readonly title: InputSignal<string> = input.required<string>();
  /** Stabiler Schlüssel `<bereich>.<abschnitt>`, z. B. `dungeon-builder.layout`. */
  readonly sectionId: InputSignal<string> = input.required<string>();
  /** Anzahl der Einträge, z. B. „Möbel (12)“; `null` blendet sie aus. */
  readonly count: InputSignal<number | null> = input<number | null>(null);
  readonly variant: InputSignal<SidebarSectionVariant> = input<SidebarSectionVariant>('sidebar');
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
