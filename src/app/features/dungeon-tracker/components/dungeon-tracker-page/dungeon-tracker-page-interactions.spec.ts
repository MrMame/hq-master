import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DungeonTrackerPage } from './dungeon-tracker-page';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { createTestCharacter } from '../../../game-session/testing/session.fixtures';
import { clickButton } from '../../../../shared/testing/click-button';

type GridSetting = 'gridCellSizePx' | 'gridOffsetX' | 'gridOffsetY' | 'gridOpacity';

describe('DungeonTrackerPage – interactions', () => {
  let fixture: ComponentFixture<DungeonTrackerPage>;
  let board: DungeonBoardService;
  let host: HTMLElement;
  const openEdit: ReturnType<typeof vi.fn> = vi.fn();
  const openCreate: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    openEdit.mockReset();
    openCreate.mockReset();
    await TestBed.configureTestingModule({
      imports: [DungeonTrackerPage],
      providers: [{ provide: CharacterEditorService, useValue: { openEdit, openCreate } }],
    }).compileComponents();

    TestBed.inject(CharactersDbService).writeCharacter(createTestCharacter('a'));
    board = TestBed.inject(DungeonBoardService);
    fixture = TestBed.createComponent(DungeonTrackerPage);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.useRealTimers());

  const fileInput: () => HTMLInputElement = (): HTMLInputElement =>
    host.querySelector('input[type="file"]') as HTMLInputElement;

  const selectFiles: (files: File[]) => void = (files: File[]): void => {
    Object.defineProperty(fileInput(), 'files', { value: files });
    fileInput().dispatchEvent(new Event('change'));
  };

  const token: () => DungeonToken = (): DungeonToken =>
    fixture.debugElement.query(By.directive(DungeonToken)).componentInstance as DungeonToken;

  it('stores an uploaded board image as data url and shows it', async () => {
    selectFiles([new File(['png'], 'board.png', { type: 'image/png' })]);

    await vi.waitFor(() => expect(board.boardState().boardImageBase64).toMatch(/^data:image\/png/));
    await fixture.whenStable();
    expect(host.textContent).toContain('✓ Bild geladen');
    expect(host.querySelector('img[alt="Spielbrett"]')).not.toBeNull();
  });

  it('ignores a file selection without a file', () => {
    vi.useFakeTimers();
    const before: DungeonBoardState = board.boardState();

    selectFiles([]);
    vi.runAllTimers();

    expect(board.boardState()).toBe(before);
    expect(host.textContent).toContain('Kein Spielbrett geladen');
  });

  it.each<[number, GridSetting, string, number]>([
    [0, 'gridCellSizePx', '60', 60],
    [1, 'gridOffsetX', '-10', -10],
    [2, 'gridOffsetY', '15', 15],
    [3, 'gridOpacity', '0.5', 0.5],
  ])('slider %i changes only %s', async (index, key, rawValue, expected) => {
    const before: DungeonBoardState = board.boardState();
    const slider: HTMLInputElement =
      host.querySelectorAll<HTMLInputElement>('input[type="range"]')[index];

    slider.value = rawValue;
    slider.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(board.boardState()).toEqual({ ...before, [key]: expected });
  });

  it('moves the position of a dragged token', async () => {
    token().tokenMoved.emit({ characterId: 'a', col: 3, row: 2 });
    await fixture.whenStable();

    expect(board.positions()).toContainEqual({ characterId: 'a', col: 3, row: 2 });
  });

  it('opens the character editor for the double-clicked token', () => {
    token().tokenDoubleClicked.emit('a');

    expect(openEdit).toHaveBeenCalledExactlyOnceWith(createTestCharacter('a'));
    expect(openCreate).not.toHaveBeenCalled();
  });

  it('opens the character editor for a new character on "Character Neu"', () => {
    clickButton(host, 'Character Neu');

    expect(openCreate).toHaveBeenCalledExactlyOnceWith();
    expect(openEdit).not.toHaveBeenCalled();
  });
});
