import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import { getOffersData } from '../../lib/offersData';
import '../../pages/OffersPage.css';
import '../../styles/globals.css';

export default function OffersPage() {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffersData();
        // Filter out invalid/test offers - only show offers with proper title and content
        const validOffers = data.filter((offer) => {
          // Must have a title (not empty, not "test", not "Saved via test")
          const hasValidTitle = 
            offer.title && 
            offer.title.trim() !== '' && 
            !offer.title.toLowerCase().includes('test') &&
            !offer.title.toLowerCase().includes('saved via');
          
          // Must be active
          const isActive = offer.isActive !== false;
          
          // Must not be expired (if endDate exists)
          const notExpired = !offer.endDate || new Date(offer.endDate) >= new Date();
          
          return hasValidTitle && isActive && notExpired;
        });
        setOffers(validOffers);
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
    if (isNaN(date)) return String(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <>
        <Header onOrderClick={openOrderModal} />
        <div className='offers-page'>
          <div className='offers-container'>
            <div className='offers-loading-state'>
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
            <div className='no-offers-message' style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'var(--light-gray, #f5f5f5)',
              borderRadius: '12px',
              marginTop: '2rem',
              border: '2px dashed var(--gray-light, #ddd)'
            }}>
              <i className='fa-solid fa-tag' style={{
                fontSize: '4rem',
                color: 'var(--gray, #999)',
                marginBottom: '1.5rem',
                display: 'block'
              }}></i>
              <h2 style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary, #333)',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                {t('offers.noOffersTitle') || 'No Active Offers'}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary, #666)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                {t('offers.noOffers') ||
                  'We currently don\'t have any active offers. Check back soon for exciting deals and special discounts!'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to='/menu' className='btn btn-primary'>
                  <i className='fa-solid fa-utensils'></i> View Menu
                </Link>
                <Link to='/' className='btn btn-secondary'>
                  <i className='fa-solid fa-home'></i> Go Home
                </Link>
              </div>
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
                {offer.badge && <div className='offer-badge'>{offer.badge}</div>}
                <div className='offer-card-header'>
                  <h2 className='offer-card-title'>{offer.title}</h2>
                  {offer.discount && <div className='offer-discount'>{offer.discount}</div>}
                </div>
                {offer.description && <p className='offer-description'>{offer.description}</p>}
                {offer.terms && offer.terms.length > 0 && (
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
                        <strong>{t('offers.starts') || 'Starts:'}</strong>{' '}
                        {formatDate(offer.startDate)}
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
