import { Component, model, effect, inject } from '@angular/core'; // 1. effect und inject importieren
import { FormsModule } from '@angular/forms';
import { CharacterInfo } from '../../models/CharacterInfo';
import { CharactersDbService } from '../../../../core/services/persitents/characters-database-service';


@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="bg-yellow-500 shadow-md rounded-lg p-0.5 h-[30vh] overflow-scroll text-xs">
    
    @if (characterInfo(); as info) {
      <div class="flex mb-1">
        <img [src]="info.image" alt="Monster Image" class="w-[30%] h-auto object-cover mb-2 rounded">
        <div class="flex-col ml-3">
            <span class="text-gray-600">Type: {{ info.type }}</span>
        </div>
      </div>

      <div class="ml-3">
        <!-- 
          WICHTIG: Damit Angular merkt, dass sich ein Objekt-Attribut ändert, 
          nutzen wir das (ngModelChange) Event, um das Signal sauber neu zu setzen (update).
        -->
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Health:</span>
          <input type="number" [(ngModel)]="info.health" (ngModelChange)="updateCharacter()" class="border p-1 rounded w-20 mb-0.5">
        </div>
        
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Defense:</span>
          <input type="number" [(ngModel)]="info.defense" (ngModelChange)="updateCharacter()" class="border p-1 rounded w-20 mb-0.5">
        </div>
        
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Speed:</span>
          <input type="number" [(ngModel)]="info.speed" (ngModelChange)="updateCharacter()" class="border p-1 rounded w-20 mb-0.5">
        </div>
      
        <div class="flex">
          <span class="basis-1/3 text-gray-600">Attack:</span>
          <input type="number" [(ngModel)]="info.attack" (ngModelChange)="updateCharacter()" class="border p-1 rounded w-20 mb-0.5">
        </div>
      </div>
      
      <div class="flex-col m-3">
        <h3 class="text-gray-600">Abilities:</h3>
        <span class="basis-1/3 text-gray-600">{{ info.abilities?.join(', ') }}</span>
      </div>
      <div class="flex-col m-3">
        <p class="basis-2/3 text-gray-700 mb-4">{{ info.description }}</p>
      </div>  
    }
    
    <br>
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Details</button>
  </div>
  `
})
export class CharacterCard {
  // Repository injizieren
  private charactersDbService = inject(CharactersDbService);
  public characterInfo = model<CharacterInfo>();

  constructor() {
    // Der Effekt überwacht das Signal. Sobald updateCharacter() läuft, 
    // feuert dieser Effekt und schreibt in die Datenbank.
    effect(() => {
      const info = this.characterInfo();
      if (info) {
        this.charactersDbService.writeCharacter(info);
        console.log('Datenbank automatisch aktualisiert für:', info.name);
      }
    });
  }

  // Hilfsmethode: Klont das Objekt und triggert das Signal-Update
  updateCharacter() {
    const info = this.characterInfo();
    if (info) {
      this.characterInfo.set({ ...info });
    }
  }
}
