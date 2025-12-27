import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';

export default function ErrorPage({ error, reset }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Log error to console or error reporting service
    if (error) {
      console.error('Application error:', error);
    }
  }, [error]);

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='error-container'>
        <div className='error-content'>
          <div className='error-icon'>
            <i className='fa-solid fa-circle-exclamation'></i>
          </div>
          <h1 className='error-title'>{t('error.title') || 'Something went wrong!'}</h1>
          <p className='error-description'>
            {t('error.description') || 'We encountered an unexpected error. Please try again.'}
          </p>
          <div className='error-actions'>
            <button onClick={handleReset} className='btn btn-primary'>
              {t('error.tryAgain') || 'Try Again'}
            </button>
            <Link to='/' className='btn btn-ghost'>
              {t('error.goHome') || 'Go to Homepage'}
            </Link>
          </div>
          {import.meta.env.DEV && error && (
            <details className='error-details'>
              <summary>{t('error.errorDetails') || 'Error Details'}</summary>
              <pre className='error-stack'>{error.message || String(error)}</pre>
            </details>
          )}
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
