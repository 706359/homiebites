const OffersTab = ({
  offersData,
  syncing,
  saved,
  handleAddOffer,
  handleSaveOffers,
  handleEditOffer,
  handleDeleteOffer,
  setOffersData,
}) => {
  return (
    <div className='admin-content'>
      <div className='orders-header'>
        <h2>Offers Management</h2>
        <div className='orders-actions'>
          <button className='btn btn-primary' onClick={handleAddOffer}>
            <i className='fa-solid fa-plus'></i> Add Offer
          </button>
          <button className='btn btn-primary' onClick={handleSaveOffers} disabled={syncing}>
            <i className='fa-solid fa-save'></i> Save Changes
          </button>
          <a href='/offers' target='_blank' rel='noopener noreferrer' className='btn btn-secondary'>
            <i className='fa-solid fa-external-link'></i> View Offers Page
          </a>
          {saved && <span className='save-indicator'>✓ Saved successfully!</span>}
        </div>
      </div>

      <div className='offers-list'>
        {offersData.length === 0 ? (
          <div className='no-data admin-empty-state'>
            <p>No offers created yet. Click "Add Offer" to create your first offer!</p>
          </div>
        ) : (
          offersData.map((offer) => (
            <div key={offer.id} className='offer-card-admin'>
              <div className='offer-card-header-admin'>
                <div>
                  <h3>{offer.title}</h3>
                  {offer.discount && <span className='offer-discount-badge'>{offer.discount}</span>}
                  {offer.badge && <span className='offer-badge-admin'>{offer.badge}</span>}
                </div>
                <div className='offer-actions-admin'>
                  <label className='toggle-switch'>
                    <input
                      type='checkbox'
                      checked={offer.isActive}
                      onChange={(e) => {
                        setOffersData((prev) =>
                          prev.map((o) =>
                            o.id === offer.id ? { ...o, isActive: e.target.checked } : o
                          )
                        );
                      }}
                    />
                    <span className='toggle-slider'></span>
                    <span className='toggle-label'>{offer.isActive ? 'Active' : 'Inactive'}</span>
                  </label>
                  <button className='btn btn-secondary' onClick={() => handleEditOffer(offer)}>
                    <i className='fa-solid fa-edit'></i> Edit
                  </button>
                  <button
                    className='btn btn-special danger'
                    onClick={() => handleDeleteOffer(offer.id)}
                  >
                    <i className='fa-solid fa-trash'></i> Delete
                  </button>
                </div>
              </div>
              <p className='offer-description-admin'>{offer.description}</p>
              {offer.startDate || offer.endDate ? (
                <div className='offer-dates-admin'>
                  {offer.startDate && (
                    <span>
                      Starts:{' '}
                      {(() => {
                        const v = offer.startDate;
                        const isoLike = /^\d{4}-\d{2}-\d{2}T?.*/;
                        const ddmmm = /^\d{2}-[A-Za-z]{3}-\d{4}$/;
                        if (typeof v === 'string' && ddmmm.test(v)) return v;
                        if (typeof v === 'string' && isoLike.test(v)) {
                          const d = new Date(v);
                          if (!isNaN(d)) {
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            const m = mNames[d.getMonth()];
                            const yyyy = d.getFullYear();
                            return `${dd}-${m}-${yyyy}`;
                          }
                        }
                        try {
                          const d = new Date(v);
                          if (!isNaN(d)) {
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            const m = mNames[d.getMonth()];
                            const yyyy = d.getFullYear();
                            return `${dd}-${m}-${yyyy}`;
                          }
                        } catch (e) {}
                        return String(v);
                      })()}
                    </span>
                  )}
                  {offer.endDate && (
                    <span>
                      Ends:{' '}
                      {(() => {
                        const v = offer.endDate;
                        const isoLike = /^\d{4}-\d{2}-\d{2}T?.*/;
                        const ddmmm = /^\d{2}-[A-Za-z]{3}-\d{4}$/;
                        if (typeof v === 'string' && ddmmm.test(v)) return v;
                        if (typeof v === 'string' && isoLike.test(v)) {
                          const d = new Date(v);
                          if (!isNaN(d)) {
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            const m = mNames[d.getMonth()];
                            const yyyy = d.getFullYear();
                            return `${dd}-${m}-${yyyy}`;
                          }
                        }
                        try {
                          const d = new Date(v);
                          if (!isNaN(d)) {
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mNames = [
                              'Jan',
                              'Feb',
                              'Mar',
                              'Apr',
                              'May',
                              'Jun',
                              'Jul',
                              'Aug',
                              'Sep',
                              'Oct',
                              'Nov',
                              'Dec',
                            ];
                            const m = mNames[d.getMonth()];
                            const yyyy = d.getFullYear();
                            return `${dd}-${m}-${yyyy}`;
                          }
                        } catch (e) {}
                        return String(v);
                      })()}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OffersTab;
