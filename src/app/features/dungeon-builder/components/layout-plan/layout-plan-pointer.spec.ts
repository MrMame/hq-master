import { PlanSetup, setupPlan } from '../../testing/layout-plan.fixtures';

describe('LayoutPlan – pointer', () => {
  let p: PlanSetup;

  beforeEach(() => {
    p = setupPlan();
  });

  it('should paint a brush stroke on release', () => {
    p.services.ui.selectTool('brush');
    p.pointer('pointerdown', 5.5, 6.5);
    p.pointer('pointermove', 7.5, 6.5);
    expect(p.surface().querySelectorAll('image').length).toBe(6);
    expect(p.services.layout.layout().floor['6,6']).toBeUndefined();

    p.pointer('pointerup', 7.5, 6.5);
    expect(p.services.layout.layout().floor['7,6']).toBe('room');
  });

  it('should ignore other mouse buttons and drop the preview on cancel', () => {
    p.services.ui.selectTool('brush');
    p.pointer('pointerdown', 5.5, 6.5, 2);
    expect(p.services.ui.gesture()).toBeNull();

    p.pointer('pointerdown', 5.5, 6.5);
    p.pointer('pointercancel', 5.5, 6.5);
    expect(p.services.ui.gesture()).toBeNull();
    expect(p.services.layout.layout().floor['5,6']).toBeUndefined();
  });

  it('should select an element with outline and action bar, and leave free spots to panning', () => {
    const viewportPresses: Event[] = [];
    p.host.querySelector('.plan')!.addEventListener('pointerdown', (e) => viewportPresses.push(e));

    p.pointer('pointerdown', 4.5, 3.5);
    p.pointer('pointerup', 4.5, 3.5);
    expect(viewportPresses).toHaveLength(0);
    const outline: Element = p.host.querySelector('[data-testid="plan-selection"]')!;
    expect(outline.getAttribute('width')).toBe('192');
    const bar: HTMLElement = p.host.querySelector('app-element-action-bar') as HTMLElement;
    expect([bar.style.left, bar.style.top]).toEqual(['352px', '320px']);

    p.pointer('pointerdown', 9.5, 7.5);
    expect(viewportPresses).toHaveLength(1);
    expect(p.host.querySelector('app-element-action-bar')).toBeNull();
  });

  it('should move the selected element with a preview and write it on release', () => {
    p.pointer('pointerdown', 4.5, 3.5);
    p.pointer('pointermove', 6.5, 4.5);
    const outline: Element = p.host.querySelector('[data-testid="plan-selection"]')!;
    expect(outline.getAttribute('x')).toBe('384');
    expect(p.services.layout.layout().pieces[0].col).toBe(4);

    p.pointer('pointerup', 6.5, 4.5);
    expect(p.services.layout.layout().pieces[0]).toMatchObject({ col: 6, row: 4 });
  });
});
