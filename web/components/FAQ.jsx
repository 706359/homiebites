'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
  ];

  const toggleFAQ = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="section-container">
        <h2 className="section-heading">{t('faq.title')}</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={`faq-${index}`}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={(e) => toggleFAQ(index, e)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
