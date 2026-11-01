import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveConditionsList } from './active-conditions-list';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import {
  afterStart,
  createConditionedCharacter,
  createTestCondition,
} from '../../../../core/testing/condition.fixtures';

describe('ActiveConditionsList', () => {
  let fixture: ComponentFixture<ActiveConditionsList>;
  let host: HTMLElement;
  let charactersDb: CharactersDbService;

  const rows: () => string[][] = () =>
    Array.from(host.querySelectorAll('[data-testid="active-condition-row"]')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? ''),
    );

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [ActiveConditionsList] });
    TestBed.inject(GameTimeService).restore(afterStart(30));
    charactersDb = TestBed.inject(CharactersDbService);
    fixture = TestBed.createComponent(ActiveConditionsList);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('shows "Keine aktiven Zustände" without conditions', () => {
    expect(host.textContent).toContain('Keine aktiven Zustände');
    expect(host.querySelector('table')).toBeNull();
  });

  it('lists the conditions of all characters sorted by the next tick', async () => {
    charactersDb.writeCharacter({
      ...createConditionedCharacter('a', [
        createTestCondition({ id: 'dazed', intervalSeconds: 0, damagePerTick: 0 }),
      ]),
      name: 'Ork',
    });
    charactersDb.writeCharacter({ ...createConditionedCharacter('b'), name: 'Elf' });
    await fixture.whenStable();

    expect(rows()).toEqual([
      ['Elf', 'Gift', '1', '12:01:00', '9:30'],
      ['Ork', 'Benommen', '0', '–', '9:30'],
    ]);
    expect(host.querySelector('img')?.getAttribute('src')).toContain('poison.svg');
    expect(host.textContent).not.toContain('Keine aktiven Zustände');
  });

  it('updates next tick and remaining time after a time step', async () => {
    charactersDb.writeCharacter({ ...createConditionedCharacter('b'), name: 'Elf' });
    TestBed.inject(GameTimeService).addTime({ seconds: 15 });
    await fixture.whenStable();

    expect(rows()[0].slice(3)).toEqual(['12:01:00', '9:15']);
  });
});
