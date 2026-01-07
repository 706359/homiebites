import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";

// Service Worker is automatically registered by vite-plugin-pwa

// iOS PWA Install Prompt Helper
if (typeof window !== 'undefined') {
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Show install instructions for iOS
  if (isIOS) {
    let deferredPrompt = null;
    
    // Listen for beforeinstallprompt (won't fire on iOS, but good for other platforms)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA is already installed');
    }
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


