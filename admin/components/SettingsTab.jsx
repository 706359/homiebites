const SettingsTab = ({ settings, onSettingsChange, onSaveSettings }) => {
  const paymentModes = ['Cash', 'Online', 'UPI', 'Bank Transfer'];

  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>Settings</h2>
        <div className='orders-actions'>
          <button className='btn btn-primary' onClick={onSaveSettings}>
            <i className='fa-solid fa-save'></i> Save All Settings
          </button>
        </div>
      </div>

      <div className='settings-container'>
        {/* Business Information Section */}
        <div className='settings-section'>
          <div className='settings-section-header'>
            <div className='settings-section-icon'>
              <i className='fa-solid fa-building'></i>
            </div>
            <div>
              <h3>Business Information</h3>
              <p className='settings-section-description'>Configure your business details</p>
            </div>
          </div>
          <div className='settings-section-content'>
            <div className='form-group'>
              <label>
                <i className='fa-solid fa-signature'></i> Business Name
                <span className='required-badge'>*</span>
              </label>
              <input
                type='text'
                value={settings.businessName || ''}
                onChange={(e) => onSettingsChange({ ...settings, businessName: e.target.value })}
                placeholder='HomieBites'
                required
              />
              <small className='form-helper-text'>
                This name will be displayed across the platform
              </small>
            </div>

            <div className='form-group'>
              <label>
                <i className='fa-solid fa-phone'></i> Contact Number
              </label>
              <input
                type='text'
                value={settings.whatsappNumber || ''}
                onChange={(e) => onSettingsChange({ ...settings, whatsappNumber: e.target.value })}
                placeholder='+91 1234567890'
              />
              <small className='form-helper-text'>
                Used for WhatsApp integration and customer contact
              </small>
            </div>
          </div>
        </div>

        {/* Order Settings Section */}
        <div className='settings-section'>
          <div className='settings-section-header'>
            <div className='settings-section-icon'>
              <i className='fa-solid fa-shopping-cart'></i>
            </div>
            <div>
              <h3>Order Settings</h3>
              <p className='settings-section-description'>Configure default order preferences</p>
            </div>
          </div>
          <div className='settings-section-content'>
            <div className='form-group'>
              <label>
                <i className='fa-solid fa-rupee-sign'></i> Default Unit Price
                <span className='required-badge'>*</span>
              </label>
              <div className='input-with-icon'>
                <span className='input-icon'>₹</span>
                <input
                  type='number'
                  value={settings.defaultUnitPrice || 0}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      defaultUnitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  required
                />
              </div>
              <small className='form-helper-text'>
                Default price used for new orders when unit price is not specified
              </small>
            </div>

            <div className='form-group'>
              <label>
                <i className='fa-solid fa-credit-card'></i> Payment Modes
                <span className='required-badge'>*</span>
              </label>
              <div className='payment-modes-grid'>
                {paymentModes.map((mode) => {
                  const isSelected = (settings.paymentModes || []).includes(mode);
                  return (
                    <label
                      key={mode}
                      className={`payment-mode-card ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={(e) => {
                          const currentModes = settings.paymentModes || [];
                          if (e.target.checked) {
                            onSettingsChange({
                              ...settings,
                              paymentModes: [...currentModes, mode],
                            });
                          } else {
                            onSettingsChange({
                              ...settings,
                              paymentModes: currentModes.filter((m) => m !== mode),
                            });
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <div className='payment-mode-icon'>
                        {mode === 'Cash' && <i className='fa-solid fa-money-bill-wave'></i>}
                        {mode === 'Online' && <i className='fa-solid fa-globe'></i>}
                        {mode === 'UPI' && <i className='fa-brands fa-google-pay'></i>}
                        {mode === 'Bank Transfer' && <i className='fa-solid fa-university'></i>}
                      </div>
                      <span className='payment-mode-name'>{mode}</span>
                      {isSelected && (
                        <div className='payment-mode-check'>
                          <i className='fa-solid fa-check'></i>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
              <small className='form-helper-text'>
                Select available payment methods for orders
              </small>
            </div>
          </div>
        </div>

        {/* Month Lock Section */}
        <div className='settings-section'>
          <div className='settings-section-header'>
            <div className='settings-section-icon'>
              <i className='fa-solid fa-lock'></i>
            </div>
            <div>
              <h3>Month Lock (Close Month)</h3>
              <p className='settings-section-description'>
                Protect historical data from accidental edits
              </p>
            </div>
          </div>
          <div className='settings-section-content'>
            <div className='form-group'>
              <label>
                <i className='fa-solid fa-calendar-alt'></i> Lock Orders Before
              </label>
              <input
                type='month'
                value={settings.monthLockedTill || ''}
                onChange={(e) => onSettingsChange({ ...settings, monthLockedTill: e.target.value })}
                placeholder='YYYY-MM'
              />
              <small className='form-helper-text'>
                Orders before this month cannot be edited. Leave empty to allow editing of all
                orders.
              </small>
              {settings.monthLockedTill && (
                <div className='month-lock-info'>
                  <i className='fa-solid fa-info-circle'></i>
                  <span>
                    Orders before <strong>{settings.monthLockedTill}</strong> are locked and cannot
                    be modified.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className='settings-section settings-section-danger'>
          <div className='settings-section-header'>
            <div className='settings-section-icon settings-section-icon-danger'>
              <i className='fa-solid fa-shield-halved'></i>
            </div>
            <div>
              <h3>Security</h3>
              <p className='settings-section-description'>Manage admin access and password</p>
            </div>
          </div>
          <div className='settings-section-content'>
            <div className='form-group'>
              <label>
                <i className='fa-solid fa-key'></i> Admin Password
              </label>
              <input
                type='password'
                value={settings.adminPassword || ''}
                onChange={(e) => onSettingsChange({ ...settings, adminPassword: e.target.value })}
                placeholder='Enter new password'
              />
              <small className='form-helper-text'>
                Leave empty to keep current password unchanged
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
