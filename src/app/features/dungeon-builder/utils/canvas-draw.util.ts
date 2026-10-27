import { ImagePlacement, RenderStep } from '../models/render-step.model';

/** Platzhalter für Elemente ohne Katalogeintrag (Inhalt der Karte, daher kein CSS-Token). */
export const UNKNOWN_FILL: string = '#6b7280';
const UNKNOWN_TEXT: string = '#ffffff';

/** Quellen aller Bilder der Zeichenschritte, je einmal. */
export function imageSources(steps: RenderStep[]): string[] {
  return [...new Set<string>(steps.flatMap((step) => (step.kind === 'image' ? [step.src] : [])))];
}

function drawImage(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  placement: ImagePlacement,
): void {
  context.save();
  context.translate(placement.translateX, placement.translateY);
  context.rotate((placement.rotation * Math.PI) / 180);
  context.drawImage(image, placement.x, placement.y, placement.width, placement.height);
  context.restore();
}

/** Zeichnet einen Schritt auf die Canvas; Bilder müssen in `images` bereits geladen vorliegen. */
export function drawStep(
  context: CanvasRenderingContext2D,
  step: RenderStep,
  images: ReadonlyMap<string, CanvasImageSource>,
): void {
  switch (step.kind) {
    case 'rect':
      context.fillStyle = step.color;
      context.fillRect(step.x, step.y, step.width, step.height);
      return;
    case 'image': {
      const image: CanvasImageSource | undefined = images.get(step.src);
      if (image) drawImage(context, image, step.placement);
      return;
    }
    case 'line':
      context.strokeStyle = step.color;
      context.lineWidth = step.width;
      context.lineCap = 'square';
      context.beginPath();
      context.moveTo(step.x1, step.y1);
      context.lineTo(step.x2, step.y2);
      context.stroke();
      return;
    case 'unknown':
      context.fillStyle = UNKNOWN_FILL;
      context.fillRect(step.x, step.y, step.width, step.height);
      context.fillStyle = UNKNOWN_TEXT;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = `bold ${Math.min(step.width, step.height) * 0.7}px sans-serif`;
      context.fillText('?', step.x + step.width / 2, step.y + step.height / 2);
  }
}
