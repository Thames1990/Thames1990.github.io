import { describe, expect, it } from 'vitest';
import {
  calculatePointerOffset,
  calculateRevealDelay,
  calculateScrollProgress,
  formatCounterValue,
} from './interactions';

describe('calculateScrollProgress', () => {
  it('returns the bounded proportion of the document that has been scrolled', () => {
    expect(calculateScrollProgress(250, 1_000, 500)).toBe(0.5);
    expect(calculateScrollProgress(-100, 1_000, 500)).toBe(0);
    expect(calculateScrollProgress(700, 1_000, 500)).toBe(1);
  });

  it('returns zero when the document has no scrollable area', () => {
    expect(calculateScrollProgress(0, 500, 500)).toBe(0);
    expect(calculateScrollProgress(100, 400, 500)).toBe(0);
  });
});

describe('calculatePointerOffset', () => {
  it('maps the element edges to opposite signed strengths', () => {
    expect(calculatePointerOffset(0, 0, 100, 20)).toBe(-10);
    expect(calculatePointerOffset(50, 0, 100, 20)).toBe(0);
    expect(calculatePointerOffset(100, 0, 100, 20)).toBe(10);
  });

  it('returns zero for invalid dimensions instead of producing Infinity or NaN', () => {
    expect(calculatePointerOffset(50, 0, 0, 20)).toBe(0);
    expect(calculatePointerOffset(50, 0, Number.NaN, 20)).toBe(0);
  });
});

describe('calculateRevealDelay', () => {
  it('stagger delays by sibling order and caps the maximum delay', () => {
    expect(calculateRevealDelay(0)).toBe(0);
    expect(calculateRevealDelay(3)).toBe(210);
    expect(calculateRevealDelay(99)).toBe(420);
  });

  it('does not create negative delays', () => {
    expect(calculateRevealDelay(-1)).toBe(0);
  });
});

describe('formatCounterValue', () => {
  it('preserves configured prefixes and suffixes', () => {
    expect(formatCounterValue(8, '', '+ years')).toBe('8+ years');
    expect(formatCounterValue(10, '≈', 'k')).toBe('≈10k');
  });
});
