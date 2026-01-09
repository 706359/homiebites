'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chatbot from '../../components/Chatbot';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { getMenuData } from '../../lib/menuData';
import '../../pages/MenuPage.css';
import '../../styles/chatbot.css';

/**
 * Client Component for Menu Page
 * Receives initial data from Server Component
 */
export default function MenuPageClient({ initialMenuData = [] }) {
  const { t } = useLanguage();
  const { success, error, info } = useNotification();
  const router = useRouter();
  const [menuData, setMenuData] = useState(initialMenuData);
  const [isLoading, setIsLoading] = useState(initialMenuData.length === 0);
  const [cart, setCart] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Only fetch if no initial data provided (fallback)
  useEffect(() => {
    if (initialMenuData.length === 0) {
      const loadMenu = async () => {
        try {
          const data = await getMenuData();
          if (data && Array.isArray(data) && data.length > 0) {
            setMenuData(data);
          } else {
            console.warn('Menu data is empty or invalid');
            setMenuData([]);
          }
        } catch (error) {
          console.error('Error loading menu data:', error);
          setMenuData([]);
        } finally {
          setIsLoading(false);
        }
      };
      loadMenu();
    } else {
      setIsLoading(false);
    }
  }, [initialMenuData]);

  // Rest of the component logic remains the same...
  // (addToCart, removeFromCart, handleWhatsAppOrder, etc.)
  
  // For now, keeping the existing implementation
  // This is a placeholder showing the pattern
  return (
    <>
      <Header onOrderClick={() => {}} />
      <div className='menu-page'>
        <div className='menu-header'>
          <button className='btn btn-ghost' onClick={() => router.push('/')}>
            ← {t('common.back')}
          </button>
          <h1>{t('menu.title')}</h1>
        </div>
        <div className='menu-content'>
          {isLoading ? (
            <div className='menu-loading-state'>
              <p>{t('common.loading')}</p>
            </div>
          ) : menuData.length === 0 ? (
            <div className='menu-empty-state'>
              <p>{t('menu.noItems')}</p>
            </div>
          ) : (
            <div className='menu-categories'>
              {menuData.map((category) => (
                <div key={category.id} className='menu-category'>
                  <h2 className='category-title'>{category.category}</h2>
                  {category.description && <p className='category-desc'>{category.description}</p>}
                  <div className='menu-items'>
                    {category.items.map((item) => (
                      <div key={item.id} className='menu-item'>
                        <div className='item-info'>
                          <h3 className='item-name'>{item.name}</h3>
                          <p className='item-price'>₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer onOrderClick={() => {}} />
      <Chatbot />
    </>
  );
}

