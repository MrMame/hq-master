import { Component, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { filter, map } from 'rxjs';
import { MAIN_NAV_ITEMS, MainNavItem } from './main-nav-items';
import { findNavItem } from './active-nav-item.util';

/**
 * Hauptnavigation im App-Header: breit als Linkleiste, schmal als Menü-Button (☰) mit Aufklappliste
 * und dem Namen der aktuellen Seite. Welche Variante sichtbar ist, entscheidet nur CSS.
 */
@Component({
  selector: 'app-main-nav',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule],
  template: `
    <button
      mat-icon-button
      class="main-nav__menu-button"
      aria-label="Hauptmenü"
      [matMenuTriggerFor]="mainMenu"
    >
      <img src="./img/menu.svg" alt="" class="main-nav__menu-icon" />
    </button>
    <mat-menu #mainMenu="matMenu">
      @for (item of items; track item.route) {
        <a
          mat-menu-item
          [routerLink]="item.route"
          routerLinkActive="main-nav__menu-item--active"
          ariaCurrentWhenActive="page"
        >
          <span class="main-nav__menu-label">{{ item.label }}</span>
        </a>
      }
    </mat-menu>

    <div class="main-nav__logo">HQ-Master</div>
    @if (activeItem(); as active) {
      <div class="main-nav__page-name">· {{ active.label }}</div>
    }

    <nav class="app-nav">
      @for (item of items; track item.route) {
        <a
          [routerLink]="item.route"
          routerLinkActive="app-nav__link--active"
          ariaCurrentWhenActive="page"
          class="app-nav__link"
        >
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  styleUrl: './main-nav.css',
})
export class MainNav {
  private readonly router: Router = inject(Router);

  protected readonly items: readonly MainNavItem[] = MAIN_NAV_ITEMS;

  private readonly currentUrl: Signal<string> = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activeItem: Signal<MainNavItem | undefined> = computed(() =>
    findNavItem(this.items, this.currentUrl()),
  );
}
