import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPlan } from '../components/layout-plan/layout-plan';
import { createTestLayout } from './builder.fixtures';
import {
  BuilderServices,
  builderProviders,
  injectBuilderServices,
} from './builder-services.fixtures';

export interface PlanSetup {
  fixture: ComponentFixture<LayoutPlan>;
  host: HTMLElement;
  services: BuilderServices;
  surface: () => SVGSVGElement;
  /** Zeiger-Ereignis auf dem Plan an der Kachelposition `col, row` (Zoom 1: 64 px je Kachel). */
  pointer: (type: string, col: number, row: number, button?: number) => void;
}

/**
 * Rendert den Plan mit einem Testlayout 10 × 8: Raumboden, unbekannter Boden, Tisch, Wand mit
 * Tür und eine unbekannte senkrechte Tür. jsdom misst kein Layout: Der Bereich ist ungemessen
 * (Maßstab = Zoom) und das SVG liegt bei (0,0).
 */
export function setupPlan(): PlanSetup {
  TestBed.configureTestingModule({ imports: [LayoutPlan], providers: builderProviders() });
  const fixture: ComponentFixture<LayoutPlan> = TestBed.createComponent(LayoutPlan);
  const host: HTMLElement = fixture.nativeElement as HTMLElement;
  const services: BuilderServices = injectBuilderServices();
  services.layout.replace(
    createTestLayout({
      floor: { '1,1': 'room', '2,1': 'lava' },
      pieces: [{ id: 't1', catalogId: 'table', col: 4, row: 3, rotation: 0 }],
      walls: [{ id: 'w1', x1: 0, y1: 1, x2: 3, y2: 1 }],
      doors: [
        { id: 'd1', catalogId: 'door', x: 1, y: 1, rotation: 0 },
        { id: 'd2', catalogId: 'alt', x: 8, y: 2, rotation: 90 },
      ],
    }),
  );
  fixture.detectChanges();

  const surface: () => SVGSVGElement = (): SVGSVGElement =>
    host.querySelector('[data-testid="plan-surface"]') as SVGSVGElement;

  function pointer(type: string, col: number, row: number, button: number = 0): void {
    const init: PointerEventInit = {
      bubbles: true,
      clientX: col * 64,
      clientY: row * 64,
      button,
      pointerId: 1,
    };
    surface().dispatchEvent(new PointerEvent(type, init));
    fixture.detectChanges();
  }

  return { fixture, host, services, surface, pointer };
}
