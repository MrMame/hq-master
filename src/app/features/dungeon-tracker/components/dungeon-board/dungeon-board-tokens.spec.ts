import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DungeonBoard } from './dungeon-board';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonBoard – tokens and selection', () => {
  let fixture: ComponentFixture<DungeonBoard>;
  let charactersDb: CharactersDbService;
  let host: HTMLElement;
  const requestDamage: ReturnType<typeof vi.fn> = vi.fn();
  const openEdit: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    requestDamage.mockReset();
    openEdit.mockReset();
    await TestBed.configureTestingModule({
      imports: [DungeonBoard],
      providers: [
        { provide: CharacterDamageService, useValue: { requestDamage } },
        { provide: CharacterEditorService, useValue: { openEdit } },
      ],
    }).compileComponents();

    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createTestCharacter('a'));
    charactersDb.writeCharacter(createTestCharacter('b'));
    fixture = TestBed.createComponent(DungeonBoard);
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

  it('keeps the selection after panning the board', async () => {
    // jsdom hat kein Layout: Client-Fläche und Pointer-Capture vorgeben (s. board-pan.spec.ts).
    const viewport: HTMLElement = host.querySelector('.board') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: 400 });
    Object.defineProperty(viewport, 'clientHeight', { value: 300 });
    viewport.setPointerCapture = vi.fn();
    await click(tokenAt(0));

    const pointer: (type: string, x: number) => boolean = (type: string, x: number): boolean =>
      viewport.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: 100 }));
    pointer('pointerdown', 100);
    pointer('pointermove', 160);
    pointer('pointerup', 160);
    await click(viewport);

    expect(tokenAt(0).classList).toContain('dungeon-token--selected');
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

  it('moves the position of a dragged token', async () => {
    const token: DungeonToken = fixture.debugElement.query(By.directive(DungeonToken))
      .componentInstance as DungeonToken;
    token.tokenMoved.emit({ characterId: 'a', col: 3, row: 2 });
    await fixture.whenStable();

    expect(TestBed.inject(DungeonBoardService).positions()).toContainEqual({
      characterId: 'a',
      col: 3,
      row: 2,
    });
  });

  it('opens the character editor for the double-clicked token', () => {
    tokenAt(0).dispatchEvent(new MouseEvent('dblclick'));

    expect(openEdit).toHaveBeenCalledExactlyOnceWith(createTestCharacter('a'));
  });
});
