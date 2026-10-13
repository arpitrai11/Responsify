import React from 'react';
import {
  MousePointer2,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  RotateCcw,
  Grid,
  Eye,
  Moon,
  Sun,
  Maximize2,
  PanelRightClose,
  Sparkles,
} from 'lucide-react';
import { DevicePreset } from '../types/presets';
import { VisualModesState } from '../types/visual-modes';

interface ToolbarProps {
  isPicking: boolean;
  onTogglePicker: () => void;
  selectedPreset: DevicePreset | null;
  onSelectPreset: (preset: DevicePreset) => void;
  width: number;
  height: number;
  onDimensionChange: (width: number, height: number) => void;
  onToggleOrientation: () => void;
  visualModes: VisualModesState;
  onToggleVisualMode: (key: keyof VisualModesState) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenWorkspace?: () => void;
  onOpenSidepanel?: () => void;
  isSidepanel?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isPicking,
  onTogglePicker,
  width,
  height,
  onDimensionChange,
  onToggleOrientation,
  visualModes,
  onToggleVisualMode,
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  onOpenWorkspace,
  onOpenSidepanel,
  isSidepanel = false,
}) => {
  return (
    <header className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 select-none">
      {/* Top Row: Main Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Picker & Inspector Launch */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePicker}
            title={isPicking ? 'Cancel Element Picker (Esc)' : 'Inspect Page Element (Click to Pick)'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              isPicking
                ? 'bg-indigo-600 text-white shadow-glow ring-2 ring-indigo-400 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <MousePointer2 className={`w-3.5 h-3.5 ${isPicking ? 'text-white' : 'text-indigo-500'}`} />
            <span>{isPicking ? 'Inspecting...' : 'Pick'}</span>
          </button>

          {/* Quick Preset Buttons */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onDimensionChange(390, 844)}
              title="Mobile (390×844)"
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDimensionChange(820, 1180)}
              title="Tablet (820×1180)"
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDimensionChange(1280, 800)}
              title="Laptop (1280×800)"
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDimensionChange(1920, 1080)}
              title="Desktop (1920×1080)"
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Editable Viewport Inputs */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-1 rounded-md text-xs font-mono">
            <input
              type="number"
              value={width}
              onChange={(e) => onDimensionChange(parseInt(e.target.value) || 320, height)}
              className="w-12 bg-transparent text-center focus:outline-none text-slate-800 dark:text-slate-200"
              title="Width in pixels"
            />
            <span className="text-slate-400">×</span>
            <input
              type="number"
              value={height}
              onChange={(e) => onDimensionChange(width, parseInt(e.target.value) || 480)}
              className="w-12 bg-transparent text-center focus:outline-none text-slate-800 dark:text-slate-200"
              title="Height in pixels"
            />
            <button
              onClick={onToggleOrientation}
              title="Rotate Orientation (Portrait/Landscape)"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Visual Modes & Utilities */}
        <div className="flex items-center gap-1.5">
          {/* Quick Visual Debugging Toggles */}
          <div className="flex items-center gap-0.5 bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onToggleVisualMode('xrayEnabled')}
              title={`X-Ray Box Inspection: ${visualModes.xrayEnabled ? 'ON' : 'OFF'}`}
              className={`p-1 rounded transition-colors ${
                visualModes.xrayEnabled
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleVisualMode('gridEnabled')}
              title={`Adaptive Grid Overlay: ${visualModes.gridEnabled ? 'ON' : 'OFF'}`}
              className={`p-1 rounded transition-colors ${
                visualModes.gridEnabled
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onToggleVisualMode('darkThemeMode')}
              title={`Simulate Dark Mode: ${visualModes.darkThemeMode !== 'disabled' ? 'ON' : 'OFF'}`}
              className={`p-1 rounded transition-colors ${
                visualModes.darkThemeMode !== 'disabled'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Open Studio / Workspace */}
          {onOpenWorkspace && (
            <button
              onClick={onOpenWorkspace}
              title="Open Responsive Studio Workspace (Split-Screen & Multi-Viewport)"
              className="flex items-center gap-1 px-2 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 rounded-md text-xs font-medium transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio</span>
            </button>
          )}

          {/* Open Side Panel (if in popup) */}
          {!isSidepanel && onOpenSidepanel && (
            <button
              onClick={onOpenSidepanel}
              title="Open Extension Side Panel for persistent sidebar inspection"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Bottom Row: Tab Navigation */}
      <nav className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'inspect', label: 'Inspect' },
          { id: 'css', label: 'CSS Editor' },
          { id: 'box', label: 'Box Model' },
          { id: 'colors', label: 'Colors & Contrast' },
          { id: 'visual', label: 'Visual Modes' },
          { id: 'content', label: 'Content Edit' },
          { id: 'assets', label: 'Assets' },
          { id: 'devices', label: 'Presets' },
          { id: 'history', label: 'History' },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
