'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAdminPage =
    pathname && (pathname === '/admin' || pathname.startsWith('/admin/'));

  // Check if mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const isMobileDevice =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) || window.innerWidth < 768;
        setIsMobile(isMobileDevice);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    // Only show on admin pages and mobile devices
    if (!isAdminPage || !isMobile) {
      return;
    }

    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const isIOS = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || window.opera || '';
      const platform = navigator.platform || '';
      const vendor = navigator.vendor || '';

      const checks = [
        /iPad|iPhone|iPod/.test(userAgent),
        platform === 'MacIntel' && navigator.maxTouchPoints > 1,
        /iPhone|iPad|iPod/.test(vendor),
        /iPhone|iPad|iPod/.test(platform),
        window.DeviceMotionEvent !== undefined &&
          /iPhone|iPad|iPod/.test(userAgent),
      ];

      const isIOSDevice = checks.some((check) => check === true);
      return isIOSDevice;
    };

    const detectedIOS = isIOS();

    const shouldShow =
      detectedIOS ||
      (isMobile &&
        /Safari/.test(navigator.userAgent) &&
        !/Chrome|CriOS|FxiOS/.test(navigator.userAgent));

    if (shouldShow) {
      const timer = setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwa-ios-prompt-seen');
        if (!hasSeenPrompt) {
          setShowIOSPrompt(true);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt, {
      passive: false,
    });

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, [isAdminPage, isMobile]);

  const handleIOSDismiss = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-ios-prompt-seen', 'true');
  };

  // Only show on admin pages, mobile devices, and if not already installed
  if (!isAdminPage || !isMobile || isInstalled) {
    return null;
  }

  if (showIOSPrompt) {
    return (
      <div
        id="pwa-install-prompt"
        className="pwa-install-prompt-ios pwa-prompt-container"
      >
        <div className="pwa-header-row">
          <h3 className="pwa-title">Install App</h3>
          <button onClick={handleIOSDismiss} className="pwa-close-btn">
            ×
          </button>
        </div>
        <p className="pwa-description">
          Install this app on your iPhone for quick access:
        </p>
        <ol className="pwa-instructions">
          <li className="pwa-instruction-item">
            Tap the <strong>Share</strong> button{' '}
            <span className="pwa-share-icon">□</span> at the bottom of your
            browser
          </li>
          <li className="pwa-instruction-item">
            Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>{' '}
            or <strong>&quot;Add to Home&quot;</strong>
          </li>
          <li>
            Tap <strong>&quot;Add&quot;</strong> to confirm
          </li>
        </ol>
        <div className="pwa-actions">
          <button onClick={handleIOSDismiss} className="btn btn-ghost flex-1">
            Maybe Later
          </button>
          <button onClick={handleIOSDismiss} className="btn btn-primary flex-1">
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
