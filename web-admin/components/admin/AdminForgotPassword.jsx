import { useState, useEffect } from "react";
import api from "../../lib/api-admin.js";
import "./styles/index.css";
import "./AdminForgotPassword.css";

const AdminForgotPassword = () => {
  const goBack = () => {
    window.location.href = "/login";
  };
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Apply theme settings from localStorage
  useEffect(() => {
    const applyThemeSettings = () => {
      try {
        // Get theme settings from localStorage
        const primaryColor = localStorage.getItem('homiebites_primary_color') || '#449031';
        const fontFamily = localStorage.getItem('homiebites_font_family') || 'Baloo 2';
        const fontSize = localStorage.getItem('homiebites_font_size') || 'medium';
        const theme = localStorage.getItem('homiebites_theme') || 'light';

        // Get root element
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
          
          // Calculate light and dark variants
          const rgb = hexToRgb(primaryColor);
          if (rgb) {
            root.style.setProperty(
              '--admin-accent-light',
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
            );
            
            // Calculate darker variant for gradients
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

    // Listen for theme changes
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

  // Step 1: Email
  const [email, setEmail] = useState("");

  // Step 2: OTP
  const [otp, setOtp] = useState("");

  // Step 3: Identity verification
  const [adminId, setAdminId] = useState("");
  const [panCard, setPanCard] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  // Step 4: New password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await api.forgotPassword(email);
      if (data && data.success) {
        setSuccess(data.message || "OTP sent to your registered email address");
        setStep(2);
      } else {
        setError(data?.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await api.verifyOTP(email, otp);
      if (data.success) {
        setVerificationToken(data.verificationToken);
        setSuccess("OTP verified successfully");
        setStep(3);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!adminId.trim() || !panCard.trim()) {
      setError("Please enter both Admin ID and PAN card");
      return;
    }

    // Validate PAN card format (10 characters, alphanumeric)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panCard.toUpperCase())) {
      setError("Invalid PAN card format. Format: ABCDE1234F");
      return;
    }

    setLoading(true);

    try {
      const data = await api.verifyIdentity(
        email,
        verificationToken,
        panCard,
        adminId,
      );
      if (data && data.success) {
        setResetToken(data.resetToken);
        setSuccess("Identity verified successfully");
        setStep(4);
      } else {
        setError(data?.error || "Verification failed");
      }
    } catch (err) {
      setError(err?.message || "Failed to verify identity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep4 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await api.resetPassword(email, resetToken, newPassword);
      if (data && data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          goBack();
        }, 2000);
      } else {
        setError(data?.error || "Failed to reset password");
      }
    } catch (err) {
      setError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1} className="login-form">
      <div className="form-field">
        <label>
          <i className="fa-solid fa-envelope"></i>
          Admin Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your admin email"
          required
          autoFocus
          className="login-input"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full login-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-paper-plane"></i>
            <span>Send OTP</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={goBack}
        className="btn btn-secondary btn-full"
      >
        Back to Login
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2} className="login-form">
      <div className="form-field">
        <label>
          <i className="fa-solid fa-shield-halved"></i>
          Enter OTP
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          required
          autoFocus
          className="login-input"
        />
        <p className="admin-forgot-help-text">
          Enter the 6-digit OTP sent to your registered email address
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full login-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-shield-check"></i>
            <span>Verify OTP</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep(1);
          setOtp("");
          setError("");
          setSuccess("");
        }}
        className="btn btn-secondary btn-full"
      >
        Back
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3} className="login-form">
      <div className="form-field">
        <label>
          <i className="fa-solid fa-id-card"></i>
          Admin ID
        </label>
        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Enter your Admin ID"
          required
          autoFocus
          className="login-input"
        />
        <p className="admin-forgot-help-text">
          Enter the Admin ID associated with your account
        </p>
      </div>
      <div className="form-field">
        <label>
          <i className="fa-solid fa-file-invoice"></i>
          PAN Card Number
        </label>
        <input
          type="text"
          value={panCard}
          onChange={(e) =>
            setPanCard(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 10),
            )
          }
          placeholder="ABCDE1234F"
          maxLength={10}
          required
          className="login-input"
        />
        <p className="admin-forgot-help-text">
          Format: ABCDE1234F (10 characters, alphanumeric)
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full login-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-user-check"></i>
            <span>Verify Identity</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep(2);
          setAdminId("");
          setPanCard("");
          setError("");
          setSuccess("");
        }}
        className="btn btn-secondary btn-full"
      >
        Back
      </button>
    </form>
  );

  const renderStep4 = () => (
    <form onSubmit={handleStep4} className="login-form">
      <div className="form-field">
        <label>
          <i className="fa-solid fa-lock"></i>
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          minLength={6}
          required
          autoFocus
          className="login-input"
        />
        <p className="admin-forgot-help-text">Minimum 6 characters</p>
      </div>
      <div className="form-field">
        <label>
          <i className="fa-solid fa-lock"></i>
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          minLength={6}
          required
          className="login-input"
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full login-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Resetting...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-key"></i>
            <span>Reset Password</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep(3);
          setNewPassword("");
          setConfirmPassword("");
          setError("");
          setSuccess("");
        }}
        className="btn btn-secondary btn-full"
      >
        Back
      </button>
    </form>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Step 1: Enter Email";
      case 2:
        return "Step 2: Verify OTP";
      case 3:
        return "Step 3: Verify Identity";
      case 4:
        return "Step 4: Reset Password";
      default:
        return "Password Recovery";
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
              <h1 className="login-title">Password Recovery</h1>
              <p className="login-subtitle">{getStepTitle()}</p>
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="login-info">
              <div className="login-info-icon">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <p className="login-info-title">Security Note</p>
              <p className="admin-login-info-text">
                This process requires multi-step verification to ensure account security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
