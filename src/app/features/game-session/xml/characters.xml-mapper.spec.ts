import { MockInstance } from 'vitest';
import { readCharacters, writeCharacters } from './characters.xml-mapper';
import { CharacterInfo } from '../../../core/models/character-info.model';
import { createTestCharacter } from '../../../core/testing/character.fixtures';
import {
  createConditionedCharacter,
  createTestCondition,
} from '../../../core/testing/condition.fixtures';

function roundTrip(characters: CharacterInfo[]): CharacterInfo[] {
  const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
  const xml: string = new XMLSerializer().serializeToString(writeCharacters(doc, characters));
  return readCharacters(new DOMParser().parseFromString(xml, 'application/xml').documentElement);
}

function read(xml: string): CharacterInfo[] {
  return readCharacters(new DOMParser().parseFromString(xml, 'application/xml').documentElement);
}

describe('characters.xml-mapper', () => {
  it('keeps characters with several conditions in a round trip', () => {
    const characters: CharacterInfo[] = [
      createConditionedCharacter('a', [
        createTestCondition({ lastTickAt: '2381-01-01T11:02:00.000Z' }),
        createTestCondition({ id: 'blind', intervalSeconds: 0, damagePerTick: 0 }),
      ]),
      createTestCharacter('b'),
    ];
    expect(roundTrip(characters)).toEqual(characters);
  });

  it('writes one <condition> element with a <description> per condition', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
    const el: Element = writeCharacters(doc, [createConditionedCharacter('a')]);
    const condition: Element = el.querySelector('character > condition') as Element;

    expect(condition.getAttribute('id')).toBe('poison');
    expect(condition.getAttribute('interval')).toBe('60');
    expect(condition.getAttribute('damage')).toBe('1');
    expect(condition.getAttribute('duration')).toBe('600');
    expect(condition.querySelector('description')?.textContent).toBe('Gift <&>');
  });

  it('writes neither type, maxima, attack, defense nor <ability> elements', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
    const el: Element = writeCharacters(doc, [createTestCharacter('a')]);
    const character: Element = el.querySelector('character') as Element;

    ['type', 'maxHealth', 'maxArmor', 'attack', 'defense'].forEach((attribute) =>
      expect(character.hasAttribute(attribute)).toBe(false),
    );
    expect(character.querySelector('ability')).toBeNull();
  });

  it('ignores the type and the abilities of older saves', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a" name="Alt" type="Feuer" Leben="4" Ruestung="0" Tempo="0">' +
        '<description>Notiz</description><ability>Flammenwerfer</ability><ability>Windstoß</ability>' +
        '</character></characters>',
    );
    expect(character).toMatchObject({ id: 'a', name: 'Alt', Leben: 4, description: 'Notiz' });
    expect(character).not.toHaveProperty('type');
    expect(character).not.toHaveProperty('abilities');
  });

  it('reads older saves without conditions as an empty list', () => {
    expect(
      read(`<characters><character id="a" Leben="1" Ruestung="0" Tempo="0"/></characters>`)[0]
        .conditions,
    ).toEqual([]);
  });

  it('keeps the round flag in a round trip', () => {
    const moved: CharacterInfo = { ...createTestCharacter('a'), movedThisRound: true };
    expect(roundTrip([moved, createTestCharacter('b')])).toEqual([moved, createTestCharacter('b')]);
  });

  it('reads older saves without the round flag as not moved', () => {
    expect(
      read(`<characters><character id="a" Leben="1" Ruestung="0" Tempo="0"/></characters>`)[0]
        .movedThisRound,
    ).toBe(false);
  });

  it('writes the fixed properties under their own names', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
    const el: Element = writeCharacters(doc, [createTestCharacter('a')]);
    const character: Element = el.querySelector('character') as Element;

    expect(['Leben', 'Ruestung', 'Tempo'].map((name) => character.getAttribute(name))).toEqual([
      '12',
      '2',
      '5',
    ]);
    ['health', 'armor', 'speed'].forEach((name) =>
      expect(character.hasAttribute(name)).toBe(false),
    );
  });

  it.each<[string, string]>([
    ['only the old names', 'health="7" armor="3" speed="5"'],
    ['no Tempo', 'Leben="7" Ruestung="3"'],
    ['a text in Leben', 'Leben="viel" Ruestung="3" Tempo="5"'],
  ])('drops a character with %s and warns', (_case, values) => {
    const warn: MockInstance<(...data: unknown[]) => void> = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const characters: CharacterInfo[] = read(
      `<characters><character id="old" ${values}/><character id="b" ${'Leben="1" Ruestung="0" Tempo="0"'}/></characters>`,
    );
    expect(characters.map((character) => character.id)).toEqual(['b']);
    expect(warn).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('„old“'));
    warn.mockRestore();
  });

  it('keeps Leben and Ruestung in a round trip', () => {
    const hurt: CharacterInfo = { ...createTestCharacter('a'), Leben: 3, Ruestung: 0 };
    expect(roundTrip([hurt])).toEqual([hurt]);
  });

  it('ignores maxima, attack and defense of older saves and raises negative values to 0', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a" Leben="9" maxHealth="5" Ruestung="-1" maxArmor="2" attack="3" defense="1" Tempo="4"/></characters>',
    );
    expect(character).toMatchObject({ Leben: 9, Ruestung: 0 });
    expect(Object.keys(character)).not.toContain('maxHealth');
    expect(Object.keys(character)).not.toContain('attack');
    expect(Object.keys(character)).not.toContain('defense');
  });

  it('skips unknown conditions and falls back to startedAt for a missing lastTickAt', () => {
    const [character]: CharacterInfo[] = read(
      `<characters><character id="a" Leben="1" Ruestung="0" Tempo="0">` +
        '<condition id="frozen"/>' +
        '<condition id="dazed" duration="30" startedAt="2381-01-01T11:00:00.000Z"/>' +
        '</character></characters>',
    );
    expect(character.conditions).toEqual([
      {
        id: 'dazed',
        intervalSeconds: 0,
        damagePerTick: 0,
        durationSeconds: 30,
        description: '',
        startedAt: '2381-01-01T11:00:00.000Z',
        lastTickAt: '2381-01-01T11:00:00.000Z',
      },
    ]);
  });
});
