import { useLanguage } from '../contexts/LanguageContext';
import './HowItWorks.css';
import Icon from './ui/Icon.jsx';

const HowItWorks = ({ onOrderClick }) => {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      icon: 'message',
      title: t('howItWorks.step1Title') || 'Contact Us',
      description:
        t('howItWorks.step1Desc') ||
        'Reach out via WhatsApp or call us to place your order',
    },
    {
      number: '02',
      icon: 'utensils',
      title: t('howItWorks.step2Title') || 'Choose Your Meal',
      description:
        t('howItWorks.step2Desc') ||
        'Select from our daily menu or customize your meal preferences',
    },
    {
      number: '03',
      icon: 'clock',
      title: t('howItWorks.step3Title') || 'Confirm Details',
      description:
        t('howItWorks.step3Desc') ||
        'Confirm your delivery time slot and address details',
    },
    {
      number: '04',
      icon: 'truck',
      title: t('howItWorks.step4Title') || 'Enjoy Fresh Food',
      description:
        t('howItWorks.step4Desc') ||
        'Receive your freshly prepared meal at your doorstep',
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-container">
        <div className="how-it-works-header">
          <span className="how-it-works-kicker">
            {t('howItWorks.kicker') || 'Simple process'}
          </span>
          <h2 className="how-it-works-title">
            {t('howItWorks.title') || 'How It Works'}
          </h2>
          <p className="how-it-works-subtitle">
            {t('howItWorks.subtitle') ||
              'Getting your favorite home-cooked meals is just a few steps away'}
          </p>
        </div>

        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <div key={index} className="how-it-works-step">
              <div className="step-content">
                <div className="step-icon">
                  <Icon name={step.icon} aria-hidden="true" />
                </div>
                <div className="step-body">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
