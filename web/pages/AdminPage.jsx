import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../../admin/AdminLogin';

export default function AdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const admin = localStorage.getItem('homiebites_admin');
    const user = localStorage.getItem('homiebites_user');
    if (admin === 'true' || (user && JSON.parse(user).role === 'admin')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate('/admin/dashboard');
  };

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}
