import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fa-leaf',
      title: t('features.pureVeg') || '100% Pure Vegetarian',
      description:
        t('features.pureVegDesc') || 'Fresh, wholesome ingredients prepared with care and love',
      color: '#449031',
      gradient: 'linear-gradient(135deg, #449031 0%, #357825 100%)',
      badge: 'Pure',
    },
    {
      icon: 'fa-house',
      title: t('features.homeTaste') || 'Home-like Taste',
      description:
        t('features.homeTasteDesc') ||
        'Authentic desi flavors that remind you of home-cooked meals',
      color: '#C45C2D',
      gradient: 'linear-gradient(135deg, #C45C2D 0%, #a84a1f 100%)',
      badge: 'Authentic',
    },
    {
      icon: 'fa-droplet',
      title: t('features.lessOil') || 'Less Oil & Healthy',
      description:
        t('features.lessOilDesc') ||
        'Healthy, balanced meals with minimal oil and maximum nutrition',
      color: '#4A90E2',
      gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
      badge: 'Healthy',
    },
    {
      icon: 'fa-truck-fast',
      title: t('features.onTime') || 'Fresh Daily Delivery',
      description:
        t('features.onTimeDesc') || 'Meals delivered fresh to your doorstep every single day',
      color: '#F5A623',
      gradient: 'linear-gradient(135deg, #F5A623 0%, #D8941A 100%)',
      badge: 'Fresh',
    },
    {
      icon: 'fa-fire',
      title: t('features.freshDaily') || 'Cooked Fresh Daily',
      description:
        t('features.freshDailyDesc') ||
        'Every meal is prepared fresh daily, never frozen or reheated',
      color: '#E74C3C',
      gradient: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
      badge: 'Daily',
    },
    {
      icon: 'fa-heart',
      title: t('features.madeWithLove') || 'Made with Love',
      description:
        t('features.madeWithLoveDesc') ||
        'Every dish is prepared with care, passion, and traditional recipes',
      color: '#9B59B6',
      gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
      badge: 'Love',
    },
  ];

  return (
    <section className='features-section'>
      <div className='section-container'>
        <div className='features-header'>
          <span className='features-badge'>Why Choose Us</span>
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
                style={{
                  '--feature-color': feature.color,
                  '--feature-gradient': feature.gradient,
                }}
              >
                <div className='feature-icon-bg'></div>
                <i className={`fa-solid ${feature.icon}`}></i>
                <div className='feature-icon-shine'></div>
              </div>
              <h3 className='feature-title'>{feature.title}</h3>
              <p className='feature-description'>{feature.description}</p>
              <div className='feature-decoration'>
                <div className='feature-decoration-line'></div>
                <div className='feature-decoration-dot'></div>
                <div className='feature-decoration-line'></div>
              </div>
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
