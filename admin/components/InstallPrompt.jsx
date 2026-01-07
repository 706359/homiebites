import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      console.log('[InstallPrompt] App is already installed (standalone mode)');
      setIsInstalled(true);
      return;
    }

    // Aggressive iOS detection - works for ANY browser on iOS
    const isIOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
      const platform = navigator.platform || '';
      const vendor = navigator.vendor || '';
      
      // Multiple detection methods
      const checks = [
        /iPad|iPhone|iPod/.test(userAgent), // Standard iOS devices
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1), // iPad iOS 13+
        /iPhone|iPad|iPod/.test(vendor), // Vendor check
        /iPhone|iPad|iPod/.test(platform), // Platform check
        (window.DeviceMotionEvent !== undefined && /iPhone|iPad|iPod/.test(userAgent)), // Device motion
      ];
      
      const isIOSDevice = checks.some(check => check === true);
      
      console.log('[InstallPrompt] ========== iOS Detection ==========');
      console.log('[InstallPrompt] User Agent:', userAgent);
      console.log('[InstallPrompt] Platform:', platform);
      console.log('[InstallPrompt] Vendor:', vendor);
      console.log('[InstallPrompt] Max Touch Points:', navigator.maxTouchPoints);
      console.log('[InstallPrompt] Window Width:', window.innerWidth);
      console.log('[InstallPrompt] Checks:', checks);
      console.log('[InstallPrompt] iOS Detected:', isIOSDevice);
      console.log('[InstallPrompt] ====================================');
      
      return isIOSDevice;
    };

    const detectedIOS = isIOS();
    
    // Show prompt for ANY browser on iOS (iPhone/iPad)
    // Also check for mobile Safari specifically
    const isMobile = window.innerWidth < 1024;
    const shouldShow = detectedIOS || (isMobile && /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent));
    
    if (shouldShow || detectedIOS) {
      console.log('[InstallPrompt] Will show prompt for iOS device');
      
      // Check URL parameter first (for testing/debugging)
      const urlParams = new URLSearchParams(window.location.search);
      const forceShow = urlParams.get('showInstall') === 'true';
      const forceHide = urlParams.get('hideInstall') === 'true';
      
      if (forceHide) {
        console.log('[InstallPrompt] Force hiding prompt (URL parameter)');
        return;
      }
      
      // Add a delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        if (forceShow) {
          console.log('[InstallPrompt] Force showing prompt (URL parameter)');
          localStorage.removeItem('pwa-ios-prompt-seen');
          setShowIOSPrompt(true);
          return;
        }
        
        const hasSeenPrompt = localStorage.getItem('pwa-ios-prompt-seen');
        console.log('[InstallPrompt] Has seen prompt:', hasSeenPrompt);
        
        // For debugging: always show on first load, ignore localStorage
        // Remove this in production
        const debugMode = urlParams.get('debug') === 'true';
        
        if (debugMode || !hasSeenPrompt) {
          console.log('[InstallPrompt] Showing iOS install prompt');
          setShowIOSPrompt(true);
        } else {
          console.log('[InstallPrompt] Prompt already shown. Add ?showInstall=true or ?debug=true to URL to show again.');
        }
      }, 1500); // Reduced delay to 1.5 seconds

      return () => clearTimeout(timer);
    } else {
      console.log('[InstallPrompt] Not iOS device, skipping iOS prompt');
    }

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      console.log('[InstallPrompt] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleIOSDismiss = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-ios-prompt-seen', 'true');
  };

  if (isInstalled) {
    console.log('[InstallPrompt] App is installed, not showing prompt');
    return null;
  }

  // Debug: Always log current state
  console.log('[InstallPrompt] Render state:', {
    showIOSPrompt,
    deferredPrompt: !!deferredPrompt,
    isInstalled,
  });

  // iOS Install Instructions
  if (showIOSPrompt) {
    console.log('[InstallPrompt] Rendering iOS install prompt UI');
    console.log('[InstallPrompt] Rendering iOS install prompt UI');
    return (
      <div
        id="pwa-install-prompt"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100% - 40px)',
          width: '400px',
          background: '#ffffff',
          border: '2px solid #449031',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          zIndex: 99999,
          animation: 'slideUp 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--admin-text, #1a202c)' }}>
            Install App
          </h3>
          <button
            onClick={handleIOSDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary, #64748b)',
              padding: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--admin-text-secondary, #64748b)', lineHeight: '1.5' }}>
          Install this app on your iPhone for quick access:
        </p>
        <ol style={{ margin: '0 0 16px 0', paddingLeft: '20px', fontSize: '14px', color: 'var(--admin-text, #1a202c)', lineHeight: '1.8' }}>
          <li style={{ marginBottom: '8px' }}>Tap the <strong>Share</strong> button <span style={{ fontSize: '18px', display: 'inline-block', transform: 'rotate(45deg)' }}>□</span> at the bottom of your browser</li>
          <li style={{ marginBottom: '8px' }}>Scroll down and tap <strong>"Add to Home Screen"</strong> or <strong>"Add to Home"</strong></li>
          <li>Tap <strong>"Add"</strong> to confirm</li>
        </ol>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleIOSDismiss}
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            Maybe Later
          </button>
          <button
            onClick={handleIOSDismiss}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // Android/Chrome Install Button
  if (deferredPrompt) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10000,
        }}
      >
        <button
          onClick={handleInstallClick}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(68, 144, 49, 0.3)',
          }}
        >
          <i className="fa-solid fa-download"></i>
          Install App
        </button>
      </div>
    );
  }

  // Debug: Show a test button if on iOS (for testing)
  const isIOSDevice = () => {
    const userAgent = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Show test button on iOS for debugging
  if (isIOSDevice() && !isInstalled) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99999,
        }}
      >
        <button
          onClick={() => {
            console.log('[InstallPrompt] Test button clicked - forcing show');
            localStorage.removeItem('pwa-ios-prompt-seen');
            setShowIOSPrompt(true);
          }}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(68, 144, 49, 0.3)',
            fontSize: '14px',
            padding: '12px 20px',
          }}
        >
          <i className="fa-solid fa-mobile-screen-button"></i>
          Show Install
        </button>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;

