'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { getFormattedPhone, getPhoneLink } from '../lib/businessConstants';
import './Footer.css';
import Icon from './ui/Icon.jsx';

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
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
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
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
  };

  return (
    <footer
      className="site-footer"
      role="contentinfo"
      aria-label="Site footer"
      id="site-footer"
    >
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link
              href="/"
              className="footer-logo-link"
              aria-label="HomieBites – Home"
            >
              <img
                src="/logo.png"
                alt=""
                className="footer-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling)
                    e.target.nextSibling.style.display = 'block';
                }}
              />
            </Link>
            <p className="footer-tagline">Homemade food, delivered daily.</p>
          </div>
          <div className="footer-cta">
            <button
              onClick={onOrderClick}
              className="footer-btn footer-btn-primary"
              type="button"
              aria-label={t('common.orderOnWhatsApp')}
            >
              <Icon name="whatsapp" aria-hidden />
              <span>{t('common.orderOnWhatsApp')}</span>
            </button>
            <a
              href={getPhoneLink()}
              className="footer-btn footer-btn-secondary"
              aria-label={`${t('common.call')} ${getFormattedPhone()}`}
            >
              <Icon name="phone" aria-hidden />
              <span>
                {t('common.call')} {getFormattedPhone()}
              </span>
            </a>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-column">
            <h3 className="footer-heading">{t('footer.quickLinks')}</h3>
            <ul className="footer-list">
              <li>
                <Link href="/">{t('footer.home')}</Link>
              </li>
              <li>
                <a href="/#about" onClick={(e) => handleHashLink(e, '#about')}>
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a
                  href="/#gallery"
                  onClick={(e) => handleHashLink(e, '#gallery')}
                >
                  {t('footer.foodGallery')}
                </a>
              </li>
              <li>
                <Link href="/pricing">
                  {t('footer.pricing') || t('header.pricing') || 'Price'}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">{t('footer.help')}</h3>
            <ul className="footer-list">
              <li>
                <a href="/#faq" onClick={(e) => handleHashLink(e, '#faq')}>
                  {t('common.faq')}
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  onClick={(e) => handleHashLink(e, '#contact')}
                >
                  {t('footer.contactUs')}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919958983578"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('footer.whatsappSupport')}
                </a>
              </li>
              <li>
                <Link href="/admin" className="footer-admin-link">
                  <Icon name="shield-halved" aria-hidden />
                  {t('footer.adminLogin')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-heading">{t('footer.serviceAreas')}</h3>
            <ul className="footer-list footer-list-plain">
              <li>{t('footer.panchsheelGreens1')}</li>
            </ul>
          </div>
        </nav>

        <div className="footer-legal">
          <div className="footer-fssai">
            <span className="footer-fssai-label">{t('footer.fssaiLabel')}</span>
            <span className="footer-fssai-number">
              {t('footer.fssaiNumber')}
            </span>
          </div>
          <div className="footer-legal-row">
            <p className="footer-copyright">{t('footer.copyright')}</p>
            <div className="footer-legal-links">
              <Link href="/privacy">Privacy Policy</Link>
              <span className="footer-dot" aria-hidden="true">
                ·
              </span>
              <Link href="/terms">Terms of Service</Link>
              <span className="footer-dot" aria-hidden="true">
                ·
              </span>
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
          </div>
          <p className="footer-credits">
            Designed & developed by{' '}
            <a
              href="https://oscillateinfo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-company-link"
            >
              Oscillate Infotech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
