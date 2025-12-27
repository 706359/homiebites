import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='not-found-container'>
        <div className='not-found-content'>
          <div className='not-found-icon'>
            <i className='fa-solid fa-triangle-exclamation'></i>
          </div>
          <h1 className='not-found-title'>404</h1>
          <h2 className='not-found-subtitle'>{t('error.notFound') || 'Page Not Found'}</h2>
          <p className='not-found-description'>
            {t('error.notFoundDescription') ||
              'The page you are looking for does not exist or has been moved.'}
          </p>
          <div className='not-found-actions'>
            <Link to='/' className='btn btn-primary'>
              {t('error.goHome') || 'Go to Homepage'}
            </Link>
            <Link to='/menu' className='btn btn-ghost'>
              {t('error.viewMenu') || 'View Menu'}
            </Link>
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
