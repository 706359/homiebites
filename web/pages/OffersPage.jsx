import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { getOffersData } from '../lib/offersData';
import '../styles/globals.css';

export default function OffersPage() {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffersData();
        setOffers(data);
      } catch (error) {
        console.error('Error loading offers:', error);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Wrap in try-catch to prevent unhandled errors
    try {
      loadOffers().catch((err) => {
        console.error('loadOffers promise rejected:', err);
        setIsLoading(false);
        setOffers([]);
      });
    } catch (err) {
      console.error('loadOffers threw synchronously:', err);
      setIsLoading(false);
      setOffers([]);
    }
  }, []);

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  const handleGetDeal = (offer) => {
    const message = encodeURIComponent(
      offer.whatsappMessage || `I'm interested in: ${offer.title}`
    );
    window.open(`https://wa.me/919958983578?text=${message}`, '_blank', 'noopener');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <>
        <Header onOrderClick={openOrderModal} />
        <div className='offers-page'>
          <div className='offers-container'>
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p>{t('common.loading') || 'Loading...'}</p>
            </div>
          </div>
        </div>
        <Footer onOrderClick={openOrderModal} />
      </>
    );
  }

  if (offers.length === 0) {
    return (
      <>
        <Header onOrderClick={openOrderModal} />
        <div className='offers-page'>
          <div className='offers-container'>
            <h1 className='offers-title'>{t('offers.title') || 'Special Offers & Discounts'}</h1>
            <div className='no-offers-message'>
              <i className='fa-solid fa-tag' style={{ fontSize: '3rem', color: 'var(--gray)', marginBottom: '1rem' }}></i>
              <p>{t('offers.noOffers') || 'No active offers at the moment. Check back soon for exciting deals!'}</p>
              <Link to='/menu' className='btn btn-primary' style={{ marginTop: '2rem' }}>
                <i className='fa-solid fa-utensils'></i> View Menu
              </Link>
            </div>
          </div>
        </div>
        <Footer onOrderClick={openOrderModal} />
      </>
    );
  }

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='offers-page'>
        <div className='offers-container'>
          <h1 className='offers-title'>{t('offers.title') || 'Special Offers & Discounts'}</h1>
          <p className='offers-subtitle'>
            {t('offers.subtitle') || 'Discover our latest deals and special offers'}
          </p>

          <div className='offers-grid'>
            {offers.map((offer) => (
              <div key={offer.id} className='offer-card'>
                {offer.badge && (
                  <div className='offer-badge'>{offer.badge}</div>
                )}
                <div className='offer-card-header'>
                  <h2 className='offer-card-title'>{offer.title}</h2>
                  {offer.discount && (
                    <div className='offer-discount'>{offer.discount}</div>
                  )}
                </div>
                {offer.description && (
                  <p className='offer-description'>{offer.description}</p>
                )}
                {offer.terms && (
                  <div className='offer-terms'>
                    <h3>{t('offers.terms') || 'Terms & Conditions:'}</h3>
                    <ul>
                      {offer.terms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(offer.startDate || offer.endDate) && (
                  <div className='offer-dates'>
                    {offer.startDate && (
                      <div>
                        <strong>{t('offers.starts') || 'Starts:'}</strong> {formatDate(offer.startDate)}
                      </div>
                    )}
                    {offer.endDate && (
                      <div>
                        <strong>{t('offers.ends') || 'Ends:'}</strong> {formatDate(offer.endDate)}
                      </div>
                    )}
                  </div>
                )}
                <button
                  className='btn btn-primary offer-cta-btn'
                  onClick={() => handleGetDeal(offer)}
                >
                  <i className='fa-solid fa-whatsapp'></i>{' '}
                  {offer.ctaText || t('offers.getDeal') || 'Get This Deal'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
