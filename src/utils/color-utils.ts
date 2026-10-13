export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

/**
 * Parse any CSS color string (hex, rgb, rgba, hsl, hsla, named color)
 */
export function parseColor(colorStr: string): RgbaColor | null {
  if (!colorStr) return null;
  const str = colorStr.trim().toLowerCase();

  // Handle transparent or initial/inherit
  if (str === 'transparent' || str === 'rgba(0, 0, 0, 0)') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // Hex format (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 4) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16) / 255,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    }
  }

  // RGB / RGBA format
  const rgbMatch = str.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return {
      r: Math.min(255, Math.max(0, parseFloat(rgbMatch[1]))),
      g: Math.min(255, Math.max(0, parseFloat(rgbMatch[2]))),
      b: Math.min(255, Math.max(0, parseFloat(rgbMatch[3]))),
      a: rgbMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbMatch[4]))) : 1,
    };
  }

  // Modern rgb(r g b / a) syntax
  const modernRgb = str.match(/rgba?\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/);
  if (modernRgb) {
    let alpha = 1;
    if (modernRgb[4]) {
      alpha = modernRgb[4].endsWith('%') ? parseFloat(modernRgb[4]) / 100 : parseFloat(modernRgb[4]);
    }
    return {
      r: Math.min(255, Math.max(0, parseFloat(modernRgb[1]))),
      g: Math.min(255, Math.max(0, parseFloat(modernRgb[2]))),
      b: Math.min(255, Math.max(0, parseFloat(modernRgb[3]))),
      a: Math.min(1, Math.max(0, alpha)),
    };
  }

  // DOM fallback parser if running in browser
  if (typeof document !== 'undefined') {
    const dummy = document.createElement('div');
    dummy.style.color = str;
    document.body?.appendChild(dummy);
    const computed = window.getComputedStyle(dummy).color;
    document.body?.removeChild(dummy);
    if (computed && computed !== str) {
      return parseColor(computed);
    }
  }

  return null;
}

export function rgbaToHex(rgba: RgbaColor): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');
  if (rgba.a < 1) {
    const a = Math.round(rgba.a * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`;
}

export function rgbaToRgbString(rgba: RgbaColor): string {
  if (rgba.a < 1) {
    return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${parseFloat(rgba.a.toFixed(2))})`;
  }
  return `rgb(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)})`;
}

export function rgbaToHsl(rgba: RgbaColor): HslColor {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: rgba.a,
  };
}

export function hslToString(hsl: HslColor): string {
  if (hsl.a !== undefined && hsl.a < 1) {
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${parseFloat(hsl.a.toFixed(2))})`;
  }
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * WCAG 2.1 Relative Luminance calculation
 */
export function getRelativeLuminance(rgba: RgbaColor): number {
  const normalize = (val: number) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = normalize(rgba.r);
  const g = normalize(rgba.g);
  const b = normalize(rgba.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Composite a semi-transparent foreground over an opaque background
 */
export function compositeColors(fg: RgbaColor, bg: RgbaColor = { r: 255, g: 255, b: 255, a: 1 }): RgbaColor {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 255, g: 255, b: 255, a: 1 };

  return {
    r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
    g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
    b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
    a: Math.min(1, a),
  };
}

/**
 * Calculate WCAG Contrast Ratio between two colors
 */
export function calculateContrastRatio(fgColorStr: string, bgColorStr: string) {
  const fg = parseColor(fgColorStr) || { r: 0, g: 0, b: 0, a: 1 };
  let bg = parseColor(bgColorStr) || { r: 255, g: 255, b: 255, a: 1 };

  let isEstimated = false;
  let note = '';

  // If background is transparent, composite against white
  if (bg.a < 1) {
    isEstimated = true;
    bg = compositeColors(bg, { r: 255, g: 255, b: 255, a: 1 });
    note = 'Background has transparency; composited over white';
  }

  // If foreground is semi-transparent, composite over resolved background
  const resolvedFg = fg.a < 1 ? compositeColors(fg, bg) : fg;

  const l1 = getRelativeLuminance(resolvedFg);
  const l2 = getRelativeLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const rawRatio = (lighter + 0.05) / (darker + 0.05);
  const ratio = parseFloat(rawRatio.toFixed(2));

  return {
    foreground: rgbaToHex(resolvedFg),
    background: rgbaToHex(bg),
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
    isEstimated,
    note,
  };
}
