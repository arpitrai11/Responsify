export type PresetCategory = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'custom';

export interface DevicePreset {
  id: string;
  name: string;
  category: PresetCategory;
  width: number;
  height: number;
  devicePixelRatio: number;
  userAgent?: string;
  orientation: 'portrait' | 'landscape';
  isCustom?: boolean;
}

export interface UserAgentPreset {
  id: string;
  name: string;
  category: 'desktop' | 'mobile';
  userAgent: string;
  isCustom?: boolean;
}

export const DEFAULT_PRESETS: DevicePreset[] = [
  // Mobile
  { id: 'iphone-15-pro', name: 'iPhone 15 / 16 Pro', category: 'mobile', width: 393, height: 852, devicePixelRatio: 3, orientation: 'portrait' },
  { id: 'iphone-14', name: 'iPhone 14 / 13', category: 'mobile', width: 390, height: 844, devicePixelRatio: 3, orientation: 'portrait' },
  { id: 'iphone-se', name: 'iPhone SE', category: 'mobile', width: 375, height: 667, devicePixelRatio: 2, orientation: 'portrait' },
  { id: 'pixel-8', name: 'Google Pixel 8', category: 'mobile', width: 412, height: 892, devicePixelRatio: 2.6, orientation: 'portrait' },
  { id: 'galaxy-s24', name: 'Samsung Galaxy S24', category: 'mobile', width: 360, height: 780, devicePixelRatio: 3, orientation: 'portrait' },
  { id: 'galaxy-fold', name: 'Galaxy Z Fold (Cover)', category: 'mobile', width: 344, height: 882, devicePixelRatio: 2.6, orientation: 'portrait' },

  // Tablet
  { id: 'ipad-mini', name: 'iPad Mini (8.3")', category: 'tablet', width: 768, height: 1024, devicePixelRatio: 2, orientation: 'portrait' },
  { id: 'ipad-air', name: 'iPad Air / Pro 11"', category: 'tablet', width: 820, height: 1180, devicePixelRatio: 2, orientation: 'portrait' },
  { id: 'ipad-pro-12', name: 'iPad Pro 12.9"', category: 'tablet', width: 1024, height: 1366, devicePixelRatio: 2, orientation: 'portrait' },
  { id: 'galaxy-tab-s9', name: 'Galaxy Tab S9', category: 'tablet', width: 800, height: 1280, devicePixelRatio: 2, orientation: 'portrait' },

  // Laptop
  { id: 'macbook-air-13', name: 'MacBook Air 13"', category: 'laptop', width: 1280, height: 832, devicePixelRatio: 2, orientation: 'landscape' },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14"', category: 'laptop', width: 1512, height: 982, devicePixelRatio: 2, orientation: 'landscape' },
  { id: 'chromebook', name: 'Standard HD Laptop', category: 'laptop', width: 1366, height: 768, devicePixelRatio: 1, orientation: 'landscape' },

  // Desktop
  { id: 'desktop-fhd', name: 'Desktop Full HD (1080p)', category: 'desktop', width: 1920, height: 1080, devicePixelRatio: 1, orientation: 'landscape' },
  { id: 'desktop-qhd', name: 'Desktop 2K QHD', category: 'desktop', width: 2560, height: 1440, devicePixelRatio: 1, orientation: 'landscape' },
  { id: 'desktop-4k', name: 'Desktop 4K UHD', category: 'desktop', width: 3840, height: 2160, devicePixelRatio: 1.5, orientation: 'landscape' },
  { id: 'desktop-ultrawide', name: 'Ultrawide (21:9)', category: 'desktop', width: 3440, height: 1440, devicePixelRatio: 1, orientation: 'landscape' },
];

export const DEFAULT_USER_AGENTS: UserAgentPreset[] = [
  {
    id: 'ua-chrome-desktop',
    name: 'Chrome Windows (Desktop)',
    category: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  },
  {
    id: 'ua-safari-mac',
    name: 'Safari macOS (Desktop)',
    category: 'desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  },
  {
    id: 'ua-firefox-desktop',
    name: 'Firefox Desktop',
    category: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  },
  {
    id: 'ua-iphone-safari',
    name: 'iPhone Safari (Mobile)',
    category: 'mobile',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  },
  {
    id: 'ua-android-chrome',
    name: 'Chrome Android (Mobile)',
    category: 'mobile',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  },
];
