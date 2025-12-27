import { useState } from 'react';
import api from '../web/lib/api.js';
import '../web/styles/login.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try backend API first
      try {
        const data = await api.login(username, password);

        if (data.success && data.user && data.user.role === 'admin') {
          localStorage.setItem('homiebites_token', data.token);
          localStorage.setItem('homiebites_user', JSON.stringify(data.user));
          localStorage.setItem('homiebites_admin', 'true');

          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            window.location.href = '/admin/dashboard';
          }
          return;
        } else {
          setError(data.error || 'Invalid credentials. Admin access required.');
        }
      } catch (apiError) {
        // API failed, will try fallback credentials below
        console.warn('API login failed, trying fallback:', apiError.message);
      }

      // Fallback to hardcoded admin credentials if API failed or credentials didn't match
      if (username === 'adminHomieBites' && password === 'Bless@@##12$$') {
        const adminUser = {
          id: 'admin',
          name: 'Admin',
          email: 'admin@homiebites.com',
          role: 'admin',
        };
        localStorage.setItem('homiebites_user', JSON.stringify(adminUser));
        localStorage.setItem('homiebites_admin', 'true');

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = '/admin/dashboard';
        }
        return;
      } else if (!error) {
        setError('Invalid credentials. Admin access required. Use fallback credentials if needed.');
      }
    } catch (err) {
      // Final fallback to hardcoded admin credentials
      if (username === 'adminHomieBites' && password === 'Bless@@##12$$') {
        const adminUser = {
          id: 'admin',
          name: 'Admin',
          email: 'admin@homiebites.com',
          role: 'admin',
        };
        localStorage.setItem('homiebites_user', JSON.stringify(adminUser));
        localStorage.setItem('homiebites_admin', 'true');

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = '/admin/dashboard';
        }
      } else {
        setError('Connection error. Please try again or use fallback credentials.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page-wrapper'>
      <div className='login-page-container'>
        <div className='login-left-section'>
          <img
            src='https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
            alt='Admin access to HomieBites dashboard'
            className='login-image'
          />
        </div>

        <div className='login-right-section'>
          <div className='login-content'>
            <h1 className='login-title'>Admin Login</h1>

            <form onSubmit={handleSubmit} className='login-form'>
              <div className='form-field'>
                <label>Username or Email</label>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className='form-field'>
                <label>Password</label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className='error-message'>{error}</div>}

              <button type='submit' className='btn btn-primary btn-full' disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOG IN'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a
                  href='/admin/forgot-password'
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--primary-orange)',
                    textDecoration: 'none',
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </form>

            <div className='login-info'>
              <p>
                <strong>Admin Access Required</strong>
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '1rem' }}>
                Authorized personnel only
              </p>
              {(import.meta.env.DEV || process.env.NODE_ENV === 'development') && (
                <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
                  <summary
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--gray)',
                      textDecoration: 'underline',
                    }}
                  >
                    Forgot Password?
                  </summary>
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                    }}
                  >
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>Quick Access:</strong>
                    </p>
                    <p style={{ marginBottom: '0.5rem' }}>
                      Username: <code>adminHomieBites</code>
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                      Password: <code>Bless@@##12$$</code>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                      <strong>Note:</strong> For production, reset password via backend database. See{' '}
                      <code>docs/ADMIN_PASSWORD_RECOVERY.md</code> for detailed instructions.
                    </p>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
