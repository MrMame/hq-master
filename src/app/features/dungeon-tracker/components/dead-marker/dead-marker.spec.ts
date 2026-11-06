import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadMarker } from './dead-marker';

describe('DeadMarker', () => {
  let host: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [DeadMarker] });
    const fixture: ComponentFixture<DeadMarker> = TestBed.createComponent(DeadMarker);
    await fixture.whenStable();
    host = fixture.nativeElement as HTMLElement;
  });

  it('is named "Tot" for screen readers and as tooltip', () => {
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Tot');
    expect(host.getAttribute('title')).toBe('Tot');
  });

  it('draws a cross of two lines that is hidden from screen readers', () => {
    const cross: SVGElement | null = host.querySelector('svg');
    expect(cross?.getAttribute('aria-hidden')).toBe('true');
    expect(cross?.querySelectorAll('line')).toHaveLength(2);
  });
});
