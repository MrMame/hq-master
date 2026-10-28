import {
  Component,
  computed,
  inject,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { BuilderTool } from '../../models/builder-tool.model';
import { ElementCatalog } from '../../models/element-catalog.model';
import {
  FLOOR_GROUP_KEY,
  LibraryDrag,
  LibraryGroup,
  ROCK_ID,
} from '../../models/library-entry.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { ElementCatalogService } from '../../services/element-catalog.service';
import { RecentElementsService } from '../../services/recent-elements.service';
import { floorGroup, pieceGroups, recentGroup } from '../../utils/library-groups.util';
import { filterGroups, isSearching } from '../../utils/library-search.util';
import { LibraryGroupSection } from '../library-group-section/library-group-section';
import { LibrarySearch } from '../library-search/library-search';

/**
 * Bibliothek in der Seitenleiste: Suche, „Zuletzt verwendet“, Bodenarten zum Malen sowie Türen und Möbel
 * zum Ziehen auf den Plan oder als Stempel per Tipp. Ziehen meldet die Zeigerposition; platziert wird von der Seite.
 */
@Component({
  selector: 'app-element-library',
  imports: [LibraryGroupSection, LibrarySearch],
  templateUrl: './element-library.html',
  styleUrl: './element-library.css',
})
export class ElementLibrary {
  protected readonly ui: BuilderUiService = inject(BuilderUiService);
  private readonly catalogService: ElementCatalogService = inject(ElementCatalogService);
  private readonly recentIds: Signal<string[]> = inject(RecentElementsService).recentIds;

  protected readonly catalog: Signal<ElementCatalog | null> = this.catalogService.catalog;
  protected readonly loadError: Signal<string | null> = this.catalogService.loadError;
  protected readonly floorGroupKey: string = FLOOR_GROUP_KEY;

  /** Suchbegriff; reiner UI-Zustand. */
  protected readonly search: WritableSignal<string> = signal<string>('');
  protected readonly searching: Signal<boolean> = computed(() => isSearching(this.search()));

  /** Zeiger beim Ziehen über die Seite (für die Vorschau auf dem Plan). */
  readonly dragMoved: OutputEmitterRef<LibraryDrag> = output<LibraryDrag>();
  /** Zeiger beim Loslassen. */
  readonly dropped: OutputEmitterRef<LibraryDrag> = output<LibraryDrag>();

  /** Türen und Möbelgruppen in Katalog-Reihenfolge (ohne Katalog keine Gruppen). */
  private readonly pieceGroups: Signal<LibraryGroup[]> = computed(() => {
    const catalog: ElementCatalog | null = this.catalog();
    return catalog ? pieceGroups(catalog) : [];
  });

  /** Boden und Möbelgruppen, bei einer Suche nur die Treffer. */
  protected readonly shownGroups: Signal<LibraryGroup[]> = computed(() => {
    const catalog: ElementCatalog | null = this.catalog();
    if (!catalog) return [];
    return filterGroups([floorGroup(catalog), ...this.pieceGroups()], this.search());
  });

  /** „Zuletzt verwendet“; ausgeblendet, solange leer oder gesucht wird. */
  protected readonly recent: Signal<LibraryGroup | null> = computed(() => {
    if (this.searching()) return null;
    const group: LibraryGroup = recentGroup(this.pieceGroups(), this.recentIds());
    return group.items.length > 0 ? group : null;
  });

  protected readonly activeStamp: Signal<string | null> = computed(() => {
    const tool: BuilderTool = this.ui.tool();
    return tool.kind === 'stamp' ? tool.catalogId : null;
  });

  protected readonly activeFloor: Signal<string> = computed(() => this.ui.floorId() ?? ROCK_ID);

  /** Bodenart wählen bzw. Tür oder Möbel als Stempel. */
  protected onPicked(groupKey: string, id: string): void {
    if (groupKey !== FLOOR_GROUP_KEY) {
      this.ui.toggleStamp(id);
      return;
    }
    this.ui.chooseFloor(id === ROCK_ID ? null : id);
  }
}
