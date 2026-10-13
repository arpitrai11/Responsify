import React, { useState, useEffect } from 'react';
import { PreviewWorkspace } from '../components/PreviewWorkspace';
import { getStoredPresets } from '../utils/storage-utils';
import { DevicePreset, DEFAULT_PRESETS } from '../types/presets';

function getTargetUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');
    if (target) {
      try {
        return decodeURIComponent(target);
      } catch {
        return target;
      }
    }
  }
  return 'https://example.com';
}

export const WorkspaceApp: React.FC = () => {
  const [initialUrl, setInitialUrl] = useState<string>(getTargetUrl);
  const [presets, setPresets] = useState<DevicePreset[]>(DEFAULT_PRESETS);

  useEffect(() => {
    const target = getTargetUrl();
    if (target && target !== 'https://example.com') {
      setInitialUrl(target);
    } else if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
        if (tabs[0]?.url && !tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('chrome-extension://')) {
          setInitialUrl(tabs[0].url);
        }
      }).catch(() => {});
    }

    getStoredPresets().then(setPresets);
  }, []);

  return <PreviewWorkspace initialUrl={initialUrl} presets={presets} />;
};
