import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryEntry } from './library-entry';

describe('LibraryEntry', () => {
  let fixture: ComponentFixture<LibraryEntry>;
  let host: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryEntry);
    host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('name', 'Tisch');
  });

  it('should show the preview image, name and size', () => {
    fixture.componentRef.setInput('image', 'img/table.svg');
    fixture.componentRef.setInput('size', '3 × 2');
    fixture.detectChanges();

    expect(host.querySelector('img')?.getAttribute('src')).toBe('img/table.svg');
    expect(host.textContent).toContain('Tisch');
    expect(host.textContent).toContain('3 × 2');
  });

  it('should show a colour swatch instead of an image and no size', () => {
    fixture.componentRef.setInput('swatch', 'rgb(28, 25, 21)');
    fixture.detectChanges();

    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('.library-entry__size')).toBeNull();
    const preview: HTMLElement = host.querySelector('.library-entry__preview') as HTMLElement;
    expect(preview.style.backgroundColor).toBe('rgb(28, 25, 21)');
  });
});
