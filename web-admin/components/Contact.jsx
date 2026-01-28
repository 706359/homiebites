import { useLanguage } from '../contexts/LanguageContext';
import {
  getFormattedPhone,
  getPhoneLink,
  getWhatsAppLink,
} from '../lib/businessConstants';
import './Contact.css';
import Icon from './ui/Icon.jsx';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="contact-header">
          <span className="contact-kicker">
            {t('contact.kicker') || 'Get in touch'}
          </span>
          <h2 className="contact-title">{t('contact.title')}</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-item">
            <h3>
              <Icon name="whatsapp" /> {t('contact.whatsapp')}
            </h3>
            <p>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getFormattedPhone()}
              </a>
            </p>
          </div>
          <div className="contact-item">
            <h3>
              <Icon name="phone" /> {t('contact.phone')}
            </h3>
            <p>
              <a href={getPhoneLink()}>{getFormattedPhone()}</a>
            </p>
          </div>
          <div className="contact-item">
            <h3>
              <Icon name="map-marker-alt" /> {t('contact.address')}
            </h3>
            <p>{t('contact.addressValue')}</p>
          </div>
          <div className="contact-item">
            <h3>
              <Icon name="clock" /> {t('contact.timings')}
            </h3>
            <div className="contact-timings">
              <div className="timing-row">
                <span className="timing-label">Morning</span>
                <span className="timing-value">7–10 AM</span>
              </div>
              <div className="timing-row">
                <span className="timing-label">Noon</span>
                <span className="timing-value">12–3 PM</span>
              </div>
              <div className="timing-row">
                <span className="timing-label">Night</span>
                <span className="timing-value">7–9 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
