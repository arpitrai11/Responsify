# Responsify (Responsive Inspector Pro) 🚀

> **Production-grade Chrome Extension for responsive design testing, multi-device viewport inspection, live CSS editing, and visual debugging — inspired by Pixefy.**

<p align="center">
  <img src="docs/images/preview.png" alt="Responsify Studio Preview" width="100%" />
</p>

Responsify replicates the full-screen responsive studio workflow seen in tools like Pixefy, with **every feature 100% unlocked** — no subscription modals, no feature locks, and no paywalls.

---

## 🌟 How It Works (Pixefy Workflow)

1. **One-Click Instant Launch**: Click the extension icon in your Chrome toolbar while browsing any webpage (e.g., `uat.justifi.world` or your local development server).
2. **Full-Page Studio Opens Automatically**: A new tab opens immediately with the **Responsive Studio Workspace** loaded with your target website.
3. **Multi-Device Simultaneous Testing**: View your website rendered side-by-side across:
   - 📱 **Mobile** (iPhone 15/16 Pro, Pixel 8, Galaxy S24, etc.)
   - 📟 **Tablet** (iPad Air, iPad Pro, Galaxy Tab, etc.)
   - 💻 **Laptop & Desktop** (MacBook Pro 16", Full HD 1080p, Ultrawide, etc.)
4. **Synchronized Scrolling**: Scroll any device viewport, and all other viewports automatically scroll in sync.
5. **No X-Frame-Options Blocking**: Uses Chrome's `declarativeNetRequest` API to strip `X-Frame-Options` and CSP `frame-ancestors` on preview sub-frames so any website can be previewed seamlessly.
6. **Built-in DevTools Inspector Drawer**: Click **Inspect & Edit** in the top bar to slide out the full developer suite: Element Picker, Live CSS Editor, Box Model, Colors & WCAG Contrast Checker, Text & Image Editor, Media Asset Downloader, and Change History.

---

## 🛠️ Top Bar & Workspace Controls

- **Layout Modes**:
  - `Single`: Focus on one specific device viewport.
  - `Split`: Side-by-side dual comparison (Mobile + Laptop).
  - `Multi`: Triple comparison (Mobile + Tablet + Laptop).
- **Pick & Move Screens**: Grab the drag handle (`:::`) on any device header to freely reposition and arrange screens anywhere across the infinite workspace canvas.
- **Canvas Hand / Pan Tool**: Switch between **Select Tool** (to move devices) and **Hand Tool** (to pan across the entire canvas). You can also pan instantly by holding the Middle Mouse button or Spacebar while dragging.
- **Ctrl + Scroll for Internal Scrolling**: Hover over any device and use `Ctrl + Scroll Wheel` to smoothly scroll the website's interior page content. With **Sync Scroll** active, this automatically scrolls all other devices simultaneously.
- **100% Crisp (Native 1:1 Rendering)**: Instantly sets zoom to 100% native resolution for razor-sharp typography and pixel-perfect subpixel rendering, eliminating CSS downsampling blur.
- **Rotate All**: Instantly switch all active devices between Portrait and Landscape.
- **Sync Scroll**: Toggle real-time synchronized scrolling across all viewports.
- **Address Bar**: Test any website URL with immediate live navigation and frame reload.
- **Zoom Controls**: Zoom in, zoom out, or scale the canvas from 30% to 150%.
- **+ Add Device**: Add any preset or custom device to the canvas dynamically.
- **Canvas Theme**: Switch between Light grid and Dark slate canvas.
- **Inspect & Edit Drawer**: Slide out the interactive element inspector and live CSS editor.
- **🌟 All Pro Unlocked**: All features are active with zero paid restrictions.

---

## 🔌 How to Load into Chrome

1. Open Google Chrome and go to: `chrome://extensions/`
2. Turn ON **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left toolbar.
4. Select your extension folder:
   ```
   D:\ResponsiveExtension
   ```
   *(Or the `D:\ResponsiveExtension\dist` subfolder — both are fully compiled and work identically!)*
5. Pin **Responsive Inspector Pro** to your Chrome toolbar.
6. Visit any website (or a local dev server) and click the extension icon to launch the studio!

---

## 🧪 Automated Tests

Run the full test suite with Vitest:
```bash
npm test
```
All 41 tests across 7 test files pass.
