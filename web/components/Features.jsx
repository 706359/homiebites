import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: 'fa-leaf',
      title: t('features.pureVeg'),
      description: t('features.pureVegDesc'),
      color: '#39B86F',
      gradient: 'linear-gradient(135deg, #39B86F 0%, #2E9D5F 100%)',
    },
    {
      icon: 'fa-house',
      title: t('features.homeTaste'),
      description: t('features.homeTasteDesc'),
      color: '#FF6B35',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #E85A2B 100%)',
    },
    {
      icon: 'fa-droplet',
      title: t('features.lessOil'),
      description: t('features.lessOilDesc'),
      color: '#4A90E2',
      gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
    },
    {
      icon: 'fa-truck-fast',
      title: t('features.onTime'),
      description: t('features.onTimeDesc'),
      color: '#F5A623',
      gradient: 'linear-gradient(135deg, #F5A623 0%, #D8941A 100%)',
    },
  ];

  return (
    <section className='features-section'>
      <div className='section-container'>
        <h2 className='section-heading'>{t('features.title')}</h2>
        <p className='features-subtitle'>
          {t('features.subtitle') ||
            'Discover what makes HomieBites the perfect choice for your daily meals'}
        </p>
        <div className='features-grid'>
          {features.map((feature, index) => (
            <div key={index} className='feature-card'>
              <div
                className='feature-icon-wrapper'
                style={{
                  '--feature-color': feature.color,
                  '--feature-gradient': feature.gradient,
                }}
              >
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <h3 className='feature-title'>{feature.title}</h3>
              <p className='feature-description'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
