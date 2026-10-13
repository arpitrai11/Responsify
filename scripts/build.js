import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'dist');

async function runBuild() {
  console.log('🚀 Building Responsive Inspector Pro...');

  // Ensure clean dist
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Build UI Entry points from src/entries/
  console.log('📦 Step 1: Building HTML Extension Pages...');
  await build({
    root,
    configFile: false,
    plugins: [react()],
    base: './',
    build: {
      outDir,
      emptyOutDir: false,
      rollupOptions: {
        input: {
          popup: resolve(root, 'src/entries/popup.html'),
          sidepanel: resolve(root, 'src/entries/sidepanel.html'),
          workspace: resolve(root, 'src/entries/workspace.html'),
          devtools: resolve(root, 'src/entries/devtools.html'),
          devtoolsPanel: resolve(root, 'src/entries/devtools-panel.html'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  });

  // Move the built HTMLs from dist/src/entries/* to dist/* and fix relative asset paths
  const distEntriesDir = resolve(outDir, 'src/entries');
  if (fs.existsSync(distEntriesDir)) {
    for (const file of fs.readdirSync(distEntriesDir)) {
      let content = fs.readFileSync(resolve(distEntriesDir, file), 'utf-8');
      content = content.replace(/\.\.\/\.\.\/assets\//g, './assets/');
      fs.writeFileSync(resolve(outDir, file), content, 'utf-8');
    }
    fs.rmSync(resolve(outDir, 'src'), { recursive: true, force: true });
  }

  // 2. Build Background Service Worker (ES module)
  console.log('⚙️ Step 2: Building Background Service Worker...');
  await build({
    root,
    configFile: false,
    build: {
      outDir: resolve(outDir, 'background'),
      emptyOutDir: false,
      lib: {
        entry: resolve(root, 'src/background/service-worker.ts'),
        formats: ['es'],
        fileName: () => 'service-worker.js',
      },
      rollupOptions: {
        output: {
          entryFileNames: 'service-worker.js',
        },
      },
    },
  });

  // 3. Build Content Script (IIFE standalone bundle)
  console.log('🔍 Step 3: Building Content Script (Inspector & Overlays)...');
  await build({
    root,
    configFile: false,
    build: {
      outDir: resolve(outDir, 'content'),
      emptyOutDir: false,
      lib: {
        entry: resolve(root, 'src/content/inspector.ts'),
        formats: ['iife'],
        name: 'ResponsiveInspectorContent',
        fileName: () => 'inspector.js',
      },
      rollupOptions: {
        output: {
          entryFileNames: 'inspector.js',
          extend: true,
        },
      },
    },
  });

  // 4. Copy manifest.json to dist
  console.log('📄 Step 4: Copying Manifest V3 to dist...');
  const manifestSrc = resolve(root, 'manifest.json');
  const manifestDist = resolve(outDir, 'manifest.json');
  if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDist);
  }

  // 5. Ensure icons exist in dist/icons and root/icons
  console.log('🖼️ Step 5: Copying Icons...');
  const iconsDist = resolve(outDir, 'icons');
  if (!fs.existsSync(iconsDist)) {
    fs.mkdirSync(iconsDist, { recursive: true });
  }
  const iconsSrc = resolve(root, 'public/icons');
  if (fs.existsSync(iconsSrc)) {
    for (const file of fs.readdirSync(iconsSrc)) {
      fs.copyFileSync(resolve(iconsSrc, file), resolve(iconsDist, file));
    }
  }

  // 6. Mirror compiled files to root directory so both D:\ResponsiveExtension AND D:\ResponsiveExtension\dist load seamlessly in Chrome
  console.log('🔄 Step 6: Mirroring compiled files to root directory for dual loading compatibility...');
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      const s = resolve(src, item);
      const d = resolve(dest, item);
      if (fs.statSync(s).isDirectory()) {
        copyDir(s, d);
      } else {
        fs.copyFileSync(s, d);
      }
    }
  }

  copyDir(resolve(outDir, 'assets'), resolve(root, 'assets'));
  copyDir(resolve(outDir, 'content'), resolve(root, 'content'));
  copyDir(resolve(outDir, 'background'), resolve(root, 'background'));
  copyDir(resolve(outDir, 'icons'), resolve(root, 'icons'));

  // Copy compiled HTMLs to root
  const htmlFiles = ['popup.html', 'sidepanel.html', 'workspace.html', 'devtools.html', 'devtools-panel.html'];
  for (const h of htmlFiles) {
    if (fs.existsSync(resolve(outDir, h))) {
      fs.copyFileSync(resolve(outDir, h), resolve(root, h));
    }
  }

  console.log('✅ Build completed successfully! Both root and dist directories are ready to load in Chrome.');
}

runBuild().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
