import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Ganzseitiger Container: Navigationsleiste oben, Seiteninhalt darunter -->
    <div class="app-shell">
      <!-- 1. Globale Navigationsleiste -->
      <header class="app-header">
        <div class="app-header__bar">
          <div class="app-header__logo">HQ-Master</div>

          <nav class="app-nav">
            <a
              routerLink="/gamesession"
              routerLinkActive="app-nav__link--active"
              class="app-nav__link"
            >
              Game Session
            </a>
            <a
              routerLink="/cardmanager"
              routerLinkActive="app-nav__link--active"
              class="app-nav__link"
            >
              Card Manager
            </a>
            <a
              routerLink="/timetracker"
              routerLinkActive="app-nav__link--active"
              class="app-nav__link"
            >
              Time Tracker
            </a>
            <a
              routerLink="/dungeontracker"
              routerLinkActive="app-nav__link--active"
              class="app-nav__link"
            >
              Dungeon Tracker
            </a>
            <a
              routerLink="/dungeonbuilder"
              routerLinkActive="app-nav__link--active"
              class="app-nav__link"
            >
              Dungeon Builder
            </a>
          </nav>
        </div>
      </header>

      <!-- 2. Dynamischer Seiteninhalt -->
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {}
