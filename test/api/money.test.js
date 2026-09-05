import { describe, expect, it } from 'vitest';
import { fromCents, isCents, roundCents, toCents } from '../../api/_lib/money.js';

describe('toCents', () => {
  it('converts reais to integer cents', () => {
    expect(toCents(12.34)).toBe(1234);
    expect(toCents(0)).toBe(0);
    expect(toCents(1)).toBe(100);
    expect(toCents(1000)).toBe(100000);
  });

  it('accepts a numeric string', () => {
    expect(toCents('12.34')).toBe(1234);
    expect(toCents('0.05')).toBe(5);
  });

  it('kills the float tail instead of carrying it', () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(1.1 * 3)).toBe(330);
    expect(toCents(32.9 * 0.35)).toBe(1152);
  });

  it('rounds half up on the third decimal', () => {
    expect(toCents(12.345)).toBe(1235);
    expect(toCents(12.344)).toBe(1234);
    expect(toCents(0.005)).toBe(1);
  });

  it('treats empty input as zero', () => {
    expect(toCents(null)).toBe(0);
    expect(toCents(undefined)).toBe(0);
    expect(toCents('')).toBe(0);
    expect(toCents(NaN)).toBe(0);
  });

  it('always returns an integer', () => {
    for (const value of [0.01, 0.1, 1.005, 99.999, 12345.678]) {
      expect(Number.isInteger(toCents(value))).toBe(true);
    }
  });
});

describe('roundCents', () => {
  it('rounds half up', () => {
    expect(roundCents(338.85)).toBe(339);
    expect(roundCents(0.5)).toBe(1);
    expect(roundCents(0.4)).toBe(0);
  });

  it('trims float noise before rounding', () => {
    expect(roundCents(100.00000000000001)).toBe(100);
    // Really 1151.5 with float error, so half-up must reach 1152 -- matching
    // toCents(32.9 * 0.35).
    expect(roundCents(1151.4999999999998)).toBe(1152);
  });

  it('leaves integers untouched', () => {
    expect(roundCents(2259)).toBe(2259);
    expect(roundCents(0)).toBe(0);
  });

  it('treats non-finite input as zero', () => {
    expect(roundCents(NaN)).toBe(0);
    expect(roundCents(Infinity)).toBe(0);
  });
});

describe('fromCents', () => {
  it('converts integer cents back to reais', () => {
    expect(fromCents(1234)).toBe(12.34);
    expect(fromCents(0)).toBe(0);
    expect(fromCents(5)).toBe(0.05);
    expect(fromCents(100000)).toBe(1000);
  });

  it('treats empty input as zero', () => {
    expect(fromCents(null)).toBe(0);
    expect(fromCents(undefined)).toBe(0);
  });
});

describe('roundtrip', () => {
  it('survives toCents -> fromCents -> toCents', () => {
    for (const cents of [0, 1, 5, 99, 100, 1234, 99999, 1000000]) {
      expect(toCents(fromCents(cents))).toBe(cents);
    }
  });
});

describe('isCents', () => {
  it('accepts non-negative integers', () => {
    expect(isCents(0)).toBe(true);
    expect(isCents(1234)).toBe(true);
  });

  it('rejects fractional values', () => {
    expect(isCents(12.34)).toBe(false);
    expect(isCents(0.5)).toBe(false);
  });

  it('rejects negatives and non-numbers', () => {
    expect(isCents(-1)).toBe(false);
    expect(isCents(null)).toBe(false);
    expect(isCents('1234')).toBe(false);
    expect(isCents(NaN)).toBe(false);
    expect(isCents(Infinity)).toBe(false);
  });
});
