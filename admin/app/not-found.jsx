"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home which will handle auth and redirect appropriately
    router.replace("/");
  }, [router]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div>404 - Page Not Found</div>
      <div>Redirecting...</div>
    </div>
  );
}

