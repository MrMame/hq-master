import { layoutFileName } from './file-name.util';

describe('file-name.util', () => {
  it.each<[string, string]>([
    ['Gruft des Hexers', 'gruft-des-hexers.xml'],
    ['Höhle der Bären ß!', 'hoehle-der-baeren-ss.xml'],
    ['  ', 'dungeon-layout.xml'],
  ])('builds a file name from "%s"', (name, expected) => {
    expect(layoutFileName(name, 'xml')).toBe(expected);
  });

  it('uses the given extension', () => {
    expect(layoutFileName('Gruft', 'jpg')).toBe('gruft.jpg');
  });
});
