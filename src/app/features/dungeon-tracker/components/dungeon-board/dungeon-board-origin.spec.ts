import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonBoard } from './dungeon-board';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { FakeResizeObserver } from '../../testing/resize-observer.fixtures';

describe('DungeonBoard – grid origin', () => {
  let fixture: ComponentFixture<DungeonBoard>;
  let board: DungeonBoardService;
  let host: HTMLElement;
  let reported: (string | null)[];

  beforeEach(async () => {
    FakeResizeObserver.reset();
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    TestBed.inject(CharactersDbService).writeCharacter(createTestCharacter('a'));
    board = TestBed.inject(DungeonBoardService);
    board.updateGridSettings({ gridOffsetX: 100, gridOffsetY: 50 });
    fixture = TestBed.createComponent(DungeonBoard);
    host = fixture.nativeElement as HTMLElement;
    reported = [];
    fixture.componentInstance.selectionChange.subscribe((id) => reported.push(id));
    await fixture.whenStable();
    FakeResizeObserver.resizeAll(800, 900); // Maßstab 0.8
    fixture.componentRef.setInput('originMode', true);
    await fixture.whenStable();
  });

  afterEach(() => vi.unstubAllGlobals());

  const element: (selector: string) => HTMLElement = (selector: string): HTMLElement =>
    host.querySelector(selector) as HTMLElement;
  const marker: () => HTMLElement | null = (): HTMLElement | null =>
    host.querySelector('[data-testid="grid-origin"]');
  const gridPosition: () => string = (): string => element('.board__grid').style.backgroundPosition;
  const tokenLeft: () => string = (): string => element('.dungeon-token').style.left;

  const pointer: (type: string, x: number, y: number) => Promise<void> = async (
    type: string,
    x: number,
    y: number,
  ): Promise<void> => {
    (marker() as HTMLElement).setPointerCapture = vi.fn();
    marker()?.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true }));
    await fixture.whenStable();
  };

  it('shows the marker on the origin only in origin mode', async () => {
    expect(element('app-grid-origin-marker').style.left).toBe('100px');
    expect(element('app-grid-origin-marker').style.top).toBe('50px');

    fixture.componentRef.setInput('originMode', false);
    await fixture.whenStable();
    expect(marker()).toBeNull();
  });

  it('shows the marker also when the grid is hidden', async () => {
    board.updateGridSettings({ gridOpacity: 0 });
    await fixture.whenStable();
    expect(marker()).not.toBeNull();
  });

  it('moves grid and tokens with the marker and stores the origin when released', async () => {
    await pointer('pointerdown', 0, 0);
    await pointer('pointermove', 80, 40);

    // (80 px, 40 px) / 0.8 = (100, 50) Einheiten; Token-Porträt mittig im 60er-Feld: + 10
    expect(gridPosition()).toBe('200px 100px');
    expect(tokenLeft()).toBe('210px');
    expect(board.boardState().gridOffsetX).toBe(100);

    await pointer('pointerup', 80, 40);

    expect(board.boardState()).toMatchObject({ gridOffsetX: 200, gridOffsetY: 100 });
    expect(board.positions()).toEqual([{ characterId: 'a', col: 0, row: 0 }]);
    expect(gridPosition()).toBe('200px 100px');
  });

  it('converts the drag distance at zoom 200 %', async () => {
    fixture.componentRef.setInput('zoom', 2);
    await fixture.whenStable();

    await pointer('pointerdown', 0, 0);
    await pointer('pointerup', 160, -32);

    expect(board.boardState()).toMatchObject({ gridOffsetX: 200, gridOffsetY: 30 });
  });

  it('returns grid and tokens to the stored origin when the drag is cancelled', async () => {
    await pointer('pointerdown', 0, 0);
    await pointer('pointermove', 80, 40);
    await pointer('pointercancel', 80, 40);

    expect(gridPosition()).toBe('100px 50px');
    expect(tokenLeft()).toBe('110px');
    expect(board.boardState().gridOffsetX).toBe(100);
  });

  it('keeps the origin when the cell size changes afterwards', async () => {
    board.updateGridSettings({ gridCellSizePx: 38.46 });
    await fixture.whenStable();

    expect(gridPosition()).toBe('100px 50px');
    expect(element('.board__grid').style.backgroundSize).toBe('38.46px 38.46px');
  });

  it('neither pans the board nor clears the selection when the marker is dragged or clicked', async () => {
    // jsdom hat kein Layout: Client-Fläche und Pointer-Capture vorgeben (s. board-pan.spec.ts).
    const viewport: HTMLElement = element('.board');
    Object.defineProperty(viewport, 'clientWidth', { value: 400 });
    Object.defineProperty(viewport, 'clientHeight', { value: 300 });
    viewport.setPointerCapture = vi.fn();

    await pointer('pointerdown', 100, 100);
    await pointer('pointermove', 160, 100);
    await pointer('pointerup', 160, 100);
    marker()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();

    expect(viewport.setPointerCapture).not.toHaveBeenCalled();
    expect(reported).toEqual([]);
  });
});
