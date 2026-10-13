import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredPresets,
  savePresets,
  getStoredHistory,
  saveStoredHistory,
  getStoredTheme,
  saveStoredTheme,
} from '../src/utils/storage-utils';
import { DevicePreset, DEFAULT_PRESETS } from '../src/types/presets';
import { ChangeRecord } from '../src/types/history';

describe('Storage & Change Tracking Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves default device presets when storage is empty', async () => {
    const presets = await getStoredPresets();
    expect(presets.length).toBe(DEFAULT_PRESETS.length);
    expect(presets[0].name).toContain('iPhone');
  });

  it('persists and restores custom device presets', async () => {
    const custom: DevicePreset = {
      id: 'custom-123',
      name: 'Custom Test Phone',
      category: 'custom',
      width: 400,
      height: 900,
      devicePixelRatio: 3,
      orientation: 'portrait',
      isCustom: true,
    };

    const updated = [...DEFAULT_PRESETS, custom];
    await savePresets(updated);

    const retrieved = await getStoredPresets();
    expect(retrieved.length).toBe(DEFAULT_PRESETS.length + 1);
    expect(retrieved.find((p) => p.id === 'custom-123')).toBeDefined();
  });

  it('persists and trims change history to avoid unbounded storage growth', async () => {
    const mockHistory: ChangeRecord[] = Array.from({ length: 10 }, (_, i) => ({
      id: `change-${i}`,
      timestamp: Date.now() - i * 1000,
      targetSelector: `.item-${i}`,
      category: 'css',
      propertyOrField: 'color',
      previousValue: '#000',
      newValue: '#fff',
      status: 'applied',
    }));

    await saveStoredHistory(mockHistory);
    const retrieved = await getStoredHistory();
    expect(retrieved.length).toBe(10);
    expect(retrieved[0].targetSelector).toBe('.item-0');
  });

  it('persists and toggles UI theme between light and dark', () => {
    expect(getStoredTheme()).toBe('light');
    saveStoredTheme('dark');
    expect(getStoredTheme()).toBe('dark');
    saveStoredTheme('light');
    expect(getStoredTheme()).toBe('light');
  });
});
