'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getOffersDataSync } from '../lib/offersData';
import './Header.css';
import LanguageSwitcher from './LanguageSwitcher';

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
          const headerOffset = 60;
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
      <div className='header-top-bar'>
        <div className='top-bar-content'>
          <span className='announcement'>{t('header.announcement')}</span>
          <div className='top-bar-right'>
            <a
              href='https://wa.me/919958983578'
              target='_blank'
              rel='noopener noreferrer'
              className='whatsapp-order-link'
              aria-label={t('common.orderOnWhatsApp')}
              title={t('common.orderOnWhatsApp')}
            >
              <i className='fa-brands fa-whatsapp'></i>
              <span>+91-9958983578</span>
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <nav className='nav'>
        <div className='nav-left'>
          <Link href='/' className='brand-logo' onClick={handleNavClick}>
            <img
              src='/logo.png'
              alt='HomieBites'
              className='logo-img'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          </Link>
        </div>

        <div className='nav-right'>
          <Link href='/' onClick={handleNavClick}>
            {t('common.home')}
          </Link>
          <a href='/#about' onClick={(e) => handleHashLink(e, '#about')}>
            {t('common.about')}
          </a>
          <a href='/#gallery' onClick={(e) => handleHashLink(e, '#gallery')}>
            {t('header.gallery') || 'Gallery'}
          </a>
          <Link href='/faq' onClick={handleNavClick}>
            {t('header.faq')}
          </Link>
          <a
            href='https://wa.me/919958983578'
            target='_blank'
            rel='noopener noreferrer'
            className='nav-icon cart-icon'
            aria-label='Contact us on WhatsApp'
            title='Contact us on WhatsApp'
          ></a>
          <button
            className={`menu-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label='Toggle menu'
            type='button'
            aria-expanded={isMenuOpen}
          >
            <i className='fa-solid fa-bars menu-icon'></i>
            <i className='fa-solid fa-xmark close-icon'></i>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className='mobile-menu-backdrop active' onClick={closeMenu} aria-hidden='true' />
      )}

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button
          className='mobile-menu-close-btn'
          onClick={closeMenu}
          aria-label='Close menu'
          type='button'
        >
          <i className='fa-solid fa-xmark'></i>
        </button>
        <a href='/#gallery' onClick={(e) => handleHashLink(e, '#gallery')}>
          {t('header.menu')}
        </a>
        <Link href='/' onClick={handleNavClick}>
          {t('common.home')}
        </Link>
        <a href='/#about' onClick={(e) => handleHashLink(e, '#about')}>
          {t('common.about')}
        </a>
        <a href='/#gallery' onClick={(e) => handleHashLink(e, '#gallery')}>
          {t('header.gallery') || 'Gallery'}
        </a>
        <Link href='/search' onClick={handleNavClick}>
          {t('header.search')}
        </Link>
        {hasActiveOffers && (
          <Link href='/offers' onClick={handleNavClick}>
            {t('header.offers') || 'Offers'}
          </Link>
        )}
        <Link href='/faq' onClick={handleNavClick}>
          {t('header.faq')}
        </Link>
        <a
          href='https://wa.me/919958983578'
          target='_blank'
          rel='noopener noreferrer'
          className='btn btn-primary btn-small'
          onClick={handleNavClick}
        >
          {t('header.subscribe')}
        </a>
      </div>
    </header>
  );
};

export default Header;
