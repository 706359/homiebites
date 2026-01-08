"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "../../AdminDashboard";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("homiebites_token");
    const admin = localStorage.getItem("homiebites_admin");
    
    if (!token || admin !== "true") {
      router.replace("/login");
    }
  }, [router]);

  return <AdminDashboard />;
}

