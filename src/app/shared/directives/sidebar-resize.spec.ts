import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SIDEBAR_RESIZING_CLASS, SidebarResize } from './sidebar-resize';

@Component({
  imports: [SidebarResize],
  template: `
    <aside #panel class="panel"></aside>
    <button
      type="button"
      [appSidebarResize]="panel"
      [resizeEnabled]="enabled()"
      (widthChange)="changes.push($event)"
      (widthCommit)="commits.push($event)"
      (activate)="activations = activations + 1"
    >
      ‹
    </button>
  `,
})
class ResizeHost {
  readonly enabled: WritableSignal<boolean> = signal(true);
  changes: number[] = [];
  commits: number[] = [];
  activations: number = 0;
}

describe('SidebarResize', () => {
  let fixture: ComponentFixture<ResizeHost>;
  let host: ResizeHost;
  let handle: HTMLButtonElement;

  // jsdom hat kein Layout: Die Leiste ist 256px breit; Pointer-Capture als Stub.
  beforeEach(async () => {
    fixture = TestBed.createComponent(ResizeHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement as HTMLElement;
    root.querySelector('aside')!.getBoundingClientRect = (): DOMRect => ({ width: 256 }) as DOMRect;
    handle = root.querySelector('button') as HTMLButtonElement;
    handle.setPointerCapture = vi.fn();
  });

  const pointer: (type: string, x: number, button?: number) => void = (
    type: string,
    x: number,
    button: number = 0,
  ): void => {
    handle.dispatchEvent(
      new PointerEvent(type, { bubbles: true, clientX: x, clientY: 10, button, pointerId: 7 }),
    );
  };

  /** Drücken, bewegen, loslassen und – wie im Browser – den folgenden Klick (detail 1). */
  const gesture: (...xs: number[]) => void = (...xs: number[]): void => {
    pointer('pointerdown', xs[0]);
    xs.slice(1).forEach((x) => pointer('pointermove', x));
    pointer('pointerup', xs[xs.length - 1]);
    handle.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
  };

  const isResizing: () => boolean = (): boolean =>
    document.documentElement.classList.contains(SIDEBAR_RESIZING_CLASS);

  it('should treat a press with less than 4px movement as a click', () => {
    gesture(100, 103);

    expect(host.activations).toBe(1);
    expect(host.changes).toEqual([]);
    expect(host.commits).toEqual([]);
  });

  it('should follow the pointer live from 4px on and commit once on release without a click', () => {
    gesture(100, 104, 150, 180);

    expect(host.changes).toEqual([260, 306, 336]);
    expect(host.commits).toEqual([336]);
    expect(host.activations).toBe(0);
    expect(handle.setPointerCapture).toHaveBeenCalledWith(7);
  });

  it('should keep dragging below the threshold again once started, also to the left', () => {
    gesture(100, 60, 98);

    expect(host.changes).toEqual([216, 254]);
    expect(host.commits).toEqual([254]);
  });

  it('should mark the document as resizing only while dragging', () => {
    pointer('pointerdown', 100);
    pointer('pointermove', 102);
    expect(isResizing()).toBe(false);

    pointer('pointermove', 140);
    expect(isResizing()).toBe(true);

    pointer('pointerup', 140);
    expect(isResizing()).toBe(false);
  });

  it('should commit the last width when the pointer is cancelled', () => {
    pointer('pointerdown', 100);
    pointer('pointermove', 130);
    pointer('pointercancel', 130);

    expect(host.commits).toEqual([286]);
    expect(isResizing()).toBe(false);
  });

  it('should not resize when disabled, but still activate on click', async () => {
    host.enabled.set(false);
    await fixture.whenStable();

    gesture(100, 200);

    expect(host.changes).toEqual([]);
    expect(host.activations).toBe(1);
    expect(handle.setPointerCapture).not.toHaveBeenCalled();
  });

  it('should ignore other mouse buttons than the primary one', () => {
    pointer('pointerdown', 100, 2);
    pointer('pointermove', 200);

    expect(host.changes).toEqual([]);
  });

  it('should not swallow keyboard clicks or a later click when no click followed a drag', () => {
    pointer('pointerdown', 100);
    pointer('pointermove', 150);
    pointer('pointerup', 150);
    handle.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }));
    expect(host.activations).toBe(1);

    pointer('pointerdown', 100);
    pointer('pointermove', 150);
    pointer('pointerup', 150);
    gesture(150, 151);
    expect(host.activations).toBe(2);
  });

  it('should remove the resizing mark when destroyed mid-drag', () => {
    pointer('pointerdown', 100);
    pointer('pointermove', 150);
    fixture.destroy();

    expect(isResizing()).toBe(false);
  });
});
