import { Injectable } from '@angular/core';
import { indentXml, parseXmlRoot } from '../../../shared/utils/xml.util';
import { DungeonLayout } from '../models/dungeon-layout.model';
import { LAYOUT_FILE_KIND, readLayout, writeLayout } from '../xml/layout.xml-mapper';

const ROOT_ELEMENT: string = 'dungeonLayout';
const FORMAT_VERSION: string = '1';
const XML_DECLARATION: string = '<?xml version="1.0" encoding="UTF-8"?>';

/** Wandelt ein `DungeonLayout` in eine Layout-XML-Datei um und zurück. */
@Injectable({
  providedIn: 'root',
})
export class LayoutXmlService {
  serialize(layout: DungeonLayout): string {
    const doc: XMLDocument = document.implementation.createDocument(null, ROOT_ELEMENT, null);
    const root: Element = doc.documentElement;
    root.setAttribute('version', FORMAT_VERSION);
    writeLayout(root, layout);
    indentXml(root);
    return `${XML_DECLARATION}\n${new XMLSerializer().serializeToString(doc)}\n`;
  }

  /** @throws Error mit verständlicher Meldung, wenn die Datei kein gültiges Layout ist. */
  parse(xml: string): DungeonLayout {
    const root: Element = parseXmlRoot(xml, ROOT_ELEMENT, LAYOUT_FILE_KIND);
    const version: string | null = root.getAttribute('version');
    if (version !== FORMAT_VERSION) {
      throw new Error(`Nicht unterstützte Layout-Version: ${version ?? 'keine'}.`);
    }
    return readLayout(root);
  }
}
