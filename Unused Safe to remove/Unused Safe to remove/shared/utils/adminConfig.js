// Admin Configuration - Shared settings for admin dashboard

export const adminFeatures = {
  dashboard: {
    enabled: true,
    name: "Dashboard",
    icon: "fa-chart-bar",
    description: "Quick health check - KPIs only",
  },
  orders: {
    enabled: true,
    name: "Current Month",
    icon: "fa-calendar-alt",
    description: "Daily operations - current month records",
  },
  customers: {
    enabled: true,
    name: "Customers",
    icon: "fa-users",
    description: "Customer management and address list",
  },
  users: {
    enabled: true,
    name: "Pending Amounts",
    icon: "fa-money-bill-wave",
    description: "Money recovery - pending payments",
  },
  analytics: {
    enabled: true,
    name: "Analytics",
    icon: "fa-chart-line",
    description: "Decision-focused reports",
  },
  reports: {
    enabled: true,
    name: "Reports",
    icon: "fa-file-lines",
    description: "Pre-built reports and exports",
  },
  notifications: {
    enabled: true,
    name: "Notifications",
    icon: "fa-bell",
    description: "Communication control",
  },
  settings: {
    enabled: true,
    name: "Settings",
    icon: "fa-cog",
    description: "Mandatory configuration only",
  },
  excelViewer: {
    enabled: true,
    name: "All Orders",
    icon: "fa-list",
    description: "Master data source - all orders",
  },
};

export const orderStatuses = ["Paid", "Pending", "Unpaid"];

export const deliveryAreas = [
  "Panchsheel Greens",
  "A1-A5 Towers",
  "B1-B3 Towers",
  "Nearby Societies",
  "Other",
];
