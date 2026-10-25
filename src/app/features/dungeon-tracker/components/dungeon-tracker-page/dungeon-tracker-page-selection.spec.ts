import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonTrackerPage } from './dungeon-tracker-page';
import { CharactersDbService } from '../../../../core/services/characters/characters-db.service';
import { CharacterDamageService } from '../../../../shared/services/character-damage.service';
import { CharacterEditorService } from '../../../../shared/services/character-editor.service';
import { DamageTypes } from '../../../../core/models/damage-types.model';
import { createTestCharacter } from '../../../../core/testing/character.fixtures';
import { spyOnScrollIntoView } from '../../testing/scroll-into-view.fixtures';

describe('DungeonTrackerPage – selection', () => {
  let fixture: ComponentFixture<DungeonTrackerPage>;
  let host: HTMLElement;
  const openEdit: ReturnType<typeof vi.fn> = vi.fn();
  const requestDamage: ReturnType<typeof vi.fn> = vi.fn();
  const scrolledElements: () => Element[] = spyOnScrollIntoView();

  beforeEach(async () => {
    [openEdit, requestDamage].forEach((mock) => mock.mockReset());
    await TestBed.configureTestingModule({
      imports: [DungeonTrackerPage],
      providers: [
        { provide: CharacterEditorService, useValue: { openEdit } },
        { provide: CharacterDamageService, useValue: { requestDamage } },
      ],
    }).compileComponents();

    const charactersDb: CharactersDbService = TestBed.inject(CharactersDbService);
    charactersDb.writeCharacter(createTestCharacter('a'));
    charactersDb.writeCharacter(createTestCharacter('b'));
    fixture = TestBed.createComponent(DungeonTrackerPage);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const legendEntryAt: (index: number) => HTMLElement = (index: number): HTMLElement =>
    host.querySelectorAll<HTMLElement>('app-dungeon-legend-entry')[index];

  const tokenAt: (index: number) => HTMLElement = (index: number): HTMLElement =>
    host.querySelectorAll<HTMLElement>('.dungeon-token')[index];

  const click: (element: Element) => Promise<void> = async (element: Element): Promise<void> => {
    (element as HTMLElement).click();
    await fixture.whenStable();
  };

  const clickLegendName: (index: number) => Promise<void> = (index: number): Promise<void> =>
    click(legendEntryAt(index).querySelector('.legend-entry__name') as Element);

  /** Markierte Legendeneinträge und Tokens sowie die Namen aller sichtbaren Menüleisten. */
  const selectionState: () => { entries: number[]; tokens: number[]; toolbars: string[] } = () => ({
    entries: [0, 1].filter((i) => legendEntryAt(i).getAttribute('aria-current') === 'true'),
    tokens: [0, 1].filter((i) => tokenAt(i).classList.contains('dungeon-token--selected')),
    toolbars: Array.from(host.querySelectorAll('[role="toolbar"]')).map(
      (bar) => bar.getAttribute('aria-label') ?? '',
    ),
  });

  const NOTHING_SELECTED: { entries: number[]; tokens: number[]; toolbars: string[] } = {
    entries: [],
    tokens: [],
    toolbars: [],
  };

  it('a legend click selects entry and token, both with the action bar', async () => {
    await clickLegendName(1);

    expect(selectionState()).toEqual({
      entries: [1],
      tokens: [1],
      toolbars: ['Aktionen für Char b <&>', 'Aktionen für Char b <&>'],
    });
  });

  it('a second legend click clears the selection at legend and board', async () => {
    await clickLegendName(1);
    await clickLegendName(1);

    expect(selectionState()).toEqual(NOTHING_SELECTED);
  });

  it('a click on another legend entry moves the selection', async () => {
    await clickLegendName(1);
    await clickLegendName(0);

    expect(selectionState()).toMatchObject({ entries: [0], tokens: [0] });
  });

  it('a token click selects the legend entry, the free board clears both', async () => {
    await click(tokenAt(0));
    expect(selectionState()).toMatchObject({ entries: [0], tokens: [0] });

    await click(host.querySelector('.board') as Element);
    expect(selectionState()).toEqual(NOTHING_SELECTED);
  });

  it('leaves no selection behind when the selected character is removed', async () => {
    await clickLegendName(0);
    TestBed.inject(CharactersDbService).removeCharacter(createTestCharacter('a'));
    await fixture.whenStable();

    expect(host.querySelectorAll('[aria-current="true"], .dungeon-token--selected')).toHaveLength(
      0,
    );
    expect(host.querySelectorAll('[role="toolbar"]')).toHaveLength(0);
  });

  it('a click on a legend value applies quick damage without changing the selection', async () => {
    await clickLegendName(1);
    const value: Element = legendEntryAt(0).querySelector(
      '.legend-entry__status button[aria-label="Schaden auf Rüstung"]',
    ) as Element;
    await click(value);

    expect(requestDamage).toHaveBeenCalledExactlyOnceWith(
      createTestCharacter('a'),
      DamageTypes.Normal,
    );
    expect(selectionState()).toMatchObject({ entries: [1], tokens: [1] });
  });

  it('"Charakter editieren" in the legend opens the editor and keeps the selection', async () => {
    await clickLegendName(1);
    const toolbar: Element = legendEntryAt(1).querySelector('[role="toolbar"]') as Element;
    await click(toolbar.querySelector('button[aria-label="Charakter editieren"]') as Element);

    expect(openEdit).toHaveBeenCalledExactlyOnceWith(createTestCharacter('b'));
    expect(selectionState()).toMatchObject({ entries: [1], tokens: [1] });
  });

  it('scrolls the token for a legend selection and the entry for a token selection', async () => {
    await clickLegendName(1);
    const tokenBar: Element | null = tokenAt(1).querySelector('app-character-action-bar');
    expect(scrolledElements()).toEqual([tokenAt(1), tokenBar]);

    await click(tokenAt(0));
    expect(scrolledElements()).toEqual([tokenAt(1), tokenBar, legendEntryAt(0)]);
  });
});
