import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, computed, inject, output, OutputEmitterRef, Signal } from '@angular/core';
import { ElementCatalog } from '../../models/element-catalog.model';
import { LibraryDrag, LibraryGroup } from '../../models/library-entry.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { ElementCatalogService } from '../../services/element-catalog.service';
import { LibraryEntry } from '../library-entry/library-entry';

/**
 * Bibliothek in der Seitenleiste: Bodenarten zum Malen, Türen und Möbel zum Ziehen auf den Plan
 * oder als Stempel per Tipp. Ziehen meldet die Zeigerposition; platziert wird von der Seite.
 */
@Component({
  selector: 'app-element-library',
  imports: [CdkDrag, LibraryEntry],
  templateUrl: './element-library.html',
  styleUrl: './element-library.css',
})
export class ElementLibrary {
  protected readonly ui: BuilderUiService = inject(BuilderUiService);
  private readonly catalogService: ElementCatalogService = inject(ElementCatalogService);

  protected readonly catalog: Signal<ElementCatalog | null> = this.catalogService.catalog;
  protected readonly loadError: Signal<string | null> = this.catalogService.loadError;
  /** Am Tablet erst nach kurzem Halten ziehen, damit die Liste weiter per Wischen scrollt. */
  protected readonly dragDelay: { touch: number; mouse: number } = { touch: 250, mouse: 0 };

  /** Zeiger beim Ziehen über die Seite (für die Vorschau auf dem Plan). */
  readonly dragMoved: OutputEmitterRef<LibraryDrag> = output<LibraryDrag>();
  /** Zeiger beim Loslassen. */
  readonly dropped: OutputEmitterRef<LibraryDrag> = output<LibraryDrag>();

  /** Türen und Möbelgruppen in Katalog-Reihenfolge. */
  protected readonly groups: Signal<LibraryGroup[]> = computed(() => {
    const catalog: ElementCatalog | null = this.catalog();
    if (!catalog) return [];
    const doors: LibraryGroup = {
      name: 'Türen',
      items: catalog.doors.map((door) => ({ ...door, size: '', label: door.name })),
    };
    const pieces: LibraryGroup[] = catalog.categories.map((category) => ({
      name: category.name,
      items: category.pieces.map((piece) => {
        const size: string = `${piece.width} × ${piece.height}`;
        return { ...piece, size, label: `${piece.name} (${size})` };
      }),
    }));
    return [doors, ...pieces].filter((group) => group.items.length > 0);
  });

  protected isStamp(catalogId: string): boolean {
    const tool: ReturnType<BuilderUiService['tool']> = this.ui.tool();
    return tool.kind === 'stamp' && tool.catalogId === catalogId;
  }

  protected onDragMoved(catalogId: string, event: CdkDragMove): void {
    this.dragMoved.emit({
      catalogId,
      clientX: event.pointerPosition.x,
      clientY: event.pointerPosition.y,
    });
  }

  /** Der Eintrag springt zurück in die Liste; das Element entsteht auf dem Plan. */
  protected onDragEnded(catalogId: string, event: CdkDragEnd): void {
    this.dropped.emit({ catalogId, clientX: event.dropPoint.x, clientY: event.dropPoint.y });
    event.source.reset();
  }
}
