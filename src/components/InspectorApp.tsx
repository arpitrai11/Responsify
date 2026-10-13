import React, { useState, useEffect, useCallback } from 'react';
import { Toolbar } from './Toolbar';
import { ElementPicker } from './ElementPicker';
import { BoxModel } from './BoxModel';
import { CssEditor } from './CssEditor';
import { ColorInspector } from './ColorInspector';
import { VisualModes } from './VisualModes';
import { ContentEditor } from './ContentEditor';
import { AssetExplorer } from './AssetExplorer';
import { DeviceSelector } from './DeviceSelector';
import { ChangeHistory } from './ChangeHistory';
import { Settings } from './Settings';

import { ElementInfo } from '../types/inspector';
import { DevicePreset, DEFAULT_PRESETS, UserAgentPreset, DEFAULT_USER_AGENTS } from '../types/presets';
import { VisualModesState, DEFAULT_GRID_CONFIG } from '../types/visual-modes';
import { PageAsset } from '../types/assets';
import { ChangeRecord } from '../types/history';
import { ExtensionMessage } from '../types/messages';

import {
  getStoredPresets,
  savePresets,
  getStoredUserAgents,
  getStoredHistory,
  saveStoredHistory,
  getStoredVisualModes,
  saveStoredVisualModes,
  getStoredTheme,
  saveStoredTheme,
} from '../utils/storage-utils';

import {
  sendMessageToActiveTab,
  getActiveTab,
} from '../services/chrome-messaging';

interface InspectorAppProps {
  isSidepanel?: boolean;
  visualModesState?: VisualModesState;
  onVisualModesChange?: (modes: VisualModesState) => void;
}

export const InspectorApp: React.FC<InspectorAppProps> = ({
  isSidepanel = false,
  visualModesState: propVisualModes,
  onVisualModesChange,
}) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('inspect');

  // Inspector & Element Selection State
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);

  // Viewport & Presets
  const [presets, setPresets] = useState<DevicePreset[]>(DEFAULT_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<DevicePreset | null>(null);
  const [width, setWidth] = useState<number>(390);
  const [height, setHeight] = useState<number>(844);
  const [userAgents, setUserAgents] = useState<UserAgentPreset[]>(DEFAULT_USER_AGENTS);
  const [selectedUserAgent, setSelectedUserAgent] = useState<string | null>(null);

  // Visual Modes
  const [visualModes, setVisualModes] = useState<VisualModesState>(
    propVisualModes || {
      xrayEnabled: false,
      gridEnabled: false,
      gridConfig: DEFAULT_GRID_CONFIG,
      darkThemeMode: 'disabled',
      colorBlindness: 'none',
    }
  );

  useEffect(() => {
    if (propVisualModes) {
      setVisualModes(propVisualModes);
    }
  }, [propVisualModes]);

  // Assets & History
  const [assets, setAssets] = useState<PageAsset[]>([]);
  const [history, setHistory] = useState<ChangeRecord[]>([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState<boolean>(false);
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  // Undo / Redo stacks
  const [undoStack, setUndoStack] = useState<ChangeRecord[]>([]);
  const [redoStack, setRedoStack] = useState<ChangeRecord[]>([]);

  // 1. Initial Storage & Theme Load
  useEffect(() => {
    const loadedTheme = getStoredTheme();
    setTheme(loadedTheme);
    if (loadedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    getStoredPresets().then(setPresets);
    getStoredUserAgents().then(setUserAgents);
    getStoredHistory().then(setHistory);
    getStoredVisualModes().then(setVisualModes);

    // Check active tab status (skip false-alarm banner when inside Studio workspace)
    getActiveTab().then((tab) => {
      if (typeof window !== 'undefined' && window.location.pathname.includes('workspace.html')) {
        return;
      }
      if (tab && tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
        setGlobalNotice('Notice: You are on a browser internal page (' + tab.url.split('/')[2] + '). Chrome restricts extensions from injecting scripts into internal pages. Open any regular website (e.g. google.com or localhost) to inspect elements.');
      }
    });
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveStoredTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 2. Message Listeners (supports both Chrome tabs and workspace canvas iframes)
  useEffect(() => {
    const runtimeListener = (msg: ExtensionMessage) => {
      if (msg.action === 'ELEMENT_SELECTED') {
        const info = msg.payload as ElementInfo;
        setSelectedElement(info);
        setIsPicking(false);
      } else if (msg.action === 'STOP_PICKER') {
        setIsPicking(false);
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(runtimeListener);
    }

    const windowListener = (event: MessageEvent) => {
      if (!event.data || !event.data.action) return;
      if (event.data.action === 'ELEMENT_SELECTED') {
        const info = event.data.payload as ElementInfo;
        setSelectedElement(info);
        setIsPicking(false);
      } else if (event.data.action === 'STOP_PICKER') {
        setIsPicking(false);
      } else if (event.data.action === 'ASSETS_DISCOVERED') {
        const discovered = event.data.payload as PageAsset[];
        if (Array.isArray(discovered)) {
          setAssets(discovered);
          setIsAssetsLoading(false);
        }
      }
    };
    window.addEventListener('message', windowListener);

    return () => {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.removeListener(runtimeListener);
      }
      window.removeEventListener('message', windowListener);
    };
  }, []);

  // 3. Inspection Picker Controls
  const togglePicker = async () => {
    const next = !isPicking;
    setIsPicking(next);
    const res = await sendMessageToActiveTab({
      action: next ? 'START_PICKER' : 'STOP_PICKER',
    });
    if (!res.success && res.error) {
      setIsPicking(false);
      setGlobalNotice(res.error);
      setTimeout(() => setGlobalNotice(null), 6000);
    }
  };

  const clearSelection = async () => {
    setSelectedElement(null);
    await sendMessageToActiveTab({ action: 'CLEAR_SELECTION' });
  };

  // 4. History Tracking Helper
  const recordChange = useCallback(
    (record: Omit<ChangeRecord, 'id' | 'timestamp'>) => {
      const fullRecord: ChangeRecord = {
        ...record,
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: Date.now(),
      };
      setHistory((prev) => {
        const next = [fullRecord, ...prev];
        saveStoredHistory(next);
        return next;
      });
      setUndoStack((prev) => [fullRecord, ...prev]);
      setRedoStack([]);
    },
    []
  );

  // 5. CSS Editing Controls
  const handleApplyCss = async (property: string, value: string) => {
    if (!selectedElement) return;

    const previousValue = selectedElement.computedStyles[property] || '';

    // Apply on page
    const res = await sendMessageToActiveTab({
      action: 'APPLY_CSS',
      payload: {
        selector: selectedElement.selector,
        property,
        value,
      },
    });

    if (res.success) {
      // Update local element state
      setSelectedElement((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          computedStyles: { ...prev.computedStyles, [property]: value },
          appliedCustomStyles: { ...(prev.appliedCustomStyles || {}), [property]: value },
        };
      });

      recordChange({
        targetSelector: selectedElement.selector,
        category: 'css',
        propertyOrField: property,
        previousValue,
        newValue: value,
        status: 'applied',
        elementTag: selectedElement.tagName,
      });
    }
  };

  const handleRemoveCss = async (property: string) => {
    if (!selectedElement) return;

    const currentVal = selectedElement.computedStyles[property] || '';

    await sendMessageToActiveTab({
      action: 'REMOVE_CSS',
      payload: {
        selector: selectedElement.selector,
        property,
      },
    });

    setSelectedElement((prev) => {
      if (!prev) return null;
      const nextCustom = { ...(prev.appliedCustomStyles || {}) };
      delete nextCustom[property];
      return {
        ...prev,
        appliedCustomStyles: nextCustom,
      };
    });

    recordChange({
      targetSelector: selectedElement.selector,
      category: 'css',
      propertyOrField: property,
      previousValue: currentVal,
      newValue: '(reverted)',
      status: 'reverted',
      elementTag: selectedElement.tagName,
    });
  };

  const handleResetAllCss = async () => {
    if (!selectedElement) return;

    await sendMessageToActiveTab({
      action: 'RESET_ELEMENT_CSS',
      payload: { selector: selectedElement.selector },
    });

    setSelectedElement((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        appliedCustomStyles: {},
      };
    });
  };

  // 6. Box Model Edge update
  const handleUpdateBoxEdge = (
    type: 'margin' | 'padding' | 'border',
    edge: 'top' | 'right' | 'bottom' | 'left',
    val: number
  ) => {
    const prop = type === 'border' ? `border-${edge}-width` : `${type}-${edge}`;
    handleApplyCss(prop, `${val}px`);
  };

  // 7. Content Text & Image Editing
  const handleUpdateText = async (newText: string) => {
    if (!selectedElement) return;
    const prevText = selectedElement.textContent;

    const res = await sendMessageToActiveTab({
      action: 'UPDATE_TEXT',
      payload: {
        selector: selectedElement.selector,
        text: newText,
      },
    });

    if (res.success) {
      setSelectedElement((prev) => (prev ? { ...prev, textContent: newText } : null));
      recordChange({
        targetSelector: selectedElement.selector,
        category: 'text',
        propertyOrField: 'textContent',
        previousValue: prevText,
        newValue: newText,
        status: 'applied',
        elementTag: selectedElement.tagName,
      });
    }
  };

  const handleResetText = async () => {
    if (!selectedElement) return;
    await sendMessageToActiveTab({
      action: 'RESET_TEXT',
      payload: { selector: selectedElement.selector },
    });
  };

  const handleUpdateImage = async (newSrc: string) => {
    if (!selectedElement) return;

    const res = await sendMessageToActiveTab({
      action: 'UPDATE_IMAGE',
      payload: {
        selector: selectedElement.selector,
        src: newSrc,
      },
    });

    if (res.success) {
      recordChange({
        targetSelector: selectedElement.selector,
        category: 'image',
        propertyOrField: 'src',
        previousValue: '(original)',
        newValue: newSrc,
        status: 'applied',
        elementTag: selectedElement.tagName,
      });
    }
  };

  const handleResetImage = async () => {
    if (!selectedElement) return;
    await sendMessageToActiveTab({
      action: 'RESET_IMAGE',
      payload: { selector: selectedElement.selector },
    });
  };

  // 8. Visual Modes Updates
  const handleVisualModesChange = async (newModes: VisualModesState) => {
    setVisualModes(newModes);
    saveStoredVisualModes(newModes);
    if (onVisualModesChange) {
      onVisualModesChange(newModes);
    }

    // Send actions to page
    if (newModes.xrayEnabled !== visualModes.xrayEnabled) {
      await sendMessageToActiveTab({ action: 'SET_XRAY', payload: { enabled: newModes.xrayEnabled } });
    }
    if (newModes.gridEnabled !== visualModes.gridEnabled || newModes.gridConfig !== visualModes.gridConfig) {
      await sendMessageToActiveTab({
        action: 'SET_GRID',
        payload: { enabled: newModes.gridEnabled, config: newModes.gridConfig },
      });
    }
    if (newModes.darkThemeMode !== visualModes.darkThemeMode) {
      await sendMessageToActiveTab({
        action: 'SET_DARK_THEME',
        payload: { mode: newModes.darkThemeMode },
      });
    }
    if (newModes.colorBlindness !== visualModes.colorBlindness) {
      await sendMessageToActiveTab({
        action: 'SET_COLOR_BLINDNESS',
        payload: { type: newModes.colorBlindness },
      });
    }
  };

  const handleToggleVisualMode = (key: keyof VisualModesState) => {
    if (key === 'xrayEnabled') {
      handleVisualModesChange({ ...visualModes, xrayEnabled: !visualModes.xrayEnabled });
    } else if (key === 'gridEnabled') {
      handleVisualModesChange({ ...visualModes, gridEnabled: !visualModes.gridEnabled });
    } else if (key === 'darkThemeMode') {
      const nextMode = visualModes.darkThemeMode === 'disabled' ? 'simulated' : 'disabled';
      handleVisualModesChange({ ...visualModes, darkThemeMode: nextMode });
    }
  };

  // 9. Asset Discovery & Download
  const handleScanAssets = async () => {
    setIsAssetsLoading(true);
    try {
      const res = await sendMessageToActiveTab<PageAsset[]>({
        action: 'DISCOVER_ASSETS',
      });
      if (res.success && res.data) {
        setAssets(res.data);
      }
    } finally {
      setIsAssetsLoading(false);
    }
  };

  const handleDownloadAsset = (asset: PageAsset) => {
    if (asset.isInlineSvg && asset.svgContent) {
      // Export SVG markup directly
      const blob = new Blob([asset.svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exported-graphic-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Download via background service worker
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        const filename = asset.url.split('/').pop()?.split('?')[0] || `asset-${Date.now()}`;
        chrome.runtime.sendMessage({
          action: 'DOWNLOAD_ASSET',
          payload: { url: asset.url, filename },
        });
      }
    }
  };

  // 10. Undo / Redo & Revert Changes
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const [lastChange, ...restUndo] = undoStack;
    setUndoStack(restUndo);
    setRedoStack((prev) => [lastChange, ...prev]);

    if (lastChange.category === 'css') {
      handleApplyCss(lastChange.propertyOrField, lastChange.previousValue);
    } else if (lastChange.category === 'text') {
      handleUpdateText(lastChange.previousValue);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const [nextChange, ...restRedo] = redoStack;
    setRedoStack(restRedo);
    setUndoStack((prev) => [nextChange, ...prev]);

    if (nextChange.category === 'css') {
      handleApplyCss(nextChange.propertyOrField, nextChange.newValue);
    } else if (nextChange.category === 'text') {
      handleUpdateText(nextChange.newValue);
    }
  };

  const handleRevertChangeRecord = async (record: ChangeRecord) => {
    if (record.category === 'css') {
      await sendMessageToActiveTab({
        action: 'APPLY_CSS',
        payload: {
          selector: record.targetSelector,
          property: record.propertyOrField,
          value: record.previousValue,
        },
      });
    } else if (record.category === 'text') {
      await sendMessageToActiveTab({
        action: 'UPDATE_TEXT',
        payload: {
          selector: record.targetSelector,
          text: record.previousValue,
        },
      });
    } else if (record.category === 'image') {
      await sendMessageToActiveTab({
        action: 'UPDATE_IMAGE',
        payload: {
          selector: record.targetSelector,
          src: record.previousValue,
        },
      });
    }

    setHistory((prev) =>
      prev.map((item) => (item.id === record.id ? { ...item, status: 'reverted' } : item))
    );
  };

  // 11. Custom Presets Management
  const handleAddCustomPreset = (preset: DevicePreset) => {
    const updated = [...presets, preset];
    setPresets(updated);
    savePresets(updated);
  };

  const handleDeleteCustomPreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    savePresets(updated);
  };

  const handleSelectPreset = async (preset: DevicePreset) => {
    setSelectedPreset(preset);
    setWidth(preset.width);
    setHeight(preset.height);

    // Apply CDP emulation if debugger is available
    const tab = await getActiveTab();
    if (tab && tab.id && typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'SET_DEVICE_EMULATION',
        payload: {
          tabId: tab.id,
          width: preset.width,
          height: preset.height,
          dpr: preset.devicePixelRatio,
          mobile: preset.category === 'mobile',
        },
      });
    }
  };

  const handleSelectUserAgent = async (ua: string | null) => {
    setSelectedUserAgent(ua);
    const tab = await getActiveTab();
    if (tab && tab.id && typeof chrome !== 'undefined' && chrome.runtime) {
      if (ua) {
        chrome.runtime.sendMessage({
          action: 'SET_DEVICE_EMULATION',
          payload: {
            tabId: tab.id,
            userAgent: ua,
          },
        });
      } else {
        chrome.runtime.sendMessage({
          action: 'RESET_DEVICE_EMULATION',
          payload: { tabId: tab.id },
        });
      }
    }
  };

  // 12. Open Studio & Sidepanel
  const openWorkspace = async () => {
    const tab = await getActiveTab();
    const targetUrl = tab?.url || 'https://example.com';
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'OPEN_WORKSPACE',
        payload: { url: targetUrl },
      });
    } else {
      window.open(`/workspace.html?target=${encodeURIComponent(targetUrl)}`, '_blank');
    }
  };

  const openSidepanel = async () => {
    const tab = await getActiveTab();
    if (tab && tab.id && typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'OPEN_SIDEPANEL',
        tabId: tab.id,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 select-none overflow-hidden">
      {/* Compact Top Toolbar */}
      <Toolbar
        isPicking={isPicking}
        onTogglePicker={togglePicker}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        width={width}
        height={height}
        onDimensionChange={(w, h) => {
          setWidth(w);
          setHeight(h);
        }}
        onToggleOrientation={() => {
          setWidth(height);
          setHeight(width);
        }}
        visualModes={visualModes}
        onToggleVisualMode={handleToggleVisualMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenWorkspace={openWorkspace}
        onOpenSidepanel={openSidepanel}
        isSidepanel={isSidepanel}
      />

      {/* Global Context Notice (e.g. Chrome Internal Page Warning) */}
      {globalNotice && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-800 p-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-start justify-between gap-2">
          <div className="flex-1 text-[11px] leading-relaxed">
            {globalNotice}
          </div>
          <button
            onClick={() => setGlobalNotice(null)}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-900 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Selected Element Header / Empty State */}
      <ElementPicker
        element={selectedElement}
        isPicking={isPicking}
        onStartPicking={togglePicker}
        onClearElement={clearSelection}
      />

      {/* Active Tab View */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'inspect' && (
          <div className="h-full overflow-y-auto">
            <BoxModel
              boxModel={selectedElement?.boxModel || null}
              onUpdateEdge={handleUpdateBoxEdge}
            />
            <ColorInspector element={selectedElement} />
          </div>
        )}

        {activeTab === 'css' && (
          <CssEditor
            element={selectedElement}
            onApplyCss={handleApplyCss}
            onRemoveCss={handleRemoveCss}
            onResetAll={handleResetAllCss}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        )}

        {activeTab === 'box' && (
          <div className="h-full overflow-y-auto pt-4">
            <BoxModel
              boxModel={selectedElement?.boxModel || null}
              onUpdateEdge={handleUpdateBoxEdge}
            />
          </div>
        )}

        {activeTab === 'colors' && (
          <ColorInspector element={selectedElement} />
        )}

        {activeTab === 'visual' && (
          <VisualModes
            state={visualModes}
            onChange={handleVisualModesChange}
          />
        )}

        {activeTab === 'content' && (
          <ContentEditor
            element={selectedElement}
            onUpdateText={handleUpdateText}
            onResetText={handleResetText}
            onUpdateImage={handleUpdateImage}
            onResetImage={handleResetImage}
          />
        )}

        {activeTab === 'assets' && (
          <AssetExplorer
            assets={assets}
            onRefreshAssets={handleScanAssets}
            onDownloadAsset={handleDownloadAsset}
            isLoading={isAssetsLoading}
          />
        )}

        {activeTab === 'devices' && (
          <DeviceSelector
            presets={presets}
            selectedPreset={selectedPreset}
            onSelectPreset={handleSelectPreset}
            onAddCustomPreset={handleAddCustomPreset}
            onDeleteCustomPreset={handleDeleteCustomPreset}
            userAgents={userAgents}
            selectedUserAgent={selectedUserAgent}
            onSelectUserAgent={handleSelectUserAgent}
          />
        )}

        {activeTab === 'history' && (
          <ChangeHistory
            history={history}
            onRevertChange={handleRevertChangeRecord}
            onClearHistory={() => {
              setHistory([]);
              saveStoredHistory([]);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            onResetPresets={() => {
              setPresets(DEFAULT_PRESETS);
              savePresets(DEFAULT_PRESETS);
            }}
            onClearHistory={() => {
              setHistory([]);
              saveStoredHistory([]);
            }}
          />
        )}
      </main>
    </div>
  );
};
