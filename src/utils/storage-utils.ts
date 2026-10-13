import { DevicePreset, DEFAULT_PRESETS, UserAgentPreset, DEFAULT_USER_AGENTS } from '../types/presets';
import { ChangeRecord } from '../types/history';
import { VisualModesState, DEFAULT_GRID_CONFIG } from '../types/visual-modes';

const STORAGE_KEYS = {
  PRESETS: 'rip_device_presets',
  USER_AGENTS: 'rip_user_agents',
  HISTORY: 'rip_change_history',
  VISUAL_MODES: 'rip_visual_modes',
  THEME: 'rip_ui_theme',
};

// Check if chrome.storage.local is available
const isChromeStorageAvailable = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local;
};

export async function getStoredPresets(): Promise<DevicePreset[]> {
  try {
    if (isChromeStorageAvailable()) {
      const data = await chrome.storage.local.get(STORAGE_KEYS.PRESETS);
      if (data[STORAGE_KEYS.PRESETS] && Array.isArray(data[STORAGE_KEYS.PRESETS])) {
        return data[STORAGE_KEYS.PRESETS];
      }
    } else if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(STORAGE_KEYS.PRESETS);
      if (local) return JSON.parse(local);
    }
  } catch (e) {
    console.warn('Error reading stored presets:', e);
  }
  return DEFAULT_PRESETS;
}

export async function savePresets(presets: DevicePreset[]): Promise<void> {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.PRESETS]: presets });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
    }
  } catch (e) {
    console.error('Error saving presets:', e);
  }
}

export async function getStoredUserAgents(): Promise<UserAgentPreset[]> {
  try {
    if (isChromeStorageAvailable()) {
      const data = await chrome.storage.local.get(STORAGE_KEYS.USER_AGENTS);
      if (data[STORAGE_KEYS.USER_AGENTS] && Array.isArray(data[STORAGE_KEYS.USER_AGENTS])) {
        return data[STORAGE_KEYS.USER_AGENTS];
      }
    } else if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(STORAGE_KEYS.USER_AGENTS);
      if (local) return JSON.parse(local);
    }
  } catch (e) {
    console.warn('Error reading stored user agents:', e);
  }
  return DEFAULT_USER_AGENTS;
}

export async function saveUserAgents(uas: UserAgentPreset[]): Promise<void> {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.USER_AGENTS]: uas });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_AGENTS, JSON.stringify(uas));
    }
  } catch (e) {
    console.error('Error saving user agents:', e);
  }
}

export async function getStoredHistory(): Promise<ChangeRecord[]> {
  try {
    if (isChromeStorageAvailable()) {
      const data = await chrome.storage.local.get(STORAGE_KEYS.HISTORY);
      if (data[STORAGE_KEYS.HISTORY] && Array.isArray(data[STORAGE_KEYS.HISTORY])) {
        return data[STORAGE_KEYS.HISTORY];
      }
    } else if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (local) return JSON.parse(local);
    }
  } catch (e) {
    console.warn('Error reading stored history:', e);
  }
  return [];
}

export async function saveStoredHistory(history: ChangeRecord[]): Promise<void> {
  try {
    // Keep max 200 items in history to avoid unbounded storage growth
    const trimmed = history.slice(0, 200);
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.HISTORY]: trimmed });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    }
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

export async function getStoredVisualModes(): Promise<VisualModesState> {
  const defaults: VisualModesState = {
    xrayEnabled: false,
    gridEnabled: false,
    gridConfig: DEFAULT_GRID_CONFIG,
    darkThemeMode: 'disabled',
    colorBlindness: 'none',
  };

  try {
    if (isChromeStorageAvailable()) {
      const data = await chrome.storage.local.get(STORAGE_KEYS.VISUAL_MODES);
      if (data[STORAGE_KEYS.VISUAL_MODES]) {
        return { ...defaults, ...data[STORAGE_KEYS.VISUAL_MODES] };
      }
    } else if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(STORAGE_KEYS.VISUAL_MODES);
      if (local) return { ...defaults, ...JSON.parse(local) };
    }
  } catch (e) {
    console.warn('Error reading visual modes:', e);
  }
  return defaults;
}

export async function saveStoredVisualModes(modes: VisualModesState): Promise<void> {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.VISUAL_MODES]: modes });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VISUAL_MODES, JSON.stringify(modes));
    }
  } catch (e) {
    console.error('Error saving visual modes:', e);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  if (typeof localStorage !== 'undefined') {
    const val = localStorage.getItem(STORAGE_KEYS.THEME);
    if (val === 'dark' || val === 'light') return val;
  }
  return 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark') {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}
