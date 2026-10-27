import { CdkDrag } from '@angular/cdk/drag-drop';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ElementCatalog } from '../../models/element-catalog.model';
import { LibraryDrag } from '../../models/library-entry.model';
import { BuilderUiService } from '../../services/builder-ui.service';
import { TEST_CATALOG } from '../../testing/builder.fixtures';
import { builderProviders, catalogProvider } from '../../testing/builder-services.fixtures';
import { ElementLibrary } from './element-library';

describe('ElementLibrary', () => {
  let catalog: WritableSignal<ElementCatalog | null>;
  let loadError: WritableSignal<string | null>;
  let fixture: ComponentFixture<ElementLibrary>;
  let host: HTMLElement;
  let ui: BuilderUiService;

  beforeEach(() => {
    catalog = signal<ElementCatalog | null>(TEST_CATALOG);
    loadError = signal<string | null>(null);
    TestBed.configureTestingModule({
      imports: [ElementLibrary],
      providers: [...builderProviders(catalog), catalogProvider(catalog, loadError)],
    });
    fixture = TestBed.createComponent(ElementLibrary);
    host = fixture.nativeElement as HTMLElement;
    ui = TestBed.inject(BuilderUiService);
    fixture.detectChanges();
  });

  function button(label: string): HTMLButtonElement {
    const found: HTMLButtonElement | undefined = Array.from(
      host.querySelectorAll<HTMLButtonElement>('button'),
    ).find((b) => b.getAttribute('aria-label') === label);
    if (!found) throw new Error(`Eintrag "${label}" nicht gefunden`);
    return found;
  }

  it('should show a loading hint, then the groups of the catalog', () => {
    catalog.set(null);
    fixture.detectChanges();
    expect(host.textContent).toContain('Bibliothek wird geladen');

    catalog.set(TEST_CATALOG);
    fixture.detectChanges();
    const headings: string[] = Array.from(host.querySelectorAll('h3')).map((h) => h.textContent!);
    expect(headings).toEqual(['Boden', 'Türen', 'Möbel', 'Hindernisse']);
    expect(button('Tisch (3 × 2)').textContent).toContain('3 × 2');
  });

  it('should show the load error', () => {
    loadError.set('Bibliothek konnte nicht geladen werden.');
    catalog.set(null);
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="library-error"]')?.textContent).toContain(
      'Bibliothek konnte nicht geladen werden.',
    );
  });

  it('should choose a floor, including rock, and mark it', () => {
    button('Gang').click();
    fixture.detectChanges();
    expect(ui.floorId()).toBe('corridor');
    expect(button('Gang').getAttribute('aria-pressed')).toBe('true');
    expect(button('Raumboden').getAttribute('aria-pressed')).toBe('false');

    button('Fels').click();
    fixture.detectChanges();
    expect(ui.floorId()).toBeNull();
    expect(button('Fels').getAttribute('aria-pressed')).toBe('true');
  });

  it('should make an entry the stamp on a tap and end it on a second tap', () => {
    button('Tür').click();
    fixture.detectChanges();
    expect(ui.tool()).toEqual({ kind: 'stamp', catalogId: 'door' });
    expect(button('Tür').getAttribute('aria-pressed')).toBe('true');

    button('Tür').click();
    fixture.detectChanges();
    expect(button('Tür').getAttribute('aria-pressed')).toBe('false');
  });

  // CDK-Drag lässt sich in jsdom nicht per Zeiger auslösen: Ereignisse über die Direktive melden.
  it('should report the pointer while dragging and on drop, then reset the entry', () => {
    const moved: LibraryDrag[] = [];
    const dropped: LibraryDrag[] = [];
    fixture.componentInstance.dragMoved.subscribe((d) => moved.push(d));
    fixture.componentInstance.dropped.subscribe((d) => dropped.push(d));
    const drag: ReturnType<typeof fixture.debugElement.query> = fixture.debugElement
      .queryAll(By.directive(CdkDrag))
      .find((el) => el.attributes['aria-label'] === 'Truhe (1 × 1)')!;
    const reset: ReturnType<typeof vi.fn> = vi.fn();

    drag.triggerEventHandler('cdkDragMoved', { pointerPosition: { x: 10, y: 20 } });
    drag.triggerEventHandler('cdkDragEnded', { dropPoint: { x: 30, y: 40 }, source: { reset } });

    expect(moved).toEqual([{ catalogId: 'chest', clientX: 10, clientY: 20 }]);
    expect(dropped).toEqual([{ catalogId: 'chest', clientX: 30, clientY: 40 }]);
    expect(reset).toHaveBeenCalled();
  });

  it('should hide the door group when the catalog has no doors', () => {
    catalog.set({ ...TEST_CATALOG, doors: [] });
    fixture.detectChanges();
    expect(host.textContent).not.toContain('Türen');
  });
});
