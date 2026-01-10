import { useState, useEffect } from "react";
import { useNotification } from "./contexts/NotificationContext.jsx";
import "./styles/index.css";
import "./AdminForgotPassword.css";

const AdminForgotPassword = () => {
  const goBack = () => {
    window.location.href = "/admin";
  };
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { error: showError, success: showSuccess } = useNotification();

  // Apply theme settings from localStorage
  useEffect(() => {
    const applyThemeSettings = () => {
      try {
        const primaryColor = localStorage.getItem('homiebites_primary_color') || '#449031';
        const fontFamily = localStorage.getItem('homiebites_font_family') || 'Baloo 2';
        const fontSize = localStorage.getItem('homiebites_font_size') || 'medium';
        const theme = localStorage.getItem('homiebites_theme') || 'light';

        const root = document.documentElement;
        const loginWrapper = document.querySelector('.login-page-wrapper');

        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
              }
            : null;
        };

        if (primaryColor) {
          root.style.setProperty('--admin-accent', primaryColor);
          const rgb = hexToRgb(primaryColor);
          if (rgb) {
            root.style.setProperty(
              '--admin-accent-light',
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
            );
            const darkerR = Math.max(0, Math.floor(rgb.r * 0.7));
            const darkerG = Math.max(0, Math.floor(rgb.g * 0.7));
            const darkerB = Math.max(0, Math.floor(rgb.b * 0.7));
            root.style.setProperty(
              '--admin-accent-dark',
              `rgb(${darkerR}, ${darkerG}, ${darkerB})`
            );
          }
        }

        if (fontFamily) {
          const fontFamilyValue = `'${fontFamily}', sans-serif`;
          root.style.setProperty('--admin-font-family', fontFamilyValue);
          if (loginWrapper) {
            loginWrapper.style.fontFamily = fontFamilyValue;
          }
        }

        if (fontSize) {
          const fontSizeMap = {
            small: '14px',
            medium: '16px',
            large: '18px',
            'extra-large': '20px',
          };
          const fontSizeValue = fontSizeMap[fontSize] || '16px';
          root.style.setProperty('--admin-base-font-size', fontSizeValue);
          if (loginWrapper) {
            loginWrapper.style.fontSize = fontSizeValue;
          }
        }

        if (theme === 'dark') {
          if (loginWrapper) {
            loginWrapper.classList.add('dark-theme');
            loginWrapper.classList.remove('light-theme');
          }
        } else if (theme === 'light') {
          if (loginWrapper) {
            loginWrapper.classList.add('light-theme');
            loginWrapper.classList.remove('dark-theme');
          }
        } else if (theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (loginWrapper) {
            if (prefersDark) {
              loginWrapper.classList.add('dark-theme');
              loginWrapper.classList.remove('light-theme');
            } else {
              loginWrapper.classList.add('light-theme');
              loginWrapper.classList.remove('dark-theme');
            }
          }
        }
      } catch (error) {
        // Silently fail if theme application has issues
      }
    };

    applyThemeSettings();

    const handleStorageChange = (e) => {
      if (
        e.key === 'homiebites_primary_color' ||
        e.key === 'homiebites_font_family' ||
        e.key === 'homiebites_font_size' ||
        e.key === 'homiebites_theme'
      ) {
        applyThemeSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChanged', applyThemeSettings);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', applyThemeSettings);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('If an account exists, a password reset link has been sent to your email. Please check your inbox.');
      } else {
        showError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      showError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-wrapper login-page-wrapper admin-forgot-password">
      <div className="login-page-container">
        <div className="login-left-section">
          <div className="login-image-overlay">
            <div className="login-brand">
              <div className="login-brand-logo">
                <img src="/logo.png" alt="HomieBites Logo" className="login-logo-img" />
              </div>
            </div>
          </div>
          <img
            src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
            alt="Admin password recovery"
            className="login-image"
          />
        </div>

        <div className="login-right-section">
          <div className="login-content">
            <div className="login-header">
              <div className="login-icon-wrapper">
                <i className="fa-solid fa-key"></i>
              </div>
              <h1 className="login-title">Forgot Password</h1>
              <p className="login-subtitle">Enter your email to receive a password reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="forgot-email-input">
                  <i className="fa-solid fa-envelope"></i>
                  Email Address
                </label>
                <input
                  id="forgot-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  autoFocus
                  autoComplete="email"
                  className="login-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full login-submit-btn"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={goBack}
                className="btn btn-secondary btn-full"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Login
              </button>
            </form>

            <div className="login-info">
              <div className="login-info-icon">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <p className="login-info-title">Security Note</p>
              <p className="admin-login-info-text">
                Password reset link will be sent to your email. The link expires in 1 hour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
