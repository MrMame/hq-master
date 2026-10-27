import { Injectable } from '@angular/core';
import { SessionSnapshot } from '../models/session-snapshot.model';
import { readCharacters, writeCharacters } from '../xml/characters.xml-mapper';
import { readDeck, writeDeck } from '../xml/deck.xml-mapper';
import { readDungeonBoard, writeDungeonBoard } from '../xml/dungeon.xml-mapper';
import { readGameTime, writeGameTime } from '../xml/game-time.xml-mapper';
import { readMeta, writeMeta } from '../xml/meta.xml-mapper';
import { indentXml, requireChild } from '../../../shared/utils/xml.util';

const ROOT_ELEMENT: string = 'gameSession';
const FORMAT_VERSION: string = '1';
const XML_DECLARATION: string = '<?xml version="1.0" encoding="UTF-8"?>';
/** Dateiart in den Fehlermeldungen beim Laden. */
const FILE_KIND: string = 'Session-Datei';

/** Wandelt einen `SessionSnapshot` in eine SaveSession-XML-Datei um und zurück. */
@Injectable({
  providedIn: 'root',
})
export class SessionXmlService {
  serialize(snapshot: SessionSnapshot): string {
    const doc: XMLDocument = document.implementation.createDocument(null, ROOT_ELEMENT, null);
    const root: Element = doc.documentElement;
    root.setAttribute('version', FORMAT_VERSION);
    root.append(
      writeMeta(doc, snapshot.meta),
      writeGameTime(doc, snapshot.gameTime),
      writeCharacters(doc, snapshot.characters),
      writeDungeonBoard(doc, snapshot.dungeon),
      writeDeck(doc, snapshot.deck),
    );
    indentXml(root);
    return `${XML_DECLARATION}\n${new XMLSerializer().serializeToString(doc)}\n`;
  }

  /** @throws Error mit verständlicher Meldung, wenn die Datei kein gültiger Spielstand ist. */
  parse(xml: string): SessionSnapshot {
    const root: Element = this.parseRoot(xml);
    return {
      meta: readMeta(requireChild(root, 'meta', FILE_KIND)),
      gameTime: readGameTime(requireChild(root, 'gameTime', FILE_KIND)),
      characters: readCharacters(requireChild(root, 'characters', FILE_KIND)),
      dungeon: readDungeonBoard(requireChild(root, 'dungeonBoard', FILE_KIND)),
      deck: readDeck(requireChild(root, 'cardDeck', FILE_KIND)),
    };
  }

  private parseRoot(xml: string): Element {
    const doc: Document = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Ungültige Session-Datei: XML konnte nicht gelesen werden.');
    }
    const root: Element = doc.documentElement;
    if (root.tagName !== ROOT_ELEMENT) {
      throw new Error(`Ungültige Session-Datei: Wurzelelement <${ROOT_ELEMENT}> fehlt.`);
    }
    const version: string | null = root.getAttribute('version');
    if (version !== FORMAT_VERSION) {
      throw new Error(`Nicht unterstützte Session-Version: ${version ?? 'keine'}.`);
    }
    return root;
  }
}
