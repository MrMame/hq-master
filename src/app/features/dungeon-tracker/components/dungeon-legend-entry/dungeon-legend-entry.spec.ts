import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonLegendEntry } from './dungeon-legend-entry';
import { BoardToken } from '../../models/board-token.model';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

const token: BoardToken = {
  position: { characterId: 'a', col: 3, row: 4 },
  character: { ...createTestCharacter('a'), name: 'Ork', health: 20, armor: 5 },
};

describe('DungeonLegendEntry', () => {
  let fixture: ComponentFixture<DungeonLegendEntry>;
  let host: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DungeonLegendEntry] });
    fixture = TestBed.createComponent(DungeonLegendEntry);
    fixture.componentRef.setInput('token', token);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  const text: (selector: string) => string | undefined = (selector: string): string | undefined =>
    host.querySelector(selector)?.textContent?.trim();

  it('shows image and name of the character', () => {
    const img: HTMLImageElement = host.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('assets/ork.png');
    expect(img.alt).toBe('Ork');
    expect(text('.legend-entry__name')).toBe('Ork');
  });

  it('shows health and armor of the character', () => {
    expect(text('[aria-label="Leben"]')).toBe('20');
    expect(text('[aria-label="Rüstung"]')).toBe('5');
  });

  it.each<[string, DamageTypes]>([
    ['Schaden auf Leben', DamageTypes.Critical],
    ['Schaden auf Rüstung', DamageTypes.Normal],
  ])('a click on the value "%s" requests %s damage', (label, damageType) => {
    const requested: (type: DamageTypes) => void = vi.fn();
    fixture.componentInstance.damageRequested.subscribe(requested);

    (host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();

    expect(requested).toHaveBeenCalledExactlyOnceWith(damageType);
  });

  it('shows the board position', () => {
    expect(text('[data-testid="token-position"]')).toBe('[3,4]');
  });
});
