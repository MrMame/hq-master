import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNav } from './shared/components/main-nav/main-nav';
import { CardViewer } from './shared/components/card-viewer/card-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainNav, CardViewer],
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

    <!-- 3. Card Viewer: schwebt im Overlay-Container über allem, aus jedem Feature nutzbar -->
    <app-card-viewer />
  `,
  styleUrl: './app.css',
})
export class App {}
