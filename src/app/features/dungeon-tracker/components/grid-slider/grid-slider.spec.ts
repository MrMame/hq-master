import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSlider } from './grid-slider';

describe('GridSlider', () => {
  let fixture: ComponentFixture<GridSlider>;
  let host: HTMLElement;
  let reported: number[];

  const render: (value: number) => void = (value: number): void => {
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSlider);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('name', 'Zellgröße');
    fixture.componentRef.setInput('valueText', '38,46px');
    fixture.componentRef.setInput('limits', { min: 20, max: 150 });
    fixture.componentRef.setInput('step', 0.01);
    reported = [];
    fixture.componentInstance.valueChange.subscribe((value) => reported.push(value));
    render(38.46);
  });

  const slider: () => HTMLInputElement = (): HTMLInputElement =>
    host.querySelector('input[type="range"]') as HTMLInputElement;
  const stepButton: (label: string) => HTMLButtonElement = (label: string): HTMLButtonElement =>
    host.querySelector(`button[aria-label="Zellgröße ${label}"]`) as HTMLButtonElement;
  const press: (label: string) => void = (label: string): void => {
    stepButton(label).dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    stepButton(label).dispatchEvent(new PointerEvent('pointerup', { button: 0 }));
  };

  it('labels the slider with name and value', () => {
    const label: HTMLLabelElement = host.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('Zellgröße: 38,46px');
    expect(label.htmlFor).toBe(slider().id);
  });

  it('gives the slider limits, finest step and value', () => {
    expect(slider().min).toBe('20');
    expect(slider().max).toBe('150');
    expect(slider().step).toBe('0.01');
    expect(slider().value).toBe('38.46');
  });

  it('reports the value of the slider as it is', () => {
    slider().value = '60.5';
    slider().dispatchEvent(new Event('input'));
    expect(reported).toEqual([60.5]);
  });

  it('changes the value by exactly one step with "+" and "−"', () => {
    press('erhöhen');
    press('verringern');
    expect(reported).toEqual([38.47, 38.45]);
  });

  it('rounds an unrounded value to the precision of the step', () => {
    render(1000 / 26);
    press('erhöhen');
    expect(reported).toEqual([38.47]);
  });

  it('disables the button at the end of the range and keeps the value within', () => {
    render(150);
    expect(stepButton('erhöhen').disabled).toBe(true);
    expect(stepButton('verringern').disabled).toBe(false);

    render(20);
    expect(stepButton('verringern').disabled).toBe(true);

    render(149.995);
    press('erhöhen');
    expect(reported).toEqual([150]);
  });

  it('gives every slider its own id', () => {
    const other: ComponentFixture<GridSlider> = TestBed.createComponent(GridSlider);
    other.componentRef.setInput('name', 'Deckkraft');
    other.componentRef.setInput('valueText', '40%');
    other.componentRef.setInput('value', 0.4);
    other.componentRef.setInput('limits', { min: 0, max: 1 });
    other.componentRef.setInput('step', 0.05);
    other.detectChanges();

    const otherSlider: HTMLInputElement = (other.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;
    expect(otherSlider.id).not.toBe(slider().id);
  });
});
