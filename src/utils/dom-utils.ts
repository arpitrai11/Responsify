import { BoxModelData, HierarchyNode, ElementInfo } from '../types/inspector';
import { calculateContrastRatio } from './color-utils';

export function getUniqueSelector(element: Element): string {
  if (!(element instanceof Element)) return '';

  // If element has a valid unique ID
  if (element.id && document.querySelectorAll(`#${CSS.escape(element.id)}`).length === 1) {
    return `#${CSS.escape(element.id)}`;
  }

  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${CSS.escape(current.id)}`;
      path.unshift(selector);
      break;
    } else {
      // Use class names if specific enough
      const meaningfulClasses = Array.from(current.classList)
        .filter((c) => !c.startsWith('rip-') && !c.includes(':') && !c.includes('['))
        .slice(0, 2);

      if (meaningfulClasses.length > 0) {
        selector += `.${meaningfulClasses.map((c) => CSS.escape(c)).join('.')}`;
      }

      // Check siblings for nth-of-type
      if (current.parentElement) {
        const siblings = Array.from(current.parentElement.children).filter(
          (c) => c.tagName === current!.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ') || element.tagName.toLowerCase();
}

export function getBoxModel(element: Element): BoxModelData {
  const computed = window.getComputedStyle(element);

  const parsePx = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : Math.round(num);
  };

  const rect = element.getBoundingClientRect();

  const padding = {
    top: parsePx(computed.paddingTop),
    right: parsePx(computed.paddingRight),
    bottom: parsePx(computed.paddingBottom),
    left: parsePx(computed.paddingLeft),
  };

  const border = {
    top: parsePx(computed.borderTopWidth),
    right: parsePx(computed.borderRightWidth),
    bottom: parsePx(computed.borderBottomWidth),
    left: parsePx(computed.borderLeftWidth),
  };

  const margin = {
    top: parsePx(computed.marginTop),
    right: parsePx(computed.marginRight),
    bottom: parsePx(computed.marginBottom),
    left: parsePx(computed.marginLeft),
  };

  // Content width/height inside padding and border
  const contentWidth = Math.max(0, Math.round(rect.width - padding.left - padding.right - border.left - border.right));
  const contentHeight = Math.max(0, Math.round(rect.height - padding.top - padding.bottom - border.top - border.bottom));

  return {
    margin,
    border,
    padding,
    content: {
      width: contentWidth,
      height: contentHeight,
    },
  };
}

export function getHierarchy(element: Element): HierarchyNode[] {
  const nodes: HierarchyNode[] = [];
  let current: Element | null = element;

  while (current && current !== document.documentElement) {
    nodes.unshift({
      tagName: current.tagName.toLowerCase(),
      id: current.id || '',
      classList: Array.from(current.classList).filter((c) => !c.startsWith('rip-')),
      selector: getUniqueSelector(current),
    });
    current = current.parentElement;
  }

  return nodes;
}

export function getEffectiveBackgroundColor(element: Element): string {
  let current: Element | null = element;
  while (current) {
    const bg = window.getComputedStyle(current).backgroundColor;
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      return bg;
    }
    current = current.parentElement;
  }
  return 'rgb(255, 255, 255)'; // Default document background fallback
}

export function extractElementInfo(element: Element): ElementInfo {
  const computed = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const selector = getUniqueSelector(element);
  const boxModel = getBoxModel(element);
  const parentHierarchy = getHierarchy(element);

  // Extract common interesting computed styles
  const importantProps = [
    'display', 'position', 'flex-direction', 'justify-content', 'align-items',
    'gap', 'grid-template-columns', 'grid-template-rows',
    'width', 'height', 'max-width', 'min-width',
    'margin', 'padding', 'font-family', 'font-size', 'font-weight',
    'line-height', 'letter-spacing', 'text-align', 'color',
    'background-color', 'border-color', 'border-width', 'border-radius',
    'box-shadow', 'opacity', 'z-index', 'overflow', 'cursor', 'transition'
  ];

  const computedStyles: Record<string, string> = {};
  for (const prop of importantProps) {
    computedStyles[prop] = computed.getPropertyValue(prop);
  }

  // Also include any inline styles set on element
  const inlineStyles: Record<string, string> = {};
  if (element instanceof HTMLElement) {
    for (let i = 0; i < element.style.length; i++) {
      const prop = element.style[i];
      inlineStyles[prop] = element.style.getPropertyValue(prop);
    }
  }

  const fgColor = computed.color;
  const bgColor = getEffectiveBackgroundColor(element);
  const borderColor = computed.borderColor;

  const contrast = calculateContrastRatio(fgColor, bgColor);

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || '',
    classList: Array.from(element.classList).filter((c) => !c.startsWith('rip-')),
    selector,
    rect: {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    boxModel,
    computedStyles,
    inlineStyles,
    textContent: (element.textContent || '').trim().slice(0, 150),
    parentHierarchy,
    childrenCount: element.children.length,
    colors: {
      color: fgColor,
      backgroundColor: bgColor,
      borderColor,
    },
    contrast,
    isInteractive: ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName),
  };
}
