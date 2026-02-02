'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import OrderModal from '../../components/OrderModal';
import '../../styles/globals.css';

const LAST_UPDATED = 'January 31, 2026';

export default function TermsOfServicePage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  return (
    <div className="legal-page">
      <Header onOrderClick={openOrderModal} />
      <main id="main-content" tabIndex="-1">
        <div className="legal-hero">
          <h1 className="legal-hero-title">Terms of Service</h1>
          <p className="legal-hero-subtitle">
            HomieBites Premium Tiffin Service
          </p>
          <p className="legal-hero-updated">Last Updated: {LAST_UPDATED}</p>
        </div>
        <div className="legal-content">
          <section>
            <p>
              Welcome to HomieBites! These Terms of Service govern your use of
              our food delivery service. By placing an order with us, you agree
              to be bound by these terms. Please read them carefully.
            </p>
          </section>

          <section>
            <h2>1. Service Description</h2>
            <p>
              HomieBites is a home-based tiffin service operating from A1-405,
              Panchsheel Greens, Noida. We provide freshly prepared, home-cooked
              vegetarian meals for delivery within Panchsheel Greens 1. Our
              service includes breakfast, lunch, and dinner options with
              flexible delivery slots.
            </p>
          </section>

          <section>
            <h2>2. Ordering and Payment</h2>
            <h3>2.1 Order Placement</h3>
            <ul>
              <li>
                Orders must be placed via WhatsApp (+91-9958983578) or phone
                call.
              </li>
              <li>
                Order cutoff times: Breakfast (by 9 PM previous day), Lunch (by
                11 AM same day), Dinner (by 5 PM same day).
              </li>
              <li>
                We reserve the right to refuse orders if capacity is full or
                ingredients are unavailable.
              </li>
            </ul>
            <h3>2.2 Pricing</h3>
            <ul>
              <li>
                All prices are listed in Indian Rupees (INR) and are inclusive
                of taxes.
              </li>
              <li>Prices are subject to change with prior notice.</li>
              <li>
                Subscription discounts apply only to monthly plans paid in
                advance.
              </li>
            </ul>
            <h3>2.3 Payment Terms</h3>
            <ul>
              <li>Payment methods: Cash on Delivery, UPI, Bank Transfer.</li>
              <li>For one-time orders: Payment due upon delivery.</li>
              <li>
                For monthly subscriptions: Full payment required in advance.
              </li>
              <li>Late payments may result in service suspension.</li>
            </ul>
          </section>

          <section>
            <h2>3. Delivery</h2>
            <h3>3.1 Delivery Area</h3>
            <ul>
              <li>We currently deliver only within Panchsheel Greens 1.</li>
              <li>
                Home delivery or pickup from Tower A1 lobby (customer&apos;s
                choice).
              </li>
            </ul>
            <h3>3.2 Delivery Slots</h3>
            <ul>
              <li>Morning: 7:00 AM – 10:00 AM</li>
              <li>Noon: 12:00 PM – 3:00 PM</li>
              <li>Night: 7:00 PM – 9:00 PM</li>
            </ul>
            <h3>3.3 Delivery Charges</h3>
            <ul>
              <li>FREE delivery on orders ₹100 and above.</li>
              <li>₹20 delivery charge for orders below ₹100.</li>
            </ul>
            <h3>3.4 Delivery Delays</h3>
            <p>
              While we strive for punctual delivery, delays may occur due to
              unforeseen circumstances (weather, high order volume, etc.). We
              will notify you of significant delays. We are not liable for minor
              delays within the delivery window.
            </p>
          </section>

          <section>
            <h2>4. Cancellation and Refund Policy</h2>
            <h3>4.1 Customer Cancellation</h3>
            <ul>
              <li>
                Orders can be cancelled up to 2 hours before the scheduled
                delivery slot.
              </li>
              <li>
                Cancellations after food preparation begins will not be eligible
                for refund.
              </li>
              <li>
                For subscription cancellations, minimum 2 days&apos; notice
                required. Unused balance will be refunded proportionately.
              </li>
            </ul>
            <h3>4.2 Our Cancellation Right</h3>
            <p>
              We reserve the right to cancel orders due to ingredient
              unavailability, kitchen emergencies, or force majeure events. Full
              refund will be issued in such cases.
            </p>
            <h3>4.3 Refunds</h3>
            <ul>
              <li>
                Refunds processed within 5–7 business days via the original
                payment method.
              </li>
              <li>
                No refunds for consumed meals unless quality issues are reported
                immediately.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Food Quality and Safety</h2>
            <h3>5.1 Our Commitment</h3>
            <ul>
              <li>
                We are FSSAI registered (Reg. No. 22726446000300) and comply
                with food safety standards.
              </li>
              <li>
                All meals are prepared fresh daily using quality ingredients.
              </li>
              <li>We maintain strict hygiene standards in our kitchen.</li>
            </ul>
            <h3>5.2 Customer Responsibility</h3>
            <ul>
              <li>
                Consume meals within 4 hours of delivery for optimal freshness.
              </li>
              <li>Refrigerate immediately if not consuming right away.</li>
              <li>
                Inform us of any food allergies or dietary restrictions before
                ordering.
              </li>
              <li>
                Inspect meals upon delivery and report issues immediately.
              </li>
            </ul>
            <h3>5.3 Quality Complaints</h3>
            <p>
              If you&apos;re unsatisfied with food quality, contact us within 1
              hour of delivery. We will offer a replacement or credit for future
              orders. Take photos of the food if possible to help us improve.
            </p>
          </section>

          <section>
            <h2>6. Subscription Terms</h2>
            <ul>
              <li>
                Monthly subscriptions are for 30 consecutive days from the start
                date.
              </li>
              <li>7% discount applies to all subscription plans.</li>
              <li>
                Subscribers can pause service for up to 5 days per month with
                prior notice.
              </li>
              <li>
                Subscriptions auto-renew unless cancelled 2 days before the end
                date.
              </li>
              <li>
                No partial refunds for early subscription termination (except in
                case of relocation or medical emergencies).
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, HomieBites shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from use of our service. Our total liability for
              any claim shall not exceed the amount paid for the specific order
              in question.
            </p>
            <p>We are not responsible for:</p>
            <ul>
              <li>Allergic reactions not disclosed to us prior to ordering</li>
              <li>
                Food quality issues not reported within 1 hour of delivery
              </li>
              <li>Delays caused by incorrect delivery addresses</li>
              <li>Unavailability to receive delivery during scheduled slot</li>
            </ul>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>
              All content on our website, including text, images, logos, and
              recipes, is the property of HomieBites and protected by copyright
              laws. You may not reproduce, distribute, or use our content
              without written permission.
            </p>
          </section>

          <section>
            <h2>9. User Conduct</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate delivery information</li>
              <li>Treat our delivery staff with respect</li>
              <li>Make timely payments</li>
              <li>Not misuse or abuse our service</li>
            </ul>
            <p>
              We reserve the right to refuse service to customers who violate
              these terms or engage in abusive behavior.
            </p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of India. Any
              disputes shall be subject to the exclusive jurisdiction of the
              courts in Noida, Uttar Pradesh.
            </p>
          </section>

          <section>
            <h2>11. Changes to Terms</h2>
            <p>
              We may modify these Terms of Service at any time. Changes will be
              posted on our website with an updated date. Continued use of our
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>For questions about these Terms of Service:</p>
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
