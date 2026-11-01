import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonLegendEntry } from './dungeon-legend-entry';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonLegendEntry – moved this round', () => {
  let fixture: ComponentFixture<DungeonLegendEntry>;

  const render: (movedThisRound: boolean) => HTMLElement = (movedThisRound) => {
    fixture.componentRef.setInput('token', {
      position: { characterId: 'a', col: 0, row: 0 },
      character: { ...createTestCharacter('a'), movedThisRound },
    });
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonLegendEntry] });
    fixture = TestBed.createComponent(DungeonLegendEntry);
  });

  it('dims the avatar of a character that moved this round', () => {
    expect(render(true).classList).toContain('legend-entry--moved');
  });

  it('shows the avatar normally while the character has not moved', () => {
    expect(render(false).classList).not.toContain('legend-entry--moved');
  });
});
