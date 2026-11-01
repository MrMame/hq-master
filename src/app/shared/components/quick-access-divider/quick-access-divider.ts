import { Component } from '@angular/core';

/** Trenner zwischen Befehlsgruppen in der `QuickAccessBar`. */
@Component({
  selector: 'app-quick-access-divider',
  host: { role: 'separator' },
  template: ``,
  styles: `
    :host {
      width: var(--space-8);
      border-top: 1px solid var(--color-gray-600);
    }
  `,
})
export class QuickAccessDivider {}
