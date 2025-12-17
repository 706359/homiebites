'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import '../../styles/login.css';

export default function LoginPage() {
  const { t } = useLanguage();
  const { success, error: showError } = useNotification();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const api = (await import('../../lib/api')).default;
      const data = await api.login(loginForm.email, loginForm.password);
      
      if (data.success) {
        localStorage.setItem('homiebites_token', data.token);
        localStorage.setItem('homiebites_user', JSON.stringify(data.user));
        success('Login successful! Welcome back.');
        router.push('/account');
      } else {
        const errorMsg = data.error || 'Invalid credentials';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Connection error. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (registerForm.password !== registerForm.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }
    
    if (registerForm.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }
    
    setLoading(true);

    try {
      const api = (await import('../../lib/api')).default;
      const data = await api.register({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password
      });
      
      if (data.success) {
        localStorage.setItem('homiebites_token', data.token);
        localStorage.setItem('homiebites_user', JSON.stringify(data.user));
        success('Account created successfully! Welcome to HomieBites!');
        router.push('/account');
      } else {
        const errorMsg = data.error || 'Registration failed';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Connection error. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page-container">
        <div className="login-left-section">
          <img 
            src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg" 
            alt="Delicious home-cooked tiffin meal"
            className="login-image"
          />
        </div>

        <div className="login-right-section">
          <div className="login-content">
            <h1 className="login-title">{t('login.title')}</h1>

            <div className="login-tabs">
              <button 
                className={`login-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                {t('login.login')}
              </button>
              <button 
                className={`login-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                {t('login.signup')}
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-field">
                  <label>{t('login.emailOrPhone')}</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t('login.password')}</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'LOGGING IN...' : t('login.login')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="login-form">
                <div className="form-field">
                  <label>{t('login.fullName')}</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t('login.emailOrPhone')}</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t('common.phone')}</label>
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t('login.password')}</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-field">
                  <label>{t('login.confirmPassword')}</label>
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'CREATING ACCOUNT...' : t('login.signup')}
                </button>
              </form>
            )}

            <div className="login-info">
              <p>
                {t('login.infoText')}
              </p>
              <ul className="login-benefits">
                <li>{t('login.benefit1')}</li>
                <li>{t('login.benefit2')}</li>
                <li>{t('login.benefit3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
