import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DevicePreset, DEFAULT_PRESETS, PresetCategory } from '../types/presets';
import {
  Square,
  Columns2,
  Columns3,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Plus,
  Trash2,
  Link2,
  Link2Off,
  Sun,
  Moon,
  PanelRightOpen,
  PanelRightClose,
  Sparkles,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Search,
  GripHorizontal,
  Hand,
  MousePointer,
  LayoutGrid,
} from 'lucide-react';
import { InspectorApp } from './InspectorApp';

interface ActiveDevice {
  instanceId: string;
  preset: DevicePreset;
  orientation: 'portrait' | 'landscape';
  posX: number;
  posY: number;
}

interface PreviewWorkspaceProps {
  initialUrl?: string;
  presets?: DevicePreset[];
}

export const PreviewWorkspace: React.FC<PreviewWorkspaceProps> = ({
  initialUrl = 'https://example.com',
  presets = DEFAULT_PRESETS,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [zoom, setZoom] = useState<number>(75); // %
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<PresetCategory | 'all'>('all');
  const [canvasTool, setCanvasTool] = useState<'select' | 'pan'>('select');

  // Infinite Canvas Pan State
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Draggable Device State
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Synchronize incoming initialUrl prop
  useEffect(() => {
    if (initialUrl && initialUrl.trim() !== '') {
      setUrl(initialUrl);
      setInputUrl(initialUrl);
    }
  }, [initialUrl]);

  // Active devices on the canvas
  const [devices, setDevices] = useState<ActiveDevice[]>([
    {
      instanceId: 'dev-1',
      preset: presets.find((p) => p.category === 'mobile') || presets[0],
      orientation: 'portrait',
      posX: 0,
      posY: 0,
    },
    {
      instanceId: 'dev-2',
      preset: presets.find((p) => p.category === 'tablet') || presets[6],
      orientation: 'portrait',
      posX: 0,
      posY: 0,
    },
    {
      instanceId: 'dev-3',
      preset: presets.find((p) => p.category === 'laptop') || presets[10],
      orientation: 'landscape',
      posX: 0,
      posY: 0,
    },
  ]);

  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync scroll across all iframes via wheel / scroll events
  const broadcastScrollDelta = useCallback(
    (sourceInstanceId: string, deltaY: number) => {
      if (!syncScroll) return;

      iframeRefs.current.forEach((iframe, instanceId) => {
        if (instanceId !== sourceInstanceId && iframe.contentWindow) {
          try {
            // Direct DOM scroll if accessible
            const doc = iframe.contentDocument;
            if (doc && doc.documentElement) {
              doc.documentElement.scrollTop += deltaY;
            }
          } catch {
            // Cross-origin fallback via postMessage
            iframe.contentWindow.postMessage(
              { action: 'SYNC_SCROLL_DELTA', deltaY },
              '*'
            );
          }
        }
      });
    },
    [syncScroll]
  );

  // Handle Ctrl+Scroll or Wheel over a device to scroll website inside
  const handleDeviceWheel = (e: React.WheelEvent, instanceId: string) => {
    // When hovering over device, Ctrl+Scroll or standard scroll scrolls the website inside!
    e.stopPropagation();

    // Prevent outer window zoom when Ctrl key is held
    if (e.ctrlKey) {
      e.preventDefault();
    }

    const deltaY = e.deltaY;
    const iframe = iframeRefs.current.get(instanceId);
    if (iframe && iframe.contentWindow) {
      try {
        if (iframe.contentDocument && iframe.contentDocument.documentElement) {
          iframe.contentDocument.documentElement.scrollTop += deltaY;
        } else {
          iframe.contentWindow.scrollBy({ top: deltaY, behavior: 'auto' });
        }
      } catch {
        iframe.contentWindow.postMessage({ action: 'SYNC_SCROLL_DELTA', deltaY }, '*');
      }

      // Broadcast to sister frames
      broadcastScrollDelta(instanceId, deltaY);
    }
  };

  // Canvas Panning Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (canvasTool === 'pan' || e.button === 1 || e.buttons === 4) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      e.preventDefault();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // 1. If panning canvas
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    // 2. If dragging a device screen
    if (draggingDeviceId) {
      const deltaX = (e.clientX - dragStartRef.current.mouseX) / (zoom / 100);
      const deltaY = (e.clientY - dragStartRef.current.mouseY) / (zoom / 100);

      setDevices((prev) =>
        prev.map((d) =>
          d.instanceId === draggingDeviceId
            ? {
                ...d,
                posX: dragStartRef.current.initialX + deltaX,
                posY: dragStartRef.current.initialY + deltaY,
              }
            : d
        )
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingDeviceId(null);
  };

  // Start dragging a device frame
  const handleStartDragDevice = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation();
    const device = devices.find((d) => d.instanceId === instanceId);
    if (!device) return;

    setDraggingDeviceId(instanceId);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: device.posX || 0,
      initialY: device.posY || 0,
    };
  };

  // Reset positions to clean auto-aligned grid
  const handleResetPositions = () => {
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        posX: 0,
        posY: 0,
      }))
    );
    setPanOffset({ x: 0, y: 0 });
  };

  // Handle URL change
  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let formatted = inputUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    setUrl(formatted);
    setInputUrl(formatted);
  };

  const handleReloadAll = () => {
    iframeRefs.current.forEach((iframe) => {
      if (iframe) iframe.src = url;
    });
  };

  // Preset Layout Quick Modes
  const setSingleMode = () => {
    const mobile = presets.find((p) => p.category === 'mobile') || presets[0];
    setDevices([
      { instanceId: `dev-${Date.now()}`, preset: mobile, orientation: 'portrait', posX: 0, posY: 0 },
    ]);
  };

  const setSplitMode = () => {
    const mobile = presets.find((p) => p.category === 'mobile') || presets[0];
    const laptop = presets.find((p) => p.category === 'laptop') || presets[10];
    setDevices([
      { instanceId: `dev-1-${Date.now()}`, preset: mobile, orientation: 'portrait', posX: 0, posY: 0 },
      { instanceId: `dev-2-${Date.now()}`, preset: laptop, orientation: 'landscape', posX: 0, posY: 0 },
    ]);
  };

  const setTripleMode = () => {
    const mobile = presets.find((p) => p.category === 'mobile') || presets[0];
    const tablet = presets.find((p) => p.category === 'tablet') || presets[6];
    const laptop = presets.find((p) => p.category === 'laptop') || presets[10];
    setDevices([
      { instanceId: `dev-1-${Date.now()}`, preset: mobile, orientation: 'portrait', posX: 0, posY: 0 },
      { instanceId: `dev-2-${Date.now()}`, preset: tablet, orientation: 'portrait', posX: 0, posY: 0 },
      { instanceId: `dev-3-${Date.now()}`, preset: laptop, orientation: 'landscape', posX: 0, posY: 0 },
    ]);
  };

  const handleAddDevice = (preset: DevicePreset) => {
    setDevices((prev) => [
      ...prev,
      {
        instanceId: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        preset,
        orientation: preset.orientation || 'portrait',
        posX: 0,
        posY: 0,
      },
    ]);
    setShowAddMenu(false);
  };

  const handleRemoveDevice = (instanceId: string) => {
    if (devices.length <= 1) return;
    setDevices((prev) => prev.filter((d) => d.instanceId !== instanceId));
    iframeRefs.current.delete(instanceId);
  };

  const handleRotateDevice = (instanceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.instanceId === instanceId
          ? { ...d, orientation: d.orientation === 'portrait' ? 'landscape' : 'portrait' }
          : d
      )
    );
  };

  const handleRotateAll = () => {
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        orientation: d.orientation === 'portrait' ? 'landscape' : 'portrait',
      }))
    );
  };

  const handleChangePreset = (instanceId: string, newPreset: DevicePreset) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.instanceId === instanceId
          ? { ...d, preset: newPreset, orientation: newPreset.orientation || 'portrait' }
          : d
      )
    );
  };

  const getDims = (device: ActiveDevice) => {
    if (device.orientation === 'portrait') {
      return {
        width: Math.min(device.preset.width, device.preset.height),
        height: Math.max(device.preset.width, device.preset.height),
      };
    }
    return {
      width: Math.max(device.preset.width, device.preset.height),
      height: Math.min(device.preset.width, device.preset.height),
    };
  };

  // Keyboard shortcut listener for space pan and reload
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleReloadAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [url]);

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden select-none font-sans ${
        canvasTheme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#eef1f6] text-slate-800'
      }`}
    >
      {/* 1. TOP CONTROL BAR (RESPONSIFY WORKSPACE HEADER) */}
      <header className="h-13 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-3 flex-shrink-0 z-30 shadow-xs">
        {/* Left: Brand Logo & Presets Mode */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-black text-sm text-white shadow-glow">
              R
            </div>
            <div className="hidden lg:block">
              <span className="font-extrabold text-xs tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Responsive Pro
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Studio</span>
            </div>
          </div>

          {/* Quick Layout Presets */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={setSingleMode}
              title="Single Device View"
              className={`p-1.5 rounded-md transition-all ${
                devices.length === 1
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={setSplitMode}
              title="Dual Split View (Mobile + Laptop)"
              className={`p-1.5 rounded-md transition-all ${
                devices.length === 2
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={setTripleMode}
              title="Multi-Device Comparison (Mobile + Tablet + Laptop)"
              className={`p-1.5 rounded-md transition-all ${
                devices.length >= 3
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Canvas Tools: Select / Pan */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setCanvasTool('select')}
              title="Select Tool: Drag & Reposition Device Screens"
              className={`p-1.5 rounded-md transition-all ${
                canvasTool === 'select'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCanvasTool('pan')}
              title="Hand Tool: Pan Canvas Workspace"
              className={`p-1.5 rounded-md transition-all ${
                canvasTool === 'pan'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset / Align Layout */}
          <button
            onClick={handleResetPositions}
            title="Auto-Align Devices on Canvas Grid"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>

          {/* Rotate All */}
          <button
            onClick={handleRotateAll}
            title="Rotate All Devices (Portrait / Landscape)"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sync Scroll Toggle */}
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            title={`Synchronized Scrolling: ${syncScroll ? 'ACTIVE' : 'OFF'}`}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
              syncScroll
                ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            {syncScroll ? <Link2 className="w-3.5 h-3.5" /> : <Link2Off className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Sync Scroll</span>
          </button>
        </div>

        {/* Center: Address Bar with Instant Navigation */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-md flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL to test (e.g. https://example.com)..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            Go
          </button>

          <button
            type="button"
            onClick={handleReloadAll}
            title="Reload all frames (Ctrl/Cmd + R)"
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Right: Zoom, 1:1 Crisp Toggle, Add Device, Canvas Theme & Drawer Toggle */}
        <div className="flex items-center gap-2">
          {/* 100% Crisp Native View Toggle */}
          <button
            onClick={() => setZoom(100)}
            title="100% Pixel-Perfect Native Crisp Resolution"
            className={`px-2 py-1 rounded-lg border text-xs font-mono font-semibold transition-colors ${
              zoom === 100
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white'
            }`}
          >
            100% Crisp
          </button>

          {/* Zoom Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setZoom(Math.max(30, zoom - 10))}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 w-9 text-center font-semibold">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Device Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Device</span>
            </button>

            {showAddMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-850 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs max-h-96 overflow-y-auto">
                <div className="font-semibold text-slate-700 dark:text-slate-200 px-2 py-1 flex items-center justify-between">
                  <span>Add Device to Canvas</span>
                  <div className="flex gap-1 text-[10px]">
                    {['all', 'mobile', 'tablet', 'laptop', 'desktop'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat as PresetCategory | 'all')}
                        className={`capitalize px-1 rounded ${
                          categoryFilter === cat ? 'bg-indigo-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        {cat[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-1">
                  {presets
                    .filter((p) => categoryFilter === 'all' || p.category === categoryFilter)
                    .map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleAddDevice(preset)}
                        className="w-full text-left p-2 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                            {preset.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {preset.width} × {preset.height} px
                          </div>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Canvas Theme Toggle */}
          <button
            onClick={() => setCanvasTheme(canvasTheme === 'dark' ? 'light' : 'dark')}
            title="Toggle Canvas Theme (Light/Dark)"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {canvasTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Inspector Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            title="Toggle Developer Tools Drawer (Element Picker & CSS Editor)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showDrawer
                ? 'bg-indigo-600 text-white shadow-glow ring-2 ring-indigo-400'
                : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90'
            }`}
          >
            {showDrawer ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Inspect & Edit</span>
          </button>

          {/* 100% Unlocked Pro Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300 dark:border-emerald-800/80 rounded-md text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>All Pro Unlocked</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTENT: INFINITE DRAGGABLE CANVAS + INSPECTOR DRAWER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Infinite Scrollable & Pannable Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className={`flex-1 overflow-auto p-12 flex items-start justify-center gap-10 transition-colors relative ${
            canvasTool === 'pan' || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          } ${
            canvasTheme === 'dark'
              ? 'bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]'
              : 'bg-[#eef1f6] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]'
          }`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {devices.map((device) => {
            const dims = getDims(device);
            const isDraggingThis = draggingDeviceId === device.instanceId;

            return (
              <div
                key={device.instanceId}
                className={`flex flex-col items-center flex-shrink-0 origin-top select-none transition-shadow ${
                  isDraggingThis ? 'z-50 cursor-grabbing shadow-2xl scale-[1.02]' : 'z-10'
                }`}
                style={{
                  transform: `translate(${device.posX}px, ${device.posY}px) scale(${zoom / 100})`,
                  // Crisp vector font rendering
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                  imageRendering: '-webkit-optimize-contrast',
                }}
              >
                {/* Floating Device Header Pill - Draggable Bar */}
                <div
                  onMouseDown={(e) => handleStartDragDevice(e, device.instanceId)}
                  className="mb-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs z-10 cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-colors group"
                  title="Click and drag to move screen position on canvas"
                >
                  {/* Drag Handle Icon */}
                  <GripHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />

                  <div className="flex items-center gap-1.5">
                    {device.preset.category === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-indigo-500" />}
                    {device.preset.category === 'tablet' && <Tablet className="w-3.5 h-3.5 text-indigo-500" />}
                    {device.preset.category === 'laptop' && <Laptop className="w-3.5 h-3.5 text-indigo-500" />}
                    {device.preset.category === 'desktop' && <Monitor className="w-3.5 h-3.5 text-indigo-500" />}

                    <select
                      value={device.preset.id}
                      onChange={(e) => {
                        const next = presets.find((p) => p.id === e.target.value);
                        if (next) handleChangePreset(device.instanceId, next);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="bg-transparent font-semibold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer text-xs"
                    >
                      {presets.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="font-mono text-slate-400 text-[11px] border-l border-slate-200 dark:border-slate-700 pl-2.5">
                    {dims.width} × {dims.height}
                  </span>

                  <div
                    className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleRotateDevice(device.instanceId)}
                      className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-400 rounded transition-colors"
                      title="Rotate Device Orientation"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        const iframe = iframeRefs.current.get(device.instanceId);
                        if (iframe) iframe.src = url;
                      }}
                      className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-400 rounded transition-colors"
                      title="Reload this frame"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>

                    {devices.length > 1 && (
                      <button
                        onClick={() => handleRemoveDevice(device.instanceId)}
                        className="p-1 hover:text-rose-600 text-slate-400 rounded transition-colors"
                        title="Remove Device from Canvas"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Device Hardware Chassis / Frame with Ctrl+Scroll capture */}
                <div
                  onWheel={(e) => handleDeviceWheel(e, device.instanceId)}
                  className={`bg-[#0d1117] transition-all rounded-[32px] p-3 shadow-2xl border-[5px] border-slate-800/90 ring-1 ring-black/20 flex flex-col items-center relative group`}
                  style={{ width: `${dims.width + 24}px` }}
                >
                  {/* Hardware Camera / Speaker Notch */}
                  <div className="w-24 h-4 bg-slate-900 rounded-full mb-2 flex items-center justify-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-indigo-900/60" />
                    </div>
                    <div className="w-8 h-1 rounded-full bg-slate-800" />
                  </div>

                  {/* Responsive Iframe - Razor Crisp Vector Rendering */}
                  <iframe
                    ref={(el) => {
                      if (el) iframeRefs.current.set(device.instanceId, el);
                      else iframeRefs.current.delete(device.instanceId);
                    }}
                    src={url}
                    title={device.preset.name}
                    className="bg-white rounded-2xl block border-0 overflow-auto shadow-inner"
                    style={{
                      width: `${dims.width}px`,
                      height: `${dims.height}px`,
                      // High-resolution antialiased rendering
                      WebkitFontSmoothing: 'antialiased',
                      textRendering: 'optimizeLegibility',
                    }}
                    onLoad={() => {
                      // Attach scroll listener when frame loads
                      const iframe = iframeRefs.current.get(device.instanceId);
                      if (iframe && iframe.contentWindow) {
                        try {
                          iframe.contentWindow.addEventListener('scroll', () => {
                            if (iframe.contentDocument && iframe.contentDocument.documentElement) {
                              const doc = iframe.contentDocument.documentElement;
                              const max = doc.scrollHeight - doc.clientHeight;
                              const percent = max > 0 ? doc.scrollTop / max : 0;
                              // Sync to other frames
                              iframeRefs.current.forEach((otherIframe, otherId) => {
                                if (otherId !== device.instanceId && otherIframe.contentWindow) {
                                  try {
                                    if (otherIframe.contentDocument && otherIframe.contentDocument.documentElement) {
                                      const otherMax =
                                        otherIframe.contentDocument.documentElement.scrollHeight -
                                        otherIframe.contentDocument.documentElement.clientHeight;
                                      otherIframe.contentWindow.scrollTo({
                                        top: percent * otherMax,
                                        behavior: 'auto',
                                      });
                                    }
                                  } catch {
                                    otherIframe.contentWindow.postMessage(
                                      { action: 'SYNC_SCROLL_PERCENT', percent },
                                      '*'
                                    );
                                  }
                                }
                              });
                            }
                          });
                        } catch {
                          // Cross-origin protected
                        }
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. SLIDING DEVTOOLS INSPECTOR DRAWER */}
        {showDrawer && (
          <aside className="w-[460px] max-w-full h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-40 animate-slideLeft">
            <div className="h-10 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Responsive Inspector Studio</span>
              </span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <InspectorApp isSidepanel={true} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
