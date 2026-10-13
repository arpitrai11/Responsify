console.log("⚡ Responsive Inspector Pro Service Worker initialized");
async function f() {
  if (typeof chrome < "u" && chrome.declarativeNetRequest)
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
                { header: "x-frame-options", operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
                { header: "frame-options", operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE },
                { header: "content-security-policy", operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE }
              ]
            },
            condition: {
              urlFilter: "*",
              resourceTypes: [chrome.declarativeNetRequest.ResourceType.SUB_FRAME]
            }
          }
        ]
      }), console.log("✅ DeclarativeNetRequest rules applied for iframe previews");
    } catch (e) {
      console.warn("Could not update DNR rules:", e);
    }
}
f();
function w(e) {
  return e ? e.startsWith("chrome://") || e.startsWith("chrome-extension://") || e.startsWith("edge://") || e.startsWith("about:") || e.startsWith("view-source:") : !0;
}
chrome.action && chrome.action.onClicked && chrome.action.onClicked.addListener(async (e) => {
  let t = "https://example.com";
  e && e.url && !w(e.url) && (t = e.url);
  const r = chrome.runtime.getURL(`workspace.html?target=${encodeURIComponent(t)}`);
  await chrome.tabs.create({ url: r });
});
async function p(e, t) {
  try {
    return { success: !0, downloadId: await chrome.downloads.download({
      url: e,
      filename: t || "asset",
      saveAs: !1
    }) };
  } catch (r) {
    return console.error("Download failed:", r), { success: !1, error: r.message };
  }
}
const a = /* @__PURE__ */ new Set();
async function g(e) {
  if (a.has(e)) return !0;
  try {
    return await chrome.debugger.attach({ tabId: e }, "1.3"), a.add(e), !0;
  } catch (t) {
    return console.warn("Could not attach debugger:", t), !1;
  }
}
async function s(e) {
  if (a.has(e))
    try {
      await chrome.debugger.detach({ tabId: e });
    } catch {
    } finally {
      a.delete(e);
    }
}
async function E(e, t) {
  if (!await g(e)) return !1;
  try {
    return t.userAgent && await chrome.debugger.sendCommand({ tabId: e }, "Network.setUserAgentOverride", {
      userAgent: t.userAgent
    }), t.width && t.height && await chrome.debugger.sendCommand({ tabId: e }, "Emulation.setDeviceMetricsOverride", {
      width: t.width,
      height: t.height,
      deviceScaleFactor: t.deviceScaleFactor || 1,
      mobile: !!t.mobile
    }), !0;
  } catch (n) {
    return console.warn("Emulation command failed:", n), !1;
  }
}
chrome.runtime.onMessage.addListener((e, t, r) => {
  var n, i;
  if (e.action === "OPEN_SIDEPANEL") {
    const o = e.tabId || ((n = t.tab) == null ? void 0 : n.id);
    if (o && chrome.sidePanel && chrome.sidePanel.open)
      return chrome.tabs.get(o).then((c) => {
        c.windowId && (chrome.sidePanel.open({ windowId: c.windowId }), r({ success: !0 }));
      }).catch(() => {
        r({ success: !1 });
      }), !0;
  }
  if (e.action === "OPEN_WORKSPACE") {
    const o = ((i = e.payload) == null ? void 0 : i.url) || "https://example.com", c = chrome.runtime.getURL(`workspace.html?target=${encodeURIComponent(o)}`);
    return chrome.tabs.create({ url: c }), r({ success: !0 }), !0;
  }
  if (e.action === "DOWNLOAD_ASSET") {
    const { url: o, filename: c } = e.payload;
    return p(o, c).then(r), !0;
  }
  if (e.action === "SET_DEVICE_EMULATION") {
    const { tabId: o, width: c, height: u, dpr: d, userAgent: l, mobile: h } = e.payload;
    return E(o, {
      width: c,
      height: u,
      deviceScaleFactor: d,
      userAgent: l,
      mobile: h
    }).then((m) => r({ success: m })), !0;
  }
  if (e.action === "RESET_DEVICE_EMULATION") {
    const { tabId: o } = e.payload;
    return s(o).then(() => r({ success: !0 })), !0;
  }
  return !1;
});
chrome.tabs.onRemoved.addListener((e) => {
  a.has(e) && s(e);
});
