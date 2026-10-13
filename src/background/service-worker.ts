import { ExtensionMessage } from '../types/messages';

console.log('⚡ Responsive Inspector Pro Service Worker initialized');

// Enable declarativeNetRequest rule to strip X-Frame-Options and frame-ancestors for sub_frames
// This allows previewing any website inside the responsive multi-device studio without iframe blocking
async function setupDnrRules() {
  if (typeof chrome !== 'undefined' && chrome.declarativeNetRequest) {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1001],
        addRules: [
          {
            id: 1001,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
              responseHeaders: [
                { header: 'x-frame-options', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
                { header: 'frame-options', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
                { header: 'content-security-policy', operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
              ],
            },
            condition: {
              urlFilter: '*',
              resourceTypes: [chrome.declarativeNetRequest.ResourceType.SUB_FRAME],
            },
          },
        ],
      });
      console.log('✅ DeclarativeNetRequest rules applied for iframe previews');
    } catch (err) {
      console.warn('Could not update DNR rules:', err);
    }
  }
}

setupDnrRules();

// Helper to check if URL is an internal/restricted browser URL
function isRestrictedUrl(url?: string): boolean {
  if (!url) return true;
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('view-source:')
  );
}

// 1. Direct Extension Action Click (EXACTLY like Pixefy in screen-capture.webm)
// Clicking extension toolbar icon immediately launches Responsive Studio with the current site
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener(async (tab) => {
    let targetUrl = 'https://example.com';
    if (tab && tab.url && !isRestrictedUrl(tab.url)) {
      targetUrl = tab.url;
    }

    const workspaceUrl = chrome.runtime.getURL(`workspace.html?target=${encodeURIComponent(targetUrl)}`);
    await chrome.tabs.create({ url: workspaceUrl });
  });
}

// 2. Download Asset Helper via chrome.downloads API
async function downloadAsset(url: string, filename: string) {
  try {
    const downloadId = await chrome.downloads.download({
      url,
      filename: filename || 'asset',
      saveAs: false,
    });
    return { success: true, downloadId };
  } catch (err) {
    console.error('Download failed:', err);
    return { success: false, error: (err as Error).message };
  }
}

// 3. Optional Chrome Debugger API for device metrics & UA override
const attachedTabs = new Set<number>();

async function attachDebugger(tabId: number) {
  if (attachedTabs.has(tabId)) return true;
  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    attachedTabs.add(tabId);
    return true;
  } catch (e) {
    console.warn('Could not attach debugger:', e);
    return false;
  }
}

async function detachDebugger(tabId: number) {
  if (!attachedTabs.has(tabId)) return;
  try {
    await chrome.debugger.detach({ tabId });
  } catch {
    // Already detached
  } finally {
    attachedTabs.delete(tabId);
  }
}

async function setEmulationViaDebugger(
  tabId: number,
  params: {
    width?: number;
    height?: number;
    deviceScaleFactor?: number;
    mobile?: boolean;
    userAgent?: string;
  }
) {
  const attached = await attachDebugger(tabId);
  if (!attached) return false;

  try {
    if (params.userAgent) {
      await chrome.debugger.sendCommand({ tabId }, 'Network.setUserAgentOverride', {
        userAgent: params.userAgent,
      });
    }

    if (params.width && params.height) {
      await chrome.debugger.sendCommand({ tabId }, 'Emulation.setDeviceMetricsOverride', {
        width: params.width,
        height: params.height,
        deviceScaleFactor: params.deviceScaleFactor || 1,
        mobile: !!params.mobile,
      });
    }
    return true;
  } catch (e) {
    console.warn('Emulation command failed:', e);
    return false;
  }
}

// 4. Message Listeners
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.action === 'OPEN_SIDEPANEL') {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId && chrome.sidePanel && chrome.sidePanel.open) {
      chrome.tabs.get(tabId).then((tab) => {
        if (tab.windowId) {
          chrome.sidePanel.open({ windowId: tab.windowId });
          sendResponse({ success: true });
        }
      }).catch(() => {
        sendResponse({ success: false });
      });
      return true;
    }
  }

  if (message.action === 'OPEN_WORKSPACE') {
    const targetUrl = (message.payload as { url?: string })?.url || 'https://example.com';
    const workspaceUrl = chrome.runtime.getURL(`workspace.html?target=${encodeURIComponent(targetUrl)}`);
    chrome.tabs.create({ url: workspaceUrl });
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'DOWNLOAD_ASSET') {
    const { url, filename } = message.payload as { url: string; filename: string };
    downloadAsset(url, filename).then(sendResponse);
    return true;
  }

  if (message.action === 'SET_DEVICE_EMULATION') {
    const { tabId, width, height, dpr, userAgent, mobile } = message.payload as {
      tabId: number;
      width: number;
      height: number;
      dpr: number;
      userAgent?: string;
      mobile?: boolean;
    };
    setEmulationViaDebugger(tabId, {
      width,
      height,
      deviceScaleFactor: dpr,
      userAgent,
      mobile,
    }).then((ok) => sendResponse({ success: ok }));
    return true;
  }

  if (message.action === 'RESET_DEVICE_EMULATION') {
    const { tabId } = message.payload as { tabId: number };
    detachDebugger(tabId).then(() => sendResponse({ success: true }));
    return true;
  }

  return false;
});

// Clean up debugger on tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  if (attachedTabs.has(tabId)) {
    detachDebugger(tabId);
  }
});
