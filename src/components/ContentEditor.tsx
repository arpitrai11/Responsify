import React, { useState, useEffect } from 'react';
import { ElementInfo } from '../types/inspector';
import { Type, Image, RotateCcw, Check, Upload } from 'lucide-react';

interface ContentEditorProps {
  element: ElementInfo | null;
  onUpdateText: (text: string) => void;
  onResetText: () => void;
  onUpdateImage: (src: string) => void;
  onResetImage: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  element,
  onUpdateText,
  onResetText,
  onUpdateImage,
  onResetImage,
}) => {
  const [textVal, setTextVal] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (element) {
      setTextVal(element.textContent || '');
      setImgUrl('');
    }
  }, [element]);

  if (!element) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Select an element on the page to edit its text content or replace images.
      </div>
    );
  }

  const isImageElement =
    element.tagName === 'img' ||
    element.tagName === 'picture' ||
    (element.computedStyles['background-image'] && element.computedStyles['background-image'] !== 'none');

  const handleSaveText = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateText(textVal);
    setSuccessNotice('Text updated on page');
    setTimeout(() => setSuccessNotice(null), 2000);
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgUrl.trim()) return;
    onUpdateImage(imgUrl.trim());
    setSuccessNotice('Image replaced on page');
    setTimeout(() => setSuccessNotice(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateImage(reader.result);
        setImgUrl(reader.result.slice(0, 50) + '...');
        setSuccessNotice('Local image loaded');
        setTimeout(() => setSuccessNotice(null), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full text-xs">
      {/* Toast feedback */}
      {successNotice && (
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* 1. Text Content Editing */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Text Content Editor</div>
            <div className="text-[11px] text-slate-500">Live modify element inner text</div>
          </div>
        </div>

        <form onSubmit={handleSaveText} className="space-y-2">
          <textarea
            rows={3}
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            placeholder="Enter replacement text..."
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onResetText}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Text</span>
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors shadow-xs"
            >
              Apply Text
            </button>
          </div>
        </form>
      </div>

      {/* 2. Image Replacement Editing */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Image Source Replacement</div>
            <div className="text-[11px] text-slate-500">
              {isImageElement
                ? 'Target element supports image replacements'
                : 'Replace image or apply background-image to this element'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveImage} className="space-y-2">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.png"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer text-slate-700 dark:text-slate-300 transition-colors">
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span>Upload Local File</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onResetImage}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Image</span>
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors shadow-xs"
            >
              Apply Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
