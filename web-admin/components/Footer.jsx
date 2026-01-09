'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

const Footer = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleHashLink = (e, hash) => {
    e.preventDefault();
    if (pathname === '/') {
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
      router.push('/');
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
          <Link href='/' className='footer-logo-link'>
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
          <a 
            href='https://wa.me/919958983578' 
            target='_blank' 
            rel='noopener noreferrer'
            className='btn btn-primary btn-small'
          >
            <i className='fa-brands fa-whatsapp'></i> Order on WhatsApp
          </a>
          <a 
            href='tel:+919958983578' 
            className='btn btn-secondary btn-small'
          >
            <i className='fa-solid fa-phone'></i> Call +91-9958983578
          </a>
        </div>
      </div>

      <div className='footer-links'>
        <div className='footer-column'>
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li>
              <Link href='/'>{t('footer.home')}</Link>
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
              <Link href='/faq'>{t('common.faq')}</Link>
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
              <Link href='/admin' className='admin-link'>
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
        <div className='footer-legal-links'>
          <Link href='/privacy'>Privacy Policy</Link>
          <span className='footer-separator'>|</span>
          <Link href='/terms'>Terms of Service</Link>
          <span className='footer-separator'>|</span>
          <Link href='/disclaimer'>Legal Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
