import { TestBed } from '@angular/core/testing';

import { DungeonLayout } from '../models/dungeon-layout.model';
import { createTestLayout } from '../testing/builder.fixtures';
import { LayoutXmlService } from './layout-xml.service';

const LAYOUT: DungeonLayout = createTestLayout({
  name: 'Gruft des Hexers',
  floor: { '1,1': 'room', '2,1': 'corridor' },
  pieces: [
    { id: 't1', catalogId: 'table', col: 1, row: 1, rotation: 90 },
    { id: 'c1', catalogId: 'unbekannt', col: 4, row: 4, rotation: 0 },
  ],
  walls: [{ id: 'w1', x1: 0, y1: 1, x2: 4, y2: 1 }],
  doors: [{ id: 'd1', catalogId: 'door', x: 2, y: 1, rotation: 270 }],
});

describe('LayoutXmlService', () => {
  let service: LayoutXmlService;

  beforeEach(() => {
    service = TestBed.inject(LayoutXmlService);
  });

  it('should write a readable, versioned layout file', () => {
    const xml: string = service.serialize(LAYOUT);

    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<dungeonLayout version="1"/);
    expect(xml).toContain('name="Gruft des Hexers" columns="10" rows="8"');
    expect(xml).toContain('\n    <cell col="1" row="1" floor="room"/>');
    expect(xml).toContain('<piece id="t1" catalogId="table" col="1" row="1" rotation="90"/>');
  });

  it('should read back the same layout, including unknown catalog entries', () => {
    expect(service.parse(service.serialize(LAYOUT))).toEqual(LAYOUT);
  });

  it('should read an empty layout', () => {
    const empty: DungeonLayout = createTestLayout();
    expect(service.parse(service.serialize(empty))).toEqual(empty);
  });

  it.each<[string, string]>([
    ['<kaputt', 'Ungültige Layout-Datei: XML konnte nicht gelesen werden.'],
    ['<gameSession version="1"/>', 'Ungültige Layout-Datei: Wurzelelement <dungeonLayout> fehlt.'],
    ['<dungeonLayout version="2"/>', 'Nicht unterstützte Layout-Version: 2.'],
    ['<dungeonLayout/>', 'Nicht unterstützte Layout-Version: keine.'],
    [
      '<dungeonLayout version="1"><floor/><pieces/><doors/></dungeonLayout>',
      'Ungültige Layout-Datei: <walls> fehlt in <dungeonLayout>.',
    ],
  ])('should reject %s', (xml, message) => {
    expect(() => service.parse(xml)).toThrow(message);
  });

  it('should repair odd values: size limits, rotations, missing ids and floor names', () => {
    const layout: DungeonLayout = service.parse(
      `<dungeonLayout version="1" columns="99" rows="x">
        <floor><cell col="1" row="1"/></floor>
        <pieces><piece catalogId="table" col="1" row="1" rotation="45"/></pieces>
        <walls><wall x1="0" y1="0" x2="2" y2="0"/></walls>
        <doors><door catalogId="door" x="1" y="0"/></doors>
      </dungeonLayout>`,
    );

    expect([layout.name, layout.columns, layout.rows]).toEqual(['Neues Layout', 40, 19]);
    expect(layout.floor).toEqual({});
    expect(layout.pieces[0].rotation).toBe(0);
    expect([layout.pieces[0].id, layout.walls[0].id, layout.doors[0].id]).not.toContain('');
  });
});
