import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonToken } from './dungeon-token';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonToken – dead', () => {
  let fixture: ComponentFixture<DungeonToken>;
  let host: HTMLElement;

  const render: (Leben: number) => void = (Leben: number): void => {
    fixture.componentRef.setInput('character', { ...createTestCharacter('a'), Leben });
    fixture.detectChanges();
  };

  const marker: () => HTMLElement | null = () =>
    host.querySelector('[data-testid="token-dead-marker"]');

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonToken] });
    fixture = TestBed.createComponent(DungeonToken);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('position', { characterId: 'a', col: 0, row: 0 });
    fixture.componentRef.setInput('cellSize', 60);
    fixture.componentRef.setInput('tokenScale', 0.85);
  });

  it('lays a cross named "Tot" over the portrait at 0 Leben and keeps the image', () => {
    render(0);

    expect(marker()?.getAttribute('aria-label')).toBe('Tot');
    expect(marker()?.parentElement?.classList).toContain('dungeon-token__portrait');
    expect(host.querySelector('img.dungeon-token__image')).not.toBeNull();
  });

  it('shows no cross while the character has Leben left', () => {
    render(1);

    expect(marker()).toBeNull();
  });

  it('removes the cross as soon as the character is healed', () => {
    render(0);
    render(3);

    expect(marker()).toBeNull();
  });

  it('can still be selected while dead', () => {
    render(0);
    const selected: (id: string) => void = vi.fn();
    fixture.componentInstance.tokenSelected.subscribe(selected);

    (host.querySelector('.dungeon-token') as HTMLElement).click();

    expect(selected).toHaveBeenCalledExactlyOnceWith('a');
  });
});
