import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../../admin/AdminDashboard';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  return (
    <ErrorBoundary>
      <AdminDashboard onLogout={() => navigate('/admin')} />
    </ErrorBoundary>
  );
}
