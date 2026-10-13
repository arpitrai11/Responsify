import React, { useState } from 'react';
import { DevicePreset, UserAgentPreset, PresetCategory } from '../types/presets';
import { Smartphone, Tablet, Laptop, Monitor, Plus, Trash2, Check, Globe } from 'lucide-react';

interface DeviceSelectorProps {
  presets: DevicePreset[];
  selectedPreset: DevicePreset | null;
  onSelectPreset: (preset: DevicePreset) => void;
  onAddCustomPreset: (preset: DevicePreset) => void;
  onDeleteCustomPreset: (id: string) => void;
  userAgents: UserAgentPreset[];
  selectedUserAgent: string | null;
  onSelectUserAgent: (ua: string | null) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  presets,
  selectedPreset,
  onSelectPreset,
  onAddCustomPreset,
  onDeleteCustomPreset,
  userAgents,
  selectedUserAgent,
  onSelectUserAgent,
}) => {
  const [activeCategory, setActiveCategory] = useState<PresetCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPreset, setNewPreset] = useState<Partial<DevicePreset>>({
    name: '',
    category: 'custom',
    width: 375,
    height: 812,
    devicePixelRatio: 2,
    orientation: 'portrait',
  });

  const filteredPresets = presets.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPreset.name || !newPreset.width || !newPreset.height) return;

    const preset: DevicePreset = {
      id: `custom-${Date.now()}`,
      name: newPreset.name,
      category: 'custom',
      width: Number(newPreset.width),
      height: Number(newPreset.height),
      devicePixelRatio: Number(newPreset.devicePixelRatio) || 1,
      orientation: newPreset.orientation || 'portrait',
      isCustom: true,
    };

    onAddCustomPreset(preset);
    setShowAddModal(false);
    setNewPreset({ name: '', category: 'custom', width: 375, height: 812, devicePixelRatio: 2 });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-xs">
      {/* Category Tabs */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          {[
            { id: 'all', label: 'All', icon: Globe },
            { id: 'mobile', label: 'Mobile', icon: Smartphone },
            { id: 'tablet', label: 'Tablet', icon: Tablet },
            { id: 'laptop', label: 'Laptop', icon: Laptop },
            { id: 'desktop', label: 'Desktop', icon: Monitor },
            { id: 'custom', label: 'Custom', icon: Plus },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as PresetCategory | 'all')}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Preset</span>
        </button>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                    : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{preset.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {preset.width} × {preset.height} px{' '}
                    <span className="text-[10px] text-slate-400">({preset.devicePixelRatio}x DPR)</span>
                  </div>
                </div>

                {preset.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomPreset(preset.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Custom Preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* User-Agent Simulation Selector */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>User-Agent Preset Override</span>
          </div>
          <div className="text-[11px] text-slate-500 mb-2">
            Applies HTTP User-Agent header emulation via Chrome DevTools Protocol when active.
          </div>

          <select
            value={selectedUserAgent || ''}
            onChange={(e) => onSelectUserAgent(e.target.value || null)}
            className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Browser Default (No Override)</option>
            {userAgents.map((ua) => (
              <option key={ua.id} value={ua.userAgent}>
                {ua.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Custom Preset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-850 rounded-xl max-w-sm w-full p-4 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">
              Add Custom Device Preset
            </h3>

            <form onSubmit={handleCreatePreset} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Device Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Test Device"
                  value={newPreset.name}
                  onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Width (px)</label>
                  <input
                    type="number"
                    required
                    value={newPreset.width}
                    onChange={(e) => setNewPreset({ ...newPreset, width: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Height (px)</label>
                  <input
                    type="number"
                    required
                    value={newPreset.height}
                    onChange={(e) => setNewPreset({ ...newPreset, height: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Device Pixel Ratio (DPR)</label>
                <select
                  value={newPreset.devicePixelRatio}
                  onChange={(e) => setNewPreset({ ...newPreset, devicePixelRatio: parseFloat(e.target.value) })}
                  className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                >
                  <option value="1">1x (Standard)</option>
                  <option value="2">2x (Retina)</option>
                  <option value="3">3x (Super Retina)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
