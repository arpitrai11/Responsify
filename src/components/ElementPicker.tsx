import React from 'react';
import { ElementInfo } from '../types/inspector';
import { MousePointer2, X, ChevronRight, Hash, Layers } from 'lucide-react';

interface ElementPickerProps {
  element: ElementInfo | null;
  isPicking: boolean;
  onStartPicking: () => void;
  onClearElement: () => void;
  onSelectHierarchyNode?: (selector: string) => void;
}

export const ElementPicker: React.FC<ElementPickerProps> = ({
  element,
  isPicking,
  onStartPicking,
  onClearElement,
}) => {
  if (!element) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 m-3">
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 shadow-xs">
          <MousePointer2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
          No Element Selected
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
          Click the pick button below or in the toolbar, then hover and click any element on the page to inspect and edit.
        </p>
        <button
          onClick={onStartPicking}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium shadow-xs transition-colors"
        >
          <MousePointer2 className="w-3.5 h-3.5" />
          <span>{isPicking ? 'Cancel Element Picker' : 'Pick Element on Page'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
      {/* Element Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold rounded">
            {element.tagName}
          </span>
          {element.id && (
            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-semibold rounded flex items-center gap-0.5">
              <Hash className="w-3 h-3" />
              {element.id}
            </span>
          )}
          {element.classList.slice(0, 3).map((cls) => (
            <span
              key={cls}
              className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
            >
              .{cls}
            </span>
          ))}
          {element.classList.length > 3 && (
            <span className="text-[11px] text-slate-400 font-sans">
              +{element.classList.length - 3} more
            </span>
          )}
        </div>

        <button
          onClick={onClearElement}
          title="Clear Selection"
          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dimensions & Stats Banner */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
        <div>
          Dimensions:{' '}
          <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
            {element.rect.width} × {element.rect.height} px
          </span>
        </div>
        <div>
          Position:{' '}
          <span className="font-mono text-slate-700 dark:text-slate-200">
            ({element.rect.left}, {element.rect.top})
          </span>
        </div>
        <div>
          Children:{' '}
          <span className="font-mono text-slate-700 dark:text-slate-200">
            {element.childrenCount}
          </span>
        </div>
      </div>

      {/* DOM Hierarchy Breadcrumbs */}
      {element.parentHierarchy.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto py-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
          <Layers className="w-3 h-3 flex-shrink-0 text-slate-400" />
          {element.parentHierarchy.map((node, idx) => (
            <React.Fragment key={idx}>
              <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-default whitespace-nowrap">
                {node.tagName}
                {node.id ? `#${node.id}` : ''}
              </span>
              {idx < element.parentHierarchy.length - 1 && (
                <ChevronRight className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
