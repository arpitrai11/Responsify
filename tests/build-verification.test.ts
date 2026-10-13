import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Production Build and Distribution Verification', () => {
  const distDir = path.resolve(__dirname, '../dist');

  it('contains dist directory and valid manifest.json', () => {
    expect(fs.existsSync(distDir)).toBe(true);
    const manifestPath = path.join(distDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe('Responsive Inspector Pro');
  });

  it('contains all HTML extension entry points', () => {
    expect(fs.existsSync(path.join(distDir, 'popup.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'sidepanel.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'workspace.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'devtools.html'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'devtools-panel.html'))).toBe(true);
  });

  it('contains compiled background service worker and content script', () => {
    const swPath = path.join(distDir, 'background/service-worker.js');
    expect(fs.existsSync(swPath)).toBe(true);
    expect(fs.statSync(swPath).size).toBeGreaterThan(500);

    const csPath = path.join(distDir, 'content/inspector.js');
    expect(fs.existsSync(csPath)).toBe(true);
    expect(fs.statSync(csPath).size).toBeGreaterThan(5000);
  });

  it('contains all required icon sizes', () => {
    [16, 32, 48, 128].forEach((size) => {
      const iconPath = path.join(distDir, `icons/icon${size}.png`);
      expect(fs.existsSync(iconPath)).toBe(true);
    });
  });
});
