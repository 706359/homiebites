'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/globals.css';

export default function LegalDisclaimerPage() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <div className="page-layout">
      <Header onOrderClick={openOrderModal} />
      <main className="page-main" id="main-content" tabIndex="-1">
        <div className="page-content">
          <h1>Legal Disclaimer</h1>
          <p className="page-content__updated">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2>1. General Information</h2>
            <p>
              HomieBites is a local kitchen operation, not a registered
              restaurant or firm. The information contained on HomieBites
              website and services is for general information purposes only.
              While we endeavor to keep the information up to date and correct,
              we make no representations or warranties of any kind, express or
              implied, about the completeness, accuracy, reliability,
              suitability, or availability of the information, products,
              services, or related graphics contained on the website.
            </p>
          </section>

          <section>
            <h2>2. Food Safety and Allergies</h2>
            <p>
              As a local kitchen operation, we take food safety seriously.
              However, customers with food allergies or dietary restrictions
              should exercise extreme caution. We cannot guarantee that our food
              products are free from allergens or that cross-contamination will
              not occur. Customers with severe allergies should consult with us
              before placing an order, and we recommend that individuals with
              serious food allergies consider alternative options.
            </p>
          </section>

          <section>
            <h2>3. Nutritional Information</h2>
            <p>
              Nutritional information provided, if any, is approximate and may
              vary. We are not responsible for any discrepancies in nutritional
              information. Customers with specific dietary requirements should
              verify information before consumption.
            </p>
          </section>

          <section>
            <h2>4. Product Availability</h2>
            <p>
              Product availability is subject to change without notice. We
              reserve the right to discontinue any product or service at any
              time. We are not liable for any unavailability of products or
              services.
            </p>
          </section>

          <section>
            <h2>5. Pricing and Payment</h2>
            <p>
              All prices are subject to change without notice. While we strive
              for accuracy, pricing errors may occur. We reserve the right to
              correct any errors and refuse or cancel orders placed at incorrect
              prices.
            </p>
          </section>

          <section>
            <h2>6. External Links</h2>
            <p>
              Our website may contain links to external websites. We have no
              control over the nature, content, and availability of those sites.
              The inclusion of any links does not necessarily imply a
              recommendation or endorse the views expressed within them.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event will HomieBites be liable for any loss or damage
              including, without limitation, indirect or consequential loss or
              damage, or any loss or damage whatsoever arising from loss of data
              or profits arising out of, or in connection with, the use of our
              website or services.
            </p>
          </section>

          <section>
            <h2>8. Jurisdiction</h2>
            <p>
              These disclaimers are governed by the laws of the jurisdiction in
              which HomieBites operates. Any disputes arising from these terms
              shall be subject to the exclusive jurisdiction of the courts in
              that jurisdiction.
            </p>
          </section>

          <section>
            <h2>9. Updates to Disclaimer</h2>
            <p>
              We reserve the right to update this disclaimer at any time. Users
              are encouraged to review this page periodically for any changes.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              If you have any questions about this Legal Disclaimer, please
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
