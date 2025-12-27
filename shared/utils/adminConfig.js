// Admin Configuration - Shared settings for admin dashboard

export const adminFeatures = {
  dashboard: {
    enabled: true,
    name: 'Dashboard',
    icon: 'fa-home',
    description: 'Overview of orders, revenue, and key metrics'
  },
  menu: {
    enabled: true,
    name: 'Menu Management',
    icon: 'fa-utensils',
    description: 'Manage menu items, prices, and categories'
  },
  orders: {
    enabled: true,
    name: 'Order Management',
    icon: 'fa-shopping-cart',
    description: 'View and manage customer orders'
  },
  users: {
    enabled: true,
    name: 'User Management',
    icon: 'fa-users',
    description: 'Manage customer accounts and data'
  },
  settings: {
    enabled: true,
    name: 'Settings',
    icon: 'fa-cog',
    description: 'Configure app and website settings'
  },
  analytics: {
    enabled: true,
    name: 'Analytics',
    icon: 'fa-chart-line',
    description: 'View sales and order analytics'
  },
  notifications: {
    enabled: true,
    name: 'Notifications',
    icon: 'fa-bell',
    description: 'Manage announcements and notifications'
  },
  offers: {
    enabled: true,
    name: 'Offers & Discounts',
    icon: 'fa-tag',
    description: 'Create and manage special offers and discounts'
  },
  summary: {
    enabled: true,
    name: 'Summary Report',
    icon: 'fa-table',
    description: 'View orders in Excel-style summary format with monthly totals'
  },
  customers: {
    enabled: true,
    name: 'Customers & Addresses',
    icon: 'fa-address-book',
    description: 'View all customer addresses with order history and statistics'
  }
}

export const orderStatuses = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
]

export const deliveryAreas = [
  'Panchsheel Greens',
  'A1-A5 Towers',
  'B1-B3 Towers',
  'Nearby Societies',
  'Other'
]

