'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Chatbot from '../../components/Chatbot';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { getMenuData } from '../../lib/menuData';
import { getCurrentUser, isUserLoggedIn, saveOrder } from '../../lib/userAuth';
import '../../styles/chatbot.css';

export default function MenuPage() {
  const { t } = useLanguage();
  const { success, error, info } = useNotification();
  const router = useRouter();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);
  const [useGuestCheckout, setUseGuestCheckout] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (isUserLoggedIn()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddress =
          currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
        setSelectedAddressId(defaultAddress.id);
        setCustomerInfo({
          name: currentUser.name,
          phone: currentUser.phone,
          address: `${defaultAddress.address}${defaultAddress.landmark ? ', ' + defaultAddress.landmark : ''}${defaultAddress.pincode ? ' - ' + defaultAddress.pincode : ''}`,
        });
      } else {
        setCustomerInfo({
          name: currentUser.name,
          phone: currentUser.phone,
          address: '',
        });
      }
    }
  }, []);

  useEffect(() => {
    try {
      const data = getMenuData();
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
  }, []);

  const addToCart = (categoryId, itemId, itemName, itemPrice) => {
    const key = `${categoryId}-${itemId}`;
    setCart((prev) => {
      const newQuantity = (prev[key]?.quantity || 0) + 1;
      return {
        ...prev,
        [key]: {
          name: itemName,
          price: itemPrice,
          quantity: newQuantity,
        },
      };
    });
    info(`${itemName} added to cart!`);
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const itemName = newCart[key]?.name;
      if (newCart[key].quantity > 1) {
        newCart[key].quantity -= 1;
        info(`${itemName} quantity decreased`);
      } else {
        delete newCart[key];
        info(`${itemName} removed from cart`);
      }
      return newCart;
    });
  };

  const FREE_DELIVERY_THRESHOLD = 100;
  const DELIVERY_CHARGE = 20;

  const getSubtotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryCharge();
  };

  const getAmountNeededForFreeDelivery = () => {
    const subtotal = getSubtotal();
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return FREE_DELIVERY_THRESHOLD - subtotal;
  };

  // Show free delivery notification when close to threshold
  useEffect(() => {
    const subtotal = getSubtotal();
    if (subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD) {
      const amountNeeded = getAmountNeededForFreeDelivery();
      if (amountNeeded > 0 && amountNeeded <= 20) {
        info(`Add ₹${amountNeeded} more for free delivery!`);
      }
    }
  }, [cart, info]);

  const handleWhatsAppOrder = () => {
    if (Object.keys(cart).length === 0) {
      error(t('menu.emptyCart') || 'Your cart is empty. Please add items to place an order.');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      error(t('menu.customerInfo') || 'Please fill in all customer details.');
      return;
    }

    const items = Object.entries(cart).map(([key, item]) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderData = {
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      items: items,
      total: getTotal(),
      subtotal: getSubtotal(),
      deliveryCharge: getDeliveryCharge(),
    };

    saveOrder(orderData);

    const itemsText = items
      .map((item) => `${item.name} x${item.quantity} (₹${item.price * item.quantity})`)
      .join('\n');

    const deliveryText =
      getDeliveryCharge() === 0
        ? '✅ *Free Delivery*'
        : `🚚 *Delivery Charge: ₹${getDeliveryCharge()}*`;

    const message = `🍽️ *Order from HomieBites*

👤 *Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

📋 *Order Items:*
${itemsText}

💰 *Subtotal: ₹${getSubtotal()}*
${deliveryText}
💰 *Grand Total: ₹${getTotal()}*

Please confirm this order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919958983578?text=${encodedMessage}`, '_blank', 'noopener');

    setCart({});
    if (!user) {
      setCustomerInfo({ name: '', phone: '', address: '' });
    }

    success(t('order.orderPlaced') || 'Order sent to WhatsApp! Our team will confirm shortly.');
  };

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='menu-page'>
        <div className='menu-header'>
          <button className='btn btn-text' onClick={() => router.push('/')}>
            ← {t('common.back')}
          </button>
          <h1>{t('menu.title')}</h1>
        </div>

        <div className='menu-content'>
          {isLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p>{t('common.loading')}</p>
            </div>
          ) : menuData.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <p>{t('menu.noItems')}</p>
            </div>
          ) : (
            <div className='menu-categories'>
              {menuData.map((category) => (
                <div key={category.id} className='menu-category'>
                  <h2 className='category-title'>{category.category}</h2>
                  {category.description && <p className='category-desc'>{category.description}</p>}

                  <div className='menu-items'>
                    {category.items.map((item) => {
                      const key = `${category.id}-${item.id}`;
                      const cartItem = cart[key];

                      return (
                        <div key={item.id} className='menu-item'>
                          <div className='item-info'>
                            <h3 className='item-name'>{item.name}</h3>
                            <p className='item-price'>₹{item.price}</p>
                          </div>
                          <div className='item-actions'>
                            {cartItem ? (
                              <div className='cart-controls'>
                                <button
                                  className='btn btn-qty'
                                  onClick={() => removeFromCart(key)}
                                  aria-label='Decrease quantity'
                                >
                                  −
                                </button>
                                <span className='qty-value'>{cartItem.quantity}</span>
                                <button
                                  className='btn btn-qty'
                                  onClick={() =>
                                    addToCart(category.id, item.id, item.name, item.price)
                                  }
                                  aria-label='Increase quantity'
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                className='btn btn-primary btn-small btn-full'
                                onClick={() =>
                                  addToCart(category.id, item.id, item.name, item.price)
                                }
                              >
                                {t('common.add')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {Object.keys(cart).length > 0 && (
            <div className='cart-sidebar'>
              <div className='cart-header'>
                <h3>{t('menu.cart')}</h3>
                <button className='btn btn-text btn-small' onClick={() => setCart({})}>
                  {t('common.remove')}
                </button>
              </div>

              <div className='cart-sidebar-content'>
                <div className='cart-items'>
                  {Object.entries(cart).map(([key, item]) => (
                    <div key={key} className='cart-item'>
                      <div className='cart-item-info'>
                        <span className='cart-item-name'>{item.name}</span>
                        <span className='cart-item-price'>
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </span>
                      </div>
                      <button className='btn btn-text btn-icon' onClick={() => removeFromCart(key)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className='cart-total'>
                  <div className='total-row'>
                    <span>{t('menu.subtotal')}:</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  <div className='total-row'>
                    <span>{t('menu.deliveryCharge')}:</span>
                    <span className={getDeliveryCharge() === 0 ? 'free-delivery' : ''}>
                      {getDeliveryCharge() === 0
                        ? t('menu.freeDelivery')
                        : `₹${getDeliveryCharge()}`}
                    </span>
                  </div>
                  {getAmountNeededForFreeDelivery() > 0 && (
                    <div className='free-delivery-message'>
                      <i className='fa-solid fa-truck'></i>
                      {t('menu.freeDeliveryMessage').replace(
                        '{amount}',
                        getAmountNeededForFreeDelivery()
                      )}
                    </div>
                  )}
                  <div className='total-row grand-total'>
                    <span>{t('menu.grandTotal')}:</span>
                    <span className='total-amount'>₹{getTotal()}</span>
                  </div>
                </div>

                {user && user.addresses && user.addresses.length > 0 && !useGuestCheckout ? (
                  <div className='address-selection'>
                    <div className='address-selection-header'>
                      <h4>{t('menu.selectAddress')}</h4>
                      <button
                        className='btn btn-text btn-small'
                        onClick={() => setUseGuestCheckout(true)}
                      >
                        {t('menu.addNewAddress')}
                      </button>
                    </div>
                    <div className='addresses-list'>
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`address-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setCustomerInfo({
                              name: user.name,
                              phone: user.phone,
                              address: `${addr.address}${addr.landmark ? ', ' + addr.landmark : ''}${addr.pincode ? ' - ' + addr.pincode : ''}`,
                            });
                          }}
                        >
                          {addr.isDefault && <span className='default-badge'>Default</span>}
                          <p>
                            <strong>{addr.name}</strong> - {addr.phone}
                          </p>
                          <p>{addr.address}</p>
                          {addr.landmark && (
                            <p>
                              {t('account.landmark')}: {addr.landmark}
                            </p>
                          )}
                          {addr.pincode && (
                            <p>
                              {t('account.pincode')}: {addr.pincode}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='customer-form'>
                    {user && (
                      <div className='guest-checkout-notice'>
                        <p>{t('menu.guestCheckout')}</p>
                        <button
                          className='btn btn-outline btn-small'
                          onClick={() => {
                            setUseGuestCheckout(false);
                            if (user.addresses && user.addresses.length > 0) {
                              const defaultAddress =
                                user.addresses.find((a) => a.isDefault) || user.addresses[0];
                              setSelectedAddressId(defaultAddress.id);
                              setCustomerInfo({
                                name: user.name,
                                phone: user.phone,
                                address: `${defaultAddress.address}${defaultAddress.landmark ? ', ' + defaultAddress.landmark : ''}${defaultAddress.pincode ? ' - ' + defaultAddress.pincode : ''}`,
                              });
                            }
                          }}
                        >
                          {t('menu.selectAddress')}
                        </button>
                      </div>
                    )}
                    <input
                      type='text'
                      placeholder={t('order.customerName')}
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      required
                    />
                    <input
                      type='tel'
                      placeholder={t('order.customerPhone')}
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      required
                    />
                    <textarea
                      placeholder={t('order.deliveryAddress')}
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, address: e.target.value })
                      }
                      required
                      rows='3'
                    />
                  </div>
                )}
              </div>

              <div className='cart-sidebar-footer'>
                <button className='btn btn-secondary btn-full' onClick={handleWhatsAppOrder}>
                  <i className='fa-brands fa-whatsapp'></i> {t('order.sendWhatsApp')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <Chatbot />
    </>
  );
}
