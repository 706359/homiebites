'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getFormattedPhone, getPhoneLink } from '../lib/businessConstants';
import { getOffersDataSync } from '../lib/offersData';
import './Header.css';
import LanguageSwitcher from './LanguageSwitcher';
import Icon from './ui/Icon.jsx';

const Header = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasActiveOffers, setHasActiveOffers] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    closeMenu();
  };

  const handleHashLink = (e, hash) => {
    e.preventDefault();
    closeMenu();
    if (pathname === '/') {
      // Already on home page, just scroll
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          const headerOffset = 60;
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
          const headerOffset = 60;
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

  useEffect(() => {
    // Check if there are active offers
    const checkOffers = () => {
      const offers = getOffersDataSync();
      setHasActiveOffers(offers.length > 0);
    };

    checkOffers();

    // Listen for offers updates
    const handleOffersUpdate = () => {
      checkOffers();
    };

    window.addEventListener('offersDataUpdated', handleOffersUpdate);
    return () => {
      window.removeEventListener('offersDataUpdated', handleOffersUpdate);
    };
  }, []);

  // Prevent body scroll when menu is open, restore when closed
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent background scroll when menu is open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scroll when menu is closed
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      // Cleanup: always restore scroll on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      const target = e.target;
      const menu = document.querySelector('.mobile-menu');
      const button = document.querySelector('.menu-btn');

      if (menu && button) {
        if (!menu.contains(target) && !button.contains(target)) {
          closeMenu();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        closeMenu();
      }
    };

    // Use capture phase for better reliability
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <header>
      <div className="header-top-bar">
        <div className="top-bar-content">
          <span className="announcement">{t('header.announcement')}</span>
          <div className="top-bar-right">
            <button
              onClick={onOrderClick}
              className="whatsapp-order-link"
              aria-label={t('common.orderOnWhatsApp')}
              title={t('common.orderOnWhatsApp')}
              type="button"
            >
              <Icon name="whatsapp" />
              <span>+91-9958983578</span>
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="brand-logo" onClick={handleNavClick}>
            <img
              src="/logo.png"
              alt="HomieBites"
              className="logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          </Link>
        </div>

        <div
          className="nav-right"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link href="/" onClick={handleNavClick} aria-label="Home">
            {t('common.home')}
          </Link>
          <a
            href="/#about"
            onClick={(e) => handleHashLink(e, '#about')}
            aria-label="About us"
          >
            {t('common.about')}
          </a>
          <a
            href="/#gallery"
            onClick={(e) => handleHashLink(e, '#gallery')}
            aria-label="Food gallery"
          >
            {t('header.gallery') || 'Gallery'}
          </a>
          <Link href="/pricing" onClick={handleNavClick} aria-label="Pricing">
            {t('header.pricing') || 'Price'}
          </Link>
          <a
            href="/#faq"
            onClick={(e) => handleHashLink(e, '#faq')}
            aria-label="Frequently asked questions"
          >
            {t('header.faq')}
          </a>
          <div className="header-action-buttons">
            <button
              onClick={onOrderClick}
              className="btn btn-primary btn-small header-order-btn"
              type="button"
            >
              <Icon name="whatsapp" />
              {t('hero.orderNow') || t('common.orderOnWhatsApp')}
            </button>
            <a
              href={getPhoneLink()}
              className="btn btn-secondary btn-small header-call-btn"
            >
              <Icon name="phone" />
              {t('common.call')}
            </a>
          </div>
          <button
            className={`menu-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            type="button"
            aria-expanded={isMenuOpen}
          >
            <Icon name="bars" className="menu-icon" />
            <Icon name="xmark" className="close-icon" />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          className="mobile-menu-backdrop active"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button
          className="mobile-menu-close-btn"
          onClick={closeMenu}
          aria-label="Close menu"
          type="button"
        >
          <Icon name="xmark" />
        </button>
        <div className="mobile-menu-language">
          <LanguageSwitcher />
        </div>
        <div className="mobile-menu-nav">
          <Link href="/" onClick={handleNavClick}>
            {t('common.home')}
          </Link>
          <a href="/#about" onClick={(e) => handleHashLink(e, '#about')}>
            {t('common.about')}
          </a>
          <a href="/#gallery" onClick={(e) => handleHashLink(e, '#gallery')}>
            {t('header.gallery') || 'Gallery'}
          </a>
          <Link href="/pricing" onClick={handleNavClick}>
            {t('header.pricing') || 'Price'}
          </Link>
          <a href="/#gallery" onClick={(e) => handleHashLink(e, '#gallery')}>
            {t('header.menu')}
          </a>
          <Link href="/search" onClick={handleNavClick}>
            {t('header.search')}
          </Link>
          {hasActiveOffers && (
            <Link href="/offers" onClick={handleNavClick}>
              {t('header.offers') || 'Offers'}
            </Link>
          )}
          <a href="/#faq" onClick={(e) => handleHashLink(e, '#faq')}>
            {t('header.faq')}
          </a>
        </div>
        <div className="mobile-menu-actions">
          <button
            onClick={(e) => {
              handleNavClick();
              onOrderClick();
            }}
            className="btn btn-primary btn-small"
            type="button"
          >
            <Icon name="whatsapp" />
            {t('hero.orderNow') || t('common.orderOnWhatsApp')}
          </button>
          <a
            href={getPhoneLink()}
            className="btn btn-secondary btn-small"
            onClick={handleNavClick}
          >
            <Icon name="phone" />
            {t('common.call')} {getFormattedPhone()}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
