import { useLanguage } from "../contexts/LanguageContext";
import "./About.css";

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <h2 className="section-heading">{t("about.title")}</h2>
        <div className="about-content">
          <p>
            {t("about.description1")} <strong>{t("about.location")}</strong>{" "}
            {t("about.description2")}
          </p>
          <p>{t("about.description3")}</p>
          <p>
            {t("about.description4")} <strong>{t("about.founded")}</strong>{" "}
            {t("about.description5")}
          </p>
        </div>

        <div className="why-choose-section">
          <h3 className="why-choose-heading">
            {t("about.whyChoose") || "Why Choose HomieBites"}
          </h3>
          <p className="why-choose-subtitle">
            {t("about.whyChooseSubtitle") ||
              "Experience the difference with our commitment to quality and freshness"}
          </p>
          <p className="why-choose-intro">
            {t("about.whyChooseIntro") ||
              "At HomieBites, we understand that your daily meals should be more than just food—they should be a source of comfort, nutrition, and joy. Our commitment goes beyond cooking; we create experiences that bring the warmth of home to your table every single day."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
