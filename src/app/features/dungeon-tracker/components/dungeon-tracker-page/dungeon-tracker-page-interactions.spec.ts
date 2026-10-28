import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DungeonTrackerPage } from './dungeon-tracker-page';
import { DungeonBoard } from '../dungeon-board/dungeon-board';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonBoardState } from '../../models/dungeon-board-state.model';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonTrackerPage – interactions', () => {
  let fixture: ComponentFixture<DungeonTrackerPage>;
  let board: DungeonBoardService;
  let host: HTMLElement;
  const openEdit: ReturnType<typeof vi.fn> = vi.fn();
  const openCreate: ReturnType<typeof vi.fn> = vi.fn();
  const requestDamage: ReturnType<typeof vi.fn> = vi.fn();

  beforeEach(async () => {
    [openEdit, openCreate, requestDamage].forEach((mock) => mock.mockReset());
    await TestBed.configureTestingModule({
      imports: [DungeonTrackerPage],
      providers: [
        { provide: CharacterEditorService, useValue: { openEdit, openCreate } },
        { provide: CharacterDamageService, useValue: { requestDamage } },
      ],
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

  const slide: (selector: string, value: string) => Promise<void> = async (
    selector: string,
    value: string,
  ): Promise<void> => {
    const slider: HTMLInputElement = host.querySelector<HTMLInputElement>(selector)!;
    slider.value = value;
    slider.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

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

  it('zooms only the board with the slider above the board, without saving the zoom', async () => {
    const before: DungeonBoardState = board.boardState();
    const boardZoom: () => number = (): number =>
      (
        fixture.debugElement.query(By.directive(DungeonBoard)).componentInstance as DungeonBoard
      ).zoom();
    const zoomControl: Element = host.querySelector('.board-area app-board-zoom-control')!;
    expect(zoomControl.textContent).toContain('100 %');
    expect(boardZoom()).toBe(1);

    await slide('input[aria-label="Zoom"]', '2.5');

    expect(zoomControl.textContent).toContain('250 %');
    expect(boardZoom()).toBe(2.5);
    expect(board.boardState()).toBe(before);
  });

  it('shows the origin marker on the board while "Nullpunkt verschieben" is on', async () => {
    const originSwitch: HTMLInputElement = host.querySelector('input[type="checkbox"]')!;
    const marker: () => Element | null = (): Element | null =>
      host.querySelector('app-dungeon-board [data-testid="grid-origin"]');
    expect(marker()).toBeNull();

    originSwitch.click();
    await fixture.whenStable();
    expect(marker()).not.toBeNull();

    originSwitch.click();
    await fixture.whenStable();
    expect(marker()).toBeNull();
  });

  it('opens the character editor for a new character with the "+" in the quick access bar', () => {
    host
      .querySelector<HTMLElement>('.general-quick-access button[aria-label="Neuer Charakter"]')!
      .click();

    expect(openCreate).toHaveBeenCalledExactlyOnceWith();
    expect(openEdit).not.toHaveBeenCalled();
  });

  it('a click on a legend value asks the damage service without selecting the token', async () => {
    const legendEntry: Element = host.querySelector('app-dungeon-legend-entry') as Element;
    (legendEntry.querySelector('button[aria-label="Schaden auf Leben"]') as HTMLElement).click();
    await fixture.whenStable();

    expect(requestDamage).toHaveBeenCalledExactlyOnceWith(
      createTestCharacter('a'),
      DamageTypes.Critical,
    );
    expect(host.querySelectorAll('.dungeon-token--selected')).toHaveLength(0);
  });

  it('shows changed health and armor immediately at token and legend', async () => {
    const hit: CharacterInfo = { ...createTestCharacter('a'), health: 3, armor: 0 };
    TestBed.inject(CharactersDbService).writeCharacter(hit);
    await fixture.whenStable();

    for (const selector of ['.dungeon-token', 'app-dungeon-legend-entry']) {
      const scope: Element | null = host.querySelector(selector);
      expect(scope?.querySelector('[aria-label="Leben"]')?.textContent?.trim()).toBe('3');
      expect(scope?.querySelector('[aria-label="Rüstung"]')?.textContent?.trim()).toBe('0');
    }
  });
});
