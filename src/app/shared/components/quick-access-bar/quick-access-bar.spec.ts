import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessDivider } from '../quick-access-divider/quick-access-divider';
import { QuickAccessBar } from './quick-access-bar';

@Component({
  imports: [QuickAccessBar, QuickAccessDivider],
  template: `
    <app-quick-access-bar>
      <button type="button">Oben</button>
      <app-quick-access-divider />
      <button type="button">Unten</button>
    </app-quick-access-bar>
  `,
})
class BarHost {}

describe('QuickAccessBar', () => {
  let bar: HTMLElement;

  beforeEach(async () => {
    const fixture: ComponentFixture<BarHost> = TestBed.createComponent(BarHost);
    await fixture.whenStable();
    bar = (fixture.nativeElement as HTMLElement).querySelector('app-quick-access-bar')!;
  });

  it('shows the projected commands from top to bottom', () => {
    const children: string[] = Array.from(bar.children).map(
      (child) => child.getAttribute('role') ?? child.textContent!.trim(),
    );
    expect(children).toEqual(['Oben', 'separator', 'Unten']);
  });

  it('lays the commands out as a vertical strip that scrolls on its own', () => {
    const style: CSSStyleDeclaration = getComputedStyle(bar);
    expect(style.display).toBe('flex');
    expect(style.flexDirection).toBe('column');
    expect(style.overflowY).toBe('auto');
  });
});
