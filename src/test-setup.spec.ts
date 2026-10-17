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
});
