import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { SidebarSection } from '../../../../shared/components/sidebar-section/sidebar-section';
import { LibraryDrag, LibraryGroup } from '../../models/library-entry.model';
import { LibraryEntry } from '../library-entry/library-entry';

/**
 * Aufklappbare Gruppe der Bibliothek. Ein Tipp auf einen Eintrag meldet ihn (`picked`), ziehbare Einträge
 * melden außerdem die Zeigerposition beim Ziehen; was daraus wird, entscheidet die Bibliothek bzw. die Seite.
 */
@Component({
  selector: 'app-library-group-section',
  imports: [CdkDrag, LibraryEntry, SidebarSection],
  templateUrl: './library-group-section.html',
  styleUrl: './library-group-section.css',
})
export class LibraryGroupSection {
  readonly group: InputSignal<LibraryGroup> = input.required<LibraryGroup>();
  /** Hervorgehobener Eintrag (aktiver Stempel bzw. gewählte Bodenart). */
  readonly activeId: InputSignal<string | null> = input<string | null>(null);
  /** Türen und Möbel lassen sich auf den Plan ziehen, Bodenarten nicht. */
  readonly draggable: InputSignal<boolean> = input<boolean>(true);
  /** Hält die Gruppe offen, z. B. bei Suchtreffern. */
  readonly forceExpanded: InputSignal<boolean> = input<boolean>(false);

  readonly picked: OutputEmitterRef<string> = output<string>();
  /** Zeiger beim Ziehen über die Seite (für die Vorschau auf dem Plan). */
  readonly dragMoved: OutputEmitterRef<LibraryDrag> = output<LibraryDrag>();
  /** Zeiger beim Loslassen. */
  readonly dropped: OutputEmitterRef<LibraryDrag> = output<LibraryDrag>();

  /** Am Tablet erst nach kurzem Halten ziehen, damit die Liste weiter per Wischen scrollt. */
  protected readonly dragDelay: { touch: number; mouse: number } = { touch: 250, mouse: 0 };

  protected readonly sectionId: Signal<string> = computed(
    () => `dungeon-builder.library.${this.group().key}`,
  );

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
