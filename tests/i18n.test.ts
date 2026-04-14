import { describe, it, expect } from 'vitest';
import { translations } from '../lib/i18n/translations';

describe('i18n translations', () => {
  it('should have all keys in both languages', () => {
    const enKeys = Object.keys(translations.en);
    const idKeys = Object.keys(translations.id);
    expect(enKeys).toEqual(idKeys);
  });

  it('should return correct translation for store', () => {
    expect(translations.en.nav.store).toBe('STORE');
    expect(translations.id.nav.store).toBe('TOKO');
  });
});
