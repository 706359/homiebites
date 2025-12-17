'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { getMenuData } from '../lib/menuData';

const OrderModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { success, error, info } = useNotification();
  const [orderItems, setOrderItems] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    loadMenuItems();

    const handleMenuUpdate = () => {
      loadMenuItems();
    };

    // Listen for storage changes (when localStorage is updated from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'homiebites_menu_data' || e.key === 'homiebites_menu_update_trigger') {
        handleMenuUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event from admin dashboard (same tab)
    window.addEventListener('menuDataUpdated', handleMenuUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuDataUpdated', handleMenuUpdate);
    };
  }, []);

  const loadMenuItems = () => {
    const menuData = getMenuData();
    const flatItems = [];
    menuData.forEach((category) => {
      category.items.forEach((item) => {
        flatItems.push({
          id: `${category.id}-${item.id}`,
          name: item.name,
          price: item.price,
        });
      });
    });
    setMenuItems(flatItems);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const updateQuantity = (itemId, change) => {
    setOrderItems((prev) => {
      const newQuantity = (prev[itemId] || 0) + change;
      if (newQuantity < 0) return prev;
      const item = menuItems.find((i) => i.id === itemId);
      if (newQuantity === 0) {
        const { [itemId]: removed, ...rest } = prev;
        if (item) info(`${item.name} removed from order`);
        return rest;
      }
      if (item && change > 0) {
        info(`${item.name} added to order`);
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const getTotalPrice = () => {
    return Object.entries(orderItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find((i) => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const handleWhatsAppOrder = () => {
    const selectedItems = Object.entries(orderItems)
      .map(([itemId, quantity]) => {
        const item = menuItems.find((i) => i.id === itemId);
        return item ? `${item.name} x${quantity} (₹${item.price * quantity})` : null;
      })
      .filter(Boolean);

    if (selectedItems.length === 0) {
      error(t('order.selectItems') || 'Please select at least one item to order.');
      return;
    }

    const message = `🍽️ *Order from HomieBites*

👤 *Customer Details:*
Name: ${customerName || 'Not provided'}
Phone: ${customerPhone || 'Not provided'}
Address: ${deliveryAddress || 'Not provided'}

📋 *Order Items:*
${selectedItems.join('\n')}

💰 *Total Amount: ₹${getTotalPrice()}*

Please confirm this order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919958983578?text=${encodedMessage}`, '_blank', 'noopener');
    success(t('order.orderPlaced') || 'Order sent to WhatsApp! Our team will confirm shortly.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='order-modal-overlay' onClick={onClose}>
      <div className='order-modal' onClick={(e) => e.stopPropagation()}>
        <button className='order-modal-close' onClick={onClose}>
          <i className='fa-solid fa-xmark'></i>
        </button>
        <h2>
          <i className='fa-brands fa-whatsapp'></i> {t('order.sendWhatsApp')}
        </h2>

        <div className='order-form-section'>
          <h3>{t('menu.customerInfo')}</h3>
          <div className='form-group'>
            <label>{t('order.customerName')} *</label>
            <input
              type='text'
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('order.customerName')}
            />
          </div>
          <div className='form-group'>
            <label>{t('order.customerPhone')} *</label>
            <input
              type='tel'
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder='+91-9958983578'
            />
          </div>
          <div className='form-group'>
            <label>{t('order.deliveryAddress')} *</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder='A1-405, Panchsheel Greens'
              rows='3'
            />
          </div>
        </div>

        <div className='order-form-section'>
          <h3>{t('order.orderItems')}</h3>
          <div className='order-items-list'>
            {menuItems.map((item) => {
              const quantity = orderItems[item.id] || 0;
              return (
                <div key={item.id} className='order-item'>
                  <div className='order-item-info'>
                    <span className='order-item-name'>{item.name}</span>
                    <span className='order-item-price'>₹{item.price}</span>
                  </div>
                  <div className='order-item-controls'>
                    <button
                      className='btn btn-qty'
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={quantity === 0}
                    >
                      <i className='fa-solid fa-minus'></i>
                    </button>
                    <span className='qty-value'>{quantity}</span>
                    <button className='btn btn-qty' onClick={() => updateQuantity(item.id, 1)}>
                      <i className='fa-solid fa-plus'></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='order-summary'>
          <div className='order-total'>
            <strong>
              {t('common.total')}: ₹{getTotalPrice()}
            </strong>
          </div>
          <button className='btn btn-primary btn-large' onClick={handleWhatsAppOrder}>
            <i className='fa-brands fa-whatsapp'></i> {t('order.sendWhatsApp')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
