import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/globals.css';

export default function LegalDisclaimerPage() {
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
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'section-1', title: '1. General Disclaimer' },
    { id: 'section-2', title: '2. Food Safety Disclaimer' },
    { id: 'section-3', title: '3. Delivery Disclaimer' },
    { id: 'section-4', title: '4. Nutritional Information Disclaimer' },
    { id: 'section-5', title: '5. Website Availability Disclaimer' },
    { id: 'section-6', title: '6. Third-Party Services Disclaimer' },
    { id: 'section-7', title: '7. Price and Availability Disclaimer' },
    { id: 'section-8', title: '8. User-Generated Content Disclaimer' },
    { id: 'section-9', title: '9. Limitation of Liability' },
    { id: 'section-10', title: '10. Medical Disclaimer' },
    { id: 'section-11', title: '11. Force Majeure' },
    { id: 'section-12', title: '12. Contact for Disclaimers' },
  ];

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='legal-page'>
        <div className='legal-container'>
          <h1 className='legal-title'>Legal Disclaimers</h1>
          <p className='legal-last-updated'>Last Updated: {new Date().toLocaleDateString()}</p>

          {/* Table of Contents */}
          <div className='legal-toc'>
            <h3>Table of Contents</h3>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} onClick={(e) => scrollToSection(e, section.id)}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className='legal-content'>
            <section id='section-1' className='legal-section'>
              <h2>1. General Disclaimer</h2>
              <p>
                The information on this website is provided on an "as is" basis. HomieBites makes no
                representations or warranties of any kind, express or implied, about the
                completeness, accuracy, reliability, suitability, or availability of the
                information, products, services, or related graphics contained on this website for
                any purpose.
              </p>
            </section>

            <section id='section-2' className='legal-section'>
              <h2>2. Food Safety Disclaimer</h2>
              <p>
                While we take every precaution to ensure food safety and hygiene, HomieBites cannot
                guarantee that our food products are free from allergens, contaminants, or other
                substances that may cause adverse reactions. Customers with food allergies, dietary
                restrictions, or medical conditions should:
              </p>
              <ul>
                <li>Carefully review ingredient information before ordering</li>
                <li>Inform us of any allergies or dietary restrictions</li>
                <li>Consult with a healthcare professional if uncertain</li>
                <li>Consume our products at their own risk</li>
              </ul>
              <p>
                HomieBites shall not be liable for any allergic reactions, foodborne illnesses, or
                health issues arising from the consumption of our products, except where such issues
                result directly from our negligence or failure to follow food safety standards.
              </p>
            </section>

            <section id='section-3' className='legal-section'>
              <h2>3. Delivery Disclaimer</h2>
              <p>
                HomieBites strives to deliver orders within the specified time window (7:30 PM -
                8:30 PM). However, we are not responsible for delays caused by:
              </p>
              <ul>
                <li>Traffic conditions or road closures</li>
                <li>Weather conditions or natural disasters</li>
                <li>Incorrect or incomplete delivery addresses</li>
                <li>Customer unavailability at the delivery location</li>
                <li>Force majeure events beyond our control</li>
              </ul>
              <p>
                We will make reasonable efforts to notify customers of delays and work to resolve
                delivery issues promptly.
              </p>
            </section>

            <section id='section-4' className='legal-section'>
              <h2>4. Nutritional Information Disclaimer</h2>
              <p>
                Nutritional information provided on our website or in communications is approximate
                and based on standard recipes and ingredients. Actual nutritional values may vary
                based on:
              </p>
              <ul>
                <li>Variations in ingredient sources</li>
                <li>Preparation methods</li>
                <li>Portion sizes</li>
                <li>Customizations requested by customers</li>
              </ul>
              <p>
                This information is provided for general guidance only and should not be considered
                medical or dietary advice. Customers with specific nutritional needs should consult
                with healthcare professionals.
              </p>
            </section>

            <section id='section-5' className='legal-section'>
              <h2>5. Website Availability Disclaimer</h2>
              <p>
                While we strive to keep our website accessible and operational, HomieBites does not
                guarantee uninterrupted or error-free access. The website may be temporarily
                unavailable due to:
              </p>
              <ul>
                <li>Technical maintenance or updates</li>
                <li>Server issues or downtime</li>
                <li>Internet connectivity problems</li>
                <li>Cyber attacks or security breaches</li>
              </ul>
              <p>
                We are not liable for any losses or damages resulting from website unavailability.
              </p>
            </section>

            <section id='section-6' className='legal-section'>
              <h2>6. Third-Party Services Disclaimer</h2>
              <p>Our website and services may integrate with third-party services, including:</p>
              <ul>
                <li>Payment processors</li>
                <li>Delivery partners</li>
                <li>Communication platforms (WhatsApp, email services)</li>
                <li>Analytics and tracking tools</li>
              </ul>
              <p>
                HomieBites is not responsible for the availability, accuracy, or practices of these
                third-party services. Your use of third-party services is subject to their
                respective terms and conditions and privacy policies.
              </p>
            </section>

            <section id='section-7' className='legal-section'>
              <h2>7. Price and Availability Disclaimer</h2>
              <p>
                Prices displayed on our website are subject to change without notice. We reserve the
                right to:
              </p>
              <ul>
                <li>Modify prices at any time</li>
                <li>Limit quantities of items available for purchase</li>
                <li>Discontinue products or services</li>
                <li>Refuse or cancel orders at our discretion</li>
              </ul>
              <p>
                While we make every effort to ensure accurate pricing, errors may occur. We reserve
                the right to correct pricing errors and cancel orders placed at incorrect prices.
              </p>
            </section>

            <section id='section-8' className='legal-section'>
              <h2>8. User-Generated Content Disclaimer</h2>
              <p>
                Our website may allow users to submit reviews, comments, or other content.
                HomieBites does not endorse or assume responsibility for user-generated content. We
                reserve the right to:
              </p>
              <ul>
                <li>Moderate, edit, or remove user content</li>
                <li>Block users who violate our policies</li>
                <li>Use user content for promotional purposes (with attribution)</li>
              </ul>
            </section>

            <section id='section-9' className='legal-section'>
              <h2>9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, HomieBites, its officers, directors,
                employees, agents, and affiliates shall not be liable for any direct, indirect,
                incidental, special, consequential, or punitive damages, including but not limited
                to:
              </p>
              <ul>
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Loss of data or information</li>
                <li>Personal injury or property damage</li>
                <li>Emotional distress or inconvenience</li>
              </ul>
              <p>
                This limitation applies regardless of the theory of liability (contract, tort,
                negligence, strict liability, or otherwise) and even if we have been advised of the
                possibility of such damages.
              </p>
            </section>

            <section id='section-10' className='legal-section'>
              <h2>10. Medical Disclaimer</h2>
              <p>
                The information provided by HomieBites, including nutritional information and
                dietary guidance, is for general informational purposes only and is not intended as
                medical advice, diagnosis, or treatment. Always seek the advice of qualified health
                professionals regarding any medical condition or dietary concerns.
              </p>
              <p>
                Do not disregard professional medical advice or delay seeking it because of
                information obtained from our website or services.
              </p>
            </section>

            <section id='section-11' className='legal-section'>
              <h2>11. Force Majeure</h2>
              <p>
                HomieBites shall not be liable for any failure or delay in performance under these
                terms resulting from acts beyond our reasonable control, including but not limited
                to:
              </p>
              <ul>
                <li>Natural disasters, pandemics, or epidemics</li>
                <li>War, terrorism, or civil unrest</li>
                <li>Government actions or regulations</li>
                <li>Labor strikes or disputes</li>
                <li>Supply chain disruptions</li>
                <li>Internet or telecommunications failures</li>
              </ul>
            </section>

            <section id='section-12' className='legal-section'>
              <h2>12. Contact for Disclaimers</h2>
              <p>If you have questions about these disclaimers, please contact us:</p>
              <ul>
                <li>
                  <strong>Email:</strong>{' '}
                  <a href='mailto:legal@homiebites.com'>legal@homiebites.com</a>
                </li>
                <li>
                  <strong>Phone/WhatsApp:</strong>{' '}
                  <a href='https://wa.me/919958983578'>+91-9958983578</a>
                </li>
                <li>
                  <strong>Address:</strong> Panchsheel Greens, New Delhi, India
                </li>
              </ul>
            </section>
          </div>

          {/* Back to Top Button */}
          {showBackToTop && (
            <button className='legal-back-to-top' onClick={scrollToTop} aria-label='Back to top'>
              <i className='fa-solid fa-arrow-up'></i>
            </button>
          )}
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
