import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { QuickAccessButton, QuickAccessButtonVariant } from './quick-access-button';

@Component({
  imports: [QuickAccessButton],
  template: `
    <button
      appQuickAccessButton
      [label]="label()"
      [title]="title()"
      [icon]="icon()"
      [variant]="variant()"
      [active]="active()"
      [disabled]="disabled()"
      (click)="clicked()"
    >
      +
    </button>
  `,
})
class ButtonHost {
  readonly label: WritableSignal<string> = signal('Neuer Charakter');
  readonly title: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  readonly icon: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  readonly variant: WritableSignal<QuickAccessButtonVariant> =
    signal<QuickAccessButtonVariant>('primary');
  readonly active: WritableSignal<boolean | undefined> = signal<boolean | undefined>(false);
  readonly disabled: WritableSignal<boolean> = signal(false);
  readonly clicked: () => void = vi.fn();
}

describe('QuickAccessButton', () => {
  let fixture: ComponentFixture<ButtonHost>;
  let host: ButtonHost;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ButtonHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
    button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
  });

  it('is a plain button named by its label, also as tooltip', () => {
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Neuer Charakter');
    expect(button.title).toBe('Neuer Charakter');
  });

  it('shows a separate tooltip, e.g. with the shortcut', async () => {
    host.label.set('Rückgängig');
    host.title.set('Rückgängig (Strg+Z)');
    await fixture.whenStable();

    expect(button.getAttribute('aria-label')).toBe('Rückgängig');
    expect(button.title).toBe('Rückgängig (Strg+Z)');
  });

  it('shows the projected content without an icon and only the icon with one', async () => {
    expect(button.textContent?.trim()).toBe('+');
    expect(button.querySelector('img')).toBeNull();

    host.icon.set('./img/undo.svg');
    await fixture.whenStable();

    const img: HTMLImageElement = button.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('./img/undo.svg');
    expect(img.alt).toBe('');
    expect(button.textContent?.trim()).toBe('');
  });

  it('announces no pressed state as primary action, even when active', async () => {
    host.active.set(true);
    await fixture.whenStable();
    expect(button.hasAttribute('aria-pressed')).toBe(false);
  });

  it('announces the pressed state as toggle', async () => {
    host.variant.set('toggle');
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList).not.toContain('quick-access-button--active');

    host.active.set(true);
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.classList).toContain('quick-access-button--active');
  });

  it('announces no pressed state as toggle without a state, e.g. undo', async () => {
    host.variant.set('toggle');
    host.active.set(undefined);
    await fixture.whenStable();
    expect(button.hasAttribute('aria-pressed')).toBe(false);
    expect(button.classList).toContain('quick-access-button--toggle');
  });

  it('triggers on click while enabled', () => {
    button.click();
    expect(host.clicked).toHaveBeenCalledOnce();
  });

  it('does not trigger while disabled', async () => {
    host.disabled.set(true);
    await fixture.whenStable();

    expect(button.disabled).toBe(true);
    button.click();
    expect(host.clicked).not.toHaveBeenCalled();
  });
});
