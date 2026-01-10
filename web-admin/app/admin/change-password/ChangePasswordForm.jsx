'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../../components/admin/contexts/NotificationContext.jsx';
import './change-password.css';

export default function ChangePasswordForm({ isTemporary }) {
  const router = useRouter();
  const { error: showError, success: showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    currentPassword: '',
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
    // Check if user is authenticated
    const token = localStorage.getItem('homiebites_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    // Verify token
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.success) {
          router.push('/admin');
        }
      } catch (err) {
        router.push('/admin');
      }
    };
    verifyToken();
  }, [router]);

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

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      showError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      showError('Password must be at least 8 characters long');
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
      const token = localStorage.getItem('homiebites_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: isTemporary ? undefined : formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Password changed successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        showError(data.error || 'Failed to change password');
      }
    } catch (err) {
      showError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='change-password-page'>
      <div className='change-password-container'>
        <div className='change-password-header'>
          <h2 className='change-password-title'>
            {isTemporary ? '🔐 Create New Password' : 'Change Password'}
          </h2>
          {isTemporary && (
            <div className='temp-password-warning'>
              <p>⚠️ You're using a temporary password. Please create a new secure password to continue.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className='change-password-form'>
          {!isTemporary && (
            <div className='form-field'>
              <label>Current Password</label>
              <input
                type='password'
                name='currentPassword'
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder='Enter current password'
              />
            </div>
          )}

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
            <label>Confirm New Password</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder='Confirm new password'
            />
          </div>

          {/* Password Strength Indicator */}
          <div className='password-requirements'>
            <p className='requirements-title'>Password Requirements:</p>
            <div className='requirements-list'>
              <div className={passwordStrength.hasLength ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasLength ? '✓' : '○'} At least 8 characters
              </div>
              <div className={passwordStrength.hasUpperCase ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasUpperCase ? '✓' : '○'} One uppercase letter
              </div>
              <div className={passwordStrength.hasLowerCase ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasLowerCase ? '✓' : '○'} One lowercase letter
              </div>
              <div className={passwordStrength.hasNumber ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasNumber ? '✓' : '○'} One number
              </div>
              <div className={passwordStrength.hasSpecialChar ? 'requirement-met' : 'requirement-unmet'}>
                {passwordStrength.hasSpecialChar ? '✓' : '○'} One special character (!@#$%^&*...)
              </div>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary btn-full'
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>

          {!isTemporary && (
            <button
              type='button'
              onClick={() => router.push('/admin/dashboard')}
              className='btn btn-ghost btn-full'
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
