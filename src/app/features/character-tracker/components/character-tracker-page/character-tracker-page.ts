import { Component, inject, Signal } from '@angular/core';
import { MovableCharacterCard } from '../movable-character-card/movable-character-card';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../models/damage-types.model';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { MonsterCharacterCreatorService } from '../../services/character-creators/monster-character-creator.service';
import { HeroCharacterCreatorService } from '../../services/character-creators/hero-character-creator.service';
import { CharacterCardLayoutService } from '../../services/character-card-layout.service';
import { CharacterDialogsService } from '../../services/character-dialogs.service';
import { applyDamage } from '../../utils/damage.util';

@Component({
  selector: 'app-character-tracker-page',
  imports: [MovableCharacterCard],
  templateUrl: './character-tracker-page.html',
  styleUrl: './character-tracker-page.css',
})
export class CharacterTrackerPage {
  private readonly charactersDbService: CharactersDbService = inject(CharactersDbService);
  private readonly monsterCreator: MonsterCharacterCreatorService = inject(
    MonsterCharacterCreatorService,
  );
  private readonly heroCreator: HeroCharacterCreatorService = inject(HeroCharacterCreatorService);
  private readonly characterDialogs: CharacterDialogsService = inject(CharacterDialogsService);
  protected readonly cardLayout: CharacterCardLayoutService = inject(CharacterCardLayoutService);

  readonly characters: Signal<CharacterInfo[]> = this.charactersDbService.characters;

  addMonster(): void {
    this.saveCharacter(this.monsterCreator.CreateNewRandomMonster());
  }

  addHero(): void {
    this.saveCharacter(this.heroCreator.CreateNewRandomHero());
  }

  addCharacter(): void {
    this.characterDialogs.openAddCharacter().subscribe((character) => {
      if (character) this.saveCharacter(character);
    });
  }

  removeCharacter(character: CharacterInfo): void {
    this.charactersDbService.removeCharacter(character);
  }

  takeDamage(character: CharacterInfo, damageType: DamageTypes): void {
    this.characterDialogs.openDamageTaken().subscribe((damage) => {
      if (damage !== undefined) this.saveCharacter(applyDamage(character, damageType, damage));
    });
  }

  saveCharacter(character: CharacterInfo): void {
    this.charactersDbService.writeCharacter(character);
  }
}
