import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BuilderUiService } from '../../services/builder-ui.service';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';
import { RecentElementsService } from '../../services/recent-elements.service';
import { builderProviders } from '../../testing/builder-services.fixtures';
import { ElementLibrary } from '../element-library/element-library';
import { DungeonBuilderPage } from './dungeon-builder-page';

describe('DungeonBuilderPage', () => {
  let fixture: ComponentFixture<DungeonBuilderPage>;
  let host: HTMLElement;
  let layout: DungeonLayoutService;
  let ui: BuilderUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DungeonBuilderPage],
      providers: builderProviders(),
    });
    fixture = TestBed.createComponent(DungeonBuilderPage);
    host = fixture.nativeElement as HTMLElement;
    layout = TestBed.inject(DungeonLayoutService);
    // Die Seite stellt ihren eigenen UI-Zustand bereit.
    ui = fixture.debugElement.injector.get(BuilderUiService);
    fixture.detectChanges();
  });

  function press(key: string, init: KeyboardEventInit = {}, target: EventTarget = document): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
    fixture.detectChanges();
  }

  function selectTable(): string {
    layout.placeElement('table', { x: 4.5, y: 4.5 });
    const id: string = layout.layout().pieces[0].id;
    ui.select({ kind: 'piece', id });
    return id;
  }

  it('should show sidebar, tool strip and plan', () => {
    expect(host.querySelector('h2')?.textContent).toBe('Dungeon Builder');
    for (const selector of [
      'app-builder-file-panel',
      'app-layout-settings',
      'app-element-library',
      'app-builder-tool-strip',
      'app-layout-plan',
    ]) {
      expect(host.querySelector(selector)).not.toBeNull();
    }
  });

  it('should zoom the plan with the slider of the tool strip', () => {
    const slider: HTMLInputElement = host.querySelector(
      'app-builder-tool-strip input[type="range"]',
    ) as HTMLInputElement;
    slider.value = '2';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const sizer: HTMLElement = host.querySelector('.plan__sizer') as HTMLElement;
    expect(sizer.style.width).toBe(`${26 * 64 * 2}px`);
  });

  it('should turn and remove the selected element with R and Delete', () => {
    selectTable();
    press('r');
    expect(layout.layout().pieces[0].rotation).toBe(90);

    press('Delete');
    expect(layout.layout().pieces).toEqual([]);
  });

  it('should undo, redo and escape via keyboard', () => {
    selectTable();
    press('z', { ctrlKey: true });
    expect(layout.layout().pieces).toEqual([]);
    press('y', { ctrlKey: true });
    expect(layout.layout().pieces).toHaveLength(1);

    press('Escape');
    expect(ui.selection()).toBeNull();
    press('r');
    press('Backspace');
    expect(layout.layout().pieces[0].rotation).toBe(0);
  });

  it('should ignore shortcuts while typing in the layout name', () => {
    selectTable();
    const name: HTMLInputElement = host.querySelector('[data-testid="layout-name"]')!;
    press('r', {}, name);
    expect(layout.layout().pieces[0].rotation).toBe(0);
  });

  // CDK-Drag lässt sich in jsdom nicht per Zeiger auslösen: die Outputs der Bibliothek melden.
  it('should preview a library element over the plan and place it on drop', () => {
    const library: ReturnType<typeof fixture.debugElement.query> = fixture.debugElement.query(
      By.directive(ElementLibrary),
    );
    library.triggerEventHandler('dragMoved', { catalogId: 'chest', clientX: 160, clientY: 96 });
    expect(ui.draft().pieces).toEqual([expect.objectContaining({ col: 2, row: 1 })]);

    library.triggerEventHandler('dragMoved', { catalogId: 'chest', clientX: -10, clientY: 96 });
    expect(ui.gesture()).toBeNull();

    library.triggerEventHandler('dropped', { catalogId: 'chest', clientX: -10, clientY: 96 });
    expect(layout.layout().pieces).toEqual([]);
    expect(TestBed.inject(RecentElementsService).recentIds()).toEqual([]);

    library.triggerEventHandler('dropped', { catalogId: 'chest', clientX: 160, clientY: 96 });
    expect(layout.layout().pieces).toEqual([expect.objectContaining({ col: 2, row: 1 })]);
    expect(ui.gesture()).toBeNull();
    expect(TestBed.inject(RecentElementsService).recentIds()).toEqual(['chest']);
  });

  it('should show file and layout as collapsible sections with a toggle for all groups', () => {
    const toggles: string[] = Array.from(host.querySelectorAll('aside h3 button')).map(
      (b) => b.textContent?.trim() ?? '',
    );
    expect(toggles.slice(0, 2)).toEqual(['Datei', 'Layout']);
    expect(host.querySelector('[aria-label="Alle Gruppen einklappen"]')).not.toBeNull();
  });
});
