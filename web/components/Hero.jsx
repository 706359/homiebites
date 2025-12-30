import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './Hero.css';

const Hero = ({ onOrderClick }) => {
  const { t } = useLanguage();

  return (
    <section className='hero-section'>
      <div className='hero-overlay'></div>
      <div className='hero-content'>
        <div className='hero-badge'>🍛 HomieBites</div>
        <h1>{t('hero.title')}</h1>
        <p className='hero-subtitle'>{t('hero.subtitle')}</p>
        <p className='hero-description'>{t('hero.description')}</p>
        <div className='hero-features'>
          <span className='hero-feature-item'>
            <i className='fa-solid fa-heart'></i> Made with Love
          </span>
          <span className='hero-feature-item'>
            <i className='fa-solid fa-fire'></i> Fresh Daily
          </span>
          <span className='hero-feature-item'>
            <i className='fa-solid fa-home'></i> Home-like Taste
          </span>
        </div>
        <div className='hero-actions'>
          <button className='btn btn-primary btn-large' onClick={onOrderClick}>
            <i className='fa-solid fa-utensils'></i> {t('hero.orderNow')}
          </button>
          <Link to='/menu' className='btn btn-secondary btn-large'>
            <i className='fa-solid fa-book-open'></i> {t('hero.viewMenu')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
