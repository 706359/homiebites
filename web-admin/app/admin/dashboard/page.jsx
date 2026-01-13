'use client';

import AdminDashboard from '../../../components/admin/AdminDashboard';
import { NotificationProvider } from '../../../components/admin/contexts/NotificationContext.jsx';
import NotificationWrapper from '../../../components/admin/NotificationWrapper.jsx';
import FontSettingsLoader from '../../../components/FontSettingsLoader';
import '../../../components/admin/styles/index.css';
import ErrorBoundary from '../../../components/ErrorBoundary';

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <FontSettingsLoader />
        <AdminDashboard onLogout={() => (window.location.href = '/admin')} />
        <NotificationWrapper />
      </NotificationProvider>
    </ErrorBoundary>
  );
}
