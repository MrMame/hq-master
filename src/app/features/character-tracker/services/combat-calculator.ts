import { Injectable } from '@angular/core';
import { MovableCharacterItem } from './../models/MovableCharacterItem';
import { DamageTypes } from './../models/DamageTypes';

@Injectable({
  providedIn: 'root' // Oder im Providers-Array des Features, falls es nur dort leben soll
})
export class CombatCalculatorService {

  private readonly CRITICAL_DAMAGE_MULTIPLIER : number = 1.0;

  /**
   * Berechnet den Schaden und wendet ihn direkt auf das Charakter-Objekt an
   */
  public applyDamage(item: MovableCharacterItem, damageType: DamageTypes, rawDamage: number): void {
    if (rawDamage <= 0) return;

    switch (damageType) {
      case DamageTypes.Normal:
        this.calculateNormalDamage(item, rawDamage);
        break;
      case DamageTypes.Critical:
        this.calculateCriticalDamage(item, rawDamage);
        break;
    }
  }

  /* PRIVATES ============================================================================== */

  private calculateNormalDamage(item: MovableCharacterItem, damage: number): void {
    // Beispiel für Business-Logik: Rüstung fängt Schaden ab
    if (item.characterInfo.armor >= damage) {
      item.characterInfo.armor -= damage;
    } else {
      const remainingDamage = damage - item.characterInfo.armor;
      item.characterInfo.armor = 0;
      item.characterInfo.health = Math.max(0, item.characterInfo.health - remainingDamage);
    }
  }

  private calculateCriticalDamage(item: MovableCharacterItem, damage: number): void {
    // Kritischer Schaden geht z.B. direkt auf die Lebenspunkte und ignoriert Rüstung komplett
    const critMultiplier = this.CRITICAL_DAMAGE_MULTIPLIER;
    const finalDamage = Math.round(damage * critMultiplier);
    item.characterInfo.health = Math.max(0, item.characterInfo.health - finalDamage);
  }
}
