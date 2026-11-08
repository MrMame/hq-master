import { Card } from '../../core/models/card.model';
import {
  formatBase,
  StatBonusView,
  statBonusView,
  statBreakdownOf,
  statBreakdownText,
  StatField,
  statField,
  storedValue,
} from './stat-bonus.util';
import { CharacterInfo } from '../../core/models/character-info.model';
import { createTestCharacter } from '../../core/testing/character.fixtures';
import { createPropertyCard, RUNE_ARMOR, TOWER_SHIELD } from '../../core/testing/deck.fixtures';

const BOOTS: Card = createPropertyCard('e9', 'Stiefel', [{ name: 'Tempo', value: 2 }]);
const MAIL: Card = createPropertyCard('e8', 'Kettenhemd', [{ name: 'Leben', value: 30 }]);

// Grundwerte: Leben 12, Ruestung 2, Tempo 5.
const character: CharacterInfo = createTestCharacter('a');
const cards: Card[] = [RUNE_ARMOR, TOWER_SHIELD];

describe('statBonusView', () => {
  it('shows a positive Tempo bonus with base, effective value and sources', () => {
    expect(statBonusView(character, [BOOTS], 'Tempo')).toEqual({
      base: 5,
      amount: 2,
      bonus: '+2',
      effective: 7,
      sources: 'Stiefel +2',
      positive: true,
    });
  });

  it('marks a negative bonus and never shows Tempo below 0', () => {
    expect(statBonusView(character, cards, 'Tempo')).toMatchObject({
      bonus: '−1',
      effective: 4,
      positive: false,
    });
    const slow: Card = createPropertyCard('e7', 'Kette', [{ name: 'Tempo', value: -9 }]);
    expect(statBonusView(character, [slow], 'Tempo')?.effective).toBe(0);
  });

  it('derives the base of Leben and Ruestung from the stored effective value', () => {
    expect(statBonusView({ ...character, Leben: 50 }, [MAIL], 'Leben')).toMatchObject({
      base: 20,
      bonus: '+30',
      effective: 50,
      sources: 'Kettenhemd +30',
    });
    expect(statBonusView({ ...character, Ruestung: 6 }, cards, 'Ruestung')).toMatchObject({
      base: 4,
      effective: 6,
    });
  });

  it('shows a negative base after damage', () => {
    expect(statBonusView({ ...character, Leben: 10 }, [MAIL], 'Leben')?.base).toBe(-20);
  });

  it('shows nothing without a card changing the value', () => {
    expect(statBonusView(character, [], 'Tempo')).toBeNull();
    expect(statBonusView(character, cards, 'Leben')).toBeNull();
  });
});

describe('statBreakdownText', () => {
  it('names base, bonus, effective value and sources', () => {
    const view: StatBonusView = statBonusView({ ...character, Leben: 10 }, [MAIL], 'Leben')!;
    expect(statBreakdownText('Leben', view)).toBe('Leben: −20 +30 = 10 (Kettenhemd +30)');
  });

  it('is built from the active cards or missing without bonus', () => {
    expect(statBreakdownOf({ ...character, Leben: 50 }, [MAIL], 'Leben')).toBe(
      'Leben: 20 +30 = 50 (Kettenhemd +30)',
    );
    expect(statBreakdownOf(character, [MAIL], 'Ruestung')).toBeNull();
  });

  it('formats a positive base without sign', () => {
    expect(formatBase(20)).toBe('20');
    expect(formatBase(0)).toBe('0');
  });
});

describe('statField', () => {
  it('shows Leben without the cards and allows a negative base down to the bonus', () => {
    const field: StatField = statField({ ...character, Leben: 50 }, [MAIL], 'Leben');
    expect(field).toMatchObject({ key: 'Leben', value: 20, min: -30, offset: 30 });
    expect(field.bonus?.effective).toBe(50);
    expect(storedValue(field, 25)).toBe(55);
  });

  it('requires a higher base when cards lower Leben', () => {
    const curse: Card = createPropertyCard('e6', 'Fluch', [{ name: 'Leben', value: -5 }]);
    expect(statField({ ...character, Leben: 3 }, [curse], 'Leben')).toMatchObject({
      value: 8,
      min: 5,
    });
  });

  it('stores Tempo as entered and allows no negative base', () => {
    const field: StatField = statField(character, [BOOTS], 'Tempo');
    expect(field).toMatchObject({ value: 5, min: 0, offset: 0 });
    expect(storedValue(field, 6)).toBe(6);
  });

  it('keeps an invalid entry and shows no breakdown for it', () => {
    const empty: CharacterInfo = { ...character, Leben: null as unknown as number };
    const field: StatField = statField(empty, [MAIL], 'Leben');
    expect(field.value).toBeNull();
    expect(field.bonus).toBeNull();
    expect(storedValue(field, Number.NaN)).toBeNaN();
  });

  it('shows the stored value without cards', () => {
    expect(statField(character, [], 'Ruestung')).toMatchObject({ value: 2, min: 0, bonus: null });
  });
});
