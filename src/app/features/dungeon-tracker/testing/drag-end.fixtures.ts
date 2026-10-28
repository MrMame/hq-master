import { CdkDragEnd } from '@angular/cdk/drag-drop';

/**
 * Ende eines CDK-Drags mit der Zugstrecke in Bildschirm-Pixeln (nur für Specs). Ein echter Drag lässt
 * sich in jsdom nicht erzeugen (keine Layout-Maße); das Event-Objekt ist daher ein Stub, ausgelöst
 * wird es aber über die Template-Bindung `(cdkDragEnded)`.
 */
export function createDragEnd(x: number, y: number, reset: () => void): CdkDragEnd {
  return { source: { getFreeDragPosition: () => ({ x, y }), reset } } as unknown as CdkDragEnd;
}
