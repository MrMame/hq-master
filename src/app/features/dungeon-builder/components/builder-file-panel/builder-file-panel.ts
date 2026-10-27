import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ConfirmationService } from '../../../../shared/services/confirmation.service';
import { FileTransferService } from '../../../../shared/services/file-transfer.service';
import { DungeonLayout } from '../../models/dungeon-layout.model';
import { ElementCatalog } from '../../models/element-catalog.model';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';
import { ElementCatalogService } from '../../services/element-catalog.service';
import { LayoutImageService } from '../../services/layout-image.service';
import { LayoutXmlService } from '../../services/layout-xml.service';
import { isEmptyLayout, unknownElementCount } from '../../utils/element-placement.util';
import { layoutFileName } from '../../utils/file-name.util';

/** Neu, Laden, Als XML speichern und Als JPEG exportieren; Fehler erscheinen als Meldung. */
@Component({
  selector: 'app-builder-file-panel',
  templateUrl: './builder-file-panel.html',
  styleUrl: './builder-file-panel.css',
})
export class BuilderFilePanel {
  private readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);
  private readonly xmlService: LayoutXmlService = inject(LayoutXmlService);
  private readonly imageService: LayoutImageService = inject(LayoutImageService);
  private readonly fileTransfer: FileTransferService = inject(FileTransferService);
  private readonly confirmation: ConfirmationService = inject(ConfirmationService);
  private readonly catalog: Signal<ElementCatalog | null> = inject(ElementCatalogService).catalog;

  protected readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly exporting: WritableSignal<boolean> = signal<boolean>(false);
  /** Elemente, deren Katalogeintrag fehlt; sie bleiben erhalten und erscheinen grau. */
  protected readonly unknownCount: Signal<number> = computed(() =>
    unknownElementCount(this.layoutService.layout(), this.catalog()),
  );

  protected async onNew(): Promise<void> {
    if (!(await this.confirmDiscard())) return;
    this.layoutService.reset();
    this.errorMessage.set(null);
  }

  /** Bei einem Fehler bleibt das aktuelle Layout unverändert. */
  protected async onLoad(event: Event): Promise<void> {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const layout: DungeonLayout = this.xmlService.parse(await this.fileTransfer.readText(file));
      if (!(await this.confirmDiscard())) return;
      this.layoutService.replace(layout);
      this.errorMessage.set(null);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : String(error));
    }
  }

  protected onSaveXml(): void {
    const layout: DungeonLayout = this.layoutService.layout();
    this.fileTransfer.download(
      this.xmlService.serialize(layout),
      layoutFileName(layout.name, 'xml'),
    );
  }

  protected async onExportJpeg(): Promise<void> {
    const layout: DungeonLayout = this.layoutService.layout();
    this.exporting.set(true);
    try {
      const image: Blob = await this.imageService.exportJpeg(layout, this.catalog());
      this.fileTransfer.download(image, layoutFileName(layout.name, 'jpg'));
      this.errorMessage.set(null);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : String(error));
    } finally {
      this.exporting.set(false);
    }
  }

  /** Ein leeres Layout wird ohne Rückfrage ersetzt. */
  private confirmDiscard(): Promise<boolean> {
    if (isEmptyLayout(this.layoutService.layout())) return Promise.resolve(true);
    return this.confirmation.confirm({
      title: 'Layout verwerfen',
      message: 'Das aktuelle Layout wird ersetzt. Nicht gespeicherte Änderungen gehen verloren.',
      confirmLabel: 'Verwerfen',
    });
  }
}
