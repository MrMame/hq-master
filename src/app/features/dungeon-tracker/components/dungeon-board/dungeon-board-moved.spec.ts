import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DungeonBoard } from './dungeon-board';
import { DungeonToken } from '../dungeon-token/dungeon-token';
import { GridOriginMarker } from '../grid-origin-marker/grid-origin-marker';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { DungeonBoardService } from '../../services/dungeon-board.service';
import { DungeonPosition } from '../../models/dungeon-position.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonBoard – moved this round', () => {
  let fixture: ComponentFixture<DungeonBoard>;
  let charactersDb: CharactersDbService;
  let start: DungeonPosition;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonBoard],
      providers: [{ provide: CharacterEditorService, useValue: { openEdit: vi.fn() } }],
    }).compileComponents();

    charactersDb = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createTestCharacter('a'));
    fixture = TestBed.createComponent(DungeonBoard);
    await fixture.whenStable();
    start = TestBed.inject(DungeonBoardService).positions()[0];
  });

  const moved: () => boolean = (): boolean => charactersDb.characters()[0].movedThisRound;

  // Ein echter CDK-Drag ist in jsdom nicht erzeugbar; das Token meldet sein Zielfeld über das Output.
  const dragTo: (col: number, row: number) => Promise<void> = async (col, row) => {
    const token: DungeonToken = fixture.debugElement.query(By.directive(DungeonToken))
      .componentInstance as DungeonToken;
    token.tokenMoved.emit({ characterId: 'a', col, row });
    await fixture.whenStable();
  };

  it('does not mark a newly placed character as moved', () => {
    expect(moved()).toBe(false);
  });

  it('marks the character as moved when the token lands on another field', async () => {
    await dragTo(start.col + 1, start.row);

    expect(moved()).toBe(true);
    expect(fixture.nativeElement.querySelector('.dungeon-token--moved')).not.toBeNull();
  });

  it('neither moves nor marks a token dropped on its own field', async () => {
    const positions: DungeonPosition[] = TestBed.inject(DungeonBoardService).positions();
    await dragTo(start.col, start.row);

    expect(moved()).toBe(false);
    expect(TestBed.inject(DungeonBoardService).positions()).toBe(positions);
  });

  it('keeps the flag when the token returns to its start field in the same round', async () => {
    await dragTo(start.col + 1, start.row);
    await dragTo(start.col, start.row);

    expect(moved()).toBe(true);
  });

  it('does not mark tokens when the grid origin is moved', async () => {
    fixture.componentRef.setInput('originMode', true);
    await fixture.whenStable();
    const marker: GridOriginMarker = fixture.debugElement.query(By.directive(GridOriginMarker))
      .componentInstance as GridOriginMarker;
    marker.originMoved.emit({ x: 30, y: 20 });
    await fixture.whenStable();

    expect(moved()).toBe(false);
  });
});
