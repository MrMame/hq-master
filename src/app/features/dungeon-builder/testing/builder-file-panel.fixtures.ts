import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, Mock, vi } from 'vitest';

import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { FileTransferService } from '../../../shared/services/file-transfer.service';
import { BuilderFilePanel } from '../components/builder-file-panel/builder-file-panel';
import { LayoutImageService } from '../services/layout-image.service';
import {
  BuilderServices,
  builderProviders,
  injectBuilderServices,
} from './builder-services.fixtures';

export interface FilePanelSetup {
  fixture: ComponentFixture<BuilderFilePanel>;
  host: HTMLElement;
  services: BuilderServices;
  /** Rückfrage; Standard: bestätigt. */
  confirm: Mock<() => Promise<boolean>>;
  download: Mock;
  /** JPEG-Export; Standard: liefert ein JPEG-Blob. */
  exportJpeg: Mock<() => Promise<Blob>>;
  /** Text der Meldung mit `data-testid` (leer, wenn sie fehlt). */
  message: (testId: string) => string;
  /** Wählt eine Datei mit diesem Inhalt im Laden-Feld und wartet, bis sie verarbeitet ist. */
  selectFile: (content: string) => Promise<void>;
}

/** Rendert den Datei-Bereich mit gemockter Rückfrage, Download und JPEG-Export. */
export function setupFilePanel(): FilePanelSetup {
  const confirm: Mock<() => Promise<boolean>> = vi.fn(() => Promise.resolve(true));
  const download: Mock = vi.fn();
  const exportJpeg: Mock<() => Promise<Blob>> = vi.fn(() =>
    Promise.resolve(new Blob(['jpeg'], { type: 'image/jpeg' })),
  );
  TestBed.configureTestingModule({
    imports: [BuilderFilePanel],
    providers: [
      ...builderProviders(),
      { provide: ConfirmationService, useValue: { confirm } },
      { provide: LayoutImageService, useValue: { exportJpeg } },
      {
        provide: FileTransferService,
        useValue: { download, readText: (file: File): Promise<string> => file.text() },
      },
    ],
  });
  const fixture: ComponentFixture<BuilderFilePanel> = TestBed.createComponent(BuilderFilePanel);
  const host: HTMLElement = fixture.nativeElement as HTMLElement;
  const services: BuilderServices = injectBuilderServices();
  services.layout.rename('Gruft des Hexers');
  fixture.detectChanges();

  const message: (testId: string) => string = (testId: string): string =>
    host.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim() ?? '';

  async function selectFile(content: string): Promise<void> {
    const input: HTMLInputElement = host.querySelector('[data-testid="load-layout"]')!;
    Object.defineProperty(input, 'files', {
      value: [new File([content], 'gruft.xml')],
      configurable: true,
    });
    input.dispatchEvent(new Event('change'));
    await vi.waitFor(() => expect(input.value).toBe(''));
    await fixture.whenStable();
  }

  return { fixture, host, services, confirm, download, exportJpeg, message, selectFile };
}
