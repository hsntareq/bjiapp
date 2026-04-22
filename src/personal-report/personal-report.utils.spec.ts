import {
  getElapsedOrgWorkSeconds,
  normalizeOrgWorkTotalSeconds,
  normalizeSalahJamaat,
  splitOrgWorkSeconds,
} from './personal-report.utils';

describe('normalizeSalahJamaat', () => {
  it('converts legacy boolean values to numeric counts', () => {
    expect(normalizeSalahJamaat(true)).toBe(1);
    expect(normalizeSalahJamaat(false)).toBe(0);
  });

  it('clamps numeric values into the valid 0..5 range', () => {
    expect(normalizeSalahJamaat(-1)).toBe(0);
    expect(normalizeSalahJamaat(3)).toBe(3);
    expect(normalizeSalahJamaat(6)).toBe(5);
  });

  it('falls back to zero for non-numeric values', () => {
    expect(normalizeSalahJamaat(undefined)).toBe(0);
    expect(normalizeSalahJamaat('abc')).toBe(0);
  });
});

describe('org work helpers', () => {
  it('normalizes total org work seconds from hours, minutes and seconds', () => {
    expect(normalizeOrgWorkTotalSeconds(1, 30, 15)).toBe(5415);
    expect(normalizeOrgWorkTotalSeconds(-1, 10, 0)).toBe(0);
    expect(normalizeOrgWorkTotalSeconds(24, 0, 0)).toBe(23 * 3600 + 59 * 60 + 59);
  });

  it('splits total seconds into hours, minutes, and seconds', () => {
    expect(splitOrgWorkSeconds(5415)).toEqual({
      orgWorkHours: 1,
      orgWorkMinutes: 30,
      orgWorkSeconds: 15,
    });
  });

  it('calculates elapsed seconds from a start timestamp', () => {
    const startedAt = new Date('2026-04-22T10:00:00.000Z');
    const now = new Date('2026-04-22T11:45:59.000Z');
    expect(getElapsedOrgWorkSeconds(startedAt, now)).toBe(105 * 60 + 59);
  });
});
