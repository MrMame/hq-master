import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonToken } from './dungeon-token';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonToken – moved this round', () => {
  let fixture: ComponentFixture<DungeonToken>;
  let host: HTMLElement;

  const render: (movedThisRound: boolean, selected?: boolean) => HTMLElement = (
    movedThisRound,
    selected = false,
  ) => {
    const character: CharacterInfo = { ...createTestCharacter('a'), movedThisRound };
    fixture.componentRef.setInput('character', character);
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
    return host.querySelector('.dungeon-token') as HTMLElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonToken] });
    fixture = TestBed.createComponent(DungeonToken);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('position', { characterId: 'a', col: 0, row: 0 });
    fixture.componentRef.setInput('cellSize', 60);
    fixture.componentRef.setInput('tokenScale', 0.85);
  });

  it('shows the open (yellow) ring while the character has not moved', () => {
    expect(render(false).classList).not.toContain('dungeon-token--moved');
  });

  it('shows the grey ring once the character has moved', () => {
    expect(render(true).classList).toContain('dungeon-token--moved');
  });

  it('keeps the thick selection ring in grey for a selected, moved token', () => {
    const token: HTMLElement = render(true, true);

    expect(token.classList).toContain('dungeon-token--selected');
    expect(token.classList).toContain('dungeon-token--moved');
  });
});
