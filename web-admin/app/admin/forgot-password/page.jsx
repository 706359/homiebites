"use client";

import AdminForgotPassword from "../../../components/admin/AdminForgotPassword";
import NotificationWrapper from "../../../components/admin/NotificationWrapper.jsx";
import { NotificationProvider } from "../../../components/admin/contexts/NotificationContext.jsx";

export default function AdminForgotPasswordPage() {
  return (
    <NotificationProvider>
      <AdminForgotPassword />
      <NotificationWrapper />
    </NotificationProvider>
  );
}
