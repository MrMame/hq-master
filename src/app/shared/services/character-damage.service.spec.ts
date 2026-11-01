import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { CharacterDamageService, DAMAGE_DIALOG_CONFIG } from './character-damage.service';
import { DamageTakenDialog } from '../components/damage-taken-dialog/damage-taken-dialog';
import { CharactersDbService } from '../../core/services/characters/characters-db.service';
import { CharacterInfo } from '../../core/models/character-info.model';
import { DamageTypes } from '../../core/models/damage-types.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { GameLogService } from '../../core/services/game-log/game-log.service';
import { GameTimeService } from '../../core/services/game-time/game-time.service';
import { applyDamage } from '../utils/damage.util';

describe('CharacterDamageService', () => {
  let service: CharacterDamageService;
  let charactersDb: CharactersDbService;
  const dialogOpen: ReturnType<typeof vi.fn> = vi.fn();
  const character: CharacterInfo = { ...createTestCharacter('a'), health: 20, armor: 5 };

  beforeEach(() => {
    dialogOpen.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open: dialogOpen } }],
    });
    service = TestBed.inject(CharacterDamageService);
    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(character);
  });

  const closeWith: (value: number | undefined) => void = (value: number | undefined): void => {
    dialogOpen.mockReturnValue({ afterClosed: () => of(value) });
  };

  it('opens the damage dialog with the character name and the damage type', () => {
    closeWith(undefined);

    service.requestDamage(character, DamageTypes.Critical);

    expect(dialogOpen).toHaveBeenCalledExactlyOnceWith(DamageTakenDialog, {
      ...DAMAGE_DIALOG_CONFIG,
      data: { characterName: character.name, damageType: DamageTypes.Critical },
    });
  });

  it.each<[DamageTypes, number, number]>([
    [DamageTypes.Normal, 18, 0],
    [DamageTypes.Critical, 13, 5],
  ])('writes a %s hit of 7 as applyDamage() result to the session', (damageType, health, armor) => {
    closeWith(7);

    service.requestDamage(character, damageType);

    expect(charactersDb.characters()).toEqual([applyDamage(character, damageType, 7)]);
    expect(charactersDb.characters()[0]).toMatchObject({ health, armor });
  });

  it.each<[DamageTypes, string]>([
    [DamageTypes.Normal, 'Grimgor: 7 Schaden auf Rüstung'],
    [DamageTypes.Critical, 'Grimgor: 7 Schaden auf Leben'],
  ])('logs a %s hit with value and target at the current game time', (damageType, text) => {
    const gameTime: GameTimeService = TestBed.inject(GameTimeService);
    gameTime.restore(new Date(2381, 0, 1, 12, 0, 0));
    closeWith(7);

    service.requestDamage({ ...character, name: 'Grimgor' }, damageType);

    expect(TestBed.inject(GameLogService).entries()).toEqual([
      expect.objectContaining({
        type: 'damage',
        gameTime: gameTime.gameTime().toISOString(),
        characterId: 'a',
        characterName: 'Grimgor',
        value: 7,
        damageType,
        text,
      }),
    ]);
  });

  it('leaves session and log unchanged when the dialog is cancelled', () => {
    closeWith(undefined);

    service.requestDamage(character, DamageTypes.Normal);

    expect(charactersDb.characters()).toEqual([character]);
    expect(TestBed.inject(GameLogService).entries()).toEqual([]);
  });

  it('focuses the dialog instead of the first button so no on-screen keyboard pops up', () => {
    expect(DAMAGE_DIALOG_CONFIG.autoFocus).toBe('dialog');
  });
});
