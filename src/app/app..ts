import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Ganzseitiger Container im Flexbox-Layout untereinander (flex-col) -->
    <div class="min-h-screen bg-gray-700 text-gray-900 flex flex-col font-sans">

      <!-- 1. Globale Navigationsleiste -->
      <header class="bg-white border-b border-gray-200">
        <!-- Begrenzte Breite (max-w-4xl), zentriert (mx-auto), Innenabstand (p-4) -->
        <div class="max-w-4xl mx-auto p-4 flex items-center justify-between">

          <!-- Logo: Text fett (font-bold) und groß (text-lg) -->
          <div class="font-bold text-lg text-blue-600">
            HQ-Master
          </div>

          <!-- Navigations-Links nebeneinander (flex) mit Abstand dazwischen (space-x-4) -->
          <nav class="flex items-center space-x-4">
            <a routerLink="/"
               routerLinkActive="text-blue-600 font-bold"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-sm text-gray-600 hover:text-gray-900">
               Monster Tracker
            </a>

            <a routerLink="/products"
               routerLinkActive="text-blue-600 font-bold"
               class="text-sm text-gray-600 hover:text-gray-900">
               Empty
            </a>

            <a routerLink="/profile"
               routerLinkActive="text-blue-600 font-bold"
               class="text-sm text-gray-600 hover:text-gray-900">
               Empty
            </a>

            <!-- Einfacher Button mit runden Ecken (rounded) -->
            <button class="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
              Aktion
            </button>
          </nav>

        </div>
      </header>

      <!-- 2. Dynamischer Seiteninhalt -->
      <!-- flex-grow sorgt dafür, dass dieser Bereich den restlichen Platz einnimmt -->
      <main class="grow max-w-4xl w-full mx-auto p-4 my-6">
        <!-- Weißer Inhaltskasten mit Rahmen (border) und Innenabstand (p-6) -->
        <div class="bg-white border border-gray-200 rounded p-6">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- 3. Globaler Footer -->
      <header class="bg-white border-t border-gray-200 text-left p-4">
        <p class="text-xs text-gray-500">
          &copy; 2026 HQ-Master. Alle Rechte vorbehalten.
        </p>
      </header>

    </div>
  `,
  styles: ``
})
export class App {
  protected readonly title = signal('hq-master');
}
