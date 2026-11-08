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

  it('writes neither a type attribute nor <ability> elements', () => {
    const doc: XMLDocument = document.implementation.createDocument(null, 'root', null);
    const el: Element = writeCharacters(doc, [createTestCharacter('a')]);
    const character: Element = el.querySelector('character') as Element;

    expect(character.hasAttribute('type')).toBe(false);
    expect(character.querySelector('ability')).toBeNull();
  });

  it('ignores the type and the abilities of older saves', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a" name="Alt" type="Feuer" health="4">' +
        '<description>Notiz</description><ability>Flammenwerfer</ability><ability>Windstoß</ability>' +
        '</character></characters>',
    );
    expect(character).toMatchObject({ id: 'a', name: 'Alt', health: 4, description: 'Notiz' });
    expect(character).not.toHaveProperty('type');
    expect(character).not.toHaveProperty('abilities');
  });

  it('reads older saves without conditions as an empty list', () => {
    expect(read('<characters><character id="a"/></characters>')[0].conditions).toEqual([]);
  });

  it('keeps the round flag in a round trip', () => {
    const moved: CharacterInfo = { ...createTestCharacter('a'), movedThisRound: true };
    expect(roundTrip([moved, createTestCharacter('b')])).toEqual([moved, createTestCharacter('b')]);
  });

  it('reads older saves without the round flag as not moved', () => {
    expect(read('<characters><character id="a"/></characters>')[0].movedThisRound).toBe(false);
  });

  it('keeps the maxima of health and armor in a round trip', () => {
    const hurt: CharacterInfo = { ...createTestCharacter('a'), health: 3, maxHealth: 10, armor: 0 };
    expect(roundTrip([hurt])).toEqual([hurt]);
  });

  it('reads older saves without maxima with the current values as maxima', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a" health="7" armor="3"/></characters>',
    );
    expect(character).toMatchObject({ health: 7, maxHealth: 7, armor: 3, maxArmor: 3 });
  });

  // Über dem Grundmaximum ist erlaubt (Ausrüstungsbonus); begrenzt wird mit den Modifikatoren im EquipmentSyncService.
  it('keeps current values above the base maximum and raises negative ones to 0', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a" health="9" maxHealth="5" armor="-1" maxArmor="2"/></characters>',
    );
    expect(character).toMatchObject({ health: 9, maxHealth: 5, armor: 0, maxArmor: 2 });
  });

  it('skips unknown conditions and falls back to startedAt for a missing lastTickAt', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a">' +
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
