import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TOOL_STATE_KEYS } from '../../../../core/session-state/tool-state-keys';
import { LibraryDrag, LibraryGroup } from '../../models/library-entry.model';
import { TEST_CATALOG } from '../../testing/builder.fixtures';
import { pieceGroups } from '../../utils/library-groups.util';
import { LibraryGroupSection } from './library-group-section';

@Component({
  imports: [LibraryGroupSection],
  template: `
    <app-library-group-section
      [group]="group"
      [activeId]="activeId()"
      [draggable]="draggable()"
      (picked)="picked.push($event)"
      (dragMoved)="moved.push($event)"
      (dropped)="dropped.push($event)"
    />
  `,
})
class TestHost {
  readonly group: LibraryGroup = pieceGroups(TEST_CATALOG)[1];
  readonly activeId: WritableSignal<string | null> = signal<string | null>('chest');
  readonly draggable: WritableSignal<boolean> = signal<boolean>(true);
  readonly picked: string[] = [];
  readonly moved: LibraryDrag[] = [];
  readonly dropped: LibraryDrag[] = [];
}

describe('LibraryGroupSection', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: HTMLElement;

  const entry: (label: string) => HTMLButtonElement = (label) =>
    host.querySelector(`[aria-label="${label}"]`) as HTMLButtonElement;
  const drag: () => CdkDrag = () =>
    fixture.debugElement.queryAll(By.directive(CdkDrag))[0].injector.get(CdkDrag);

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should show the group as a collapsible section with its count and entries', () => {
    expect(host.querySelector('h3 button')?.textContent?.trim()).toBe('Möbel (2)');
    expect(entry('Tisch (3 × 2)').textContent).toContain('3 × 2');
    expect(entry('Tisch (3 × 2)').title).toBe('Tisch (3 × 2)');
  });

  it('should store its state under the library section id', async () => {
    (host.querySelector('h3 button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(JSON.parse(localStorage.getItem(TOOL_STATE_KEYS.sidebarSections)!)).toEqual([
      'dungeon-builder.library.Möbel',
    ]);
  });

  it('should mark the active entry and report a tap', async () => {
    expect(entry('Truhe (1 × 1)').getAttribute('aria-pressed')).toBe('true');
    expect(entry('Tisch (3 × 2)').getAttribute('aria-pressed')).toBe('false');

    entry('Tisch (3 × 2)').click();

    expect(fixture.componentInstance.picked).toEqual(['table']);
  });

  it('should allow dragging only when draggable', async () => {
    expect(drag().disabled).toBe(false);

    fixture.componentInstance.draggable.set(false);
    await fixture.whenStable();

    expect(drag().disabled).toBe(true);
    expect(entry('Tisch (3 × 2)').classList).toContain('library__entry--static');
  });

  // CDK-Drag lässt sich in jsdom nicht per Zeiger auslösen: Ereignisse über die Direktive melden.
  it('should report the pointer while dragging and on drop, then reset the entry', () => {
    const element: ReturnType<typeof fixture.debugElement.query> = fixture.debugElement
      .queryAll(By.directive(CdkDrag))
      .find((el) => el.attributes['aria-label'] === 'Truhe (1 × 1)')!;
    const reset: ReturnType<typeof vi.fn> = vi.fn();

    element.triggerEventHandler('cdkDragMoved', { pointerPosition: { x: 10, y: 20 } });
    element.triggerEventHandler('cdkDragEnded', { dropPoint: { x: 30, y: 40 }, source: { reset } });

    expect(fixture.componentInstance.moved).toEqual([
      { catalogId: 'chest', clientX: 10, clientY: 20 },
    ]);
    expect(fixture.componentInstance.dropped).toEqual([
      { catalogId: 'chest', clientX: 30, clientY: 40 },
    ]);
    expect(reset).toHaveBeenCalled();
  });
});
