import React, { useState } from 'react';
import { PageAsset } from '../types/assets';
import { Download, Search, Image as ImageIcon, Code2, RefreshCw, ExternalLink } from 'lucide-react';

interface AssetExplorerProps {
  assets: PageAsset[];
  onRefreshAssets: () => void;
  onDownloadAsset: (asset: PageAsset) => void;
  isLoading?: boolean;
}

export const AssetExplorer: React.FC<AssetExplorerProps> = ({
  assets,
  onRefreshAssets,
  onDownloadAsset,
  isLoading = false,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredAssets = assets.filter((asset) => {
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesSearch = !search || asset.url.toLowerCase().includes(search.toLowerCase()) || (asset.altText && asset.altText.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-xs">
      {/* Search and Action Bar */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets by URL or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <button
            onClick={onRefreshAssets}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded text-xs transition-colors"
            title="Scan Page for Assets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
            <span>Scan</span>
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {['all', 'image', 'svg', 'background-image'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'background-image' ? 'Backgrounds' : type} (
              {type === 'all' ? assets.length : assets.filter((a) => a.type === type).length})
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No media assets found on this page.</p>
            <button
              onClick={onRefreshAssets}
              className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline text-xs"
            >
              Scan again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group"
              >
                {/* Thumbnail Preview */}
                <div className="relative w-full h-24 bg-slate-200/60 dark:bg-slate-800 rounded flex items-center justify-center overflow-hidden mb-2 pattern-checkerboard">
                  {asset.isInlineSvg ? (
                    <div
                      className="w-16 h-16 flex items-center justify-center p-2 text-indigo-600 dark:text-indigo-400"
                      dangerouslySetInnerHTML={{ __html: asset.svgContent || '' }}
                    />
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.altText || 'Thumbnail'}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}

                  {/* Type Badge */}
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono uppercase">
                    {asset.type}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-2">
                  <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate" title={asset.altText || asset.url}>
                    {asset.altText || (asset.isInlineSvg ? 'Inline SVG Graphic' : asset.url.split('/').pop()?.split('?')[0])}
                  </div>
                  {asset.dimensions && (
                    <div className="text-[10px] font-mono text-slate-500">
                      {asset.dimensions.width} × {asset.dimensions.height} px
                    </div>
                  )}
                </div>

                {/* Download and View Buttons */}
                <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
                    title="Open asset in new tab"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </a>

                  <button
                    onClick={() => onDownloadAsset(asset)}
                    className="flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-medium transition-colors shadow-xs"
                    title={asset.isInlineSvg ? 'Export SVG markup to .svg file' : 'Download file via Chrome'}
                  >
                    {asset.isInlineSvg ? <Code2 className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                    <span>{asset.isInlineSvg ? 'Export SVG' : 'Download'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
