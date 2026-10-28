import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { RepeatOnHold } from '../../../../shared/directives/repeat-on-hold';
import { stepWithin } from '../../utils/grid-step.util';

/** Zähler für eindeutige ids: verbindet Beschriftung und Regler. */
let nextSliderId: number = 0;

/**
 * Raster-Regler mit Beschriftung, „−“ und „+“. Die Buttons ändern den Wert um die feinste Stufe
 * (`step`), auch wiederholt beim Gedrückthalten, gerundet und begrenzt; am Bereichsende ist der
 * jeweilige Button deaktiviert. Speichert nichts selbst, sondern meldet den neuen Wert.
 */
@Component({
  selector: 'app-grid-slider',
  imports: [RepeatOnHold],
  templateUrl: './grid-slider.html',
  styleUrl: './grid-slider.css',
})
export class GridSlider {
  /** Name des Werts, z. B. „Zellgröße“; die Buttons heißen „Zellgröße verringern“ / „… erhöhen“. */
  readonly name: InputSignal<string> = input.required<string>();
  /** Angezeigter Wert hinter dem Namen, z. B. „38,46px“. */
  readonly valueText: InputSignal<string> = input.required<string>();
  readonly value: InputSignal<number> = input.required<number>();
  readonly limits: InputSignal<{ min: number; max: number }> = input.required<{
    min: number;
    max: number;
  }>();
  /** Feinste Stufe für Regler und Buttons. */
  readonly step: InputSignal<number> = input.required<number>();

  readonly valueChange: OutputEmitterRef<number> = output<number>();

  protected readonly sliderId: string = `grid-slider-${nextSliderId++}`;

  /** Der Regler meldet seinen Wert unverändert. */
  protected onSlide(event: Event): void {
    this.valueChange.emit(Number((event.target as HTMLInputElement).value));
  }

  protected onStep(direction: -1 | 1): void {
    this.valueChange.emit(stepWithin(this.value(), direction, this.step(), this.limits()));
  }
}
