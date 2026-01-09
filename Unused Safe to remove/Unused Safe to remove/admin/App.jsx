import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminForgotPassword from "./AdminForgotPassword";
import AdminLogin from "./AdminLogin";
import { NotificationProvider } from "./contexts/NotificationContext";

function AdminRoutes() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("homiebites_token");
        const admin = localStorage.getItem("homiebites_admin");
        const isAuth = !!(token && admin === "true");
        setIsAuthenticated(isAuth);
        
        // Redirect based on auth status
        const path = window.location.pathname;
        if (isAuth && (path === "/" || path === "/admin" || path === "/admin/login")) {
          navigate("/admin/dashboard", { replace: true });
        } else if (!isAuth && path.startsWith("/admin/dashboard")) {
          navigate("/admin/login", { replace: true });
        }
        // If not authenticated and on login/forgot-password routes, allow them to stay
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/admin/dashboard", { replace: true });
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "16px"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/admin" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="*" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
    </Routes>
  );
}

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;


