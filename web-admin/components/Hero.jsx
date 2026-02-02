'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../lib/api';
import './Hero.css';
import Icon from './ui/Icon.jsx';

const Hero = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalCustomers: null,
    dailyMeals: null,
    totalOrders: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getStats();
        if (process.env.NODE_ENV === 'development') {
          console.log('[Hero] Stats response:', response);
        }
        if (response && response.success && response.data) {
          const newStats = {
            totalCustomers: response.data.totalCustomers || 0,
            dailyMeals: response.data.dailyMeals || 0,
            totalOrders: response.data.totalOrders || 0,
          };
          if (process.env.NODE_ENV === 'development') {
            console.log('[Hero] Setting stats:', newStats);
          }
          setStats(newStats);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Hero] Invalid stats response:', response);
          }
        }
      } catch (error) {
        console.error('[Hero] Error fetching stats:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{t('hero.title')}</h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <p className="hero-description">{t('hero.description')}</p>

        <div className="hero-benefits">
          <div className="hero-benefit-item">
            <Icon name="check-circle" />
            <div>
              <strong>
                {t('hero.benefit1Title') || '100% Pure Vegetarian'}
              </strong>
              <p>
                {t('hero.benefit1Desc') ||
                  'Fresh, hygienic vegetarian meals prepared daily'}
              </p>
            </div>
          </div>
          <div className="hero-benefit-item">
            <Icon name="check-circle" />
            <div>
              <strong>
                {t('hero.benefit2Title') || 'Flexible Delivery Slots'}
              </strong>
              <p>
                {t('hero.benefit2Desc') ||
                  'Morning (7-10 AM), Noon (12-3 PM), Night (7-9 PM)'}
              </p>
            </div>
          </div>
          <div className="hero-benefit-item hero-benefit-pricing">
            <Icon name="check-circle" />
            <div>
              <strong>{t('hero.benefit3Title') || 'Affordable Pricing'}</strong>
              <p>
                {t('hero.benefit3Desc') ||
                  'Home delivery on orders ₹100+ | Starting from ₹80'}
              </p>
            </div>
          </div>
        </div>

        <div className="hero-trust-signals">
          <div className="hero-trust-item">
            <Icon name="users" />
            <span>
              {loading || stats.totalCustomers === null
                ? t('hero.trust1') || '500+ Happy Customers'
                : `${stats.totalCustomers}+ ${t('hero.trust1Label') || 'Happy Customers'}`}
            </span>
          </div>
          <div className="hero-trust-item">
            <Icon name="calendar-check" />
            <span>
              {loading || stats.dailyMeals === null
                ? t('hero.trust2') || 'Daily Fresh Meals'
                : `${stats.dailyMeals} ${t('hero.trust2Label') || 'Daily Fresh Meals'}`}
            </span>
          </div>
          <div className="hero-trust-item">
            <Icon name="shield-halved" />
            <span>
              {loading || stats.totalOrders === null
                ? t('hero.trust3') || 'Hygienic Kitchen'
                : `${stats.totalOrders}+ ${t('hero.trust3Label') || 'Orders Delivered'}`}
            </span>
          </div>
        </div>

        <div className="hero-cta-text">
          <p>
            {t('hero.ctaText') ||
              'Experience authentic home-cooked meals delivered fresh to your doorstep every day!'}
          </p>
        </div>

        {/* Mobile-only Order Button */}
        {onOrderClick && (
          <div className="hero-mobile-order">
            <button
              onClick={onOrderClick}
              className="btn btn-primary btn-large hero-order-btn-mobile"
              type="button"
              aria-label="Order Now"
            >
              <Icon name="whatsapp" />
              {t('hero.orderNow') || t('common.orderOnWhatsApp') || 'Order Now'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
