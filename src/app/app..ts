import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({

  selector: 'app-root',
  imports: [RouterOutlet],
  // templateUrl: './app.html',
  styleUrl: './app.scss',
   template: `
    <div class="app-container">
      <!-- 1. Globale Navigationsleiste -->
      <header class="app-header">
        <div class="logo">MeinProjekt</div>
        <nav class="nav-links">
          <!-- routerLink steuert den Seitenwechsel ohne Neuladen -->
          <!-- routerLinkActive färbt den Link ein, wenn die Seite aktiv ist -->
          <a routerLink="/" routerLinkActive="active" >Dashboard</a>
          <a routerLink="/products" routerLinkActive="active">Produkte</a>
          <a routerLink="/profile" routerLinkActive="active">Profil</a>
          <button class="bg-blue-600 text-white p-4 rounded">Klick mich</button>
        </nav>
      </header>

      <!-- 2. Dynamischer Seiteninhalt (Hier landen deine Feature-Pages) -->
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>

      <!-- 3. Globaler Footer -->
      <footer class="app-footer">
        <p>&copy; 2026 MeinProjekt. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  `,
  styles:``

})
export class App {
  protected readonly title = signal('hq-master');
}
