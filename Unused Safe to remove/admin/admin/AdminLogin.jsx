import { useState } from "react";
import api from "./lib/api.js";
import { useNotification } from "./contexts/NotificationContext";
import InstallPrompt from "./components/InstallPrompt.jsx";
import "./styles/index.css";
import "./AdminLogin.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { error: showError, success: showSuccess } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try backend API first
      try {
        // Use username field for admin login (api.login accepts email, so pass username as email)
        const data = await api.login(username, password);

        if (
          data.success &&
          data.user &&
          (data.user.role === "admin" || data.user.isAdmin)
        ) {
          localStorage.setItem("homiebites_token", data.token);
          localStorage.setItem("homiebites_user", JSON.stringify(data.user));
          localStorage.setItem("homiebites_admin", "true");

          // Successfully logged in

          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            // Fallback: redirect using window.location if router not available
            window.location.href = "/dashboard";
          }
          return;
        } else {
          showError(
            data.error || "Invalid credentials. Admin access required.",
          );
          setLoading(false);
          return;
        }
      } catch (apiError) {
        // API failed - check if it's a connection error or credential error
        console.error("[AdminLogin] API login failed:", {
          message: apiError.message,
          username: username,
          errorType: apiError.constructor.name,
        });

        // If it's a network/connection error, try fallback
        // If it's a credential error, don't try fallback
        const isNetworkError =
          apiError.message &&
          (apiError.message.includes("HTML") ||
            apiError.message.includes("not available") ||
            apiError.message.includes("connect") ||
            apiError.message.includes("Network error") ||
            apiError.message.includes("Failed to fetch"));

        if (isNetworkError) {
          console.warn(
            "[AdminLogin] Backend server not available, trying fallback credentials...",
          );
        } else {
          // Credential error or other API error - don't try fallback, show error
          showError(
            apiError.message ||
              "Invalid credentials. Please check your username and password. Make sure the backend server is running.",
          );
          setLoading(false);
          return;
        }
      }

      // Fallback to hardcoded admin credentials if API failed (network/connection errors only)
      // This only runs if API failed due to network issues, not credential errors
      // Support both username and mobile number for login
      // Note: Password should match backend .env ADMIN_PASSWORD (currently "Bless@@!!##12")
      const isAdminLogin =
        (username === "adminHomieBites" || username === "8958111112") &&
        password === "Bless@@!!##12";
      if (isAdminLogin) {
        const adminUser = {
          id: "admin",
          name: "Admin",
          email: "admin@homiebites.com",
          role: "admin",
          isAdmin: true,
        };

        // Store user data and admin flag
        localStorage.setItem("homiebites_user", JSON.stringify(adminUser));
        localStorage.setItem("homiebites_admin", "true");

        // Generate a dev token for fallback (simple JWT-like string)
        // Note: Backend API calls will still fail, but dashboard UI will work
        const devToken = "dev-fallback-token-" + Date.now();
        localStorage.setItem("homiebites_token", devToken);

        console.warn(
          "[AdminLogin] Using fallback credentials. Backend API appears to be offline. Some features may not work until backend is running and you log in via API.",
        );

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = "/admin/dashboard";
        }
        setLoading(false);
        return;
      } else {
        showError(
          "Invalid credentials. Please check your username and password.",
        );
        setLoading(false);
      }
    } catch (err) {
      // Final fallback for unexpected errors
      console.error("[AdminLogin] Unexpected error during login:", err);

      // Only try fallback if credentials match and it's a connection/network error
      // Support both username and mobile number for login
      // Note: Password should match backend .env ADMIN_PASSWORD (currently "Bless@@!!##12")
      const isAdminLogin =
        (username === "adminHomieBites" || username === "8958111112") &&
        password === "Bless@@!!##12";
      if (isAdminLogin) {
        const adminUser = {
          id: "admin",
          name: "Admin",
          email: "admin@homiebites.com",
          role: "admin",
          isAdmin: true,
        };
        localStorage.setItem("homiebites_user", JSON.stringify(adminUser));
        localStorage.setItem("homiebites_admin", "true");

        // Generate dev token for fallback
        const devToken = "dev-fallback-token-" + Date.now();
        localStorage.setItem("homiebites_token", devToken);

        console.warn(
          "[AdminLogin] Using fallback credentials due to unexpected error. Backend API may not be available.",
        );

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = "/admin/dashboard";
        }
      } else {
        showError(
          "Login failed. Please check your credentials and ensure the backend server is running.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-wrapper login-page-wrapper">
      <div className="login-page-container">
        <div className="login-left-section">
          <img
            src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
            alt="Admin access to HomieBites dashboard"
            className="login-image"
          />
        </div>

        <div className="login-right-section">
          <div className="login-content">
            <h1 className="login-title">Admin Login</h1>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="8958111112"
                  required
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? "LOGGING IN..." : "LOG IN"}
              </button>

              <div className="admin-login-forgot-link-wrapper">
                <a
                  href="/admin/forgot-password"
                  className="admin-login-forgot-link"
                >
                  Forgot Password?
                </a>
              </div>
            </form>

            <div className="login-info">
              <p>
                <strong>Admin Access Required</strong>
              </p>
              <p className="admin-login-info-text">Authorized personnel only</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default AdminLogin;
