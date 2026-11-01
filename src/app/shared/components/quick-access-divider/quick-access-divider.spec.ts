import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessDivider } from './quick-access-divider';

describe('QuickAccessDivider', () => {
  it('is announced as a separator without content', async () => {
    const fixture: ComponentFixture<QuickAccessDivider> =
      TestBed.createComponent(QuickAccessDivider);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('role')).toBe('separator');
    expect(host.textContent).toBe('');
  });
});
