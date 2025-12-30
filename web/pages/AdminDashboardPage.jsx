import { Navigate, useNavigate } from 'react-router-dom';
import AdminDashboard from '../../admin/AdminDashboard';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Check auth - stable boolean check
  const token = localStorage.getItem('homiebites_token');
  const isAdmin = localStorage.getItem('homiebites_admin') === 'true';
  const isAuthenticated = !!(token && isAdmin);

  // Use Navigate component for auth gating - no useEffect, no loops
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <ErrorBoundary>
      <AdminDashboard onLogout={() => navigate('/admin')} />
    </ErrorBoundary>
  );
}
