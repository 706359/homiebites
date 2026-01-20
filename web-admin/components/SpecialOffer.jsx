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
        <div className='offer-header'>
          <span className='offer-kicker'>{t('specialOffer.intro') || 'For busy professionals and families'}</span>
          <h2 className='offer-title'>{t('specialOffer.title')}</h2>
          <p className='offer-text'>
            {t('specialOffer.text')} <strong>{t('specialOffer.discount')}</strong> {t('specialOffer.onTotal')}
          </p>
        </div>
        <div className='offer-actions'>
          <a href={getWhatsAppLink()} target='_blank' rel='noopener noreferrer' className='btn btn-primary btn-small'>
            <i className='fa-brands fa-whatsapp'></i> {t('common.orderOnWhatsApp')}
          </a>
          <a href={getPhoneLink()} className='btn btn-secondary btn-small'>
            <i className='fa-solid fa-phone'></i> {t('common.call')} {getFormattedPhone()}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
