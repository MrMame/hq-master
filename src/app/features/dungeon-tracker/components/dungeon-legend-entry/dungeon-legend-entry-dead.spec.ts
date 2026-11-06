import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonLegendEntry } from './dungeon-legend-entry';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('DungeonLegendEntry – dead', () => {
  let fixture: ComponentFixture<DungeonLegendEntry>;
  let host: HTMLElement;

  const render: (health: number) => void = (health: number): void => {
    fixture.componentRef.setInput('token', {
      position: { characterId: 'a', col: 0, row: 0 },
      character: { ...createTestCharacter('a'), health },
    });
    fixture.detectChanges();
  };

  const marker: () => HTMLElement | null = () =>
    host.querySelector('[data-testid="legend-dead-marker"]');

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonLegendEntry] });
    fixture = TestBed.createComponent(DungeonLegendEntry);
    host = fixture.nativeElement as HTMLElement;
  });

  it('lays a cross named "Tot" over the avatar at 0 health', () => {
    render(0);

    expect(marker()?.getAttribute('aria-label')).toBe('Tot');
    expect(marker()?.parentElement?.querySelector('img.legend-entry__avatar')).not.toBeNull();
  });

  it('shows no cross while the character has health left', () => {
    render(1);

    expect(marker()).toBeNull();
  });

  it('removes the cross as soon as the character is healed', () => {
    render(0);
    render(3);

    expect(marker()).toBeNull();
  });
});
