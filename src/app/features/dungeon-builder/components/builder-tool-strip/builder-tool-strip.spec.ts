import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  BuilderServices,
  builderProviders,
  injectBuilderServices,
} from '../../testing/builder-services.fixtures';
import { BuilderToolStrip } from './builder-tool-strip';

describe('BuilderToolStrip', () => {
  let fixture: ComponentFixture<BuilderToolStrip>;
  let host: HTMLElement;
  let s: BuilderServices;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BuilderToolStrip], providers: builderProviders() });
    fixture = TestBed.createComponent(BuilderToolStrip);
    host = fixture.nativeElement as HTMLElement;
    s = injectBuilderServices();
    fixture.detectChanges();
  });

  function button(label: string): HTMLButtonElement {
    return host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
  }

  it('should list the tools in order with "Auswahl" active', () => {
    const labels: (string | null)[] = Array.from(host.querySelectorAll('button')).map((b) =>
      b.getAttribute('aria-label'),
    );
    expect(labels).toEqual([
      'Auswahl',
      'Pinsel',
      'Rechteck',
      'Füllen',
      'Radierer',
      'Wand',
      'Rückgängig',
      'Wiederholen',
    ]);
    expect(button('Auswahl').getAttribute('aria-pressed')).toBe('true');
    expect(host.querySelector('app-board-zoom-control')).not.toBeNull();
  });

  it('should switch the tool on click', () => {
    button('Wand').click();
    fixture.detectChanges();

    expect(s.ui.tool()).toEqual({ kind: 'wall' });
    expect(button('Wand').getAttribute('aria-pressed')).toBe('true');
    expect(button('Auswahl').getAttribute('aria-pressed')).toBe('false');
  });

  it('should mark no tool while a stamp is active', () => {
    s.ui.toggleStamp('chest');
    fixture.detectChanges();
    expect(host.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
  });

  it('should enable undo and redo only when there is something to do', () => {
    expect(button('Rückgängig').disabled).toBe(true);
    s.layout.paintFloor([{ col: 0, row: 0 }], 'room');
    fixture.detectChanges();
    expect(button('Rückgängig').disabled).toBe(false);

    button('Rückgängig').click();
    fixture.detectChanges();
    expect(s.layout.layout().floor).toEqual({});
    expect(button('Wiederholen').disabled).toBe(false);

    button('Wiederholen').click();
    expect(s.layout.layout().floor).toEqual({ '0,0': 'room' });
  });

  it('should pass the zoom of its slider on', () => {
    const slider: HTMLInputElement = host.querySelector('input[type="range"]') as HTMLInputElement;
    slider.value = '2';
    slider.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.zoom()).toBe(2);
  });
});
