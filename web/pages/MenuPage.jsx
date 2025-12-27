import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { getMenuData, getMenuDataSync } from '../lib/menuData';
import { getCurrentUser, isUserLoggedIn, saveAddress, saveOrder } from '../lib/userAuth';
import '../styles/chatbot.css';

export default function MenuPage() {
  const { t } = useLanguage();
  const { success, error, info } = useNotification();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);
  const [useGuestCheckout, setUseGuestCheckout] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: '',
  });

  useEffect(() => {
    if (isUserLoggedIn()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddress =
          currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
        setSelectedAddressId(defaultAddress.id);
        setUseGuestCheckout(false);
        setCustomerInfo({
          name: currentUser.name,
          phone: currentUser.phone,
          address: `${defaultAddress.address}${defaultAddress.landmark ? ', ' + defaultAddress.landmark : ''}${defaultAddress.pincode ? ' - ' + defaultAddress.pincode : ''}`,
          landmark: defaultAddress.landmark || '',
          pincode: defaultAddress.pincode || '',
        });
      } else {
        setUseGuestCheckout(true);
        setCustomerInfo({
          name: currentUser.name,
          phone: currentUser.phone,
          address: '',
          landmark: '',
          pincode: '',
        });
        // Auto-fetch location for logged-in users without saved addresses
        fetchCurrentLocation();
      }
    }
  }, []);

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      info(t('menu.locationNotSupported') || 'Location services not available');
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get full address details
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (response.ok) {
            const data = await response.json();

            // Build address string
            const addressParts = [];
            if (data.locality) addressParts.push(data.locality);
            if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
            if (data.city) addressParts.push(data.city);

            const streetAddress = data.street || data.locality || '';
            const pincode = data.postcode || '';

            const fullAddress = addressParts.join(', ') || streetAddress || 'Your Location';

            setCustomerInfo((prev) => ({
              ...prev,
              address: fullAddress,
              landmark: streetAddress,
              pincode: pincode,
            }));

            success(t('menu.locationFetched') || 'Location fetched successfully');
          } else {
            throw new Error('Failed to fetch address');
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          error(t('menu.locationFetchError') || 'Failed to fetch location. Please enter manually.');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setIsFetchingLocation(false);
        error(
          t('menu.locationPermissionDenied') ||
            'Location permission denied. Please enter address manually.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
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
        // Fallback to sync version
        try {
          const syncData = getMenuDataSync();
          if (syncData && Array.isArray(syncData) && syncData.length > 0) {
            setMenuData(syncData);
          } else {
            setMenuData([]);
          }
        } catch (syncError) {
          console.error('Error loading menu from cache:', syncError);
          setMenuData([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
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

    const items = Object.entries(cart).map(([, item]) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Build full address string
    let fullAddress = customerInfo.address;
    if (customerInfo.landmark) {
      fullAddress += `, ${customerInfo.landmark}`;
    }
    if (customerInfo.pincode) {
      fullAddress += ` - ${customerInfo.pincode}`;
    }

    const orderData = {
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: fullAddress,
      landmark: customerInfo.landmark,
      pincode: customerInfo.pincode,
      items: items,
      total: getTotal(),
      subtotal: getSubtotal(),
      deliveryCharge: getDeliveryCharge(),
    };

    // Save order (async - API first, localStorage fallback)
    saveOrder(orderData).catch((err) => {
      console.error('Error saving order:', err);
      // Order still sent via WhatsApp, so continue
    });

    const itemsText = items
      .map((item) => `${item.name} x${item.quantity} (₹${item.price * item.quantity})`)
      .join('\n');

    const deliveryText =
      getDeliveryCharge() === 0
        ? '✅ *Free Delivery*'
        : `🚚 *Delivery Charge: ₹${getDeliveryCharge()}*`;

    let addressText = `Address: ${fullAddress}`;
    if (customerInfo.landmark || customerInfo.pincode) {
      addressText += '\n';
      if (customerInfo.landmark) {
        addressText += `Landmark: ${customerInfo.landmark}\n`;
      }
      if (customerInfo.pincode) {
        addressText += `Pincode: ${customerInfo.pincode}`;
      }
    }

    const message = `🍽️ *Order from HomieBites*

👤 *Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
${addressText}

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
      setCustomerInfo({ name: '', phone: '', address: '', landmark: '', pincode: '' });
    }

    success(t('order.orderPlaced') || 'Order sent to WhatsApp! Our team will confirm shortly.');
  };

  const openOrderModal = () => {
    // Order modal functionality can be added here if needed
  };

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='menu-page'>
        <div className='menu-header'>
          <button className='btn btn-text' onClick={() => navigate('/')}>
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

          <div className='cart-sidebar'>
            <div className='cart-header'>
              <h3>{t('menu.cart')}</h3>
              {Object.keys(cart).length > 0 && (
                <button className='btn btn-text btn-small' onClick={() => setCart({})}>
                  {t('common.remove')}
                </button>
              )}
            </div>

            <div className='cart-sidebar-content'>
              {Object.keys(cart).length === 0 ? (
                <div className='cart-empty-state'>
                  <div className='cart-empty-icon'>
                    <i className='fa-solid fa-shopping-bag'></i>
                  </div>
                  <h4 className='cart-empty-title'>
                    {t('menu.emptyCartTitle') || 'Your cart is empty'}
                  </h4>
                  <p className='cart-empty-message'>
                    {t('menu.emptyCartMessage') ||
                      'Add some delicious and healthy food to get started!'}
                  </p>
                </div>
              ) : (
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
              )}

              {Object.keys(cart).length > 0 && (
                <>
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
                          onClick={() => {
                            setUseGuestCheckout(true);
                            fetchCurrentLocation();
                          }}
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
                              setUseGuestCheckout(false);
                              setCustomerInfo({
                                name: user.name,
                                phone: user.phone,
                                address: `${addr.address}${addr.landmark ? ', ' + addr.landmark : ''}${addr.pincode ? ' - ' + addr.pincode : ''}`,
                                landmark: addr.landmark || '',
                                pincode: addr.pincode || '',
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
                      {user && user.addresses && user.addresses.length > 0 && (
                        <div className='guest-checkout-notice'>
                          <p>{t('menu.addNewAddress')}</p>
                          <button
                            className='btn btn-outline btn-small'
                            onClick={() => {
                              setUseGuestCheckout(false);
                              const defaultAddress =
                                user.addresses.find((a) => a.isDefault) || user.addresses[0];
                              setSelectedAddressId(defaultAddress.id);
                              setCustomerInfo({
                                name: user.name,
                                phone: user.phone,
                                address: `${defaultAddress.address}${defaultAddress.landmark ? ', ' + defaultAddress.landmark : ''}${defaultAddress.pincode ? ' - ' + defaultAddress.pincode : ''}`,
                                landmark: defaultAddress.landmark || '',
                                pincode: defaultAddress.pincode || '',
                              });
                            }}
                          >
                            {t('menu.selectSavedAddress') || 'Select Saved Address'}
                          </button>
                        </div>
                      )}
                      {user && (
                        <div className='location-fetch-section'>
                          <button
                            type='button'
                            className='btn btn-outline btn-small'
                            onClick={fetchCurrentLocation}
                            disabled={isFetchingLocation}
                          >
                            <i className='fa-solid fa-location-dot'></i>{' '}
                            {isFetchingLocation
                              ? t('menu.fetchingLocation') || 'Fetching...'
                              : t('menu.useCurrentLocation') || 'Use Current Location'}
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
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
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
                      <div className='form-row'>
                        <div className='form-field'>
                          <input
                            type='text'
                            placeholder={t('account.landmark') || 'Landmark (optional)'}
                            value={customerInfo.landmark}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, landmark: e.target.value })
                            }
                          />
                        </div>
                        <div className='form-field'>
                          <input
                            type='text'
                            placeholder={t('account.pincode') || 'Pincode'}
                            value={customerInfo.pincode}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, pincode: e.target.value })
                            }
                            maxLength='6'
                          />
                        </div>
                      </div>
                      {user && (
                        <button
                          type='button'
                          className='btn btn-outline btn-small'
                          onClick={() => {
                            if (!customerInfo.address.trim()) {
                              error(t('menu.addressRequired') || 'Please enter an address');
                              return;
                            }
                            const result = saveAddress({
                              name: customerInfo.name,
                              phone: customerInfo.phone,
                              address: customerInfo.address,
                              landmark: customerInfo.landmark,
                              pincode: customerInfo.pincode,
                            });
                            if (result.success) {
                              const updatedUser = getCurrentUser();
                              setUser(updatedUser);
                              setUseGuestCheckout(false);
                              setSelectedAddressId(result.address.id);
                              success(t('account.saveAddress') || 'Address saved successfully!');
                            } else {
                              error(result.error || 'Failed to save address');
                            }
                          }}
                        >
                          <i className='fa-solid fa-bookmark'></i>{' '}
                          {t('menu.saveAddressForFuture') || 'Save Address for Future'}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {Object.keys(cart).length > 0 && (
              <div className='cart-sidebar-footer'>
                <button className='btn btn-secondary btn-full' onClick={handleWhatsAppOrder}>
                  <i className='fa-brands fa-whatsapp'></i> {t('order.sendWhatsApp')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <Chatbot />
    </>
  );
}
