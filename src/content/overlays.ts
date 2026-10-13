import { GridConfig, ColorBlindnessType } from '../types/visual-modes';

const OVERLAY_ID_HOVER = 'rip-inspect-hover-overlay';
const OVERLAY_ID_SELECTED = 'rip-inspect-selected-overlay';
const OVERLAY_ID_GRID = 'rip-grid-overlay';
const STYLE_ID_XRAY = 'rip-xray-styles';
const STYLE_ID_DARK = 'rip-dark-simulation-styles';
const SVG_FILTER_CONTAINER_ID = 'rip-svg-filters';

/**
 * Create or get hover inspection highlight overlay
 */
export function showHoverOverlay(target: Element) {
  let overlay = document.getElementById(OVERLAY_ID_HOVER);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID_HOVER;
    overlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 2147483640;
      border: 1.5px solid #6366f1;
      background-color: rgba(99, 102, 241, 0.15);
      box-sizing: border-box;
      transition: all 0.05s ease-out;
      border-radius: 2px;
    `;
    const label = document.createElement('div');
    label.className = 'rip-label';
    label.style.cssText = `
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      background: #1e1b4b;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      font-size: 11px;
      font-weight: 500;
      line-height: 1;
      padding: 3px 6px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid rgba(255,255,255,0.15);
    `;
    overlay.appendChild(label);
    document.documentElement.appendChild(overlay);
  }

  const rect = target.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  overlay.style.display = 'block';
  overlay.style.top = `${rect.top + scrollY}px`;
  overlay.style.left = `${rect.left + scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;

  const label = overlay.querySelector('.rip-label') as HTMLElement;
  if (label) {
    const tagName = target.tagName.toLowerCase();
    const idStr = target.id ? `#${target.id}` : '';
    const classStr = Array.from(target.classList)
      .filter((c) => !c.startsWith('rip-'))
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join('');
    const dims = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;

    label.innerHTML = `
      <span style="color: #a5b4fc; font-weight: 600;">${tagName}</span><span style="color: #fbbf24;">${idStr}</span><span style="color: #93c5fd;">${classStr}</span>
      <span style="color: #94a3b8; font-size: 10px; margin-left: 4px; border-left: 1px solid #475569; padding-left: 6px;">${dims}</span>
    `;

    // Position adjustment if near top of viewport
    if (rect.top < 28) {
      label.style.bottom = 'auto';
      label.style.top = '4px';
    } else {
      label.style.top = 'auto';
      label.style.bottom = 'calc(100% + 4px)';
    }
  }
}

export function hideHoverOverlay() {
  const overlay = document.getElementById(OVERLAY_ID_HOVER);
  if (overlay) {
    overlay.style.display = 'none';
  }
}

/**
 * Show persistent border on selected inspected element
 */
export function showSelectedOverlay(target: Element) {
  let overlay = document.getElementById(OVERLAY_ID_SELECTED);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID_SELECTED;
    overlay.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 2147483639;
      border: 2px dashed #3b82f6;
      background-color: rgba(59, 130, 246, 0.08);
      box-sizing: border-box;
      border-radius: 2px;
    `;
    document.documentElement.appendChild(overlay);
  }

  const rect = target.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  overlay.style.display = 'block';
  overlay.style.top = `${rect.top + scrollY}px`;
  overlay.style.left = `${rect.left + scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

export function hideSelectedOverlay() {
  const overlay = document.getElementById(OVERLAY_ID_SELECTED);
  if (overlay) {
    overlay.style.display = 'none';
  }
}

/**
 * Feature Module B: X-Ray Mode
 */
export function setXrayMode(enabled: boolean) {
  let styleEl = document.getElementById(STYLE_ID_XRAY);
  if (enabled) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID_XRAY;
      styleEl.textContent = `
        * {
          outline: 1px solid rgba(99, 102, 241, 0.3) !important;
        }
        div, section, article, main, aside, header, footer, nav {
          outline: 1px solid rgba(59, 130, 246, 0.4) !important;
          background-color: rgba(59, 130, 246, 0.02) !important;
        }
        [style*="display: flex"], [style*="display:flex"], .flex {
          outline: 1.5px solid rgba(236, 72, 153, 0.5) !important;
        }
        [style*="display: grid"], [style*="display:grid"], .grid {
          outline: 1.5px solid rgba(6, 182, 212, 0.5) !important;
        }
        h1, h2, h3, h4, h5, h6, p, span, a, button {
          outline: 1px dashed rgba(245, 158, 11, 0.4) !important;
        }
        img, svg, picture, video, canvas {
          outline: 1.5px solid rgba(16, 185, 129, 0.6) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) {
      styleEl.remove();
    }
  }
}

/**
 * Feature Module B: Adaptive Grid Overlays
 */
export function setGridOverlay(enabled: boolean, config: GridConfig) {
  let gridEl = document.getElementById(OVERLAY_ID_GRID);
  if (!enabled) {
    if (gridEl) gridEl.remove();
    return;
  }

  if (!gridEl) {
    gridEl = document.createElement('div');
    gridEl.id = OVERLAY_ID_GRID;
    document.documentElement.appendChild(gridEl);
  }

  const { columns, gutter, margin, color, opacity } = config;

  gridEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2147483641;
    display: flex;
    box-sizing: border-box;
    padding: 0 ${margin}px;
    gap: ${gutter}px;
  `;

  gridEl.innerHTML = '';
  for (let i = 0; i < columns; i++) {
    const col = document.createElement('div');
    col.style.cssText = `
      flex: 1;
      height: 100%;
      background-color: ${color};
      opacity: ${opacity};
      border-left: 1px dashed ${color};
      border-right: 1px dashed ${color};
      box-sizing: border-box;
    `;
    gridEl.appendChild(col);
  }
}

/**
 * Feature Module B: Dark Theme Simulation
 */
export function setDarkThemeSimulation(mode: 'disabled' | 'native' | 'simulated') {
  let styleEl = document.getElementById(STYLE_ID_DARK);
  if (mode === 'simulated') {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID_DARK;
      styleEl.textContent = `
        html {
          filter: invert(0.88) hue-rotate(180deg) !important;
          background: #111 !important;
        }
        img, picture, video, canvas, svg, [style*="background-image"] {
          filter: invert(1.14) hue-rotate(180deg) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) {
      styleEl.remove();
    }
  }
}

/**
 * Feature Module B: Color Blindness SVG Filters
 */
export function setColorBlindnessFilter(type: ColorBlindnessType) {
  let filterContainer = document.getElementById(SVG_FILTER_CONTAINER_ID);

  if (type === 'none') {
    document.documentElement.style.removeProperty('filter');
    if (filterContainer) filterContainer.remove();
    return;
  }

  if (!filterContainer) {
    filterContainer = document.createElement('div');
    filterContainer.id = SVG_FILTER_CONTAINER_ID;
    filterContainer.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;';
    filterContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="rip-protanopia">
          <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0   0.558, 0.442, 0, 0, 0   0, 0.242, 0.758, 0, 0   0, 0, 0, 1, 0" />
        </filter>
        <filter id="rip-deuteranopia">
          <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0   0.7, 0.3, 0, 0, 0   0, 0.3, 0.7, 0, 0   0, 0, 0, 1, 0" />
        </filter>
        <filter id="rip-tritanopia">
          <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0   0, 0.433, 0.567, 0, 0   0, 0.475, 0.525, 0, 0   0, 0, 0, 1, 0" />
        </filter>
        <filter id="rip-achromatopsia">
          <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0   0.299, 0.587, 0.114, 0, 0   0.299, 0.587, 0.114, 0, 0   0, 0, 0, 1, 0" />
        </filter>
      </svg>
    `;
    document.documentElement.appendChild(filterContainer);
  }

  document.documentElement.style.filter = `url(#rip-${type})`;
}

/**
 * Remove all extension injected DOM elements, overlays, and styles
 */
export function removeAllOverlays() {
  hideHoverOverlay();
  hideSelectedOverlay();
  setXrayMode(false);
  setGridOverlay(false, { columns: 12, gutter: 20, margin: 32, color: '#6366f1', opacity: 0.15 });
  setDarkThemeSimulation('disabled');
  setColorBlindnessFilter('none');

  document.getElementById(OVERLAY_ID_HOVER)?.remove();
  document.getElementById(OVERLAY_ID_SELECTED)?.remove();
  document.getElementById(OVERLAY_ID_GRID)?.remove();
  document.getElementById(STYLE_ID_XRAY)?.remove();
  document.getElementById(STYLE_ID_DARK)?.remove();
  document.getElementById(SVG_FILTER_CONTAINER_ID)?.remove();
}
