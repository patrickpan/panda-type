import { generateWords } from './wordList';

describe('generateWords', () => {
  test('returns the requested number of words', () => {
    expect(generateWords(10)).toHaveLength(10);
    expect(generateWords(1)).toHaveLength(1);
    expect(generateWords(0)).toHaveLength(0);
  });

  test('returns no duplicate words', () => {
    const words = generateWords(20);
    const unique = new Set(words);
    expect(unique.size).toBe(words.length);
  });

  test('returns non-empty strings without spaces', () => {
    const words = generateWords(10);
    words.forEach((w) => {
      expect(typeof w).toBe('string');
      expect(w.length).toBeGreaterThan(0);
      expect(w).not.toMatch(/\s/);
    });
  });

  test('produces a different order on each call', () => {
    const a = generateWords(15);
    const b = generateWords(15);
    // Same words, different order — unlikely to be identical for 15 words
    expect(a.join(' ')).not.toBe(b.join(' '));
  });
});
