import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/globals.css";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  // Handle smooth scroll with header offset
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "section-1", title: "1. Introduction" },
    { id: "section-2", title: "2. Information We Collect" },
    { id: "section-3", title: "3. How We Use Your Information" },
    { id: "section-4", title: "4. Information Sharing and Disclosure" },
    { id: "section-5", title: "5. Data Security" },
    { id: "section-6", title: "6. Your Rights" },
    { id: "section-7", title: "7. Cookies and Tracking Technologies" },
    { id: "section-8", title: "8. Third-Party Links" },
    { id: "section-9", title: "9. Children's Privacy" },
    { id: "section-10", title: "10. Data Retention" },
    { id: "section-11", title: "11. Changes to This Privacy Policy" },
    { id: "section-12", title: "12. Contact Us" },
  ];

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className="legal-page">
        <div className="legal-container">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-last-updated">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          {/* Table of Contents */}
          <div className="legal-toc">
            <h3>Table of Contents</h3>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="legal-content">
            <section id="section-1" className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to HomieBites ("we," "our," or "us"). We are committed
                to protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our website and services.
              </p>
            </section>

            <section id="section-2" className="legal-section">
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>Name and contact information (email, phone number)</li>
                <li>Delivery address and location data</li>
                <li>
                  Payment information (processed securely through third-party
                  providers)
                </li>
                <li>Order history and preferences</li>
                <li>Account credentials (password, stored securely)</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <p>We may automatically collect:</p>
              <ul>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section id="section-3" className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul>
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your orders and account</li>
                <li>
                  To send promotional offers and newsletters (with your consent)
                </li>
                <li>To improve our services and user experience</li>
                <li>To prevent fraud and ensure security</li>
                <li>To comply with legal obligations</li>
                <li>To analyze usage patterns and trends</li>
              </ul>
            </section>

            <section id="section-4" className="legal-section">
              <h2>4. Information Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who
                  help us operate our business (payment processors, delivery
                  partners, email services)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly
                  authorize us to share your information
                </li>
              </ul>
            </section>

            <section id="section-5" className="legal-section">
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section id="section-6" className="legal-section">
              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Request data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@homiebites.com">
                  privacy@homiebites.com
                </a>{" "}
                or{" "}
                <a href="https://wa.me/919958983578">
                  WhatsApp: +91-9958983578
                </a>
                .
              </p>
            </section>

            <section id="section-7" className="legal-section">
              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing
                experience, analyze site traffic, and personalize content. You
                can control cookies through your browser settings, but disabling
                cookies may limit certain features of our website.
              </p>
            </section>

            <section id="section-8" className="legal-section">
              <h2>8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section id="section-9" className="legal-section">
              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personal information from
                children. If you believe we have collected information from a
                child, please contact us immediately.
              </p>
            </section>

            <section id="section-10" className="legal-section">
              <h2>10. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required by law. When we no longer need your
                information, we will securely delete or anonymize it.
              </p>
            </section>

            <section id="section-11" className="legal-section">
              <h2>11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last Updated" date. Your continued
                use of our services after changes constitutes acceptance of the
                updated policy.
              </p>
            </section>

            <section id="section-12" className="legal-section">
              <h2>12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <ul>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@homiebites.com">
                    privacy@homiebites.com
                  </a>
                </li>
                <li>
                  <strong>Phone/WhatsApp:</strong>{" "}
                  <a href="https://wa.me/919958983578">+91-9958983578</a>
                </li>
                <li>
                  <strong>Address:</strong> Panchsheel Greens, New Delhi, India
                </li>
              </ul>
            </section>
          </div>

          {/* Back to Top Button */}
          {showBackToTop && (
            <button
              className="legal-back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          )}
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
