import React from 'react';
import ReactDOM from 'react-dom/client';
import { InspectorApp } from '../components/InspectorApp';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InspectorApp isSidepanel={true} />
  </React.StrictMode>
);
