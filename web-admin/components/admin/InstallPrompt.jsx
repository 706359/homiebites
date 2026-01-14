'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  
  
  
  const isAdminPage = pathname && (pathname === '/admin' || pathname.startsWith('/admin/'));

  useEffect(() => {
    
    if (!isAdminPage) {
      return;
    }

    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    
    const isIOS = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
      const platform = navigator.platform || '';
      const vendor = navigator.vendor || '';

      
      const checks = [
        /iPad|iPhone|iPod/.test(userAgent), 
        platform === 'MacIntel' && navigator.maxTouchPoints > 1, 
        /iPhone|iPad|iPod/.test(vendor), 
        /iPhone|iPad|iPod/.test(platform), 
        window.DeviceMotionEvent !== undefined && /iPhone|iPad|iPod/.test(userAgent), 
      ];

      const isIOSDevice = checks.some((check) => check === true);
      return isIOSDevice;
    };

    const detectedIOS = isIOS();

    
    
    const isMobile = window.innerWidth < 1024;
    const shouldShow =
      detectedIOS ||
      (isMobile &&
        /Safari/.test(navigator.userAgent) &&
        !/Chrome|CriOS|FxiOS/.test(navigator.userAgent));

    if (shouldShow || detectedIOS) {
      
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

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt, { passive: false });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isAdminPage]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      
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

  
  if (!isAdminPage || isInstalled) {
    return null;
  }

  
  if (showIOSPrompt) {
    return (
      <div
        id='pwa-install-prompt'
        className='pwa-install-prompt-ios'
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100vw - 40px)',
          width: 'min(400px, calc(100vw - 40px))',
          background: '#ffffff',
          border: '2px solid var(--admin-accent, #449031)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          zIndex: 99999,
          animation: 'slideUp 0.3s ease',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--admin-text, #1a202c)',
            }}
          >
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
        <p
          style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: 'var(--admin-text-secondary, #64748b)',
            lineHeight: '1.5',
          }}
        >
          Install this app on your iPhone for quick access:
        </p>
        <ol
          style={{
            margin: '0 0 16px 0',
            paddingLeft: '20px',
            fontSize: '14px',
            color: 'var(--admin-text, #1a202c)',
            lineHeight: '1.8',
          }}
        >
          <li style={{ marginBottom: '8px' }}>
            Tap the <strong>Share</strong> button{' '}
            <span style={{ fontSize: '18px', display: 'inline-block', transform: 'rotate(45deg)' }}>
              □
            </span>{' '}
            at the bottom of your browser
          </li>
          <li style={{ marginBottom: '8px' }}>
            Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> or{' '}
            <strong>&quot;Add to Home&quot;</strong>
          </li>
          <li>
            Tap <strong>&quot;Add&quot;</strong> to confirm
          </li>
        </ol>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleIOSDismiss} className='btn btn-ghost' style={{ flex: 1 }}>
            Maybe Later
          </button>
          <button onClick={handleIOSDismiss} className='btn btn-primary' style={{ flex: 1 }}>
            Got it!
          </button>
        </div>
      </div>
    );
  }

  
  if (deferredPrompt) {
    return (
      <div
        className='install-prompt-button-container'
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          left: 'auto',
          zIndex: 10000,
          maxWidth: 'calc(100vw - 40px)',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={handleInstallClick}
          className='btn btn-primary install-prompt-button'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 8px rgba(68, 144, 49, 0.3)',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <i className='fa-solid fa-download'></i>
        </button>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;
