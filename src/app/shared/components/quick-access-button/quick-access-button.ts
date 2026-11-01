import { Component, computed, input, InputSignal, Signal } from '@angular/core';

/** `primary`: gelbe Hauptaktion (z. B. „+“); `toggle`: grauer Umschalter, aktiv gelb. */
export type QuickAccessButtonVariant = 'primary' | 'toggle';

/**
 * Befehl in der `QuickAccessBar`, auf einem nativen `<button>`, damit `click`, `disabled` und
 * Tastaturbedienung nativ bleiben. Mit `icon` zeigt er das Bild, sonst den projizierten Inhalt.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[appQuickAccessButton]',
  host: {
    type: 'button',
    class: 'quick-access-button',
    '[class.quick-access-button--toggle]': "variant() === 'toggle'",
    '[class.quick-access-button--active]': 'pressed() === true',
    '[attr.aria-label]': 'label()',
    '[attr.title]': 'title() ?? label()',
    '[attr.aria-pressed]': 'pressed()',
  },
  template: `
    @if (icon(); as src) {
      <img [src]="src" alt="" class="quick-access-button__icon" />
    } @else {
      <ng-content />
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-10);
      height: var(--space-10);
      border-radius: var(--radius-sm);
      background-color: var(--color-yellow-500);
      color: var(--color-black);
      font-size: var(--text-xl);
      line-height: var(--text-xl--line-height);
      font-weight: var(--font-weight-bold);
      cursor: pointer;
      transition-property: background-color;
      transition-duration: var(--transition-duration);
      transition-timing-function: var(--transition-ease);

      &:hover:not(:disabled) {
        background-color: var(--color-yellow-400);
      }

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }
    }

    /* Inaktive Umschalter grau, der aktive gelb wie die Hauptaktion */
    :host(.quick-access-button--toggle:not(.quick-access-button--active)) {
      background-color: var(--color-gray-700);

      &:hover:not(:disabled) {
        background-color: var(--color-gray-600);
      }
    }

    :host(.quick-access-button--active) .quick-access-button__icon {
      filter: invert(1);
    }

    .quick-access-button__icon {
      width: var(--space-6);
      height: var(--space-6);
    }
  `,
})
export class QuickAccessButton {
  /** Setzt `aria-label` und ist Standard für `title`. */
  readonly label: InputSignal<string> = input.required<string>();
  /** Tooltip, z. B. mit Tastenkürzel; ohne Angabe gilt `label`. */
  readonly title: InputSignal<string | undefined> = input<string>();
  /** Bild-URL; ohne Icon wird der projizierte Inhalt angezeigt. */
  readonly icon: InputSignal<string | undefined> = input<string>();
  /** Nur bei `toggle`: eingeschaltet. Ohne Angabe ein grauer Befehl ohne Umschaltzustand (z. B. Rückgängig). */
  readonly active: InputSignal<boolean | undefined> = input<boolean>();
  readonly variant: InputSignal<QuickAccessButtonVariant> =
    input<QuickAccessButtonVariant>('primary');

  /** `aria-pressed` nur bei Umschaltern mit Zustand, sonst kein Attribut. */
  protected readonly pressed: Signal<boolean | null> = computed(() =>
    this.variant() === 'toggle' ? (this.active() ?? null) : null,
  );
}
