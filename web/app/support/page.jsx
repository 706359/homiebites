'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/globals.css';

export default function SupportPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  const supportCategories = [
    {
      id: 'ordering',
      title: t('support.ordering.title') || 'How to Order',
      icon: 'fa-shopping-cart',
      description:
        t('support.ordering.description') || 'Everything you need to know about placing orders',
      items: [
        {
          question: t('support.ordering.item1') || 'How to place an order?',
          answer:
            t('support.ordering.answer1') ||
            'You can place an order via WhatsApp (+91-9958983578), through our website menu page, or by calling us. Orders should be placed at least 1 hour before delivery time (7:30 PM).',
        },
        {
          question: t('support.ordering.item2') || 'Payment methods',
          answer:
            t('support.ordering.answer2') ||
            'We accept Cash on Delivery (COD), UPI payments, and online transfers. Payment can be made at the time of delivery or in advance.',
        },
        {
          question: t('support.ordering.item3') || 'Can I modify or cancel my order?',
          answer:
            t('support.ordering.answer3') ||
            'Yes, you can modify or cancel your order by contacting us via WhatsApp or phone at least 30 minutes before the delivery time.',
        },
        {
          question: t('support.ordering.item4') || 'Order tracking',
          answer:
            t('support.ordering.answer4') ||
            'Once your order is confirmed, you will receive a confirmation message. You can track your order status through your account or contact us directly.',
        },
      ],
    },
    {
      id: 'delivery',
      title: t('support.delivery.title') || 'Delivery Information',
      icon: 'fa-truck',
      description: t('support.delivery.description') || 'Delivery areas, timings, and charges',
      items: [
        {
          question: t('support.delivery.item1') || 'Delivery areas',
          answer:
            t('support.delivery.answer1') ||
            'We deliver to all towers in Panchsheel Greens (A1-A5, B1-B3) and nearby areas within a 2km radius. For locations beyond this, please contact us to check availability.',
        },
        {
          question: t('support.delivery.item2') || 'Delivery timings',
          answer:
            t('support.delivery.answer2') ||
            'We deliver daily between 7:30 PM to 8:30 PM. Last orders are accepted until 7:00 PM. We deliver 7 days a week, including weekends.',
        },
        {
          question: t('support.delivery.item3') || 'Delivery charges',
          answer:
            t('support.delivery.answer3') ||
            'Free delivery on orders ₹100 and above. For orders below ₹100, a delivery charge of ₹20 applies. Self-pickup is also available from A1-405, Panchsheel Greens.',
        },
        {
          question: t('support.delivery.item4') || "What if I'm not available during delivery?",
          answer:
            t('support.delivery.answer4') ||
            "Please inform us in advance if you won't be available. You can arrange for someone else to receive the order or reschedule for another time.",
        },
      ],
    },
    {
      id: 'account',
      title: t('support.account.title') || 'Account & Profile',
      icon: 'fa-user',
      description: t('support.account.description') || 'Manage your account, addresses, and orders',
      items: [
        {
          question: t('support.account.item1') || 'How to create an account?',
          answer:
            t('support.account.answer1') ||
            'Click on the Login/Account icon in the header, then select "Sign Up". Fill in your details (name, email, phone, password) and you\'re all set!',
        },
        {
          question: t('support.account.item2') || 'Manage addresses',
          answer:
            t('support.account.answer2') ||
            'Once logged in, go to your Account page and click on "Addresses". You can add, edit, or set a default address for faster checkout.',
        },
        {
          question: t('support.account.item3') || 'View order history',
          answer:
            t('support.account.answer3') ||
            'All your past orders are available in your Account page under the "Orders" tab. You can view order details, status, and reorder items.',
        },
        {
          question: t('support.account.item4') || 'Forgot password?',
          answer:
            t('support.account.answer4') ||
            "Please contact us via WhatsApp or phone, and we'll help you reset your password.",
        },
      ],
    },
    {
      id: 'menu',
      title: t('support.menu.title') || 'Menu & Pricing',
      icon: 'fa-utensils',
      description: t('support.menu.description') || 'Information about our menu items and pricing',
      items: [
        {
          question: t('support.menu.item1') || 'What menu items are available?',
          answer:
            t('support.menu.answer1') ||
            'We offer Full Tiffin (complete meals), Mix & Match Tiffin (customizable), and Khichdi. Check our Menu page for the complete list with current prices.',
        },
        {
          question: t('support.menu.item2') || 'Pricing information',
          answer:
            t('support.menu.answer2') ||
            'Our prices start from ₹100. Full tiffin meals range from ₹100-₹150. Prices are updated regularly and displayed on our Menu page.',
        },
        {
          question: t('support.menu.item3') || 'Special offers and discounts',
          answer:
            t('support.menu.answer3') ||
            'We offer monthly subscription discounts (7% off for 30 days). Check our Special Offers section for current promotions and deals.',
        },
        {
          question: t('support.menu.item4') || 'Can I customize my meal?',
          answer:
            t('support.menu.answer4') ||
            'Yes! Our Mix & Match Tiffin option allows you to customize your meal. Contact us via WhatsApp to discuss your preferences.',
        },
      ],
    },
  ];

  const contactInfo = {
    phone: '+91-9958983578',
    whatsapp: '919958983578',
    email: 'support@homiebites.com',
    address: 'Panchsheel Greens, New Delhi',
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='support-page'>
        <div className='support-container'>
          <h1 className='support-title'>{t('header.support') || 'Support'}</h1>
          <p className='support-subtitle'>
            {t('support.subtitle') || 'We are here to help you with any questions or concerns.'}
          </p>

          <div className='support-categories'>
            {supportCategories.map((category) => (
              <div
                key={category.id}
                className={`support-category ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <div
                  className='category-header'
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category.id ? null : category.id)
                  }
                >
                  <div className='category-header-left'>
                    <i className={`fa-solid ${category.icon}`}></i>
                    <div>
                      <h3>{category.title}</h3>
                      {category.description && (
                        <p className='category-description'>{category.description}</p>
                      )}
                    </div>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-${selectedCategory === category.id ? 'up' : 'down'}`}
                  ></i>
                </div>
                {selectedCategory === category.id && (
                  <div className='category-items'>
                    {category.items.map((item, index) => (
                      <div key={index} className='category-item'>
                        <div className='category-item-question'>
                          <i className='fa-solid fa-circle-question'></i>
                          <strong>{item.question}</strong>
                        </div>
                        <div className='category-item-answer'>{item.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='support-contact'>
            <h2 className='contact-title'>{t('support.contactUs') || 'Contact Us'}</h2>
            <div className='contact-grid'>
              <div className='contact-item'>
                <i className='fa-solid fa-phone'></i>
                <h4>{t('support.phone') || 'Phone'}</h4>
                <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              </div>
              <div className='contact-item'>
                <i className='fa-brands fa-whatsapp'></i>
                <h4>WhatsApp</h4>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {t('support.chatOnWhatsApp') || 'Chat with us'}
                </a>
              </div>
              <div className='contact-item'>
                <i className='fa-solid fa-envelope'></i>
                <h4>{t('support.email') || 'Email'}</h4>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </div>
              <div className='contact-item'>
                <i className='fa-solid fa-location-dot'></i>
                <h4>{t('support.address') || 'Address'}</h4>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {contactInfo.address}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
    </>
  );
}
