'use client';

/**
 * Reset Password Page
 * Using token from email reset link
 * Following ADMIN_PASSWORD.md specification
 */
import { useParams } from 'next/navigation';
import NotificationWrapper from '../../../../components/admin/NotificationWrapper.jsx';
import { NotificationProvider } from '../../../../components/admin/contexts/NotificationContext.jsx';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params?.token;

  return (
    <NotificationProvider>
      <ResetPasswordForm token={token} />
      <NotificationWrapper />
    </NotificationProvider>
  );
}
