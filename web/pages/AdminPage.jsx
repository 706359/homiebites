import { Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from '../../admin/AdminLogin';

export default function AdminPage() {
  const navigate = useNavigate();

  // Check if already authenticated - stable boolean check
  const token = localStorage.getItem('homiebites_token');
  const admin = localStorage.getItem('homiebites_admin');
  const userStr = localStorage.getItem('homiebites_user');
  
  let userRole = null;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userRole = user?.role;
    } catch (e) {
      // Invalid JSON, ignore
    }
  }
  
  const isAuthenticated = !!(token && (admin === 'true' || userRole === 'admin'));

  // If already authenticated, redirect to dashboard - use Navigate component (no loops)
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    navigate('/admin/dashboard');
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
