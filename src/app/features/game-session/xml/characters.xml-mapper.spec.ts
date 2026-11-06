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

  it('lowers current values above their maximum to the maximum', () => {
    const [character]: CharacterInfo[] = read(
      '<characters><character id="a" health="9" maxHealth="5" armor="4" maxArmor="2"/></characters>',
    );
    expect(character).toMatchObject({ health: 5, maxHealth: 5, armor: 2, maxArmor: 2 });
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
