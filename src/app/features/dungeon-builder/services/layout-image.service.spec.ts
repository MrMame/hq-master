import { TestBed } from '@angular/core/testing';

import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout, TEST_CATALOG } from '../testing/builder.fixtures';
import { createFakeContext, FakeContext } from '../testing/canvas.fixtures';
import { LayoutImageService } from './layout-image.service';

const LAYOUT: DungeonLayout = createTestLayout({
  columns: 26,
  rows: 19,
  floor: { '1,1': 'room', '2,1': 'room' },
  pieces: [{ id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 90 }],
  walls: [{ id: 'w1', x1: 0, y1: 1, x2: 4, y2: 1 }],
  doors: [{ id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 0 }],
});

describe('LayoutImageService', () => {
  let service: LayoutImageService;
  let fake: FakeContext;
  let canvases: HTMLCanvasElement[];
  let loadedImages: string[];

  // jsdom lädt keine Bilder und hat keine Canvas: `src` meldet sofort `load` (oder `error` für
  // „kaputt“), `getContext` liefert die aufzeichnende Canvas, `toBlob` ein JPEG-Blob.
  beforeEach(() => {
    service = TestBed.inject(LayoutImageService);
    fake = createFakeContext();
    canvases = [];
    loadedImages = [];
    vi.spyOn(HTMLImageElement.prototype, 'src', 'set').mockImplementation(function (
      this: HTMLImageElement,
      value: string,
    ) {
      loadedImages.push(value);
      queueMicrotask(() =>
        value.includes('kaputt')
          ? this.onerror?.(new Event('error'))
          : this.onload?.(new Event('load')),
      );
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
      this: HTMLCanvasElement,
    ) {
      canvases.push(this);
      return fake.context;
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) =>
      callback(new Blob(['jpeg'], { type: 'image/jpeg' })),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should draw the layout at 64 px per tile and return a JPEG', async () => {
    const blob: Blob = await service.exportJpeg(LAYOUT, TEST_CATALOG);

    expect(blob.type).toBe('image/jpeg');
    expect([canvases[0].width, canvases[0].height]).toEqual([1664, 1216]);
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.9,
    );
  });

  it('should load each graphic once and draw all layers without grid', async () => {
    await service.exportJpeg(LAYOUT, TEST_CATALOG);

    expect(loadedImages).toEqual(['img/room.svg', 'img/table.svg', 'img/door.svg']);
    expect(fake.calls.fillRect).toHaveBeenCalledWith(0, 0, 1664, 1216);
    expect(fake.calls.drawImage).toHaveBeenCalledTimes(4);
    expect(fake.calls.rotate).toHaveBeenCalledWith(Math.PI / 2);
    expect(fake.calls.stroke).toHaveBeenCalledTimes(2);
    expect(fake.calls.fillText).not.toHaveBeenCalled();
  });

  it('should draw elements without catalog entry as placeholders', async () => {
    await service.exportJpeg(LAYOUT, null);

    expect(loadedImages).toEqual([]);
    expect(fake.calls.fillText).toHaveBeenCalledTimes(4);
  });

  it('should report a graphic that cannot be loaded', async () => {
    const broken: typeof TEST_CATALOG = {
      ...TEST_CATALOG,
      floors: [{ id: 'room', name: 'Raum', image: 'img/kaputt.svg' }],
    };
    await expect(service.exportJpeg(LAYOUT, broken)).rejects.toThrow(
      'Grafik „img/kaputt.svg“ konnte nicht geladen werden.',
    );
  });

  it('should report when the browser cannot create the image', async () => {
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementation((callback) => callback(null));
    await expect(service.exportJpeg(LAYOUT, TEST_CATALOG)).rejects.toThrow(
      'Das Bild konnte nicht erzeugt werden.',
    );

    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    await expect(service.exportJpeg(LAYOUT, TEST_CATALOG)).rejects.toThrow(
      'Das Bild konnte nicht erzeugt werden.',
    );
  });
});
