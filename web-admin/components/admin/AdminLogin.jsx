import { useState, useEffect } from "react";
import api from "../../lib/api-admin.js";
import { useNotification } from "./contexts/NotificationContext.jsx";
import InstallPrompt from "./InstallPrompt.jsx";
import "./styles/index.css";
import "./AdminLogin.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { error: showError, success: showSuccess } = useNotification();

  // Apply theme settings from localStorage
  useEffect(() => {
    const applyThemeSettings = () => {
      try {
        // Get theme settings from localStorage
        const primaryColor = localStorage.getItem('homiebites_primary_color') || '#449031';
        const fontFamily = localStorage.getItem('homiebites_font_family') || 'Baloo 2';
        const fontSize = localStorage.getItem('homiebites_font_size') || 'medium';
        const theme = localStorage.getItem('homiebites_theme') || 'light';

        // Get root element or create a wrapper
        const root = document.documentElement;
        const loginWrapper = document.querySelector('.login-page-wrapper');

        // Helper to convert hex to RGB
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

        // Apply primary color
        if (primaryColor) {
          root.style.setProperty('--admin-accent', primaryColor);
          
          // Calculate light variant
          const rgb = hexToRgb(primaryColor);
          if (rgb) {
            root.style.setProperty(
              '--admin-accent-light',
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
            );
            
            // Calculate darker variant for gradients (80% of original)
            const darkerR = Math.max(0, Math.floor(rgb.r * 0.7));
            const darkerG = Math.max(0, Math.floor(rgb.g * 0.7));
            const darkerB = Math.max(0, Math.floor(rgb.b * 0.7));
            root.style.setProperty(
              '--admin-accent-dark',
              `rgb(${darkerR}, ${darkerG}, ${darkerB})`
            );
          }
        }

        // Apply font family
        if (fontFamily) {
          const fontFamilyValue = `'${fontFamily}', sans-serif`;
          root.style.setProperty('--admin-font-family', fontFamilyValue);
          if (loginWrapper) {
            loginWrapper.style.fontFamily = fontFamilyValue;
          }
        }

        // Apply font size
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

        // Apply theme (light/dark)
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
          // Auto theme based on system preference
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

    // Apply theme on mount
    applyThemeSettings();

    // Listen for theme changes in localStorage (if changed in another tab)
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

    // Also listen for custom theme change events
    const handleThemeChange = () => {
      applyThemeSettings();
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try backend API first
      try {
        // Use email for login (following ADMIN_PASSWORD.md)
        const data = await api.login(email, password);

        if (
          data.success &&
          data.user &&
          (data.user.role === "admin" || data.user.isAdmin || data.user.role === "Admin")
        ) {
          localStorage.setItem("homiebites_token", data.token);
          localStorage.setItem("homiebites_user", JSON.stringify(data.user));
          localStorage.setItem("homiebites_admin", "true");

          // Check if password change is required (temporary password)
          if (data.requirePasswordChange) {
            // Redirect to change password page
            window.location.href = "/admin/change-password?temporary=true";
            return;
          }

          // Successfully logged in - redirect to dashboard immediately
          // Use window.location.href for immediate navigation to avoid race conditions
          console.log('[AdminLogin] Login successful, redirecting to dashboard');
          window.location.href = "/admin/dashboard";
          return;
        } else {
          showError(
            data.error || "Invalid credentials. Admin access required.",
          );
          setLoading(false);
          return;
        }
      } catch (apiError) {
        // API failed - check if it's a connection error or credential error
        // If it's a network/connection error, try fallback
        // If it's a credential error, don't try fallback
        const isNetworkError =
          apiError.message &&
          (apiError.message.includes("HTML") ||
            apiError.message.includes("not available") ||
            apiError.message.includes("connect") ||
            apiError.message.includes("Network error") ||
            apiError.message.includes("Failed to fetch"));

        if (!isNetworkError) {
          // Credential error or other API error - don't try fallback, show error
          showError(
            apiError.message ||
              "Invalid credentials. Please check your username and password. Make sure the backend server is running.",
          );
          setLoading(false);
          return;
        }
      }

      // No fallback - API must be working for authentication
      showError(
        "Invalid credentials. Please check your username and password.",
      );
      setLoading(false);
    } catch (err) {
      // No fallback credentials - API must be working
      showError(
        "Login failed. Please check your credentials and ensure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-wrapper login-page-wrapper">
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
            alt="Admin access to HomieBites dashboard"
            className="login-image"
          />
        </div>

        <div className="login-right-section">
          <div className="login-content">
            <div className="login-header">
              <div className="login-icon-wrapper">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h1 className="login-title">Admin Login</h1>
              <p className="login-subtitle">Access your dashboard securely</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="email-input">
                  <i className="fa-solid fa-envelope"></i>
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  autoFocus
                  autoComplete="email"
                  className="login-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="password-input">
                  <i className="fa-solid fa-lock"></i>
                  Password
                </label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="login-input"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                    <span>Log In</span>
                  </>
                )}
              </button>

              <div className="admin-login-forgot-link-wrapper">
                <a
                  href="/admin/forgot-password"
                  className="admin-login-forgot-link"
                >
                  <i className="fa-solid fa-key"></i>
                  Forgot Password?
                </a>
              </div>
            </form>

            <div className="login-info">
              <div className="login-info-icon">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <p className="login-info-title">Secure Admin Access</p>
              <p className="admin-login-info-text">Authorized personnel only</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* PWA Install Prompt - Admin Only */}
      <InstallPrompt />
    </div>
  );
};

export default AdminLogin;
