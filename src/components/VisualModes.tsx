import React from 'react';
import { VisualModesState, GridConfig, ColorBlindnessType, DarkThemeMode } from '../types/visual-modes';
import { Eye, Grid, Sparkles, Sliders, Check } from 'lucide-react';

interface VisualModesProps {
  state: VisualModesState;
  onChange: (newState: VisualModesState) => void;
}

export const VisualModes: React.FC<VisualModesProps> = ({ state, onChange }) => {
  const updateGrid = (updates: Partial<GridConfig>) => {
    onChange({
      ...state,
      gridConfig: { ...state.gridConfig, ...updates },
    });
  };

  const setColorBlindness = (type: ColorBlindnessType) => {
    onChange({
      ...state,
      colorBlindness: type,
    });
  };

  const setDarkTheme = (mode: DarkThemeMode) => {
    onChange({
      ...state,
      darkThemeMode: mode,
    });
  };

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full text-xs">
      {/* 1. X-Ray Mode */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">X-Ray Layout Inspector</div>
              <div className="text-[11px] text-slate-500">Expose structural bounds, flexboxes, and CSS grids</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.xrayEnabled}
              onChange={(e) => onChange({ ...state, xrayEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* 2. Adaptive Grid Overlays */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Adaptive Column Grid</div>
              <div className="text-[11px] text-slate-500">Overlay responsive alignment guides</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.gridEnabled}
              onChange={(e) => onChange({ ...state, gridEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Grid Settings */}
        {state.gridEnabled && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-750 space-y-2.5">
            {/* Columns Preset */}
            <div>
              <div className="text-[11px] text-slate-500 mb-1 font-medium">Columns:</div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                {[4, 8, 12, 16].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => updateGrid({ columns: cols as 4 | 8 | 12 | 16 })}
                    className={`py-1 rounded border text-xs transition-colors ${
                      state.gridConfig.columns === cols
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {cols} col
                  </button>
                ))}
              </div>
            </div>

            {/* Gutter & Margins */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[11px] text-slate-500 mb-1 flex justify-between">
                  <span>Gutter:</span>
                  <span className="font-mono">{state.gridConfig.gutter}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={state.gridConfig.gutter}
                  onChange={(e) => updateGrid({ gutter: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1 flex justify-between">
                  <span>Margin:</span>
                  <span className="font-mono">{state.gridConfig.margin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="96"
                  value={state.gridConfig.margin}
                  onChange={(e) => updateGrid({ margin: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Opacity & Color */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-[11px] text-slate-500 mb-1 flex justify-between">
                  <span>Opacity:</span>
                  <span className="font-mono">{Math.round(state.gridConfig.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={state.gridConfig.opacity * 100}
                  onChange={(e) => updateGrid({ opacity: parseInt(e.target.value) / 100 })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="text-[11px] text-slate-500 mb-1">Color:</div>
                <input
                  type="color"
                  value={state.gridConfig.color}
                  onChange={(e) => updateGrid({ color: e.target.value })}
                  className="w-8 h-7 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Dark Theme Simulation */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Dark Theme Simulation</div>
            <div className="text-[11px] text-slate-500">Test high-contrast and inverted dark palettes</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDarkTheme(state.darkThemeMode === 'simulated' ? 'disabled' : 'simulated')}
            className={`py-1.5 px-2 rounded border text-xs font-medium transition-colors ${
              state.darkThemeMode === 'simulated'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
          >
            {state.darkThemeMode === 'simulated' ? 'Active (Simulated)' : 'Simulate Dark CSS'}
          </button>

          <button
            onClick={() => setDarkTheme('disabled')}
            disabled={state.darkThemeMode === 'disabled'}
            className="py-1.5 px-2 rounded border text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            Reset Theme
          </button>
        </div>
      </div>

      {/* 4. Color-Blindness Simulation */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Color Vision Deficiency Filters</div>
            <div className="text-[11px] text-slate-500">Simulate visual impairment with SVG matrices</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'none', label: 'Normal Vision' },
            { id: 'protanopia', label: 'Protanopia (Red-Blind)' },
            { id: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
            { id: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
            { id: 'achromatopsia', label: 'Achromatopsia (Grayscale)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setColorBlindness(item.id as ColorBlindnessType)}
              className={`p-2 rounded border text-left flex items-center justify-between text-xs transition-colors ${
                state.colorBlindness === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              {state.colorBlindness === item.id && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
