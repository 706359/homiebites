'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/globals.css';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
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
          <p className="legal-hero-updated">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to HomieBites. HomieBites is a local kitchen operation,
              not a registered restaurant or firm. We respect your privacy and
              are committed to protecting your personal data. This privacy
              policy explains how we collect, use, and safeguard your
              information when you use our services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and delivery address when you place an order
              </li>
              <li>
                <strong>Order Information:</strong> Details about your orders,
                including items ordered, quantities, and payment information
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our website, including IP address, browser type, and pages
                visited
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To process and fulfill your orders</li>
              <li>
                To communicate with you about your orders and our services
              </li>
              <li>To improve our website and services</li>
              <li>
                To send you promotional offers and updates (with your consent)
              </li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>5. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul>
              <li>
                With service providers who assist us in operating our business
              </li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              We use cookies to enhance your experience on our website. You can
              control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us through our website or customer service channels.
            </p>
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
