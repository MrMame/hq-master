import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonLegendEntry } from './dungeon-legend-entry';
import { BoardToken } from '../../models/board-token.model';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import {
  afterStart,
  createConditionedCharacter,
} from '../../../../core/testing/condition.fixtures';

describe('DungeonLegendEntry – conditions', () => {
  let fixture: ComponentFixture<DungeonLegendEntry>;
  let host: HTMLElement;

  const render: (token: BoardToken) => void = (token: BoardToken): void => {
    fixture.componentRef.setInput('token', token);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonLegendEntry] });
    TestBed.inject(GameTimeService).restore(afterStart(150));
    fixture = TestBed.createComponent(DungeonLegendEntry);
    host = fixture.nativeElement as HTMLElement;
  });

  it('shows a second row below the name with icon and remaining time per condition', () => {
    render({
      position: { characterId: 'a', col: 0, row: 0 },
      character: createConditionedCharacter('a'),
    });

    const row: HTMLElement = host.querySelector('.legend-entry__conditions') as HTMLElement;
    expect(row.previousElementSibling?.classList).toContain('legend-entry__row');
    expect(row.querySelector('[aria-label="Gift – noch 7:30"]')?.textContent?.trim()).toBe('7:30');
  });

  it('shows no second row without conditions', () => {
    render({ position: { characterId: 'a', col: 0, row: 0 }, character: createTestCharacter('a') });

    expect(host.querySelector('.legend-entry__conditions')).toBeNull();
  });
});
