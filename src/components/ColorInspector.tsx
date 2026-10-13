import React, { useState } from 'react';
import { ElementInfo } from '../types/inspector';
import { parseColor, rgbaToHex, rgbaToHsl, rgbaToRgbString, hslToString } from '../utils/color-utils';
import { Copy, Check, Info, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ColorInspectorProps {
  element: ElementInfo | null;
}

export const ColorInspector: React.FC<ColorInspectorProps> = ({ element }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!element) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Select an element to inspect colors and WCAG accessibility contrast ratios.
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const renderColorCard = (title: string, colorStr: string) => {
    const parsed = parseColor(colorStr);
    if (!parsed) return null;

    const hex = rgbaToHex(parsed);
    const rgb = rgbaToRgbString(parsed);
    const hsl = hslToString(rgbaToHsl(parsed));

    return (
      <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            {title}
          </span>
          <div
            className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 shadow-xs"
            style={{ backgroundColor: colorStr }}
            title={colorStr}
          />
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between p-1 bg-white dark:bg-slate-900 rounded border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500">HEX</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-800 dark:text-slate-200 font-medium">{hex}</span>
              <button
                onClick={() => copyToClipboard(hex, `HEX ${title}`)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Copy HEX"
              >
                {copiedText === `HEX ${title}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-1 bg-white dark:bg-slate-900 rounded border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500">RGB</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[140px]">{rgb}</span>
              <button
                onClick={() => copyToClipboard(rgb, `RGB ${title}`)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Copy RGB"
              >
                {copiedText === `RGB ${title}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-1 bg-white dark:bg-slate-900 rounded border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500">HSL</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[140px]">{hsl}</span>
              <button
                onClick={() => copyToClipboard(hsl, `HSL ${title}`)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Copy HSL"
              >
                {copiedText === `HSL ${title}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const contrast = element.contrast;

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-xs">
      {/* Colors Section */}
      <div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Element Colors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {renderColorCard('Text Color', element.colors.color)}
          {renderColorCard('Background', element.colors.backgroundColor)}
          {element.colors.borderColor && renderColorCard('Border', element.colors.borderColor)}
        </div>
      </div>

      {/* WCAG Contrast Checker Section */}
      {contrast && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200">WCAG Contrast Ratio</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {contrast.ratio} : 1
              </span>
            </div>

            {/* Visual Preview Pill */}
            <div
              className="px-3 py-1 rounded text-xs font-semibold shadow-xs"
              style={{
                color: contrast.foreground,
                backgroundColor: contrast.background,
              }}
            >
              Sample Text
            </div>
          </div>

          {/* Compliance Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div
              className={`p-2 rounded border ${
                contrast.aaNormal
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 font-bold">
                {contrast.aaNormal ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>AA Normal</span>
              </div>
              <div className="text-[10px] opacity-80">{contrast.aaNormal ? 'Pass (≥ 4.5)' : 'Fail (< 4.5)'}</div>
            </div>

            <div
              className={`p-2 rounded border ${
                contrast.aaLarge
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 font-bold">
                {contrast.aaLarge ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>AA Large</span>
              </div>
              <div className="text-[10px] opacity-80">{contrast.aaLarge ? 'Pass (≥ 3.0)' : 'Fail (< 3.0)'}</div>
            </div>

            <div
              className={`p-2 rounded border ${
                contrast.aaaNormal
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 font-bold">
                {contrast.aaaNormal ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>AAA Normal</span>
              </div>
              <div className="text-[10px] opacity-80">{contrast.aaaNormal ? 'Pass (≥ 7.0)' : 'Fail (< 7.0)'}</div>
            </div>

            <div
              className={`p-2 rounded border ${
                contrast.aaaLarge
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 font-bold">
                {contrast.aaaLarge ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>AAA Large</span>
              </div>
              <div className="text-[10px] opacity-80">{contrast.aaaLarge ? 'Pass (≥ 4.5)' : 'Fail (< 4.5)'}</div>
            </div>
          </div>

          {contrast.isEstimated && (
            <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-900">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{contrast.note || 'Background color contains transparency; ratio is estimated composited over white.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
