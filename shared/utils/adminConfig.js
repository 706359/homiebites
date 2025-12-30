// Admin Configuration - Shared settings for admin dashboard

export const adminFeatures = {
  dashboard: {
    enabled: true,
    name: 'Dashboard',
    icon: 'fa-home',
    description: 'Quick health check - KPIs only',
  },
  orders: {
    enabled: true,
    name: 'Current Month Orders',
    icon: 'fa-shopping-cart',
    description: 'Daily operations - current month records',
  },
  menu: {
    enabled: true,
    name: 'Menu Management',
    icon: 'fa-utensils',
    description: 'Control what users see on website',
  },
  offers: {
    enabled: true,
    name: 'Offers',
    icon: 'fa-tag',
    description: 'Marketing offers and discounts',
  },
  customers: {
    enabled: true,
    name: 'All Addresses',
    icon: 'fa-map-marker-alt',
    description: 'Address master list',
  },
  users: {
    enabled: true,
    name: 'Pending Amounts',
    icon: 'fa-money-bill-wave',
    description: 'Money recovery - pending payments',
  },
  analytics: {
    enabled: true,
    name: 'Analytics',
    icon: 'fa-chart-line',
    description: 'Decision-focused reports',
  },
  notifications: {
    enabled: true,
    name: 'Notifications',
    icon: 'fa-bell',
    description: 'Communication control',
  },
  summary: {
    enabled: true,
    name: 'Summary',
    icon: 'fa-table',
    description: 'Address-wise monthly totals',
  },
  settings: {
    enabled: true,
    name: 'Settings',
    icon: 'fa-cog',
    description: 'Mandatory configuration only',
  },
  excelViewer: {
    enabled: true,
    name: 'All Orders Data',
    icon: 'fa-file-excel',
    description: 'Master data source - all orders',
  },
};

export const orderStatuses = ['Paid', 'Pending', 'Unpaid'];

export const deliveryAreas = [
  'Panchsheel Greens',
  'A1-A5 Towers',
  'B1-B3 Towers',
  'Nearby Societies',
  'Other',
];
