import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import './Footer.css';

const Footer = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showError(t('footer.newsletterInvalidEmail') || 'Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    // Store newsletter subscription in localStorage
    const subscriptions = JSON.parse(localStorage.getItem('homiebites_newsletter') || '[]');
    const emailExists = subscriptions.some((sub) => sub.email === newsletterEmail.toLowerCase());

    if (emailExists) {
      showError(t('footer.newsletterAlreadySubscribed') || 'This email is already subscribed');
      setIsSubscribing(false);
      return;
    }

    const subscription = {
      email: newsletterEmail.toLowerCase(),
      subscribedAt: new Date().toISOString(),
    };

    subscriptions.push(subscription);
    localStorage.setItem('homiebites_newsletter', JSON.stringify(subscriptions));

    setNewsletterEmail('');
    success(
      t('footer.newsletterSuccess') ||
        'Thank you for subscribing! You will receive special offers via email.'
    );
    setIsSubscribing(false);
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
          <Link className='btn btn-secondary' to='/menu'>
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

        <div className='footer-column footer-newsletter'>
          <h4>{t('footer.newsletterTitle') || 'Newsletter'}</h4>
          <p className='footer-newsletter-desc'>
            {t('footer.newsletterDesc') || 'Subscribe to get special offers and updates'}
          </p>
          <form className='footer-newsletter-form' onSubmit={handleNewsletterSubmit}>
            <input
              type='email'
              placeholder={t('footer.newsletterPlaceholder') || 'Enter your email'}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              disabled={isSubscribing}
            />
            <button type='submit' className='btn btn-primary' disabled={isSubscribing}>
              {isSubscribing
                ? t('footer.newsletterSubscribing') || 'Subscribing...'
                : t('footer.newsletterSubscribe') || 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>{t('footer.copyright')}</p>
        <div className='footer-legal-links'>
          <Link to='/privacy'>Privacy Policy</Link>
          <span className='footer-separator'>|</span>
          <Link to='/terms'>Terms of Service</Link>
          <span className='footer-separator'>|</span>
          <Link to='/disclaimer'>Legal Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
