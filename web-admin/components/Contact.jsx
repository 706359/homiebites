import { useLanguage } from "../contexts/LanguageContext";
import "./Contact.css";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <h2 className="section-heading">{t("contact.title")}</h2>
        
        {/* Primary Order Options */}
        <div className="contact-primary-actions">
          <a 
            href="https://wa.me/919958983578" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary btn-large contact-action-btn"
          >
            <i className="fa-brands fa-whatsapp"></i> Order on WhatsApp
          </a>
          <a 
            href="tel:+919958983578" 
            className="btn btn-secondary btn-large contact-action-btn"
          >
            <i className="fa-solid fa-phone"></i> Call +91-9958983578
          </a>
        </div>

        <div className="contact-grid">
          <div className="contact-item">
            <h3><i className="fa-brands fa-whatsapp"></i> WhatsApp</h3>
            <p>
              <a href="https://wa.me/919958983578" target="_blank" rel="noopener noreferrer">+91-9958983578</a>
            </p>
          </div>
          <div className="contact-item">
            <h3><i className="fa-solid fa-phone"></i> Phone</h3>
            <p>
              <a href="tel:+919958983578">+91-9958983578</a>
            </p>
          </div>
          <div className="contact-item">
            <h3><i className="fa-solid fa-map-marker-alt"></i> Address</h3>
            <p>{t("contact.addressValue")}</p>
          </div>
          <div className="contact-item">
            <h3><i className="fa-solid fa-clock"></i> {t("contact.timings")}</h3>
            <p>{t("contact.timingsValue")}</p>
          </div>
          <div className="contact-item">
            <h3><i className="fa-solid fa-truck"></i> {t("contact.deliveryOptions") || "Delivery Options"}</h3>
            <p>
              <strong>{t("contact.deliveryPanchsheel") || "Panchsheel Greens 1: Home delivery & Pickup from Tower A1 lobby"}</strong><br/>
              <strong>{t("contact.deliveryOutside") || "Outside Panchsheel Greens 1: Delivery at gate only"}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
