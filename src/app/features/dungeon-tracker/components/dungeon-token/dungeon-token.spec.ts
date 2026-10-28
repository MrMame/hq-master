import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';

import { DungeonToken } from './dungeon-token';
import { DungeonPosition } from '../../models/dungeon-position.model';
import { CharacterInfo } from '../../../../core/models/character-info.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { createDragEnd as dragEnd } from '../../testing/drag-end.fixtures';

const position: DungeonPosition = { characterId: 'a', col: 2, row: 3 };

describe('DungeonToken', () => {
  let fixture: ComponentFixture<DungeonToken>;
  let component: DungeonToken;

  const render: (character: CharacterInfo) => HTMLElement = (
    character: CharacterInfo,
  ): HTMLElement => {
    fixture.componentRef.setInput('character', character);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('div') as HTMLElement;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonToken] });
    fixture = TestBed.createComponent(DungeonToken);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('position', position);
    fixture.componentRef.setInput('cellSize', 50);
    fixture.componentRef.setInput('offsetX', 10);
    fixture.componentRef.setInput('offsetY', 20);
  });

  const endDrag: (event: CdkDragEnd) => void = (event: CdkDragEnd): void =>
    fixture.debugElement.query(By.directive(CdkDrag)).triggerEventHandler('cdkDragEnded', event);

  it('should center the 40px portrait in its field from field, cell size and offset', () => {
    const token: HTMLElement = render(createTestCharacter('a'));
    expect(token.style.left).toBe('115px');
    expect(token.style.top).toBe('175px');
  });

  it('should center the portrait also in a field smaller than the portrait', () => {
    fixture.componentRef.setInput('cellSize', 30);
    const token: HTMLElement = render(createTestCharacter('a'));
    expect(token.style.left).toBe('65px');
    expect(token.style.top).toBe('105px');
  });

  it('should show the initials when the character has no image', () => {
    const token: HTMLElement = render({ ...createTestCharacter('a'), name: 'goblin', image: '' });
    expect(token.querySelector('img')).toBeNull();
    expect(token.querySelector('.dungeon-token__initials')?.textContent?.trim()).toBe('GO');
  });

  it('should show the image and use the name as title and alt text', () => {
    const character: CharacterInfo = { ...createTestCharacter('a'), image: 'img/orc.png' };
    const token: HTMLElement = render(character);
    const img: HTMLImageElement = token.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('img/orc.png');
    expect(img.alt).toBe(character.name);
    expect(token.title).toBe(character.name);
  });

  it('should give every token the same gold-bordered style regardless of its name', () => {
    const classNames: string[] = ['Goblin', 'Hero Aragorn'].map((name) => {
      const token: HTMLElement = render({ ...createTestCharacter('a'), name });
      expect(token.classList).toContain('dungeon-token');
      return token.className;
    });
    expect(classNames[0]).toBe(classNames[1]);
  });

  it('should keep the field after a drag without movement', () => {
    render(createTestCharacter('a'));
    const moved: (event: { characterId: string; col: number; row: number }) => void = vi.fn();
    component.tokenMoved.subscribe(moved);

    endDrag(dragEnd(0, 0, vi.fn()));

    expect(moved).toHaveBeenCalledWith({ characterId: 'a', col: 2, row: 3 });
  });

  it('should emit the field under the portrait center after dragging and reset the offset', () => {
    render(createTestCharacter('a'));
    const reset: () => void = vi.fn();
    const moved: (event: { characterId: string; col: number; row: number }) => void = vi.fn();
    component.tokenMoved.subscribe(moved);

    endDrag(dragEnd(70, -30, reset));

    expect(moved).toHaveBeenCalledWith({ characterId: 'a', col: 3, row: 2 });
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('should pass the board scale to the drag and convert the screen distance into units', () => {
    fixture.componentRef.setInput('scale', 2);
    render(createTestCharacter('a'));
    const moved: (event: { characterId: string; col: number; row: number }) => void = vi.fn();
    component.tokenMoved.subscribe(moved);

    endDrag(dragEnd(70, -30, vi.fn()));

    expect(fixture.debugElement.query(By.directive(CdkDrag)).injector.get(CdkDrag).scale).toBe(2);
    // 70 px / 2 = 35: Porträtmitte 115 + 35 + 20 = 170 → Spalte 3; -15: 175 - 15 + 20 = 180 → Zeile 3
    expect(moved).toHaveBeenCalledWith({ characterId: 'a', col: 3, row: 3 });
  });

  it('should emit the character id on double click', () => {
    const token: HTMLElement = render(createTestCharacter('a'));
    const clicked: (id: string) => void = vi.fn();
    component.tokenDoubleClicked.subscribe(clicked);

    token.dispatchEvent(new MouseEvent('dblclick'));

    expect(clicked).toHaveBeenCalledWith('a');
  });
});
