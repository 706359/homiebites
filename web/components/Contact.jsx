import { useLanguage } from "../contexts/LanguageContext";
import "./Contact.css";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <h2 className="section-heading">{t("contact.title")}</h2>
        <div className="contact-grid">
          <div className="contact-item">
            <h3>{t("contact.phone")}</h3>
            <p>
              {t("contact.callWhatsApp")}{" "}
              <a href="tel:+919958983578">+91-9958983578</a>
            </p>
          </div>
          <div className="contact-item">
            <h3>{t("contact.address")}</h3>
            <p>{t("contact.addressValue")}</p>
          </div>
          <div className="contact-item">
            <h3>{t("contact.timings")}</h3>
            <p>{t("contact.timingsValue")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
