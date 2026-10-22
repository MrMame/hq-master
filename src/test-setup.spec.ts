// Sichert die globale Isolation aus `test-setup.ts` ab: Die Tests laufen in Reihenfolge,
// der zweite sieht den Eintrag des ersten nur, wenn `localStorage` nicht geleert wurde.
describe('global test setup', () => {
  it('lets a test write to localStorage', () => {
    localStorage.setItem('leak-probe', 'x');
    expect(localStorage.getItem('leak-probe')).toBe('x');
  });

  it('starts the next test with an empty localStorage', () => {
    expect(localStorage.length).toBe(0);
  });

  it('provides a ResizeObserver that jsdom lacks', () => {
    const observer: ResizeObserver = new ResizeObserver(() => undefined);
    expect(() => {
      observer.observe(document.body);
      observer.unobserve(document.body);
      observer.disconnect();
    }).not.toThrow();
  });
});
