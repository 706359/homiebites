'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import '../../styles/globals.css';

const LAST_UPDATED = 'January 31, 2026';

export default function LegalDisclaimerPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  return (
    <div className="legal-page">
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <div className="legal-hero">
          <h1 className="legal-hero-title">Disclaimer</h1>
          <p className="legal-hero-subtitle">
            HomieBites Premium Tiffin Service
          </p>
          <p className="legal-hero-updated">Last Updated: {LAST_UPDATED}</p>
        </div>
        <div className="legal-content">
          <section>
            <p>
              This disclaimer outlines important information about
              HomieBites&apos; food service. Please read carefully before
              placing an order.
            </p>
          </section>

          <section>
            <h2>1. General Information</h2>
            <p>
              The information provided on the HomieBites website
              (https://homiebites.com) is for general informational purposes
              only. While we strive to ensure accuracy, we make no warranties or
              representations about the completeness, reliability, or accuracy
              of this information.
            </p>
          </section>

          <section>
            <h2>2. Food Service Disclaimer</h2>
            <h3>2.1 Home-Based Kitchen</h3>
            <p>
              HomieBites operates from a residential home kitchen (A1-405,
              Panchsheel Greens). While we maintain high standards of hygiene
              and are FSSAI registered, our facility is not a commercial
              restaurant or cloud kitchen. By ordering from us, you acknowledge
              and accept this operational model.
            </p>
            <h3>2.2 Food Allergies and Dietary Restrictions</h3>
            <p>
              <strong>IMPORTANT:</strong> If you have food allergies,
              intolerances, or specific dietary restrictions, you MUST inform us
              before placing your order. While we will make every effort to
              accommodate your needs, we cannot guarantee complete elimination
              of allergen cross-contamination in our home kitchen environment.
            </p>
            <p>Common allergens that may be present in our kitchen include:</p>
            <ul>
              <li>Nuts (peanuts, cashews, almonds)</li>
              <li>Dairy products (milk, ghee, paneer, curd)</li>
              <li>Gluten (wheat flour in rotis and parathas)</li>
              <li>Soy products</li>
            </ul>
            <p>
              If you have severe allergies, please consult with us before
              ordering. We recommend having your EpiPen or emergency medication
              available. HomieBites is not liable for allergic reactions
              resulting from undisclosed allergies or cross-contamination.
            </p>
            <h3>2.3 Nutritional Information</h3>
            <p>
              Nutritional information provided on our website is approximate and
              based on standard recipes. Actual nutritional content may vary
              based on ingredient sourcing, portion sizes, and preparation
              methods. This information should not be used as the sole basis for
              dietary or medical decisions.
            </p>
            <h3>2.4 Menu Variations</h3>
            <p>
              Daily menus are subject to change based on ingredient
              availability, seasonal variations, and kitchen capacity. We
              reserve the right to substitute menu items with comparable
              alternatives. Specific dish requests cannot always be guaranteed.
            </p>
          </section>

          <section>
            <h2>3. Health and Medical Disclaimer</h2>
            <h3>3.1 Not Medical Advice</h3>
            <p>
              Any health-related information or claims on our website are for
              general informational purposes only and do not constitute medical
              advice. Claims about our food being &quot;healthy,&quot;
              &quot;low-oil,&quot; or suitable for specific diets are subjective
              and not evaluated by medical professionals.
            </p>
            <p>
              If you have specific health conditions (diabetes, hypertension,
              heart disease, digestive disorders, etc.), consult your doctor or
              registered dietitian before making dietary changes or relying on
              our meals as part of a medical treatment plan.
            </p>
            <h3>3.2 Weight Loss Claims</h3>
            <p>
              While our meals are prepared with minimal oil and balanced
              nutrition, we do not guarantee weight loss results. Individual
              results depend on multiple factors including overall caloric
              intake, exercise, metabolism, and genetics. Consult a certified
              nutritionist for personalized weight management advice.
            </p>
          </section>

          <section>
            <h2>4. Service Limitations</h2>
            <h3>4.1 Limited Capacity</h3>
            <p>
              As a home-based operation, we have limited daily capacity. We may
              not be able to accept all orders, especially during high-demand
              periods. Orders are confirmed on a first-come, first-served basis.
            </p>
            <h3>4.2 Delivery Area</h3>
            <p>
              Our delivery service is currently limited to Panchsheel Greens 1
              only. We cannot guarantee expansion to other areas.
            </p>
            <h3>4.3 Service Interruptions</h3>
            <p>
              Our service may be temporarily suspended due to personal
              emergencies, illness, festivals, kitchen maintenance, or force
              majeure events. We will make reasonable efforts to notify
              customers in advance, but cannot guarantee uninterrupted service.
            </p>
          </section>

          <section>
            <h2>5. Website and Technology Disclaimer</h2>
            <h3>5.1 Website Accuracy</h3>
            <p>
              While we strive to keep our website information current and
              accurate, errors may occur. Prices, menu items, and service
              details are subject to change without notice. We are not
              responsible for typographical errors or technical glitches on our
              website.
            </p>
            <h3>5.2 Third-Party Links</h3>
            <p>
              Our website may contain links to third-party websites or services
              (payment gateways, social media, etc.). We are not responsible for
              the content, accuracy, or practices of these external sites. Use
              them at your own risk.
            </p>
            <h3>5.3 Data Security</h3>
            <p>
              While we implement reasonable security measures, we cannot
              guarantee absolute security of data transmitted over the internet.
              You accept the inherent risks of online communication and
              transactions.
            </p>
          </section>

          <section>
            <h2>6. Liability Limitations</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul>
              <li>
                HomieBites provides food &quot;as is&quot; without warranties of
                any kind, express or implied.
              </li>
              <li>
                We are not liable for indirect, consequential, or incidental
                damages arising from use of our service.
              </li>
              <li>
                Our maximum liability for any claim shall not exceed the amount
                paid for the specific order in question.
              </li>
              <li>
                We are not responsible for health issues, allergic reactions, or
                food-borne illness unless directly caused by our gross
                negligence.
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Testimonials and Reviews</h2>
            <p>
              Customer testimonials and reviews displayed on our website
              represent individual experiences and may not reflect typical
              results. Individual satisfaction with our food may vary based on
              personal taste preferences and expectations.
            </p>
          </section>

          <section>
            <h2>8. Professional Advice</h2>
            <p>
              Nothing on our website should be construed as professional
              dietary, nutritional, or medical advice. Always seek the guidance
              of qualified health professionals regarding any questions you may
              have about your diet or health conditions.
            </p>
          </section>

          <section>
            <h2>9. No Guarantee of Results</h2>
            <p>
              We cannot guarantee specific health outcomes, weight loss results,
              or improvement in medical conditions from consuming our meals.
              Results vary based on individual circumstances, overall lifestyle,
              and adherence to a balanced diet.
            </p>
          </section>

          <section>
            <h2>10. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time.
              Changes will be posted on our website with an updated date. Your
              continued use of our service after changes constitutes acceptance
              of the modified disclaimer.
            </p>
          </section>

          <section>
            <h2>11. Acknowledgment</h2>
            <p>
              BY PLACING AN ORDER WITH HOMIEBITES, YOU ACKNOWLEDGE THAT YOU HAVE
              READ, UNDERSTOOD, AND AGREE TO THIS DISCLAIMER. IF YOU DO NOT
              AGREE, PLEASE DO NOT USE OUR SERVICE.
            </p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>For questions or concerns about this disclaimer:</p>
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
      <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />
    </div>
  );
}
