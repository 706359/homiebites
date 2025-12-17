import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/globals.css';

export default function FAQPage() {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const faqs = [
    {
      question: t('faq.q1') || 'How do I place an order?',
      answer:
        t('faq.a1') ||
        'You can place an order through our website by adding items to your cart and proceeding to checkout, or contact us directly via WhatsApp.',
    },
    {
      question: t('faq.q2') || 'What are your delivery timings?',
      answer:
        t('faq.a2') ||
        'We deliver daily. Last order time is 7:30 PM, and delivery is completed by 8:30 PM.',
    },
    {
      question: t('faq.q3') || 'What areas do you deliver to?',
      answer:
        t('faq.a3') ||
        'We currently deliver to Panchsheel Greens, A1-A5 Towers, B1-B3 Towers, and nearby societies.',
    },
    {
      question: t('faq.q4') || 'What payment methods do you accept?',
      answer: t('faq.a4') || 'We accept cash on delivery, online payments, and UPI payments.',
    },
    {
      question: t('faq.q5') || 'Can I customize my order?',
      answer:
        t('faq.a5') ||
        'Yes! We offer Mix & Match options where you can choose your preferred combination of sabji, rotis, and rice.',
    },
    {
      question: t('faq.q6') || 'Do you offer subscription plans?',
      answer:
        t('faq.a6') || 'Yes, we offer monthly subscription plans. Contact us for more details.',
    },
    {
      question: t('faq.q7') || 'What if I need to cancel my order?',
      answer:
        t('faq.a7') ||
        'Please contact us at least 2 hours before delivery time to cancel your order.',
    },
    {
      question: t('faq.q8') || 'Is the food vegetarian?',
      answer:
        t('faq.a8') || 'Yes, all our food is 100% vegetarian and prepared with fresh ingredients.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='faq-page'>
        <div className='faq-container'>
          <h1 className='faq-title'>{t('header.faq') || 'Frequently Asked Questions'}</h1>
          <p className='faq-subtitle'>
            {t('faq.subtitle') || 'Find answers to common questions about our service.'}
          </p>

          <div className='faq-list'>
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
                <button className='faq-question' onClick={() => toggleFAQ(index)}>
                  <span>{faq.question}</span>
                  <i className={`fa-solid fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
                </button>
                {openIndex === index && (
                  <div className='faq-answer'>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='faq-contact'>
            <p>{t('faq.stillHaveQuestions') || 'Still have questions?'}</p>
            <a
              href={`https://wa.me/919958983578`}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-whatsapp btn-large'
            >
              <i className='fa-brands fa-whatsapp'></i>
              {t('faq.contactWhatsApp') || 'Contact us on WhatsApp'}
            </a>
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
