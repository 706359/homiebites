import { useLanguage } from '../contexts/LanguageContext';
import './SpecialOffer.css';

const SpecialOffer = () => {
  const { t } = useLanguage();

  const handleGetDeal = () => {
    const message = encodeURIComponent(t('specialOffer.whatsappMessage'));
    window.open(`https://wa.me/919958983578?text=${message}`, '_blank', 'noopener');
  };

  return (
    <section className='offer-section'>
      <div className='section-container'>
        <p className='offer-intro'>
          {t('specialOffer.intro') || 'for busy professionals and families'}
        </p>
        <button className='btn btn-primary btn-large' onClick={handleGetDeal}>
          {t('specialOffer.getDeal')}
        </button>
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
