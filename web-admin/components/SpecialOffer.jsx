import { useLanguage } from '../contexts/LanguageContext';
import { getFormattedPhone, getPhoneLink, getWhatsAppLink } from '../lib/businessConstants';
import './SpecialOffer.css';

const SpecialOffer = () => {
  const { t } = useLanguage();

  const handleGetDeal = () => {
    const message = t('specialOffer.whatsappMessage');
    window.open(getWhatsAppLink(message), '_blank', 'noopener');
  };

  return (
    <section className='offer-section'>
      <div className='section-container'>
        <p className='offer-intro'>
          {t('specialOffer.intro') || 'for busy professionals and families'}
        </p>
        <div className='offer-actions'>
          <a
            href={getWhatsAppLink()}
            target='_blank'
            rel='noopener noreferrer'
            className='btn btn-primary btn-large'
          >
            <i className='fa-brands fa-whatsapp'></i> Order on WhatsApp
          </a>
          <a href={getPhoneLink()} className='btn btn-secondary btn-large'>
            <i className='fa-solid fa-phone'></i> Call {getFormattedPhone()}
          </a>
        </div>
        <h2 className='section-heading'>{t('specialOffer.title')}</h2>
        <p className='offer-text'>
          {t('specialOffer.text')} <strong>{t('specialOffer.discount')}</strong>{' '}
          {t('specialOffer.onTotal')}
        </p>
      </div>
    </section>
  );
};

export default SpecialOffer;
