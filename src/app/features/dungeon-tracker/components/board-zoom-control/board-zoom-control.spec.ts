import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardZoomControl } from './board-zoom-control';

describe('BoardZoomControl', () => {
  let fixture: ComponentFixture<BoardZoomControl>;
  let host: HTMLElement;

  const slider: () => HTMLInputElement = (): HTMLInputElement =>
    host.querySelector('input[type="range"]') as HTMLInputElement;

  const slide: (value: string) => Promise<void> = async (value: string): Promise<void> => {
    slider().value = value;
    slider().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BoardZoomControl] }).compileComponents();
    fixture = TestBed.createComponent(BoardZoomControl);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should show 100 % and a slider from 100 % to 400 % in 10 % steps', () => {
    expect(host.textContent).toContain('100 %');
    expect(slider().getAttribute('aria-label')).toBe('Zoom');
    expect([slider().min, slider().max, slider().step]).toEqual(['1', '4', '0.1']);
    expect(slider().value).toBe('1');
  });

  it('should set the zoom and show the new percentage when the slider moves', async () => {
    const emitted: number[] = [];
    fixture.componentInstance.zoom.subscribe((value) => emitted.push(value));

    await slide('2.5');

    expect(fixture.componentInstance.zoom()).toBe(2.5);
    expect(emitted).toEqual([2.5]);
    expect(host.textContent).toContain('250 %');
  });

  it('should follow a zoom set from outside', async () => {
    fixture.componentRef.setInput('zoom', 4);
    await fixture.whenStable();

    expect(host.textContent).toContain('400 %');
    expect(slider().value).toBe('4');
  });

  it('should clamp input outside the range to the slider bounds', async () => {
    await slide('9');

    expect(fixture.componentInstance.zoom()).toBe(4);
  });
});
