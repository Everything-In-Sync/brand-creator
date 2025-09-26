import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import faviconUrl from '../assets/images/fav.png';

const ensureFavicon = () => {
  const selector = "link[rel*='icon']";
  // Remove any previous favicon entries so browsers don't keep outdated icons around.
  document.querySelectorAll<HTMLLinkElement>(selector).forEach((existing) => existing.remove());

  const link = document.createElement('link');
  link.rel = 'icon';
  link.relList.add('shortcut');
  link.type = 'image/png';
  link.href = faviconUrl;
  document.head.appendChild(link);
};

ensureFavicon();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
