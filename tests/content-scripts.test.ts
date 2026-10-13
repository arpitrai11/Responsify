import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  applyCss,
  removeCss,
  resetElementCss,
  updateText,
  resetText,
  updateImage,
  resetImage,
  discoverPageAssets,
} from '../src/content/inspector';
import {
  setXrayMode,
  setGridOverlay,
  setDarkThemeSimulation,
  setColorBlindnessFilter,
  removeAllOverlays,
} from '../src/content/overlays';

describe('Content Scripts: Page Modification and Visual Overlays', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-card" style="color: blue; padding: 10px;">
        <h2 id="card-title">Initial Title</h2>
        <img id="card-avatar" src="https://example.com/avatar.png" alt="User avatar" />
        <svg id="card-icon" width="24" height="24"><circle cx="12" cy="12" r="10" /></svg>
      </div>
    `;
  });

  afterEach(() => {
    removeAllOverlays();
  });

  it('applies CSS property live and preserves original for restoration', () => {
    const card = document.getElementById('test-card')!;
    expect(card.style.color).toBe('blue');

    applyCss('#test-card', 'color', '#ff0000');
    expect(card.style.color).toBe('rgb(255, 0, 0)');

    // Revert
    removeCss('#test-card', 'color');
    expect(card.style.color).toBe('blue');
  });

  it('resets all modified CSS properties on an element', () => {
    const card = document.getElementById('test-card')!;
    applyCss('#test-card', 'background-color', 'yellow');
    applyCss('#test-card', 'font-size', '20px');

    expect(card.style.backgroundColor).toBe('yellow');
    expect(card.style.fontSize).toBe('20px');

    resetElementCss('#test-card');
    expect(card.style.backgroundColor).toBe('');
    expect(card.style.fontSize).toBe('');
  });

  it('updates text content and restores original', () => {
    const title = document.getElementById('card-title')!;
    expect(title.textContent).toBe('Initial Title');

    updateText('#card-title', 'Updated Heading Pro');
    expect(title.textContent).toBe('Updated Heading Pro');

    resetText('#card-title');
    expect(title.textContent).toBe('Initial Title');
  });

  it('replaces image source and restores original', () => {
    const avatar = document.getElementById('card-avatar') as HTMLImageElement;
    expect(avatar.src).toBe('https://example.com/avatar.png');

    updateImage('#card-avatar', 'https://example.com/new-avatar.png');
    expect(avatar.src).toBe('https://example.com/new-avatar.png');

    resetImage('#card-avatar');
    expect(avatar.src).toBe('https://example.com/avatar.png');
  });

  it('discovers images and SVGs on the page', () => {
    const assets = discoverPageAssets();
    expect(assets.length).toBeGreaterThanOrEqual(2);

    const imgAsset = assets.find((a) => a.type === 'image');
    expect(imgAsset).toBeDefined();
    expect(imgAsset?.url).toBe('https://example.com/avatar.png');

    const svgAsset = assets.find((a) => a.type === 'svg');
    expect(svgAsset).toBeDefined();
    expect(svgAsset?.isInlineSvg).toBe(true);
  });

  it('activates and cleans up X-Ray mode styles', () => {
    setXrayMode(true);
    expect(document.getElementById('rip-xray-styles')).not.toBeNull();

    setXrayMode(false);
    expect(document.getElementById('rip-xray-styles')).toBeNull();
  });

  it('activates and cleans up adaptive grid overlay', () => {
    setGridOverlay(true, { columns: 12, gutter: 20, margin: 32, color: '#6366f1', opacity: 0.15 });
    const grid = document.getElementById('rip-grid-overlay');
    expect(grid).not.toBeNull();
    expect(grid?.children.length).toBe(12);

    setGridOverlay(false, { columns: 12, gutter: 20, margin: 32, color: '#6366f1', opacity: 0.15 });
    expect(document.getElementById('rip-grid-overlay')).toBeNull();
  });

  it('activates and cleans up dark theme simulation', () => {
    setDarkThemeSimulation('simulated');
    expect(document.getElementById('rip-dark-simulation-styles')).not.toBeNull();

    setDarkThemeSimulation('disabled');
    expect(document.getElementById('rip-dark-simulation-styles')).toBeNull();
  });

  it('activates and cleans up color blindness SVG filters', () => {
    setColorBlindnessFilter('protanopia');
    expect(document.getElementById('rip-svg-filters')).not.toBeNull();
    expect(document.documentElement.style.filter).toContain('url(#rip-protanopia)');

    setColorBlindnessFilter('none');
    expect(document.documentElement.style.filter).toBe('');
  });
});
