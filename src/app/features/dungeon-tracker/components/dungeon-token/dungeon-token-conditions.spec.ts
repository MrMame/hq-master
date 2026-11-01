import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonToken } from './dungeon-token';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import {
  afterStart,
  createConditionedCharacter,
} from '../../../../core/testing/condition.fixtures';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonToken – conditions', () => {
  let fixture: ComponentFixture<DungeonToken>;
  let host: HTMLElement;

  const render: (selected: boolean) => void = (selected: boolean): void => {
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
  };

  const conditions: (variant: string) => HTMLElement | null = (variant) =>
    host.querySelector(`app-character-conditions.character-conditions--${variant}`);

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonToken] });
    TestBed.inject(GameTimeService).restore(afterStart(150));
    fixture = TestBed.createComponent(DungeonToken);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('position', { characterId: 'a', col: 0, row: 0 });
    fixture.componentRef.setInput('cellSize', 60);
    fixture.componentRef.setInput('tokenScale', 0.85);
    fixture.componentRef.setInput('character', createConditionedCharacter('a'));
  });

  it('always shows the condition icons at the token with the remaining time as label', () => {
    render(false);

    const icons: HTMLElement = conditions('token') as HTMLElement;
    expect(icons.classList).toContain('dungeon-token__conditions');
    expect(icons.querySelector('[aria-label="Gift – noch 7:30"]')).not.toBeNull();
    expect(conditions('selected')).toBeNull();
  });

  it('lists the conditions with name below the values of the selected token', () => {
    render(true);

    const parts: string[] = Array.from(
      (host.querySelector('.dungeon-token') as HTMLElement).children,
    ).map((c) => c.tagName.toLowerCase());
    expect(parts.slice(1)).toEqual([
      'app-character-conditions',
      'app-character-status',
      'app-character-conditions',
      'app-character-action-bar',
    ]);
    expect(conditions('selected')?.textContent).toContain('Gift');
  });

  it('shows no conditions for a character without conditions', () => {
    fixture.componentRef.setInput('character', createTestCharacter('a'));
    render(true);

    expect(host.querySelector('app-character-conditions')).toBeNull();
  });
});
