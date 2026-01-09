"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check authentication status
    const token = localStorage.getItem("homiebites_token");
    const admin = localStorage.getItem("homiebites_admin");
    
    if (token && admin === "true") {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
    }}>
      <div>Loading...</div>
    </div>
  );
}

