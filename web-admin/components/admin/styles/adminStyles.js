/**
 * Admin styles loader (enterprise): single entry for all admin CSS.
 * - Uses JS import (no CSS @import) for reliable bundling with Turbopack.
 * - Order: index (vars, layout, resets) then modules. Loaded from app/admin/layout.jsx.
 */
import './index.css';
import './modules/sidebar.css';
import './modules/topnav.css';
import './modules/modals.css';
import './modules/tables.css';
import './modules/filters.css';
import './modules/forms.css';
import './modules/cards.css';
import './modules/badges.css';
import './modules/empty-states.css';
import './modules/notifications.css';
import './modules/inputs.css';
import './modules/utilities.css';
import './modules/dashboard.css';
import './modules/pending-amounts.css';
import './modules/menu-price.css';
import './modules/offers.css';
import './modules/notifications-grid.css';
import './modules/settings.css';
import './modules/csv-upload-modal.css';
import './modules/analytics-tab.css';
import './modules/admin-login.css';
import './modules/admin-forgot-password.css';
