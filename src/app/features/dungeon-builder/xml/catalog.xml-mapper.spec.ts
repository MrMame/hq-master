import { parseXmlRoot } from '../../../shared/utils/xml.util';
import { DEFAULT_APPEARANCE, ElementCatalog } from '../models/element-catalog.model';
import { readCatalog } from './catalog.xml-mapper';

function read(xml: string): ElementCatalog {
  return readCatalog(parseXmlRoot(xml, 'catalog'));
}

describe('catalog.xml-mapper', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads appearance, floors, doors and piece groups in file order', () => {
    const catalog: ElementCatalog = read(`
      <catalog version="1">
        <appearance rockColor="#111111" wallColor="#222222" wallThickness="0.3"/>
        <floors><floor id="room" name="Raumboden" image="e/room.svg"/></floors>
        <doors><door id="door" name="Tür" image="e/door.svg"/></doors>
        <pieces category="Grundmöbel">
          <piece id="table" name="Tisch" width="3" height="2" image="e/table.svg"/>
        </pieces>
        <pieces category="Hindernisse">
          <piece id="rubble" name="Schutt" image="e/rubble.svg">
            <cell col="0" row="0"/><cell col="0" row="1"/><cell col="1" row="1"/>
          </piece>
        </pieces>
      </catalog>`);

    expect(catalog.appearance).toEqual({
      rockColor: '#111111',
      wallColor: '#222222',
      wallThickness: 0.3,
    });
    expect(catalog.floors).toEqual([{ id: 'room', name: 'Raumboden', image: 'e/room.svg' }]);
    expect(catalog.doors.map((d) => d.id)).toEqual(['door']);
    expect(catalog.categories.map((c) => c.name)).toEqual(['Grundmöbel', 'Hindernisse']);
    expect(catalog.categories[0].pieces[0]).toMatchObject({ width: 3, height: 2 });
    expect(catalog.categories[0].pieces[0].cells).toHaveLength(6);
    expect(catalog.categories[1].pieces[0]).toMatchObject({ width: 2, height: 2 });
    expect(catalog.categories[1].pieces[0].cells).toHaveLength(3);
  });

  it('uses defaults for missing appearance, names and empty groups', () => {
    const catalog: ElementCatalog = read(
      '<catalog><floors><floor id="room" image="r.svg"/><floor id="hall" name="" image="h.svg"/></floors><pieces/></catalog>',
    );

    expect(catalog.appearance).toEqual(DEFAULT_APPEARANCE);
    expect(catalog.floors.map((f) => f.name)).toEqual(['room', 'hall']);
    expect(catalog.doors).toEqual([]);
    expect(catalog.categories).toEqual([{ name: 'Elemente', pieces: [] }]);
    expect(read('<catalog><appearance/></catalog>').appearance).toEqual(DEFAULT_APPEARANCE);
  });

  it.each<[string, string]>([
    ['missing id', '<piece image="a.svg"/>'],
    ['missing image', '<piece id="a"/>'],
    ['invalid size', '<piece id="a" image="a.svg" width="0" height="2"/>'],
    ['broken size', '<piece id="a" image="a.svg" width="1.5"/>'],
    [
      'not connected',
      '<piece id="a" image="a.svg"><cell col="0" row="0"/><cell col="1" row="1"/></piece>',
    ],
    ['not starting at 0,0', '<piece id="a" image="a.svg"><cell col="1" row="0"/></piece>'],
    [
      'duplicate cells',
      '<piece id="a" image="a.svg"><cell col="0" row="0"/><cell col="0" row="0"/></piece>',
    ],
  ])('skips a piece with %s and warns', (_case, piece) => {
    const catalog: ElementCatalog = read(
      `<catalog><pieces category="G">${piece}</pieces></catalog>`,
    );

    expect(catalog.categories[0].pieces).toEqual([]);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('keeps only the first entry of a duplicate id', () => {
    const catalog: ElementCatalog = read(`
      <catalog>
        <floors><floor id="a" image="a.svg"/></floors>
        <doors><door id="a" image="b.svg"/></doors>
      </catalog>`);

    expect(catalog.floors).toHaveLength(1);
    expect(catalog.doors).toEqual([]);
  });
});
