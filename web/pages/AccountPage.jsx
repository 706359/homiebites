import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OrderModal from '../components/OrderModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import {
  getCurrentUser,
  getUserOrders,
  logoutUser,
  saveAddress,
  updateProfile,
} from '../lib/userAuth';
import '../styles/chatbot.css';

export default function AccountPage() {
  const { t } = useLanguage();
  const { success, error: showError } = useNotification();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const navigate = useNavigate();

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: '',
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
    });

    const userOrders = getUserOrders();
    setOrders(userOrders);
  }, [navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const result = updateProfile(profileForm);
    if (result.success) {
      setUser(result.user);
      success('Profile updated successfully!');
    } else {
      const errorMsg = result.error || 'Failed to update profile';
      showError(errorMsg);
    }
  };

  const handleAddressSave = (e) => {
    e.preventDefault();
    const result = saveAddress(addressForm);
    if (result.success) {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
      setAddressForm({
        name: '',
        phone: '',
        address: '',
        landmark: '',
        pincode: '',
      });
      success('Address saved successfully!');
    } else {
      const errorMsg = result.error || 'Failed to save address';
      showError(errorMsg);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <div className='account-page'>
        <div className='account-header'>
          <h1>{t('account.title')}</h1>
        </div>

        <div className='account-container'>
          <div className='account-sidebar'>
            <div className='account-user-info'>
              <div className='user-avatar'>{user.name?.charAt(0).toUpperCase() || 'U'}</div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>

            <div className='account-tabs'>
              <button
                className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className='fa-solid fa-user'></i>
                {t('account.profile')}
              </button>
              <button
                className={`account-tab ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <i className='fa-solid fa-map-marker-alt'></i>
                {t('account.addresses')}
              </button>
              <button
                className={`account-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className='fa-solid fa-shopping-bag'></i>
                {t('account.orders')}
              </button>
              <button className='account-tab logout-btn' onClick={handleLogout}>
                <i className='fa-solid fa-sign-out-alt'></i>
                {t('common.logout')}
              </button>
            </div>
          </div>

          <div className='account-content'>
            {activeTab === 'profile' && (
              <div className='account-section'>
                <h2>{t('account.profile')}</h2>
                <form className='profile-form' onSubmit={handleProfileUpdate}>
                  <div className='form-field'>
                    <label>{t('common.name')}</label>
                    <input
                      type='text'
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className='form-field'>
                    <label>{t('common.email')}</label>
                    <input
                      type='email'
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className='form-field'>
                    <label>{t('common.phone')}</label>
                    <input
                      type='tel'
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <button type='submit' className='btn btn-primary'>
                    {t('account.updateProfile')}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className='account-section'>
                <h2>{t('account.addresses')}</h2>
                <form className='address-form' onSubmit={handleAddressSave}>
                  <div className='form-row'>
                    <div className='form-field'>
                      <label>{t('common.name')}</label>
                      <input
                        type='text'
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className='form-field'>
                      <label>{t('common.phone')}</label>
                      <input
                        type='tel'
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className='form-field'>
                    <label>{t('common.address')}</label>
                    <textarea
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      required
                      rows='3'
                    />
                  </div>
                  <div className='form-row'>
                    <div className='form-field'>
                      <label>{t('account.landmark')}</label>
                      <input
                        type='text'
                        value={addressForm.landmark}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, landmark: e.target.value })
                        }
                      />
                    </div>
                    <div className='form-field'>
                      <label>{t('account.pincode')}</label>
                      <input
                        type='text'
                        value={addressForm.pincode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, pincode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <button type='submit' className='btn btn-primary'>
                    {t('account.saveAddress')}
                  </button>
                </form>

                <div className='saved-addresses'>
                  <h3>{t('account.addresses')}</h3>
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className='addresses-list'>
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`address-card ${addr.isDefault ? 'default' : ''}`}
                        >
                          {addr.isDefault && <span className='default-badge'>Default</span>}
                          <div className='address-info'>
                            <p>
                              <strong>{addr.name}</strong>
                            </p>
                            <p>{addr.phone}</p>
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='no-data'>
                      <p>{t('account.noAddresses')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className='account-section'>
                <h2>{t('account.orders')}</h2>
                {orders.length > 0 ? (
                  <div className='orders-list'>
                    {orders.map((order) => (
                      <div key={order.id} className='order-card'>
                        <div className='order-header'>
                          <strong>
                            {t('common.order')} #{order.sNo || order.id}
                          </strong>
                          <span className='order-date'>
                            {order.date || new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`order-status ${order.status || 'pending'}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        <div className='order-items'>
                          {order.items &&
                            order.items.map((item, idx) => (
                              <div key={idx} className='order-item-row'>
                                <span>
                                  {item.name} x {item.quantity || 1}
                                </span>
                                <span>₹{item.price * (item.quantity || 1)}</span>
                              </div>
                            ))}
                        </div>
                        <div className='order-total'>
                          <strong>
                            {t('common.total')}: ₹{order.total || order.totalAmount}
                          </strong>
                        </div>
                        {order.deliveryAddress && (
                          <div className='order-address'>
                            <p>
                              <strong>{t('order.deliveryAddress')}:</strong>
                            </p>
                            <p>{order.deliveryAddress}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='no-data'>
                    <p>{t('account.noOrders')}</p>
                    <p>
                      <Link to='/menu'>{t('menu.viewMenu')}</Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer onOrderClick={openOrderModal} />
      <Chatbot />
      <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />
    </>
  );
}
