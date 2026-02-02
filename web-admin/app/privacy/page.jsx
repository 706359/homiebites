'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import '../../styles/globals.css';

const LAST_UPDATED = 'January 31, 2026';

export default function PrivacyPolicyPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <div className="legal-page">
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <div className="legal-hero">
          <h1 className="legal-hero-title">Privacy Policy</h1>
          <p className="legal-hero-subtitle">HomieBites Premium Tiffin Service</p>
          <p className="legal-hero-updated">Last Updated: {LAST_UPDATED}</p>
        </div>
        <div className="legal-content">
          <section>
            <p>
              At HomieBites, we respect your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard your data when you use our
              tiffin service.
            </p>
          </section>

          <section>
            <h2>1. Information We Collect</h2>
            <h3>1.1 Personal Information</h3>
            <p>When you place an order with HomieBites, we collect:</p>
            <ul>
              <li>Name and contact details (phone number, WhatsApp number)</li>
              <li>Delivery address (building, tower, flat number)</li>
              <li>Dietary preferences and restrictions</li>
              <li>Order history and meal preferences</li>
              <li>Payment information (UPI IDs, transaction details)</li>
            </ul>
            <h3>1.2 Usage Information</h3>
            <p>
              We may collect information about how you interact with our
              website, including your IP address, browser type, pages visited,
              and time spent on our site. This helps us improve our service and
              user experience.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and deliver your food orders</li>
              <li>
                Communicate with you about orders, delivery updates, and service
                changes
              </li>
              <li>Customize meals based on your dietary preferences</li>
              <li>
                Send you daily menu updates and promotional offers (with your
                consent)
              </li>
              <li>Improve our service quality and customer experience</li>
              <li>Process payments and maintain financial records</li>
              <li>Comply with legal obligations (FSSAI regulations, tax requirements)</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              We do <strong>NOT</strong> sell, rent, or trade your personal
              information to third parties. Your data may be shared only in the
              following limited circumstances:
            </p>
            <ul>
              <li>
                <strong>Delivery Personnel:</strong> We share your name, address,
                and contact number with our delivery staff to ensure timely
                delivery.
              </li>
              <li>
                <strong>Payment Processors:</strong> If you pay via UPI or online
                banking, your payment details are processed through secure
                third-party payment gateways.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information
                if required by law or in response to valid legal requests from
                authorities.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the unlikely event of a
                sale or merger, your information may be transferred to the new
                owner.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information
              from unauthorized access, loss, or misuse. However, no method of
              transmission over the internet or electronic storage is 100%
              secure. While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this Privacy Policy, or as
              required by law. Order history may be kept for up to 2 years for
              accounting and tax purposes. You may request deletion of your data
              at any time by contacting us.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of the personal
                information we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Update or correct any inaccurate
                information.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal data
                (subject to legal retention requirements).
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from promotional messages
                by replying &apos;STOP&apos; to our WhatsApp broadcasts.
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Withdraw consent for data
                processing at any time (may affect service delivery).
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at +91-9958983578 or
              visit us at A1-405, Panchsheel Greens.
            </p>
          </section>

          <section>
            <h2>7. Cookies and Tracking</h2>
            <p>
              Our website may use cookies and similar tracking technologies to
              enhance your browsing experience. You can disable cookies in your
              browser settings, though this may affect website functionality.
            </p>
          </section>

          <section>
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party services (such as
              payment gateways or social media). We are not responsible for the
              privacy practices of these external sites. We encourage you to read
              their privacy policies.
            </p>
          </section>

          <section>
            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under 18 years of age. We
              do not knowingly collect personal information from minors. If you
              believe a child has provided us with information, please contact
              us immediately.
            </p>
          </section>

          <section>
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated &apos;Last Updated&apos;
              date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us:
            </p>
            <ul className="legal-contact-list">
              <li>
                <strong>HomieBites Premium Tiffin Service</strong>
              </li>
              <li>Address: A1-405, Panchsheel Greens, Noida</li>
              <li>Phone/WhatsApp: +91-9958983578</li>
              <li>Website: https://homiebites.com</li>
              <li>FSSAI Registration: 22726446000300</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
