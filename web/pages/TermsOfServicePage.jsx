import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/globals.css";

export default function TermsOfServicePage() {
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
    { id: "section-1", title: "1. Acceptance of Terms" },
    { id: "section-2", title: "2. Description of Service" },
    { id: "section-3", title: "3. Account Registration" },
    { id: "section-4", title: "4. Ordering and Payment" },
    { id: "section-5", title: "5. Delivery Terms" },
    { id: "section-6", title: "6. Food Quality and Safety" },
    { id: "section-7", title: "7. User Conduct" },
    { id: "section-8", title: "8. Intellectual Property" },
    { id: "section-9", title: "9. Limitation of Liability" },
    { id: "section-10", title: "10. Indemnification" },
    { id: "section-11", title: "11. Modifications to Service" },
    { id: "section-12", title: "12. Changes to Terms" },
    { id: "section-13", title: "13. Governing Law" },
    { id: "section-14", title: "14. Severability" },
    { id: "section-15", title: "15. Contact Information" },
  ];

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className="legal-page">
        <div className="legal-container">
          <h1 className="legal-title">Terms of Service</h1>
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
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using HomieBites ("we," "our," or "us") website
                and services, you agree to be bound by these Terms of Service
                and all applicable laws and regulations. If you do not agree
                with any of these terms, you are prohibited from using our
                services.
              </p>
            </section>

            <section id="section-2" className="legal-section">
              <h2>2. Description of Service</h2>
              <p>
                HomieBites provides a tiffin (meal) delivery service offering
                home-cooked vegetarian meals. We deliver to specified areas
                including Panchsheel Greens and nearby locations. Our services
                include:
              </p>
              <ul>
                <li>Daily meal delivery</li>
                <li>Customizable meal options</li>
                <li>Subscription plans</li>
                <li>One-time orders</li>
                <li>Online ordering and payment</li>
              </ul>
            </section>

            <section id="section-3" className="legal-section">
              <h2>3. Account Registration</h2>
              <p>
                To use certain features, you must create an account. You agree
                to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section id="section-4" className="legal-section">
              <h2>4. Ordering and Payment</h2>
              <h3>4.1 Order Placement</h3>
              <ul>
                <li>
                  Orders must be placed at least 1 hour before delivery time
                  (7:30 PM)
                </li>
                <li>We reserve the right to accept or reject any order</li>
                <li>Order confirmation will be sent via WhatsApp or email</li>
                <li>Prices are subject to change without prior notice</li>
              </ul>

              <h3>4.2 Payment Terms</h3>
              <ul>
                <li>
                  We accept Cash on Delivery (COD), UPI, and online payments
                </li>
                <li>Payment is due at the time of delivery for COD orders</li>
                <li>
                  Online payments are processed through secure third-party
                  gateways
                </li>
                <li>
                  All prices are in Indian Rupees (₹) and include applicable
                  taxes
                </li>
              </ul>

              <h3>4.3 Refunds and Cancellations</h3>
              <ul>
                <li>
                  Orders can be cancelled up to 2 hours before delivery time for
                  a full refund
                </li>
                <li>Late cancellations may incur charges</li>
                <li>
                  Refunds for online payments will be processed within 5-7
                  business days
                </li>
                <li>
                  No refunds for delivered orders unless there is a quality
                  issue
                </li>
              </ul>
            </section>

            <section id="section-5" className="legal-section">
              <h2>5. Delivery Terms</h2>
              <ul>
                <li>
                  <strong>Delivery Areas:</strong> We deliver to Panchsheel
                  Greens (A1-A5, B1-B3 Towers) and nearby areas within a 2km
                  radius
                </li>
                <li>
                  <strong>Delivery Time:</strong> Daily between 7:30 PM - 8:30
                  PM
                </li>
                <li>
                  <strong>Delivery Charges:</strong> Free delivery on orders
                  ₹100 and above. ₹20 charge for orders below ₹100
                </li>
                <li>
                  <strong>Self-Pickup:</strong> Available from A1-405,
                  Panchsheel Greens
                </li>
                <li>
                  We are not responsible for delays due to circumstances beyond
                  our control (weather, traffic, etc.)
                </li>
              </ul>
            </section>

            <section id="section-6" className="legal-section">
              <h2>6. Food Quality and Safety</h2>
              <ul>
                <li>
                  All food is prepared fresh daily using quality ingredients
                </li>
                <li>We follow strict hygiene and food safety standards</li>
                <li>All meals are 100% vegetarian</li>
                <li>
                  If you have food allergies or dietary restrictions, please
                  inform us before ordering
                </li>
                <li>
                  We are not liable for allergic reactions if allergens are not
                  disclosed by the customer
                </li>
              </ul>
            </section>

            <section id="section-7" className="legal-section">
              <h2>7. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use our services for any illegal or unauthorized purpose
                </li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Transmit any harmful code, viruses, or malware</li>
                <li>Interfere with or disrupt our services</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm our staff or other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section id="section-8" className="legal-section">
              <h2>8. Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos,
                images, and software, is the property of HomieBites or its
                licensors and is protected by copyright and trademark laws. You
                may not reproduce, distribute, or create derivative works
                without our written permission.
              </p>
            </section>

            <section id="section-9" className="legal-section">
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, HomieBites shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to loss of profits,
                data, or use, arising out of or relating to your use of our
                services.
              </p>
              <p>
                Our total liability for any claims arising from our services
                shall not exceed the amount you paid for the specific order in
                question.
              </p>
            </section>

            <section id="section-10" className="legal-section">
              <h2>10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless HomieBites, its
                officers, directors, employees, and agents from any claims,
                damages, losses, liabilities, and expenses (including legal
                fees) arising out of or relating to your use of our services or
                violation of these terms.
              </p>
            </section>

            <section id="section-11" className="legal-section">
              <h2>11. Modifications to Service</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any
                aspect of our services at any time, with or without notice. We
                shall not be liable to you or any third party for any
                modification, suspension, or discontinuance of services.
              </p>
            </section>

            <section id="section-12" className="legal-section">
              <h2>12. Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. We will
                notify you of any material changes by posting the new terms on
                this page and updating the "Last Updated" date. Your continued
                use of our services after changes constitutes acceptance of the
                updated terms.
              </p>
            </section>

            <section id="section-13" className="legal-section">
              <h2>13. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in
                accordance with the laws of India, without regard to its
                conflict of law provisions. Any disputes arising from these
                terms shall be subject to the exclusive jurisdiction of the
                courts in New Delhi, India.
              </p>
            </section>

            <section id="section-14" className="legal-section">
              <h2>14. Severability</h2>
              <p>
                If any provision of these terms is found to be invalid or
                unenforceable, the remaining provisions shall continue in full
                force and effect.
              </p>
            </section>

            <section id="section-15" className="legal-section">
              <h2>15. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:legal@homiebites.com">legal@homiebites.com</a>
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
