'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useNotification } from '../../../../components/admin/contexts/NotificationContext.jsx';
import './reset-password.css';

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const { error: showError, success: showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    if (!token) {
      showError('Invalid reset link. Please request a new password reset.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Only run when token changes

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      showError('Passwords do not match');
      setLoading(false);
      return;
    }

    const allRequirementsMet = Object.values(passwordStrength).every(Boolean);
    if (!allRequirementsMet) {
      showError('Password does not meet all security requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        showError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      showError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className='reset-password-page'>
        <div className='reset-password-container'>
          <div className='reset-password-header'>
            <h2 className='reset-password-title'>Invalid Reset Link</h2>
            <p className='reset-password-subtitle'>Please request a new password reset</p>
          </div>
          <button
            onClick={() => router.push('/admin/forgot-password')}
            className='btn btn-primary btn-full'
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='reset-password-page'>
      <div className='reset-password-container'>
        <div className='reset-password-header'>
          <h2 className='reset-password-title'>Reset Password</h2>
          <p className='reset-password-subtitle'>Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className='reset-password-form'>
          <div className='form-field'>
            <label>New Password</label>
            <input
              type='password'
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder='Enter new password'
            />
          </div>

          <div className='form-field'>
            <label>Confirm Password</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder='Confirm new password'
            />
          </div>

          <div className='password-requirements'>
            <p className='requirements-title'>Password Requirements:</p>
            <div className='requirements-list'>
              <div className={passwordStrength.hasLength ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasLength ? '✓' : '○'} At least 8 characters
              </div>
              <div
                className={passwordStrength.hasUpperCase ? 'requirement-met' : 'requirement-unmet'}
              >
                {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
              </div>
              <div
                className={passwordStrength.hasLowerCase ? 'requirement-met' : 'requirement-unmet'}
              >
                {passwordStrength.hasLowerCase ? '✓' : '○'} One lowercase letter
              </div>
              <div className={passwordStrength.hasNumber ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasNumber ? '✓' : '○'} One number
              </div>
              <div
                className={
                  passwordStrength.hasSpecialChar ? 'requirement-met' : 'requirement-unmet'
                }
              >
                {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character
              </div>
            </div>
          </div>

          <button type='submit' disabled={loading} className='btn btn-primary btn-full'>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            type='button'
            onClick={() => router.push('/admin')}
            className='btn btn-ghost btn-full'
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
