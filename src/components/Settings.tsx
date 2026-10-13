import React, { useState, useEffect } from 'react';
import { Keyboard, Shield, Trash2, Info, Sparkles } from 'lucide-react';

interface SettingsProps {
  onResetPresets: () => void;
  onClearHistory: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onResetPresets, onClearHistory }) => {
  const [hasDebuggerPermission, setHasDebuggerPermission] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.permissions) {
      chrome.permissions.contains({ permissions: ['debugger'] }, (result) => {
        setHasDebuggerPermission(!!result);
      });
    }
  }, []);

  const handleRequestDebugger = () => {
    if (typeof chrome !== 'undefined' && chrome.permissions) {
      if (!hasDebuggerPermission) {
        chrome.permissions.request({ permissions: ['debugger'] }, (granted) => {
          setHasDebuggerPermission(!!granted);
          setFeedback(granted ? 'Debugger permission granted!' : 'Permission request was cancelled.');
          setTimeout(() => setFeedback(null), 3000);
        });
      } else {
        chrome.permissions.remove({ permissions: ['debugger'] }, (removed) => {
          if (removed) {
            setHasDebuggerPermission(false);
            setFeedback('Debugger permission revoked.');
            setTimeout(() => setFeedback(null), 3000);
          }
        });
      }
    }
  };

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full text-xs">
      {/* Status Notice */}
      {feedback && (
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-md text-indigo-700 dark:text-indigo-300 flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. All Features Unlocked Badge */}
      <div className="p-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800/80 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-100">Responsive Inspector Pro</div>
            <div className="text-[11px] text-slate-500">All Features Unlocked • 100% Free & Open Developer Tool</div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px]">
          v1.0.0
        </span>
      </div>

      {/* 2. Keyboard Shortcuts */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Keyboard Shortcuts</div>
            <div className="text-[11px] text-slate-500">Speed up your inspection workflow</div>
          </div>
        </div>

        <div className="divide-y divide-slate-200/60 dark:divide-slate-800 text-[11px]">
          <div className="py-1.5 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Cancel Element Picker</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono shadow-2xs">
              Esc
            </kbd>
          </div>
          <div className="py-1.5 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Undo Last Change</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono shadow-2xs">
              Ctrl / Cmd + Z
            </kbd>
          </div>
          <div className="py-1.5 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Redo Change</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono shadow-2xs">
              Ctrl + Shift + Z
            </kbd>
          </div>
          <div className="py-1.5 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Toggle Inspection Mode</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono shadow-2xs">
              Alt + I
            </kbd>
          </div>
        </div>
      </div>

      {/* 3. Optional Debugger Permissions */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Chrome Debugger Protocol</div>
            <div className="text-[11px] text-slate-500">Enables exact User-Agent and Device Metrics emulation</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          The Chrome Debugger permission is optional. When enabled, it allows the extension to override the HTTP User-Agent and simulate device screen metrics natively in Chrome tabs without reloading.
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full ${hasDebuggerPermission ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>{hasDebuggerPermission ? 'Permission Active' : 'Permission Not Requested'}</span>
          </div>

          <button
            onClick={handleRequestDebugger}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              hasDebuggerPermission
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {hasDebuggerPermission ? 'Revoke Permission' : 'Request Permission'}
          </button>
        </div>
      </div>

      {/* 4. Reset & Data Management */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Data Management</div>
            <div className="text-[11px] text-slate-500">Reset local presets and storage</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              if (confirm('Reset all device presets to factory defaults?')) {
                onResetPresets();
                setFeedback('Presets reset to defaults.');
                setTimeout(() => setFeedback(null), 3000);
              }
            }}
            className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded text-xs transition-colors"
          >
            Reset Presets to Defaults
          </button>

          <button
            onClick={() => {
              if (confirm('Clear entire edit history?')) {
                onClearHistory();
                setFeedback('Change history cleared.');
                setTimeout(() => setFeedback(null), 3000);
              }
            }}
            className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded text-xs transition-colors"
          >
            Clear Change History
          </button>
        </div>
      </div>
    </div>
  );
};
