"use client";

import AdminDashboard from "../../../../admin/AdminDashboard";
import ErrorBoundary from "../../../components/ErrorBoundary";

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary>
      <AdminDashboard onLogout={() => (window.location.href = "/admin")} />
    </ErrorBoundary>
  );
}
