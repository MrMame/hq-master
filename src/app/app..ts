import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Ganzseitiger Container im Flexbox-Layout untereinander (flex-col) -->
    <div class="min-h-screen bg-black text-gray-900 flex flex-col font-sans">

      <!-- 1. Globale Navigationsleiste -->
      <header class="h-[3em] bg-yellow-500 ">
        <!-- Begrenzte Breite (max-w-4xl), zentriert (mx-auto), Innenabstand (p-4) -->
        <div class="flex items-center justify-between p-2">

          <!-- Logo: Text fett (font-bold) und groß (text-lg) -->
          <div class="font-bold text-lg text-yellow-800">
            HQ-Master
          </div>

          <!-- Navigations-Links nebeneinander (flex) mit Abstand dazwischen (space-x-4) -->
          <nav class="flex items-center space-x-4">
            <a routerLink="/charactertracker"
               routerLinkActive="text-blue-600 font-bold"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-sm text-gray-600 hover:text-gray-900">
               Character Tracker
            </a>
            <a routerLink="/profile"
               routerLinkActive="text-blue-600 font-bold"
               class="text-sm text-gray-600 hover:text-gray-900">
               Empty
            </a>

          </nav>

        </div>
      </header>

      <!-- 2. Dynamischer Seiteninhalt -->
      <!-- flex-grow sorgt dafür, dass dieser Bereich den restlichen Platz einnimmt -->
      <main class="bg-white  rounded w-full h-[90vh]">
          <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: ``
})
export class App {
  protected readonly title = signal('hq-master');

}
