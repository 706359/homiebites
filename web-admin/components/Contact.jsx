import { useLanguage } from '../contexts/LanguageContext';
import { getFormattedPhone, getPhoneLink, getWhatsAppLink } from '../lib/businessConstants';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id='contact' className='contact-section'>
      <div className='section-container'>
        <div className='contact-header'>
          <span className='contact-kicker'>{t('contact.kicker') || 'Get in touch'}</span>
          <h2 className='contact-title'>{t('contact.title')}</h2>
        </div>

        <div className='contact-primary-actions'>
          <a
            href={getWhatsAppLink()}
            target='_blank'
            rel='noopener noreferrer'
            className='btn btn-primary btn-large contact-action-btn'
          >
            <i className='fa-brands fa-whatsapp'></i> {t('common.orderOnWhatsApp')}
          </a>
          <a href={getPhoneLink()} className='btn btn-secondary btn-large contact-action-btn'>
            <i className='fa-solid fa-phone'></i> {t('common.call')} {getFormattedPhone()}
          </a>
        </div>

        <div className='contact-grid'>
          <div className='contact-item'>
            <h3>
              <i className='fa-brands fa-whatsapp'></i> {t('contact.whatsapp')}
            </h3>
            <p>
              <a href={getWhatsAppLink()} target='_blank' rel='noopener noreferrer'>
                {getFormattedPhone()}
              </a>
            </p>
          </div>
          <div className='contact-item'>
            <h3>
              <i className='fa-solid fa-phone'></i> {t('contact.phone')}
            </h3>
            <p>
              <a href={getPhoneLink()}>{getFormattedPhone()}</a>
            </p>
          </div>
          <div className='contact-item'>
            <h3>
              <i className='fa-solid fa-map-marker-alt'></i> {t('contact.address')}
            </h3>
            <p>{t('contact.addressValue')}</p>
          </div>
          <div className='contact-item'>
            <h3>
              <i className='fa-solid fa-clock'></i> {t('contact.timings')}
            </h3>
            <p>{t('contact.timingsValue')}</p>
          </div>
          <div className='contact-item'>
            <h3>
              <i className='fa-solid fa-truck'></i>{' '}
              {t('contact.deliveryOptions') || 'Delivery Options'}
            </h3>
            <p>
              <strong>
                {t('contact.deliveryPanchsheel') ||
                  'Panchsheel Greens 1: Home delivery & Pickup from Tower A1 lobby'}
              </strong>
              <br />
              <strong>
                {t('contact.deliveryOutside') ||
                  'Outside Panchsheel Greens 1: Delivery at gate only'}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
