import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { DungeonToken } from './dungeon-token';
import { DungeonPosition } from '../../models/dungeon-position.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { createDragEnd } from '../../testing/drag-end.fixtures';

interface TokenMove {
  characterId: string;
  col: number;
  row: number;
}

describe('DungeonToken – fields around the origin', () => {
  let fixture: ComponentFixture<DungeonToken>;
  let host: HTMLElement;
  let moves: TokenMove[];

  // Nullpunkt mitten im Bild: Feld (2, 3) beginnt bei (300, 250), Porträtmitte (325, 275).
  const render: (position: DungeonPosition) => void = (position: DungeonPosition): void => {
    fixture.componentRef.setInput('position', position);
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(DungeonToken);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('character', createTestCharacter('a'));
    fixture.componentRef.setInput('cellSize', 50);
    fixture.componentRef.setInput('offsetX', 200);
    fixture.componentRef.setInput('offsetY', 100);
    render({ characterId: 'a', col: 2, row: 3 });
    moves = [];
    fixture.componentInstance.tokenMoved.subscribe((move) => moves.push(move));
  });

  const dropAfter: (x: number, y: number) => void = (x: number, y: number): void =>
    fixture.debugElement
      .query(By.directive(CdkDrag))
      .triggerEventHandler('cdkDragEnded', createDragEnd(x, y, vi.fn()));

  const token: () => HTMLElement = (): HTMLElement =>
    host.querySelector('.dungeon-token') as HTMLElement;

  it('reports a negative column and row when dropped left of and above the origin', () => {
    // Porträtmitte (125, 75): 75 links und 25 oberhalb des Nullpunkts
    dropAfter(-200, -200);
    expect(moves).toEqual([{ characterId: 'a', col: -2, row: -1 }]);
  });

  it('reports the field directly left of the origin as column -1', () => {
    dropAfter(-126, -175);
    expect(moves).toEqual([{ characterId: 'a', col: -1, row: 0 }]);
  });

  it('draws a token with a negative position left of and above the origin', () => {
    render({ characterId: 'a', col: -2, row: -1 });
    // 200 - 2 × 50 + (50 - 40) / 2 = 105; 100 - 50 + 5 = 55
    expect(token().style.left).toBe('105px');
    expect(token().style.top).toBe('55px');
  });

  it('places a token dropped left of or above the stage on the field at its edge', () => {
    dropAfter(-1000, -1000);
    // Porträtmitte auf (0, 0) begrenzt: (0 - 200) / 50 = -4, (0 - 100) / 50 = -2
    expect(moves).toEqual([{ characterId: 'a', col: -4, row: -2 }]);
  });

  it('keeps the old behavior right of and below the stage', () => {
    dropAfter(2000, 0);
    expect(moves).toEqual([{ characterId: 'a', col: 42, row: 3 }]);
  });
});
