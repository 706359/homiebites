import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fa-leaf',
      title: t('about.feature1.title'),
      description: t('about.feature1.description'),
      color: '#39B86F',
    },
    {
      icon: 'fa-house',
      title: t('about.feature2.title'),
      description: t('about.feature2.description'),
      color: '#FF6B35',
    },
    {
      icon: 'fa-droplet',
      title: t('about.feature3.title'),
      description: t('about.feature3.description'),
      color: '#4A90E2',
    },
    {
      icon: 'fa-truck-fast',
      title: t('about.feature4.title'),
      description: t('about.feature4.description'),
      color: '#F5A623',
    },
  ];

  return (
    <section id='about' className='about-section'>
      <div className='section-container'>
        <h2 className='section-heading'>{t('about.title')}</h2>
        <div className='about-content'>
          <p>
            {t('about.description1')} <strong>{t('about.location')}</strong>{' '}
            {t('about.description2')}
          </p>
          <p>{t('about.description3')}</p>
          <p>
            {t('about.description4')} <strong>{t('about.founded')}</strong>{' '}
            {t('about.description5')}
          </p>
        </div>

        <div className='why-choose-section'>
          <h3 className='why-choose-heading'>{t('about.whyChoose') || 'Why Choose HomieBites'}</h3>
          <p className='why-choose-subtitle'>
            {t('about.whyChooseSubtitle') ||
              'Experience the difference with our commitment to quality and freshness'}
          </p>
          <p className='why-choose-intro'>
            {t('about.whyChooseIntro') ||
              'At HomieBites, we understand that your daily meals should be more than just food—they should be a source of comfort, nutrition, and joy. Our commitment goes beyond cooking; we create experiences that bring the warmth of home to your table every single day.'}
          </p>
        </div>

        {/* Statistics Section */}
        <div className='why-choose-stats'>
          <div className='stat-item'>
            <div className='stat-number'>{t('about.stat1.number') || '500+'}</div>
            <div className='stat-label'>{t('about.stat1.label') || 'Happy Customers'}</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>{t('about.stat2.number') || '100%'}</div>
            <div className='stat-label'>{t('about.stat2.label') || 'Pure Vegetarian'}</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>{t('about.stat3.number') || 'Daily'}</div>
            <div className='stat-label'>{t('about.stat3.label') || 'Fresh Cooking'}</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>{t('about.stat4.number') || 'On-Time'}</div>
            <div className='stat-label'>{t('about.stat4.label') || 'Delivery Promise'}</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className='why-choose-grid'>
          {features.map((feature, index) => (
            <div key={index} className='why-choose-card'>
              <div className='why-choose-icon-wrapper' style={{ '--icon-color': feature.color }}>
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <h3 className='why-choose-title'>{feature.title}</h3>
              <p className='why-choose-description'>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className='why-choose-benefits'>
          <div className='benefit-item'>
            <i className='fa-solid fa-check-circle'></i>
            <span>{t('about.benefit1') || 'Hygienic kitchen with strict quality control'}</span>
          </div>
          <div className='benefit-item'>
            <i className='fa-solid fa-check-circle'></i>
            <span>{t('about.benefit2') || 'Affordable pricing for daily meals'}</span>
          </div>
          <div className='benefit-item'>
            <i className='fa-solid fa-check-circle'></i>
            <span>{t('about.benefit3') || 'Flexible ordering - daily or weekly subscription'}</span>
          </div>
          <div className='benefit-item'>
            <i className='fa-solid fa-check-circle'></i>
            <span>
              {t('about.benefit4') || 'Traditional recipes passed down through generations'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
