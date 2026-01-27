import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAutoKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';
import api from '../../lib/api-admin.js';
import { getSessionExpiresAt } from '../../lib/auth-admin.js';
import { useNotification } from './contexts/NotificationContext.jsx';
import InstallPrompt from './InstallPrompt.jsx';
import { parseFontSize, applyAdminFontSize } from './utils/fontSize.js';

const AdminLogin = ({ onLoginSuccess }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { error: showError, success: showSuccess } = useNotification();

  useAutoKeyboardAvoidance({
    containerSelector: '.login-form',
    inputSelector: 'input, textarea, select',
  });

  useEffect(() => {
    const applyThemeSettings = () => {
      try {
        const primaryColor =
          localStorage.getItem('homiebites_primary_color') || '#449031';
        const fontFamily =
          localStorage.getItem('homiebites_font_family') || 'Baloo 2';
        const fontSize = localStorage.getItem('homiebites_font_size') || '18';

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
          root.style.setProperty(
            '--font-primary',
            `'${fontFamily}', sans-serif`
          );
        }

        const fs = parseFontSize(fontSize);
        if (fs != null) applyAdminFontSize(fs);

        // Always apply light theme (dark theme removed)
        if (loginWrapper) {
          loginWrapper.classList.add('light-theme');
          loginWrapper.classList.remove('dark-theme');
        }
      } catch (error) {}
    };

    applyThemeSettings();

    const handleStorageChange = (e) => {
      if (
        e.key === 'homiebites_primary_color' ||
        e.key === 'homiebites_font_family' ||
        e.key === 'homiebites_font_size'
      ) {
        applyThemeSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);

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
      try {
        const data = await api.login(email, password);

        if (
          data.success &&
          data.user &&
          (data.user.role === 'admin' ||
            data.user.isAdmin ||
            data.user.role === 'Admin')
        ) {
          localStorage.setItem('homiebites_token', data.token);
          localStorage.setItem('homiebites_user', JSON.stringify(data.user));
          localStorage.setItem('homiebites_admin', 'true');
          localStorage.setItem(
            'homiebites_token_meta',
            JSON.stringify({ expiresAt: getSessionExpiresAt() })
          );
          // Set initial activity timestamp
          localStorage.setItem('homiebites_last_activity', Date.now().toString());

          if (data.requirePasswordChange) {
            // Show success message before redirect for password change
            showSuccess('Login successful. Redirecting to change password...');
            await new Promise((resolve) => setTimeout(resolve, 800));
            window.location.href = '/admin/change-password?temporary=true';
            return;
          }

          // Show success message and add proper delay before redirect
          showSuccess('Login successful! Redirecting to dashboard...');

          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development')
              console.log(
                '[AdminLogin] Login successful, redirecting to dashboard'
              );
          }

          // Add delay for user to see success message
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Redirect to dashboard
          if (onLoginSuccess && typeof onLoginSuccess === 'function') {
            onLoginSuccess();
          } else {
            window.location.href = '/admin/dashboard';
          }
          return;
        } else {
          showError(
            data.error || 'Invalid credentials. Admin access required.'
          );
          setLoading(false);
          return;
        }
      } catch (apiError) {
        const isNetworkError =
          apiError.message &&
          (apiError.message.includes('HTML') ||
            apiError.message.includes('not available') ||
            apiError.message.includes('connect') ||
            apiError.message.includes('Network error') ||
            apiError.message.includes('Failed to fetch'));

        if (!isNetworkError) {
          showError(
            apiError.message ||
              'Invalid credentials. Please check your username and password. Make sure the backend server is running.'
          );
          setLoading(false);
          return;
        }
      }

      showError(
        'Invalid credentials. Please check your username and password.'
      );
      setLoading(false);
    } catch (err) {
      showError(
        'Login failed. Please check your credentials and ensure the backend server is running.'
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
                <img
                  src="/logo.png"
                  alt="HomieBites Logo"
                  className="login-logo-img"
                />
              </div>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
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
                  Email or Mobile Number
                </label>
                <input
                  id="email-input"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or mobile number"
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
                <button
                  type="button"
                  onClick={() => router.push('/admin/forgot-password')}
                  className="admin-login-forgot-link"
                >
                  <i className="fa-solid fa-key"></i>
                  Forgot Password?
                </button>
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

      <InstallPrompt />
    </div>
  );
};

export default AdminLogin;
