import { afterEach, vi } from 'vitest';
import { spyOnScrollIntoView } from '../testing/scroll-into-view.fixtures';
import { prefersReducedMotion, revealSection } from './reveal-section.util';

describe('revealSection', () => {
  const scrolled: () => Element[] = spyOnScrollIntoView();

  function createSection(): HTMLElement {
    const section: HTMLElement = document.createElement('app-sidebar-section');
    section.innerHTML = '<h3><button class="sidebar-section__toggle">Gürtel</button></h3>';
    document.body.append(section);
    return section;
  }

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('scrolls the section to the top smoothly and focuses its heading', () => {
    const section: HTMLElement = createSection();
    revealSection(section, false);

    expect(scrolled()).toEqual([section]);
    expect(vi.mocked(section.scrollIntoView)).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(document.activeElement?.textContent).toBe('Gürtel');
  });

  it('scrolls without animation for reduced motion', () => {
    const section: HTMLElement = createSection();
    revealSection(section, true);

    expect(vi.mocked(section.scrollIntoView)).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    });
  });

  it('does nothing without a section', () => {
    expect(() => revealSection(null, false)).not.toThrow();
    expect(scrolled()).toEqual([]);
  });

  it('reads the reduced-motion preference and defaults to motion without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(prefersReducedMotion()).toBe(false);

    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    expect(prefersReducedMotion()).toBe(true);
  });
});
