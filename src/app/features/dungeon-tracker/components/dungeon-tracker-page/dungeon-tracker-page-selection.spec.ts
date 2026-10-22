import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonTrackerPage } from './dungeon-tracker-page';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonTrackerPage – selection and damage', () => {
  let fixture: ComponentFixture<DungeonTrackerPage>;
  let charactersDb: CharactersDbService;
  let host: HTMLElement;
  const requestDamage: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    requestDamage.mockReset();
    await TestBed.configureTestingModule({
      imports: [DungeonTrackerPage],
      providers: [{ provide: CharacterDamageService, useValue: { requestDamage } }],
    }).compileComponents();

    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createTestCharacter('a'));
    charactersDb.writeCharacter(createTestCharacter('b'));
    fixture = TestBed.createComponent(DungeonTrackerPage);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const tokenAt: (index: number) => HTMLElement = (index: number): HTMLElement =>
    host.querySelectorAll<HTMLElement>('.dungeon-token')[index];

  const selectedTokens: () => number = (): number =>
    host.querySelectorAll('.dungeon-token--selected').length;

  const click: (element: Element) => Promise<void> = async (element: Element): Promise<void> => {
    (element as HTMLElement).click();
    await fixture.whenStable();
  };

  it('starts without a selection and without damage buttons', () => {
    expect(selectedTokens()).toBe(0);
    expect(host.querySelectorAll('.dungeon-token button')).toHaveLength(0);
  });

  it('selects the clicked token and shows only its damage buttons', async () => {
    await click(tokenAt(0));

    expect(tokenAt(0).classList).toContain('dungeon-token--selected');
    expect(selectedTokens()).toBe(1);
    expect(tokenAt(0).querySelectorAll('button')).toHaveLength(2);
    expect(tokenAt(1).querySelectorAll('button')).toHaveLength(0);
  });

  it('moves the selection to another clicked token', async () => {
    await click(tokenAt(0));
    await click(tokenAt(1));

    expect(tokenAt(1).classList).toContain('dungeon-token--selected');
    expect(selectedTokens()).toBe(1);
  });

  it('keeps the selection on a second click (no toggling, double click keeps it)', async () => {
    await click(tokenAt(0));
    await click(tokenAt(0));

    expect(tokenAt(0).classList).toContain('dungeon-token--selected');
  });

  it('clears the selection on a click on the free board', async () => {
    await click(tokenAt(0));
    await click(host.querySelector('.board') as HTMLElement);

    expect(selectedTokens()).toBe(0);
  });

  it('leaves no selection behind when the selected character is removed', async () => {
    await click(tokenAt(0));
    charactersDb.removeCharacter(createTestCharacter('a'));
    await fixture.whenStable();

    expect(selectedTokens()).toBe(0);
    expect(fixture.componentInstance.selectedId()).toBeNull();
  });

  it.each<[string, DamageTypes]>([
    ['Schaden auf Rüstung', DamageTypes.Normal],
    ['Schaden auf Leben', DamageTypes.Critical],
  ])('"%s" asks the damage service for the selected character', async (label, damageType) => {
    await click(tokenAt(1));
    await click(tokenAt(1).querySelector(`button[aria-label="${label}"]`) as HTMLElement);

    expect(requestDamage).toHaveBeenCalledExactlyOnceWith(createTestCharacter('b'), damageType);
    expect(tokenAt(1).classList).toContain('dungeon-token--selected');
  });

  it('a click on a legend value asks the damage service without selecting the token', async () => {
    const legendEntry: Element = host.querySelectorAll('app-dungeon-legend-entry')[1];
    await click(legendEntry.querySelector('button[aria-label="Schaden auf Leben"]') as Element);

    expect(requestDamage).toHaveBeenCalledExactlyOnceWith(
      createTestCharacter('b'),
      DamageTypes.Critical,
    );
    expect(selectedTokens()).toBe(0);
  });

  it('shows changed health and armor immediately at token and legend', async () => {
    const hit: CharacterInfo = { ...createTestCharacter('a'), health: 3, armor: 0 };
    charactersDb.writeCharacter(hit);
    await fixture.whenStable();

    for (const scope of [tokenAt(0), host.querySelector('app-dungeon-legend-entry')]) {
      expect(scope?.querySelector('[aria-label="Leben"]')?.textContent?.trim()).toBe('3');
      expect(scope?.querySelector('[aria-label="Rüstung"]')?.textContent?.trim()).toBe('0');
    }
  });
});
