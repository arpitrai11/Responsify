// Chrome DevTools page script to register custom panel

if (typeof chrome !== 'undefined' && chrome.devtools && chrome.devtools.panels) {
  chrome.devtools.panels.create(
    'Responsive Pro',
    'icons/icon16.png',
    'devtools-panel.html',
    (panel) => {
      console.log('Responsive Inspector Pro DevTools panel created', panel);
    }
  );
}
