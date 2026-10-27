import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  BuilderServices,
  builderProviders,
  injectBuilderServices,
} from '../../testing/builder-services.fixtures';
import { ElementActionBar } from './element-action-bar';

@Component({
  imports: [ElementActionBar],
  template: `<div (click)="clicks = clicks + 1" (pointerdown)="presses = presses + 1">
    <app-element-action-bar />
  </div>`,
})
class ActionBarHost {
  clicks: number = 0;
  presses: number = 0;
}

describe('ElementActionBar', () => {
  let fixture: ComponentFixture<ActionBarHost>;
  let host: HTMLElement;
  let s: BuilderServices;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ActionBarHost], providers: builderProviders() });
    fixture = TestBed.createComponent(ActionBarHost);
    host = fixture.nativeElement as HTMLElement;
    s = injectBuilderServices();
    s.layout.placeElement('table', { x: 3.5, y: 3.5 });
    s.ui.select({ kind: 'piece', id: s.layout.layout().pieces[0].id });
    fixture.detectChanges();
  });

  function button(label: string): HTMLButtonElement {
    return host.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement;
  }

  it('should be a toolbar with "Drehen" and "Löschen"', () => {
    const toolbar: Element = host.querySelector('[role="toolbar"]')!;
    expect(toolbar.getAttribute('aria-label')).toBe('Aktionen für das markierte Element');
    expect(button('Drehen').title).toBe('Drehen (R)');
    expect(button('Löschen').title).toBe('Löschen (Entf)');
  });

  it('should turn the selected element', () => {
    button('Drehen').click();
    expect(s.layout.layout().pieces[0].rotation).toBe(90);
  });

  it('should remove the selected element', () => {
    button('Löschen').click();
    expect(s.layout.layout().pieces).toEqual([]);
  });

  it('should do nothing without a selection', () => {
    s.ui.select(null);
    button('Drehen').click();
    button('Löschen').click();
    expect(s.layout.layout().pieces[0].rotation).toBe(0);
  });

  it('should keep clicks and presses away from the plan', () => {
    button('Drehen').click();
    button('Drehen').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(fixture.componentInstance.clicks).toBe(0);
    expect(fixture.componentInstance.presses).toBe(0);
  });
});
