import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getMenuDataSync } from '../lib/menuData';

const Rates = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const [rateCards, setRateCards] = useState([]);

  useEffect(() => {
    const menuData = getMenuDataSync();
    const formattedCards = menuData.map((category) => ({
      id: category.id,
      title: category.category,
      icon: category.icon,
      tag: category.tag,
      description: category.description,
      items: category.items.map((item) => ({
        name: item.name,
        price: `₹${item.price}`,
      })),
    }));
    setRateCards(formattedCards);
  }, []);

  useEffect(() => {
    const handleMenuUpdate = () => {
      const menuData = getMenuDataSync();
      const formattedCards = menuData.map((category) => ({
        id: category.id,
        title: category.category,
        icon: category.icon,
        tag: category.tag,
        description: category.description,
        items: category.items.map((item) => ({
          name: item.name,
          price: `₹${item.price}`,
        })),
      }));
      setRateCards(formattedCards);
    };

    const handleStorageChange = (e) => {
      if (e.key === 'homiebites_menu_data' || e.key === 'homiebites_menu_update_trigger') {
        handleMenuUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('menuDataUpdated', handleMenuUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuDataUpdated', handleMenuUpdate);
    };
  }, []);

  return (
    <section id='rates' className='rates-section'>
      <div className='section-container'>
        <h2 className='section-heading'>{t('rates.title')}</h2>

        <div className='products-grid'>
          {rateCards.map((card) => (
            <div key={card.id} className='product-card'>
              <h3 className='product-title'>{card.title}</h3>
              {card.description && <p className='product-desc'>{card.description}</p>}
              <ul className='product-items'>
                {card.items.map((item, idx) => (
                  <li key={idx} className='product-item'>
                    <span>{item.name}</span>
                    <span className='product-price'>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='order-cta'>
          <p>
            {t('rates.readyToOrder')} <a href='tel:+919958983578'>+91-9958983578</a>{' '}
            {t('rates.orWhatsApp')}
          </p>
          <button className='btn btn-primary btn-large' onClick={onOrderClick}>
            {t('rates.orderNow')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Rates;
