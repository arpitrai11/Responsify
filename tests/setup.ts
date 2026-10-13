import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mock for chrome extension APIs in unit testing
const mockStorage: Record<string, any> = {};

const chromeMock = {
  runtime: {
    sendMessage: vi.fn().mockImplementation((_msg, cb) => {
      if (cb) cb({ success: true });
      return Promise.resolve({ success: true });
    }),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    getURL: vi.fn((path) => `chrome-extension://mock-id/${path}`),
  },
  tabs: {
    query: vi.fn().mockResolvedValue([
      { id: 101, url: 'https://test-site.example.com', windowId: 1, active: true },
    ]),
    get: vi.fn().mockResolvedValue({ id: 101, url: 'https://test-site.example.com', windowId: 1 }),
    create: vi.fn().mockResolvedValue({ id: 102 }),
    sendMessage: vi.fn().mockImplementation((_tabId, _msg) => {
      return Promise.resolve({ success: true });
    }),
  },
  scripting: {
    executeScript: vi.fn().mockResolvedValue([{ result: true }]),
  },
  storage: {
    local: {
      get: vi.fn((key: string | string[]) => {
        if (typeof key === 'string') {
          return Promise.resolve({ [key]: mockStorage[key] });
        }
        return Promise.resolve(mockStorage);
      }),
      set: vi.fn((items: Record<string, any>) => {
        Object.assign(mockStorage, items);
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
        return Promise.resolve();
      }),
    },
  },
  downloads: {
    download: vi.fn().mockResolvedValue(12345),
  },
  permissions: {
    contains: vi.fn((_p, cb) => cb(true)),
    request: vi.fn((_p, cb) => cb(true)),
    remove: vi.fn((_p, cb) => cb(true)),
  },
  sidePanel: {
    setPanelBehavior: vi.fn().mockResolvedValue(undefined),
    open: vi.fn().mockResolvedValue(undefined),
  },
};

// @ts-expect-error Mocking global chrome
global.chrome = chromeMock;
