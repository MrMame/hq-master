import { DOCUMENT, inject, Injectable } from '@angular/core';
import { DungeonLayout } from '../models/dungeon-layout.model';
import { ElementCatalog } from '../models/element-catalog.model';
import { RenderStep } from '../models/render-step.model';
import { drawStep, imageSources } from '../utils/canvas-draw.util';
import { exportSize, renderSteps } from '../utils/layout-render.util';

const JPEG_QUALITY: number = 0.9;

/** Zeichnet ein Layout ohne Raster und ohne Rand auf eine Canvas und liefert es als JPEG. */
@Injectable({
  providedIn: 'root',
})
export class LayoutImageService {
  private readonly document: Document = inject(DOCUMENT);

  /** @throws Error mit verständlicher Meldung, wenn eine Grafik fehlt oder kein Bild entsteht. */
  async exportJpeg(layout: DungeonLayout, catalog: ElementCatalog | null): Promise<Blob> {
    const size: ReturnType<typeof exportSize> = exportSize(layout.columns, layout.rows);
    const steps: RenderStep[] = renderSteps(layout, catalog, size.tile);
    const images: Map<string, CanvasImageSource> = await this.loadImages(imageSources(steps));

    const canvas: HTMLCanvasElement = this.document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) throw new Error('Das Bild konnte nicht erzeugt werden.');
    for (const step of steps) drawStep(context, step, images);
    return this.toJpeg(canvas);
  }

  private async loadImages(sources: string[]): Promise<Map<string, CanvasImageSource>> {
    const images: HTMLImageElement[] = await Promise.all(sources.map((src) => this.loadImage(src)));
    return new Map<string, CanvasImageSource>(sources.map((src, i) => [src, images[i]]));
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image: HTMLImageElement = this.document.createElement('img');
      image.onload = (): void => resolve(image);
      image.onerror = (): void => reject(new Error(`Grafik „${src}“ konnte nicht geladen werden.`));
      image.src = src;
    });
  }

  private toJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('Das Bild konnte nicht erzeugt werden.')),
        'image/jpeg',
        JPEG_QUALITY,
      ),
    );
  }
}
