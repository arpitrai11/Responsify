import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Manifest V3 Compliance and Configuration', () => {
  const manifestPath = path.resolve(__dirname, '../manifest.json');
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestRaw);

  it('should be valid Manifest V3', () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe('Responsive Inspector Pro');
    expect(manifest.version).toBe('1.0.0');
  });

  it('should declare least-privilege permissions and optional permissions', () => {
    expect(manifest.permissions).toContain('activeTab');
    expect(manifest.permissions).toContain('storage');
    expect(manifest.permissions).toContain('scripting');
    expect(manifest.permissions).toContain('downloads');
    expect(manifest.permissions).toContain('sidePanel');
    expect(manifest.optional_permissions).toContain('debugger');
  });

  it('should declare background service worker as module', () => {
    expect(manifest.background).toBeDefined();
    expect(manifest.background.service_worker).toBe('background/service-worker.js');
    expect(manifest.background.type).toBe('module');
  });

  it('should declare extension action and side panel', () => {
    expect(manifest.action).toBeDefined();
    expect(manifest.side_panel.default_path).toBe('sidepanel.html');
    expect(manifest.devtools_page).toBe('devtools.html');
  });

  it('should declare content script and web accessible resources', () => {
    expect(manifest.content_scripts).toBeDefined();
    expect(manifest.content_scripts[0].matches).toContain('<all_urls>');
    expect(manifest.content_scripts[0].js).toContain('content/inspector.js');
  });
});
