import { DOCUMENT, inject, Injectable } from '@angular/core';

/** Datei-Ein-/Ausgabe für SaveSession-Dateien im Browser. */
@Injectable({
  providedIn: 'root',
})
export class SessionFileService {
  private readonly document: Document = inject(DOCUMENT);

  download(content: string, fileName: string): void {
    const blob: Blob = new Blob([content], { type: 'application/xml' });
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
