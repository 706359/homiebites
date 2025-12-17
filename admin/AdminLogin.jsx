import { useState } from 'react';
import './AdminLogin.css';

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
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success && data.user && data.user.role === 'admin') {
        localStorage.setItem('homiebites_token', data.token);
        localStorage.setItem('homiebites_user', JSON.stringify(data.user));
        localStorage.setItem('homiebites_admin', 'true');

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = '/admin/dashboard';
        }
      } else {
        // Fallback to hardcoded admin credentials
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
          setError(data.error || 'Invalid credentials. Admin access required.');
        }
      }
    } catch (err) {
      // Fallback to hardcoded admin credentials if API fails
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
        setError('Connection error. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='admin-login-page'>
      <div className='admin-login-container'>
        <div className='login-header'>
          <h1>Admin Login</h1>
          <p>Access the admin dashboard to manage your menu and orders</p>
        </div>

        <form onSubmit={handleSubmit} className='login-form'>
          {error && <div className='error-message'>{error}</div>}

          <div className='form-field'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className='form-field'>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type='submit' className='login-btn' disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>

        <div className='login-info'>
          <p>
            <strong>Admin Access Required</strong>
          </p>
          <p className='warning'>Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
