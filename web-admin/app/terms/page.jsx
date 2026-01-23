'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/globals.css';

export default function TermsOfServicePage() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <div className="legal-page">
          <div className="legal-container">
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

            <section className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                HomieBites is a local kitchen operation, not a registered restaurant or firm. By
                accessing and using HomieBites services, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to these terms, please
                do not use our services.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Use of Service</h2>
              <p>You agree to use our service only for lawful purposes and in accordance with these Terms of Service.</p>
              <p>You agree not to:</p>
              <ul>
                <li>Use the service in any way that violates any applicable law or regulation</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Orders and Payment</h2>
              <ul>
                <li>
                  All orders are subject to acceptance and availability. We reserve the right to
                  refuse or cancel any order.
                </li>
                <li>
                  Prices are subject to change without notice. The price charged will be the price
                  in effect at the time of order confirmation.
                </li>
                <li>
                  Payment must be made at the time of order or as agreed upon for delivery.
                </li>
                <li>
                  We accept cash on delivery and online payment methods as available.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Delivery</h2>
              <ul>
                <li>
                  Delivery times are estimates and not guaranteed. We are not liable for delays
                  caused by circumstances beyond our control.
                </li>
                <li>
                  You are responsible for providing accurate delivery address information.
                </li>
                <li>
                  If delivery cannot be completed due to incorrect address or unavailability, you
                  may be charged additional fees.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Cancellation and Refunds</h2>
              <ul>
                <li>
                  Orders may be cancelled before preparation begins. Once preparation has started,
                  cancellation may not be possible.
                </li>
                <li>
                  Refunds, if applicable, will be processed according to our refund policy.
                </li>
                <li>
                  We reserve the right to refuse refunds for orders that have been delivered and
                  consumed.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos, and images, is the
                property of HomieBites and is protected by copyright and other intellectual property
                laws.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, HomieBites shall not be liable for any
                indirect, incidental, special, or consequential damages arising from your use of our
                services.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of our
                services after changes are posted constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through our website
                or customer service channels.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}
