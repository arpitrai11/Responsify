import React, { useState } from 'react';
import { BoxModelData } from '../types/inspector';

interface BoxModelProps {
  boxModel: BoxModelData | null;
  onUpdateEdge?: (type: 'margin' | 'padding' | 'border', edge: 'top' | 'right' | 'bottom' | 'left', value: number) => void;
}

export const BoxModel: React.FC<BoxModelProps> = ({ boxModel, onUpdateEdge }) => {
  const [editing, setEditing] = useState<{
    type: 'margin' | 'padding' | 'border';
    edge: 'top' | 'right' | 'bottom' | 'left';
    val: number;
  } | null>(null);

  if (!boxModel) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        Select an element to view and adjust its Box Model.
      </div>
    );
  }

  const handleEditSubmit = () => {
    if (editing && onUpdateEdge) {
      onUpdateEdge(editing.type, editing.edge, editing.val);
      setEditing(null);
    }
  };

  const renderValue = (
    type: 'margin' | 'padding' | 'border',
    edge: 'top' | 'right' | 'bottom' | 'left',
    val: number
  ) => {
    const isThisEditing = editing?.type === type && editing?.edge === edge;

    if (isThisEditing) {
      return (
        <input
          autoFocus
          type="number"
          value={editing.val}
          onChange={(e) => setEditing({ ...editing, val: parseInt(e.target.value) || 0 })}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEditSubmit();
            if (e.key === 'Escape') setEditing(null);
          }}
          className="w-8 px-0.5 text-center bg-white dark:bg-slate-900 border border-indigo-400 rounded text-[11px] font-mono"
        />
      );
    }

    return (
      <span
        onClick={() => setEditing({ type, edge, val })}
        className="cursor-pointer hover:font-bold hover:underline transition-all px-1 py-0.5 rounded"
        title={`Click to edit ${type}-${edge} (currently ${val}px)`}
      >
        {val}
      </span>
    );
  };

  return (
    <div className="p-4 flex flex-col items-center select-none text-[11px] font-mono">
      {/* Outer Margin Box (Orange) */}
      <div className="relative w-full max-w-[340px] bg-orange-100/70 dark:bg-orange-950/40 border border-dashed border-orange-300 dark:border-orange-800 rounded p-2 text-orange-900 dark:text-orange-200">
        <div className="absolute top-1 left-2 text-[10px] text-orange-600 dark:text-orange-400 font-sans uppercase font-bold tracking-wider">
          margin
        </div>
        <div className="text-center mb-1">
          {renderValue('margin', 'top', boxModel.margin.top)}
        </div>

        <div className="flex items-center justify-between">
          <div>{renderValue('margin', 'left', boxModel.margin.left)}</div>

          {/* Border Box (Yellow) */}
          <div className="relative flex-1 mx-2 bg-yellow-100/70 dark:bg-yellow-950/40 border border-solid border-yellow-300 dark:border-yellow-800 rounded p-2 text-yellow-900 dark:text-yellow-200">
            <div className="absolute top-1 left-2 text-[10px] text-yellow-600 dark:text-yellow-400 font-sans uppercase font-bold tracking-wider">
              border
            </div>
            <div className="text-center mb-1">
              {renderValue('border', 'top', boxModel.border.top)}
            </div>

            <div className="flex items-center justify-between">
              <div>{renderValue('border', 'left', boxModel.border.left)}</div>

              {/* Padding Box (Green) */}
              <div className="relative flex-1 mx-2 bg-emerald-100/70 dark:bg-emerald-950/40 border border-dashed border-emerald-300 dark:border-emerald-800 rounded p-2 text-emerald-900 dark:text-emerald-200">
                <div className="absolute top-1 left-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-sans uppercase font-bold tracking-wider">
                  padding
                </div>
                <div className="text-center mb-1">
                  {renderValue('padding', 'top', boxModel.padding.top)}
                </div>

                <div className="flex items-center justify-between">
                  <div>{renderValue('padding', 'left', boxModel.padding.left)}</div>

                  {/* Content Box (Blue) */}
                  <div className="flex-1 mx-2 py-3 bg-sky-200/80 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-700 rounded text-center text-sky-900 dark:text-sky-100 font-semibold shadow-xs">
                    {boxModel.content.width} × {boxModel.content.height}
                  </div>

                  <div>{renderValue('padding', 'right', boxModel.padding.right)}</div>
                </div>

                <div className="text-center mt-1">
                  {renderValue('padding', 'bottom', boxModel.padding.bottom)}
                </div>
              </div>

              <div>{renderValue('border', 'right', boxModel.border.right)}</div>
            </div>

            <div className="text-center mt-1">
              {renderValue('border', 'bottom', boxModel.border.bottom)}
            </div>
          </div>

          <div>{renderValue('margin', 'right', boxModel.margin.right)}</div>
        </div>

        <div className="text-center mt-1">
          {renderValue('margin', 'bottom', boxModel.margin.bottom)}
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] text-slate-500 font-sans">
        Click any value to edit live on the inspected page
      </div>
    </div>
  );
};
