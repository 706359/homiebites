'use client';

import AdminDashboard from '../../../components/admin/AdminDashboard';
import { NotificationProvider } from '../../../components/admin/contexts/NotificationContext.jsx';
import NotificationWrapper from '../../../components/admin/NotificationWrapper.jsx';
import '../../../components/admin/styles/index.css';
import ErrorBoundary from '../../../components/ErrorBoundary';

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AdminDashboard onLogout={() => (window.location.href = '/admin')} />
        <NotificationWrapper />
      </NotificationProvider>
    </ErrorBoundary>
  );
}
