const NotificationsTab = ({ notifications, setNotifications }) => {
  const addNotification = () => {
    const newNotification = {
      id: Date.now(),
      type: 'Payment reminder', // Payment reminder, Offer announcement, Service update
      title: '',
      message: '',
      channel: 'Website banner', // Website banner, WhatsApp, Admin alerts
      active: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications([...notifications, newNotification]);
  };

  const saveNotifications = () => {
    localStorage.setItem('homiebites_notifications', JSON.stringify(notifications));
    alert('✅ Notifications saved!');
  };

  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>Notifications & Announcements</h2>
        <div className='orders-actions'>
          <button className='btn btn-primary' onClick={addNotification}>
            <i className='fa-solid fa-plus'></i> Add Notification
          </button>
        </div>
      </div>

      <div className='notifications-list'>
        {notifications.map((notif) => (
          <div key={notif.id} className='notification-card'>
            <input
              type='text'
              value={notif.title || ''}
              onChange={(e) => {
                const updated = notifications.map((n) =>
                  n.id === notif.id ? { ...n, title: e.target.value } : n
                );
                setNotifications(updated);
              }}
              placeholder='Notification Title'
              className='notification-title'
            />
            <textarea
              value={notif.message || ''}
              onChange={(e) => {
                const updated = notifications.map((n) =>
                  n.id === notif.id ? { ...n, message: e.target.value } : n
                );
                setNotifications(updated);
              }}
              placeholder='Notification Message'
              className='notification-message'
              rows='3'
            />
            <div className='form-row'>
              <div className='form-group'>
                <label>Type:</label>
                <select
                  value={notif.type || 'Payment reminder'}
                  onChange={(e) => {
                    const updated = notifications.map((n) =>
                      n.id === notif.id ? { ...n, type: e.target.value } : n
                    );
                    setNotifications(updated);
                  }}
                  className='custom-dropdown'
                >
                  <option value='Payment reminder'>Payment reminder</option>
                  <option value='Offer announcement'>Offer announcement</option>
                  <option value='Service update'>Service update</option>
                </select>
              </div>
              <div className='form-group'>
                <label>Channel:</label>
                <select
                  value={notif.channel || 'Website banner'}
                  onChange={(e) => {
                    const updated = notifications.map((n) =>
                      n.id === notif.id ? { ...n, channel: e.target.value } : n
                    );
                    setNotifications(updated);
                  }}
                  className='custom-dropdown'
                >
                  <option value='Website banner'>Website banner</option>
                  <option value='WhatsApp'>WhatsApp</option>
                  <option value='Admin alerts'>Admin alerts</option>
                </select>
              </div>
            </div>
            <div className='notification-actions'>
              <label>
                <input
                  type='checkbox'
                  checked={notif.active || false}
                  onChange={(e) => {
                    const updated = notifications.map((n) =>
                      n.id === notif.id ? { ...n, active: e.target.checked } : n
                    );
                    setNotifications(updated);
                  }}
                />
                Active
              </label>
              {notif.channel === 'WhatsApp' && (
                <button
                  className='btn btn-secondary btn-small'
                  onClick={() => {
                    const whatsappMessage = encodeURIComponent(
                      `*${notif.title}*\n\n${notif.message}`
                    );
                    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
                  }}
                >
                  <i className='fa-brands fa-whatsapp'></i> Send WhatsApp
                </button>
              )}
              <button
                className='btn btn-special danger btn-small'
                onClick={() => {
                  setNotifications(notifications.filter((n) => n.id !== notif.id));
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 0 && (
        <div style={{ marginTop: 'var(--admin-margin-xl)' }}>
          <button className='btn btn-primary' onClick={saveNotifications}>
            <i className='fa-solid fa-save'></i> Save Notifications
          </button>
        </div>
      )}

      {notifications.length === 0 && (
        <div className='no-data admin-empty-state' style={{ marginTop: 'var(--admin-margin-xl)' }}>
          <p>No notifications yet. Click "Add Notification" to create one.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
