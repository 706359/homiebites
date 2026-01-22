'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AdminForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, just show success message
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 3000);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
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
                <img
                  src="/logo.png"
                  alt="HomieBites Logo"
                  className="login-logo-img"
                />
              </div>
            </div>
          </div>
          <img
            src="/admin-login-bg.jpg"
            alt="Background"
            className="login-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="login-right-section">
          <div className="login-content">
            <div className="login-header">
              <div className="login-icon-wrapper">
                <i className="fa-solid fa-key"></i>
              </div>
              <h1 className="login-title">Reset Password</h1>
              <p className="login-subtitle">
                Enter your email to receive a reset link
              </p>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="alert alert-error">
                  <i className="fa-solid fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    Password reset email sent! Redirecting to login...
                  </span>
                </div>
              )}
              <div className="form-field">
                <label htmlFor="email">
                  <i className="fa-solid fa-envelope"></i>
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@homiebites.com"
                  required
                  disabled={loading || success}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full login-submit-btn"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Sending...</span>
                  </>
                ) : success ? (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Email Sent</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
              <div className="admin-login-forgot-link-wrapper">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="admin-login-forgot-link"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
            <div className="login-info">
              <div className="login-info-icon">
                <i className="fa-solid fa-shield-check"></i>
              </div>
              <p className="login-info-title">Secure Password Reset</p>
              <p className="admin-login-info-text">
                We'll send you a secure link to reset your password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
