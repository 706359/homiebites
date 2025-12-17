import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleHashLink = (e, hash) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      // Already on home page, just scroll
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          const headerOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 50);
    } else {
      // Navigate to home first, then scroll after navigation
      navigate('/');
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          const headerOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
  };

  return (
    <footer>
      <div className='footer-inner'>
        <div className='footer-brand'>
          <Link to='/' className='footer-logo-link'>
            <img
              src='/logo.png'
              alt='HomieBites'
              className='footer-logo-img'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <h2 className='footer-logo-text' style={{ display: 'none' }}>
              HOMIEBITES
            </h2>
          </Link>
        </div>

        <div className='footer-actions'>
          <Link className='btn btn-ghost footer-view-menu-btn' to='/menu'>
            {t('footer.viewMenu')}
          </Link>
          <button className='btn btn-primary pulse' onClick={onOrderClick}>
            {t('footer.orderNow')}
          </button>
        </div>
      </div>

      <div className='footer-links'>
        <div className='footer-column'>
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li>
              <Link to='/'>{t('footer.home')}</Link>
            </li>
            <li>
              <a href='/#about' onClick={(e) => handleHashLink(e, '#about')}>
                {t('footer.aboutUs')}
              </a>
            </li>
            <li>
              <a href='/#gallery' onClick={(e) => handleHashLink(e, '#gallery')}>
                {t('footer.foodGallery')}
              </a>
            </li>
          </ul>
        </div>

        <div className='footer-column'>
          <h4>{t('footer.help')}</h4>
          <ul>
            <li>
              <Link to='/faq'>{t('common.faq')}</Link>
            </li>
            <li>
              <Link to='/support'>{t('common.support')}</Link>
            </li>
            <li>
              <a href='/#contact' onClick={(e) => handleHashLink(e, '#contact')}>
                {t('footer.contactUs')}
              </a>
            </li>
            <li>
              <a href='https://wa.me/919958983578' target='_blank' rel='noreferrer'>
                {t('footer.whatsappSupport')}
              </a>
            </li>
            <li>
              <Link to='/admin' className='admin-link'>
                <i className='fa-solid fa-shield-halved'></i> {t('footer.adminLogin')}
              </Link>
            </li>
          </ul>
        </div>

        <div className='footer-column'>
          <h4>{t('footer.serviceAreas')}</h4>
          <ul>
            <li>{t('footer.panchsheelGreens1')}</li>
            <li className='footer-note'>{t('footer.emergencyDelivery')}</li>
          </ul>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
