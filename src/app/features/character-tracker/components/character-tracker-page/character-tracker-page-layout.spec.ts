import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { CharacterTrackerPage } from './character-tracker-page';
import { MovableCharacterCard } from '../movable-character-card/movable-character-card';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterCardLayoutService } from '../../services/character-card-layout.service';
import { CardLayout, DEFAULT_CARD_LAYOUT } from '../../models/card-layout.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';

describe('CharacterTrackerPage – layout', () => {
  let fixture: ComponentFixture<CharacterTrackerPage>;
  let cardLayout: CharacterCardLayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterTrackerPage],
      providers: [{ provide: MatDialog, useValue: { open: vi.fn() } }],
    }).compileComponents();

    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createTestCharacter('a'));
    charactersDb.writeCharacter(createTestCharacter('b'));
    cardLayout = TestBed.inject(CharacterCardLayoutService);
    fixture = TestBed.createComponent(CharacterTrackerPage);
    await fixture.whenStable();
  });

  /** Zweite gerenderte Karte (Charakter `b`), damit die Zuordnung per Id geprüft wird. */
  const secondCard: () => MovableCharacterCard = (): MovableCharacterCard =>
    fixture.debugElement.queryAll(By.directive(MovableCharacterCard))[1]
      .componentInstance as MovableCharacterCard;

  it('moves only the card whose moved event fired', async () => {
    const before: { a: CardLayout; b: CardLayout } = {
      a: cardLayout.layoutFor('a'),
      b: cardLayout.layoutFor('b'),
    };

    secondCard().moved.emit({ x: 10, y: -5 });
    await fixture.whenStable();

    expect(cardLayout.layoutFor('b')).toEqual<CardLayout>({
      ...before.b,
      x: before.b.x + 10,
      y: before.b.y - 5,
    });
    expect(cardLayout.layoutFor('a')).toEqual(before.a);
  });

  it('brings the focused card to the front', async () => {
    secondCard().focused.emit();
    await fixture.whenStable();

    expect(cardLayout.isOnTop('b')).toBe(true);
    expect(cardLayout.isOnTop('a')).toBe(false);
  });

  it('toggles minimised only for the card whose toggle fired', async () => {
    secondCard().minimiseToggled.emit();
    await fixture.whenStable();

    expect(cardLayout.layoutFor('b').isMinimised).toBe(!DEFAULT_CARD_LAYOUT.isMinimised);
    expect(cardLayout.layoutFor('a').isMinimised).toBe(DEFAULT_CARD_LAYOUT.isMinimised);
  });
});
