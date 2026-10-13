import {
  showHoverOverlay,
  hideHoverOverlay,
  showSelectedOverlay,
  hideSelectedOverlay,
  setXrayMode,
  setGridOverlay,
  setDarkThemeSimulation,
  setColorBlindnessFilter,
  removeAllOverlays,
} from './overlays';
import { extractElementInfo, getUniqueSelector } from '../utils/dom-utils';
import { ExtensionMessage, ExtensionResponse } from '../types/messages';
import { GridConfig, ColorBlindnessType, DarkThemeMode } from '../types/visual-modes';
import { PageAsset } from '../types/assets';

// Inspection State
let isPickerActive = false;
let selectedElement: HTMLElement | null = null;
let hoveredElement: Element | null = null;

// Original attributes tracking for safe revert
const originalStylesMap = new WeakMap<HTMLElement, Map<string, string>>();
const originalTextMap = new WeakMap<HTMLElement, string>();
const originalSrcMap = new WeakMap<HTMLElement, string>();

function onMouseMove(e: MouseEvent) {
  if (!isPickerActive) return;

  // Find topmost non-overlay element
  const elements = document.elementsFromPoint(e.clientX, e.clientY);
  const target = elements.find((el) => {
    return !el.id.startsWith('rip-') && !el.closest('#rip-inspect-hover-overlay') && !el.closest('#rip-grid-overlay');
  });

  if (target && target !== hoveredElement && target !== document.documentElement && target !== document.body) {
    hoveredElement = target;
    showHoverOverlay(target);
  }
}

function onClick(e: MouseEvent) {
  if (!isPickerActive) return;

  e.preventDefault();
  e.stopPropagation();

  const elements = document.elementsFromPoint(e.clientX, e.clientY);
  const target = elements.find((el) => {
    return !el.id.startsWith('rip-') && !el.closest('#rip-inspect-hover-overlay') && !el.closest('#rip-grid-overlay');
  });

  if (target && target instanceof HTMLElement) {
    selectTargetElement(target);
    stopPicker();

    // Send selection to popup/sidepanel
    chrome.runtime.sendMessage({
      action: 'ELEMENT_SELECTED',
      payload: extractElementInfo(target),
    }).catch(() => {
      // Listener might not be open, that's normal
    });
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isPickerActive) {
    stopPicker();
    chrome.runtime.sendMessage({ action: 'STOP_PICKER' }).catch(() => {});
  }
}

export function startPicker() {
  isPickerActive = true;
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKeyDown, true);
  document.body.style.cursor = 'crosshair';
}

export function stopPicker() {
  isPickerActive = false;
  hoveredElement = null;
  hideHoverOverlay();
  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('keydown', onKeyDown, true);
  document.body.style.cursor = '';
}

export function selectTargetElement(el: HTMLElement) {
  selectedElement = el;
  showSelectedOverlay(el);
}

export function clearSelection() {
  selectedElement = null;
  hideSelectedOverlay();
}

/**
 * Live CSS Modification with original value preservation
 */
export function applyCss(selector: string, property: string, value: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  if (!originalStylesMap.has(el)) {
    originalStylesMap.set(el, new Map());
  }

  const elStyles = originalStylesMap.get(el)!;
  if (!elStyles.has(property)) {
    // Save original inline style or computed fallback
    elStyles.set(property, el.style.getPropertyValue(property) || '');
  }

  el.style.setProperty(property, value, 'important');
  showSelectedOverlay(el);
  return { success: true };
}

export function removeCss(selector: string, property: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  const elStyles = originalStylesMap.get(el);
  if (elStyles && elStyles.has(property)) {
    const origVal = elStyles.get(property)!;
    if (origVal) {
      el.style.setProperty(property, origVal);
    } else {
      el.style.removeProperty(property);
    }
  } else {
    el.style.removeProperty(property);
  }

  showSelectedOverlay(el);
  return { success: true };
}

export function resetElementCss(selector: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  const elStyles = originalStylesMap.get(el);
  if (elStyles) {
    elStyles.forEach((val, prop) => {
      if (val) {
        el.style.setProperty(prop, val);
      } else {
        el.style.removeProperty(prop);
      }
    });
    originalStylesMap.delete(el);
  }

  showSelectedOverlay(el);
  return { success: true };
}

/**
 * Text Content Editing & Revert
 */
export function updateText(selector: string, newText: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  if (!originalTextMap.has(el)) {
    originalTextMap.set(el, el.textContent || '');
  }

  el.textContent = newText;
  showSelectedOverlay(el);
  return { success: true };
}

export function resetText(selector: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  if (originalTextMap.has(el)) {
    el.textContent = originalTextMap.get(el)!;
    originalTextMap.delete(el);
  }

  showSelectedOverlay(el);
  return { success: true };
}

/**
 * Image URL Editing & Revert
 */
export function updateImage(selector: string, newSrc: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  if (el instanceof HTMLImageElement) {
    if (!originalSrcMap.has(el)) {
      originalSrcMap.set(el, el.src);
    }
    el.src = newSrc;
  } else {
    // Background image
    if (!originalSrcMap.has(el)) {
      originalSrcMap.set(el, el.style.backgroundImage || '');
    }
    el.style.backgroundImage = `url("${newSrc}")`;
  }

  showSelectedOverlay(el);
  return { success: true };
}

export function resetImage(selector: string) {
  const el = (selectedElement && getUniqueSelector(selectedElement) === selector)
    ? selectedElement
    : (document.querySelector(selector) as HTMLElement | null);

  if (!el) return { success: false, error: 'Element not found' };

  if (originalSrcMap.has(el)) {
    const orig = originalSrcMap.get(el)!;
    if (el instanceof HTMLImageElement) {
      el.src = orig;
    } else {
      el.style.backgroundImage = orig;
    }
    originalSrcMap.delete(el);
  }

  showSelectedOverlay(el);
  return { success: true };
}

/**
 * Discover Page Assets
 */
export function discoverPageAssets(): PageAsset[] {
  const assets: PageAsset[] = [];
  const seenUrls = new Set<string>();

  // 1. Image elements <img>
  const imgs = Array.from(document.querySelectorAll('img'));
  imgs.forEach((img, idx) => {
    const src = img.currentSrc || img.src;
    if (src && !src.startsWith('chrome-extension://') && !seenUrls.has(src)) {
      seenUrls.add(src);
      assets.push({
        id: `img-${idx}`,
        type: 'image',
        url: src,
        altText: img.alt || '',
        dimensions: {
          width: img.naturalWidth || img.clientWidth,
          height: img.naturalHeight || img.clientHeight,
        },
      });
    }
  });

  // 2. SVG elements <svg>
  const svgs = Array.from(document.querySelectorAll('svg'));
  svgs.forEach((svg, idx) => {
    // If it's not part of the extension's overlays
    if (svg.closest('#rip-svg-filters') || svg.closest('#rip-inspect-hover-overlay')) return;

    const bbox = svg.getBoundingClientRect();
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    assets.push({
      id: `svg-${idx}`,
      type: 'svg',
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`,
      altText: svg.getAttribute('aria-label') || svg.getAttribute('name') || `SVG Icon #${idx + 1}`,
      dimensions: {
        width: Math.round(bbox.width) || 24,
        height: Math.round(bbox.height) || 24,
      },
      isInlineSvg: true,
      svgContent: svgStr,
    });
  });

  // 3. Background images
  const allElements = Array.from(document.querySelectorAll('*'));
  let bgIdx = 0;
  for (const el of allElements) {
    if (el.id.startsWith('rip-')) continue;
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== 'none' && bgImage.startsWith('url(')) {
      const match = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (match && match[1] && !seenUrls.has(match[1])) {
        seenUrls.add(match[1]);
        const rect = el.getBoundingClientRect();
        assets.push({
          id: `bg-${bgIdx++}`,
          type: 'background-image',
          url: match[1],
          altText: `Background on <${el.tagName.toLowerCase()}>`,
          dimensions: {
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        });
      }
    }
  }

  return assets.slice(0, 100); // Sensible limit to prevent UI lag
}

// Global Message Listener for Extension Communication
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse: (res: ExtensionResponse) => void) => {
    switch (message.action) {
      case 'PING':
        sendResponse({ success: true });
        break;

      case 'START_PICKER':
        startPicker();
        sendResponse({ success: true });
        break;

      case 'STOP_PICKER':
        stopPicker();
        sendResponse({ success: true });
        break;

      case 'CLEAR_SELECTION':
        clearSelection();
        sendResponse({ success: true });
        break;

      case 'APPLY_CSS': {
        const payload = message.payload as { selector: string; property: string; value: string };
        const res = applyCss(payload.selector, payload.property, payload.value);
        sendResponse(res);
        break;
      }

      case 'REMOVE_CSS': {
        const payload = message.payload as { selector: string; property: string };
        const res = removeCss(payload.selector, payload.property);
        sendResponse(res);
        break;
      }

      case 'RESET_ELEMENT_CSS': {
        const payload = message.payload as { selector: string };
        const res = resetElementCss(payload.selector);
        sendResponse(res);
        break;
      }

      case 'UPDATE_TEXT': {
        const payload = message.payload as { selector: string; text: string };
        const res = updateText(payload.selector, payload.text);
        sendResponse(res);
        break;
      }

      case 'RESET_TEXT': {
        const payload = message.payload as { selector: string };
        const res = resetText(payload.selector);
        sendResponse(res);
        break;
      }

      case 'UPDATE_IMAGE': {
        const payload = message.payload as { selector: string; src: string };
        const res = updateImage(payload.selector, payload.src);
        sendResponse(res);
        break;
      }

      case 'RESET_IMAGE': {
        const payload = message.payload as { selector: string };
        const res = resetImage(payload.selector);
        sendResponse(res);
        break;
      }

      case 'SET_XRAY': {
        const payload = message.payload as { enabled: boolean };
        setXrayMode(payload.enabled);
        sendResponse({ success: true });
        break;
      }

      case 'SET_GRID': {
        const payload = message.payload as { enabled: boolean; config: GridConfig };
        setGridOverlay(payload.enabled, payload.config);
        sendResponse({ success: true });
        break;
      }

      case 'SET_DARK_THEME': {
        const payload = message.payload as { mode: DarkThemeMode };
        setDarkThemeSimulation(payload.mode);
        sendResponse({ success: true });
        break;
      }

      case 'SET_COLOR_BLINDNESS': {
        const payload = message.payload as { type: ColorBlindnessType };
        setColorBlindnessFilter(payload.type);
        sendResponse({ success: true });
        break;
      }

      case 'DISCOVER_ASSETS': {
        const assets = discoverPageAssets();
        sendResponse({ success: true, data: assets });
        break;
      }

      case 'SYNC_SCROLL': {
        const payload = message.payload as { scrollX: number; scrollY: number };
        window.scrollTo({
          left: payload.scrollX,
          top: payload.scrollY,
          behavior: 'auto',
        });
        sendResponse({ success: true });
        break;
      }

      case 'SYNC_SCROLL_DELTA': {
        const payload = message.payload as { deltaY: number };
        window.scrollBy({
          top: payload.deltaY,
          behavior: 'auto',
        });
        sendResponse({ success: true });
        break;
      }

      case 'GET_PAGE_INFO': {
        sendResponse({
          success: true,
          data: {
            title: document.title,
            url: window.location.href,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
              devicePixelRatio: window.devicePixelRatio,
            },
          },
        });
        break;
      }

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }

    return true; // Keep message channel open for async response
  }
);

// Cross-origin iframe postMessage listener for smooth Ctrl+scroll & synchronized scrolling
window.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.action === 'SYNC_SCROLL_DELTA') {
    window.scrollBy({ top: event.data.deltaY || 0, behavior: 'auto' });
  } else if (event.data.action === 'SYNC_SCROLL_PERCENT') {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: (event.data.percent || 0) * maxScroll, behavior: 'auto' });
  }
});

// Clean up if unloaded
window.addEventListener('beforeunload', () => {
  removeAllOverlays();
});
