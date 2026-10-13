import { describe, it, expect } from 'vitest';
import {
  parseColor,
  rgbaToHex,
  rgbaToRgbString,
  rgbaToHsl,
  calculateContrastRatio,
  getRelativeLuminance,
} from '../src/utils/color-utils';

describe('Color Tools & WCAG Contrast Calculations', () => {
  it('correctly parses hex colors (3, 4, 6, 8 digits)', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor('#00ff0080')).toEqual({ r: 0, g: 255, b: 0, a: 128 / 255 });
  });

  it('correctly parses rgb and rgba strings', () => {
    expect(parseColor('rgb(255, 128, 0)')).toEqual({ r: 255, g: 128, b: 0, a: 1 });
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it('converts RGBA to HEX, RGB string and HSL accurately', () => {
    const color = { r: 99, g: 102, b: 241, a: 1 };
    expect(rgbaToHex(color)).toBe('#6366f1');
    expect(rgbaToRgbString(color)).toBe('rgb(99, 102, 241)');

    const hsl = rgbaToHsl(color);
    expect(hsl.h).toBeGreaterThanOrEqual(235);
    expect(hsl.h).toBeLessThanOrEqual(245);
    expect(hsl.s).toBeGreaterThanOrEqual(80);
  });

  it('calculates WCAG relative luminance according to specs', () => {
    expect(getRelativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1.0, 2);
    expect(getRelativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBeCloseTo(0.0, 2);
  });

  it('calculates contrast ratio and compliance correctly for Black on White', () => {
    const result = calculateContrastRatio('#000000', '#ffffff');
    expect(result.ratio).toBe(21.0);
    expect(result.aaNormal).toBe(true);
    expect(result.aaLarge).toBe(true);
    expect(result.aaaNormal).toBe(true);
    expect(result.aaaLarge).toBe(true);
  });

  it('flags failing contrast ratios for low-contrast text', () => {
    const result = calculateContrastRatio('#999999', '#ffffff');
    expect(result.ratio).toBeLessThan(4.5);
    expect(result.aaNormal).toBe(false);
  });

  it('handles transparent backgrounds with composite estimation note', () => {
    const result = calculateContrastRatio('#000000', 'rgba(0, 0, 0, 0)');
    expect(result.isEstimated).toBe(true);
    expect(result.note).toBeDefined();
  });
});
