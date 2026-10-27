import { DOCUMENT, inject, Injectable } from '@angular/core';

/** Datei-Ein-/Ausgabe im Browser: Herunterladen und Lesen von Dateien. */
@Injectable({
  providedIn: 'root',
})
export class FileTransferService {
  private readonly document: Document = inject(DOCUMENT);

  /** Ein `Blob` wird unverändert heruntergeladen, ein Text als `Blob` mit `mimeType`. */
  download(content: string | Blob, fileName: string, mimeType: string = 'application/xml'): void {
    const blob: Blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url: string = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = this.document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  readText(file: File): Promise<string> {
    return file.text();
  }
}
