import React, { useState } from 'react';
import { ElementInfo } from '../types/inspector';
import { Plus, Search, RotateCcw, Undo2, Redo2, Check, Trash2 } from 'lucide-react';

interface CssEditorProps {
  element: ElementInfo | null;
  onApplyCss: (property: string, value: string) => void;
  onRemoveCss: (property: string) => void;
  onResetAll: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const CssEditor: React.FC<CssEditorProps> = ({
  element,
  onApplyCss,
  onRemoveCss,
  onResetAll,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const [filter, setFilter] = useState('');
  const [newProp, setNewProp] = useState('');
  const [newVal, setNewVal] = useState('');
  const [editingProp, setEditingProp] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  if (!element) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Select an element on the page to view and edit its CSS styles.
      </div>
    );
  }

  // Combine computed styles with any active inline overrides
  const combinedStyles: Record<string, { value: string; isCustom: boolean }> = {};

  // Computed styles
  Object.entries(element.computedStyles).forEach(([prop, val]) => {
    combinedStyles[prop] = { value: val, isCustom: false };
  });

  // Custom applied styles
  if (element.appliedCustomStyles) {
    Object.entries(element.appliedCustomStyles).forEach(([prop, val]) => {
      combinedStyles[prop] = { value: val, isCustom: true };
    });
  }

  // Filtered properties
  const filteredProps = Object.keys(combinedStyles)
    .filter((prop) => prop.toLowerCase().includes(filter.toLowerCase()) || combinedStyles[prop].value.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      // Prioritize custom modified styles at top
      if (combinedStyles[a].isCustom && !combinedStyles[b].isCustom) return -1;
      if (!combinedStyles[a].isCustom && combinedStyles[b].isCustom) return 1;
      return a.localeCompare(b);
    });

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.trim() || !newVal.trim()) return;

    onApplyCss(newProp.trim(), newVal.trim());
    setNewProp('');
    setNewVal('');
  };

  const handleSaveEdit = (prop: string) => {
    if (editVal.trim()) {
      onApplyCss(prop, editVal.trim());
    } else {
      onRemoveCss(prop);
    }
    setEditingProp(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-xs">
      {/* Editor Controls Bar */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        {/* Search Filter */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter properties..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-7 pr-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Undo / Redo / Reset */}
        <div className="flex items-center gap-1">
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo last change"
              className={`p-1 rounded ${
                canUndo
                  ? 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onRedo && (
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo change"
              className={`p-1 rounded ${
                canRedo
                  ? 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onResetAll}
            title="Reset all modified CSS properties on this element"
            className="flex items-center gap-1 px-2 py-1 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Add New Declaration Form */}
      <form
        onSubmit={handleAddNew}
        className="p-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 font-mono"
      >
        <input
          type="text"
          placeholder="property (e.g. background)"
          value={newProp}
          onChange={(e) => setNewProp(e.target.value)}
          className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-indigo-500"
        />
        <span className="text-slate-400 font-bold">:</span>
        <input
          type="text"
          placeholder="value (e.g. #4f46e5)"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
          title="Apply CSS Property"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Styles List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
        {filteredProps.map((prop) => {
          const item = combinedStyles[prop];
          const isEditing = editingProp === prop;

          return (
            <div
              key={prop}
              className={`px-3 py-1.5 flex items-center justify-between gap-2 group hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors ${
                item.isCustom ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {item.isCustom && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" title="Custom override" />
                )}
                <span className="text-slate-500 dark:text-slate-400 font-medium select-text">
                  {prop}:
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      autoFocus
                      type="text"
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(prop);
                        if (e.key === 'Escape') setEditingProp(null);
                      }}
                      className="flex-1 px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-indigo-400 rounded text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(prop)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => {
                      setEditingProp(prop);
                      setEditVal(item.value);
                    }}
                    className="text-slate-800 dark:text-slate-200 cursor-pointer hover:underline truncate select-text"
                    title="Click to edit value"
                  >
                    {item.value};
                  </span>
                )}
              </div>

              {/* Action buttons on hover */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                {item.isCustom && (
                  <button
                    onClick={() => onRemoveCss(prop)}
                    title="Revert to original value"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
