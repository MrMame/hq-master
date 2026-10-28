import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySearch } from './library-search';

@Component({
  imports: [LibrarySearch],
  template: `<div (keydown)="bubbled.set(true)"><app-library-search [(term)]="term" /></div>`,
})
class TestHost {
  readonly term: WritableSignal<string> = signal<string>('');
  readonly bubbled: WritableSignal<boolean> = signal<boolean>(false);
}

describe('LibrarySearch', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: HTMLElement;

  const field: () => HTMLInputElement = () => host.querySelector('input') as HTMLInputElement;
  const clear: () => HTMLButtonElement | null = () =>
    host.querySelector('[aria-label="Suche leeren"]');

  async function type(value: string): Promise<void> {
    field().value = value;
    field().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function pressEscape(): Promise<KeyboardEvent> {
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    field().dispatchEvent(event);
    await fixture.whenStable();
    return event;
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should report the typed term and offer a clear button only while filled', async () => {
    expect(field().type).toBe('search');
    expect(field().getAttribute('aria-label')).toBe('Element suchen');
    expect(clear()).toBeNull();

    await type('tisch');

    expect(fixture.componentInstance.term()).toBe('tisch');
    expect(clear()).not.toBeNull();
  });

  it('should clear the term with the × button', async () => {
    await type('tisch');
    clear()!.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.term()).toBe('');
    expect(field().value).toBe('');
    expect(clear()).toBeNull();
  });

  it('should clear a filled field on Escape without passing the key on', async () => {
    await type('tisch');
    const event: KeyboardEvent = await pressEscape();

    expect(fixture.componentInstance.term()).toBe('');
    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.bubbled()).toBe(false);
  });

  it('should pass Escape on when the field is empty', async () => {
    const event: KeyboardEvent = await pressEscape();

    expect(event.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.bubbled()).toBe(true);
  });
});
