import { ExtensionMessage, ExtensionResponse } from '../types/messages';

export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  if (typeof chrome === 'undefined' || !chrome.tabs) return null;

  try {
    // 1. Try current window
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0 && tabs[0].id) {
      return tabs[0];
    }

    // 2. Try last focused window (especially useful when opened from popup/devtools)
    tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tabs && tabs.length > 0 && tabs[0].id) {
      return tabs[0];
    }

    // 3. Fallback to any active tab
    tabs = await chrome.tabs.query({ active: true });
    return tabs[0] || null;
  } catch (err) {
    console.error('Error querying active tab:', err);
    return null;
  }
}

export function isRestrictedUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('view-source:') ||
    url.startsWith('devtools://')
  );
}

export async function ensureContentScriptInjected(tabId: number): Promise<boolean> {
  if (typeof chrome === 'undefined' || !chrome.scripting) return false;

  try {
    // Ping to see if content script is active
    const response = await chrome.tabs.sendMessage(tabId, { action: 'PING' } as ExtensionMessage);
    if (response && response.success) {
      return true;
    }
  } catch {
    // Content script not yet responding, proceed to inject
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/inspector.js'],
    });
    return true;
  } catch (e) {
    console.warn(`Could not inject content script into tab ${tabId}:`, e);
    return false;
  }
}

export async function sendMessageToActiveTab<T = unknown>(
  message: ExtensionMessage
): Promise<ExtensionResponse<T>> {
  // If running directly inside workspace.html, broadcast directly to all canvas iframes
  if (typeof window !== 'undefined' && (window.location.pathname.includes('workspace.html') || document.querySelector('iframe'))) {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    if (iframes.length > 0) {
      iframes.forEach((iframe) => {
        try {
          iframe.contentWindow?.postMessage(message, '*');
        } catch {
          // Cross-origin safe
        }
      });
      return { success: true };
    }
  }

  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    return { success: false, error: 'No active tab found. Please switch to a browser tab with a website open.' };
  }

  // Prevent messaging browser internal pages where Chrome forbids content script injection
  if (isRestrictedUrl(tab.url)) {
    // If it's the workspace tab itself, broadcast to child iframes
    if (tab.url && tab.url.includes('workspace.html')) {
      const iframes = Array.from(document.querySelectorAll('iframe'));
      iframes.forEach((iframe) => {
        try {
          iframe.contentWindow?.postMessage(message, '*');
        } catch {}
      });
      return { success: true };
    }

    return {
      success: false,
      error: 'Cannot inspect browser internal pages (chrome://, about:, extensions). Open any regular webpage (e.g. localhost or a website) to inspect.',
    };
  }

  return sendMessageToTab(tab.id, message);
}

export async function sendMessageToTab<T = unknown>(
  tabId: number,
  message: ExtensionMessage
): Promise<ExtensionResponse<T>> {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    return { success: false, error: 'Chrome extension APIs unavailable in this context.' };
  }

  try {
    const res = await chrome.tabs.sendMessage(tabId, message);
    return res || { success: true };
  } catch {
    // If not injected or tab reloaded, try injecting once
    const injected = await ensureContentScriptInjected(tabId);
    if (injected) {
      try {
        const retryRes = await chrome.tabs.sendMessage(tabId, message);
        return retryRes || { success: true };
      } catch (retryErr: unknown) {
        return { success: false, error: (retryErr as Error)?.message || 'Failed after injection retry' };
      }
    }
    return { success: false, error: 'Could not communicate with tab. Make sure the page is fully loaded.' };
  }
}
