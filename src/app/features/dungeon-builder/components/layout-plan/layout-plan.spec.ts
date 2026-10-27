import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSetup, setupPlan } from '../../testing/layout-plan.fixtures';
import { LayoutPlan } from './layout-plan';

describe('LayoutPlan', () => {
  let p: PlanSetup;

  beforeEach(() => {
    p = setupPlan();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should draw rock, floor, pieces, walls with door gaps and placeholders', () => {
    expect(p.surface().getAttribute('viewBox')).toBe('0 0 640 512');
    expect(p.surface().querySelector('rect')?.getAttribute('fill')).toBe('#000000');
    const images: string[] = Array.from(p.surface().querySelectorAll('image')).map((img) =>
      img.getAttribute('href')!,
    );
    expect(images).toEqual(['img/room.svg', 'img/table.svg', 'img/door.svg']);
    expect(p.surface().querySelectorAll('line')).toHaveLength(2);
    expect(p.host.querySelector('[data-testid="unknown-f:2,1"]')?.textContent?.trim()).toBe('?');
  });

  it('should size the question mark by the shorter side of a placeholder', () => {
    const text: (key: string) => string | null | undefined = (key: string) =>
      p.host.querySelector(`[data-testid="unknown-${key}"] text`)?.getAttribute('font-size');
    expect(text('f:2,1')).toBe(String(64 * 0.7));
    expect(text('d:d2')).toBe(String(16 * 0.7));
  });

  it('should place images with translate and rotate', () => {
    p.services.layout.rotateElement({ kind: 'piece', id: 't1' });
    p.fixture.detectChanges();
    const table: Element = p.surface().querySelectorAll('image')[1];
    expect(table.getAttribute('transform')).toBe('translate(320 288) rotate(90)');
  });

  it('should scale the plan with the zoom', () => {
    p.fixture.componentRef.setInput('zoom', 2);
    p.fixture.detectChanges();
    const sizer: HTMLElement = p.host.querySelector('.plan__sizer') as HTMLElement;
    expect([sizer.style.width, sizer.style.height]).toEqual(['1280px', '1024px']);
  });

  it('should fit the whole plan into the measured area at zoom 1', () => {
    let report: ResizeObserverCallback = (): void => undefined;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          report = callback;
        }
        observe(): void {
          // gemessen wird über `report`
        }
        disconnect(): void {
          // nichts zu lösen
        }
      },
    );
    const fixture: ComponentFixture<LayoutPlan> = TestBed.createComponent(LayoutPlan);
    fixture.detectChanges();

    const entry: ResizeObserverEntry = {
      contentRect: { width: 320, height: 512 },
    } as ResizeObserverEntry;
    report([entry], {} as ResizeObserver);
    fixture.detectChanges();

    const sizer: HTMLElement = (fixture.nativeElement as HTMLElement).querySelector(
      '.plan__sizer',
    )!;
    expect([sizer.style.width, sizer.style.height]).toEqual(['320px', '256px']);
  });

  it('should convert screen positions into plan points inside the plan only', () => {
    expect(p.fixture.componentInstance.toPlanPoint(96, 32)).toEqual({ x: 1.5, y: 0.5 });
    expect(p.fixture.componentInstance.toPlanPoint(-1, 32)).toBeNull();
    expect(p.fixture.componentInstance.toPlanPoint(32, 512)).toBeNull();
  });

  it('should mark the plan as pannable only with the select tool and zoom', () => {
    const viewport: HTMLElement = p.host.querySelector('.plan') as HTMLElement;
    p.fixture.componentRef.setInput('zoom', 2);
    p.fixture.detectChanges();
    expect(viewport.classList).toContain('plan--pannable');

    p.services.ui.selectTool('wall');
    p.fixture.detectChanges();
    expect(viewport.classList).toContain('plan--drawing');
    expect(viewport.classList).not.toContain('plan--pannable');
  });

  it('should remember the visible centre while scrolling', () => {
    const viewport: HTMLElement = p.host.querySelector('.plan') as HTMLElement;
    Object.defineProperty(viewport, 'scrollWidth', { value: 1000 });
    Object.defineProperty(viewport, 'scrollHeight', { value: 800 });
    viewport.dispatchEvent(new Event('scroll'));
    p.fixture.componentRef.setInput('zoom', 3);
    p.fixture.detectChanges();
    expect(viewport.scrollLeft).toBe(0);
  });
});
