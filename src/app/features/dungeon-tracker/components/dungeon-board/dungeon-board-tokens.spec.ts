import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DungeonBoard } from './dungeon-board';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { CharacterSelection } from '../../models/character-selection.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { spyOnScrollIntoView } from '../../testing/scroll-into-view.fixtures';

describe('DungeonBoard – tokens and selection', () => {
  let fixture: ComponentFixture<DungeonBoard>;
  let host: HTMLElement;
  let reported: (string | null)[];
  const openEdit: ReturnType<typeof vi.fn> = vi.fn();
  const scrolledElements: () => Element[] = spyOnScrollIntoView();

  beforeEach(async () => {
    openEdit.mockReset();
    await TestBed.configureTestingModule({
      imports: [DungeonBoard],
      providers: [{ provide: CharacterEditorService, useValue: { openEdit } }],
    }).compileComponents();

    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createTestCharacter('a'));
    charactersDb.writeCharacter(createTestCharacter('b'));
    fixture = TestBed.createComponent(DungeonBoard);
    host = fixture.nativeElement as HTMLElement;
    reported = [];
    fixture.componentInstance.selectionChange.subscribe((id) => reported.push(id));
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

  const select: (selection: CharacterSelection | null) => Promise<void> = async (
    selection: CharacterSelection | null,
  ): Promise<void> => {
    fixture.componentRef.setInput('selection', selection);
    await fixture.whenStable();
  };

  it('starts without a selection and without action bar', () => {
    expect(selectedTokens()).toBe(0);
    expect(host.querySelectorAll('.dungeon-token button')).toHaveLength(0);
  });

  it('shows the selection of the page with the action bar only at that token', async () => {
    await select({ characterId: 'a', source: 'board' });

    expect(tokenAt(0).classList).toContain('dungeon-token--selected');
    expect(selectedTokens()).toBe(1);
    expect(tokenAt(0).querySelector('[role="toolbar"]')).not.toBeNull();
    expect(tokenAt(1).querySelectorAll('button')).toHaveLength(0);
  });

  it('reports the clicked token, also on a second click (no toggling)', async () => {
    await click(tokenAt(1));
    await click(tokenAt(1));

    expect(reported).toEqual(['b', 'b']);
  });

  it('reports no selection for a click on the free board', async () => {
    await click(host.querySelector('.board') as HTMLElement);

    expect(reported).toEqual([null]);
  });

  it('reports nothing after panning the board', async () => {
    // jsdom hat kein Layout: Client-Fläche und Pointer-Capture vorgeben (s. board-pan.spec.ts).
    const viewport: HTMLElement = host.querySelector('.board') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: 400 });
    Object.defineProperty(viewport, 'clientHeight', { value: 300 });
    viewport.setPointerCapture = vi.fn();

    const pointer: (type: string, x: number) => boolean = (type: string, x: number): boolean =>
      viewport.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: 100 }));
    pointer('pointerdown', 100);
    pointer('pointermove', 160);
    pointer('pointerup', 160);
    await click(viewport);

    expect(reported).toEqual([]);
  });

  it('scrolls the selected token into view only for a selection from the legend', async () => {
    await select({ characterId: 'a', source: 'board' });
    expect(scrolledElements()).toEqual([]);

    await select({ characterId: 'b', source: 'legend' });
    expect(scrolledElements()).toEqual([
      tokenAt(1),
      tokenAt(1).querySelector('app-character-action-bar'),
    ]);
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
