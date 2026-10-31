import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNav } from './shared/components/main-nav/main-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainNav],
  template: `
    <!-- Ganzseitiger Container: Navigationsleiste oben, Seiteninhalt darunter -->
    <div class="app-shell">
      <!-- 1. Globale Navigationsleiste -->
      <header class="app-header">
        <app-main-nav />
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
