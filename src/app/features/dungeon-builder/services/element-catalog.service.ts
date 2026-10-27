import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { parseXmlRoot } from '../../../shared/utils/xml.util';
import { ElementCatalog } from '../models/element-catalog.model';
import { readCatalog } from '../xml/catalog.xml-mapper';

/** Katalog der Bibliothek; relativ zur `base href`, damit er auch unter GitHub Pages lädt. */
export const CATALOG_URL: string = 'dungeon-builder/catalog.xml';

/** Lädt den Element-Katalog einmal beim Start und stellt ihn als Signal bereit. */
@Injectable({
  providedIn: 'root',
})
export class ElementCatalogService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly _catalog: WritableSignal<ElementCatalog | null> = signal<ElementCatalog | null>(
    null,
  );
  private readonly _loadError: WritableSignal<string | null> = signal<string | null>(null);

  /** `null`, solange der Katalog lädt oder wenn er nicht geladen werden konnte. */
  readonly catalog: Signal<ElementCatalog | null> = this._catalog.asReadonly();
  readonly loadError: Signal<string | null> = this._loadError.asReadonly();

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const xml: string = await firstValueFrom(
        this.http.get(CATALOG_URL, { responseType: 'text' }),
      );
      this._catalog.set(readCatalog(parseXmlRoot(xml, 'catalog', 'Katalog-Datei')));
    } catch (error: unknown) {
      console.warn('Katalog konnte nicht geladen werden.', error);
      this._loadError.set('Bibliothek konnte nicht geladen werden.');
    }
  }
}
