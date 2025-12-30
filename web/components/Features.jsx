import { useLanguage } from '../contexts/LanguageContext';
import './Features.css';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fa-leaf',
      title: t('features.pureVeg') || '100% Pure Vegetarian',
      description:
        t('features.pureVegDesc') || 'Fresh, wholesome ingredients prepared with care and love',
      color: 'green',
      badge: 'Pure',
    },
    {
      icon: 'fa-house',
      title: t('features.homeTaste') || 'Home-like Taste',
      description:
        t('features.homeTasteDesc') ||
        'Authentic desi flavors that remind you of home-cooked meals',
      color: 'orange',
      badge: 'Authentic',
    },
    {
      icon: 'fa-droplet',
      title: t('features.lessOil') || 'Less Oil & Healthy',
      description:
        t('features.lessOilDesc') ||
        'Healthy, balanced meals with minimal oil and maximum nutrition',
      color: 'blue',
      badge: 'Healthy',
    },
    {
      icon: 'fa-truck-fast',
      title: t('features.onTime') || 'Fresh Daily Delivery',
      description:
        t('features.onTimeDesc') || 'Meals delivered fresh to your doorstep every single day',
      color: 'yellow',
      badge: 'Fresh',
    },
    {
      icon: 'fa-fire',
      title: t('features.freshDaily') || 'Cooked Fresh Daily',
      description:
        t('features.freshDailyDesc') ||
        'Every meal is prepared fresh daily, never frozen or reheated',
      color: 'red',
      badge: 'Daily',
    },
    {
      icon: 'fa-heart',
      title: t('features.madeWithLove') || 'Made with Love',
      description:
        t('features.madeWithLoveDesc') ||
        'Every dish is prepared with care, passion, and traditional recipes',
      color: 'purple',
      badge: 'Love',
    },
  ];

  return (
    <section className='features-section'>
      <div className='section-container'>
        <div className='features-header'>
          <h2 className='section-heading'>{t('features.title') || 'Our Features'}</h2>
          <p className='features-subtitle'>
            {t('features.subtitle') ||
              'Discover what makes HomieBites the perfect choice for your daily meals'}
          </p>
        </div>
        <div className='features-grid'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='feature-card'
              data-aos='fade-up'
              data-aos-delay={index * 100}
            >
              <div className='feature-badge'>{feature.badge}</div>
              <div
                className='feature-icon-wrapper'
                data-color={feature.color}
              >
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <h3 className='feature-title'>{feature.title}</h3>
              <p className='feature-description'>{feature.description}</p>
            </div>
          ))}
        </div>
        <div className='features-cta'>
          <p className='features-cta-text'>
            {t('features.ctaText') ||
              'Ready to experience the difference? Order your first meal today!'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
