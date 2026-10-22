import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DungeonBoard } from './dungeon-board';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { FakeResizeObserver } from '../../testing/resize-observer.fixtures';

describe('DungeonBoard', () => {
  let fixture: ComponentFixture<DungeonBoard>;
  let board: DungeonBoardService;
  let host: HTMLElement;

  beforeEach(async () => {
    FakeResizeObserver.reset();
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    TestBed.inject(CharactersDbService).writeCharacter(createTestCharacter('a'));
    board = TestBed.inject(DungeonBoardService);
    fixture = TestBed.createComponent(DungeonBoard);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    FakeResizeObserver.resizeAll(800, 900);
    await fixture.whenStable();
  });

  afterEach(() => vi.unstubAllGlobals());

  const element: (selector: string) => HTMLElement = (selector: string): HTMLElement =>
    host.querySelector(selector) as HTMLElement;

  const setZoom: (zoom: number) => Promise<void> = async (zoom: number): Promise<void> => {
    fixture.componentRef.setInput('zoom', zoom);
    await fixture.whenStable();
  };

  it('fits the whole 4:3 stage into the measured board at zoom 100%', () => {
    expect(element('.board__stage').style.width).toBe('1000px');
    expect(element('.board__stage').style.height).toBe('750px');
    expect(element('.board__stage').style.transform).toBe('scale(0.8)');
    expect(element('.board__sizer').style.width).toBe('800px');
    expect(element('.board__sizer').style.height).toBe('600px');
    expect(element('.board').classList).not.toContain('board--pannable');
  });

  it('enlarges the stage by the zoom and lets the board be panned', async () => {
    await setZoom(2);

    expect(element('.board__stage').style.transform).toBe('scale(1.6)');
    expect(element('.board__sizer').style.width).toBe('1600px');
    expect(element('.board').classList).toContain('board--pannable');
  });

  it('places grid and tokens on the stage and passes the scale to the tokens', async () => {
    await setZoom(2);
    const token: DungeonToken = fixture.debugElement.query(By.directive(DungeonToken))
      .componentInstance as DungeonToken;

    expect(element('.board__stage').querySelector('.board__grid')).not.toBeNull();
    expect(element('.board__stage').querySelector('app-dungeon-token')).not.toBeNull();
    expect(token.scale()).toBe(1.6);
  });

  it('draws the grid lines one screen pixel wide', async () => {
    await setZoom(2);
    // 1 / 1.6 = 0.625 Einheiten → transparent bis 60 - 0.625
    expect(element('.board__grid').style.backgroundImage).toContain('transparent 59.375px');
  });

  it('hides the grid at opacity 0', async () => {
    board.updateGridSettings({ gridOpacity: 0 });
    await fixture.whenStable();

    expect(element('.board__grid')).toBeNull();
  });

  it('takes the stage height from the loaded photo and forgets it with the photo', async () => {
    board.setBoardImage('data:image/png;base64,AAAA');
    await fixture.whenStable();
    const photo: HTMLImageElement = element('img[alt="Spielbrett"]') as HTMLImageElement;
    Object.defineProperty(photo, 'naturalWidth', { value: 1600 });
    Object.defineProperty(photo, 'naturalHeight', { value: 1000 });
    photo.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(element('.board__stage').style.height).toBe('625px');
    expect(host.textContent).not.toContain('Kein Spielbrett geladen');

    board.reset();
    await fixture.whenStable();
    expect(element('.board__stage').style.height).toBe('750px');
    expect(host.textContent).toContain('Kein Spielbrett geladen');
  });

  it('keeps the center of the visible area when the zoom changes', async () => {
    // jsdom hat kein Layout: Ausschnitt 400 × 300 einer Fläche, die sich mit dem Zoom verdoppelt.
    const viewport: HTMLElement = element('.board');
    let scrolledSize: [number, number] = [1000, 500];
    Object.defineProperty(viewport, 'clientWidth', { value: 400 });
    Object.defineProperty(viewport, 'clientHeight', { value: 300 });
    Object.defineProperty(viewport, 'scrollWidth', { get: () => scrolledSize[0] });
    Object.defineProperty(viewport, 'scrollHeight', { get: () => scrolledSize[1] });
    viewport.scrollLeft = 400; // Mitte bei (400 + 200) / 1000 = 0.6
    viewport.scrollTop = 50; // Mitte bei (50 + 150) / 500 = 0.4
    viewport.dispatchEvent(new Event('scroll'));

    scrolledSize = [2000, 1000];
    await setZoom(2);

    expect(viewport.scrollLeft).toBe(0.6 * 2000 - 200);
    expect(viewport.scrollTop).toBe(0.4 * 1000 - 150);
  });

  it('stops observing the board size when destroyed', () => {
    fixture.destroy();
    expect(FakeResizeObserver.instances[0].disconnect).toHaveBeenCalledTimes(1);
  });
});

describe('DungeonBoard – before the board is measured', () => {
  it('draws the grid with a line width of 1 instead of dividing by a zero scale', async () => {
    const fixture: ComponentFixture<DungeonBoard> = TestBed.createComponent(DungeonBoard);
    await fixture.whenStable();
    const grid: HTMLElement = (fixture.nativeElement as HTMLElement).querySelector(
      '.board__grid',
    ) as HTMLElement;
    expect(grid.style.backgroundImage).toContain('transparent 59px');
  });
});
