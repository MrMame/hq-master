import { Component, signal } from '@angular/core';
import {
  CdkDrag,             // Direktive: macht ein Element ziehbar
  CdkDropList,         // Direktive: definiert eine Ablagezone
  CdkDragDrop,         // Event-Typ: enthält alle Drag-Infos beim Loslassen (nur als Type-Import)
  CdkDragPreview,      // Direktive: benutzerdefiniertes Vorschaubild beim Ziehen
  CdkDragPlaceholder,  // Direktive: was am Original-Ort sichtbar bleibt
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-test-page',
  imports: [CdkDrag, CdkDropList, CdkDragPreview, CdkDragPlaceholder],
  templateUrl: './drag-test-page.html',
  styleUrl: './drag-test-page.scss',
})
export class DragTestPage {
  /** Ob das rote Viereck bereits in den Eimer geworfen wurde */
  public dropped = signal(false);

  /** Wird aufgerufen, wenn ein Element auf einer cdkDropList losgelassen wird */
  public onDrop(event: CdkDragDrop<string>): void {
    // event.previousContainer: die Liste, aus der gezogen wurde
    // event.container: die Liste, auf der losgelassen wurde
    // Da wir nur ein Element haben, reicht ein einfaches Flag
    if (event.previousContainer !== event.container) {
      this.dropped.set(true);
    }
  }

  /** Setzt die Demo zurück */
  public reset(): void {
    this.dropped.set(false);
  }
}
