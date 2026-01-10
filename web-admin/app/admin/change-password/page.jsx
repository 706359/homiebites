'use client';

/**
 * Change Password Page
 * For temporary password or regular password change
 * Following ADMIN_PASSWORD.md specification
 */
import { useSearchParams } from 'next/navigation';
import NotificationWrapper from '../../../components/admin/NotificationWrapper.jsx';
import { NotificationProvider } from '../../../components/admin/contexts/NotificationContext.jsx';
import ChangePasswordForm from './ChangePasswordForm';

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const isTemporary = searchParams.get('temporary') === 'true';

  return (
    <NotificationProvider>
      <ChangePasswordForm isTemporary={isTemporary} />
      <NotificationWrapper />
    </NotificationProvider>
  );
}
