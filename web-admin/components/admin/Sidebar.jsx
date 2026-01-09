import { useState, useEffect, useRef } from "react";
import { adminFeatures } from "./utils/adminConfig.js";

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  onLogout,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showProfileDropdown]);

  return (
    <div
      className={`admin-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img
            src="/logo.png"
            alt="HomieBites"
            className="sidebar-logo-img"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
            onClick={() => setActiveTab("dashboard")}
            style={{ cursor: "pointer" }}
          />
          <div className="sidebar-logo-fallback" style={{ display: "none" }} onClick={() => setActiveTab("dashboard")}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {[
          { key: "dashboard", tabKey: "dashboard" },
          { key: "excelViewer", tabKey: "allOrdersData" }, // Map 'excelViewer' config key to 'allOrdersData' tab
          { key: "orders", tabKey: "currentMonthOrders" }, // Map 'orders' config key to 'currentMonthOrders' tab
          { key: "analytics", tabKey: "analytics" },
          { key: "customers", tabKey: "customers" },
          { key: "reports", tabKey: "reports" },
          { key: "users", tabKey: "pendingAmounts" }, // Map 'users' config key to 'pendingAmounts' tab
          { key: "menuPrice", tabKey: "menuPrice" },
          { key: "notifications", tabKey: "notifications" },
          { key: "settings", tabKey: "settings" },
        ]
          .map(({ key, tabKey }) => [key, adminFeatures[key], tabKey])
          .filter(([key, feature]) => feature && feature.enabled)
          .map(([key, feature, tabKey]) => (
            <button
              key={key}
              className={`sidebar-item ${activeTab === tabKey ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tabKey);
                setSidebarOpen(false);
              }}
              title={sidebarCollapsed ? feature.name : ""}
            >
              <i className={`fa-solid ${feature.icon}`}></i>
              {!sidebarCollapsed && <span>{feature.name}</span>}
            </button>
          ))}
      </nav>

      <div className="sidebar-footer">
        {/* Profile Section */}
        <div className="sidebar-profile-section" ref={profileDropdownRef}>
          <button
            className="sidebar-profile-btn sidebar-item"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            title={sidebarCollapsed ? "Profile" : ""}
          >
            <div className="sidebar-profile-avatar">
              {currentUser?.name ? (
                <span>
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-profile-info">
                <div className="sidebar-profile-name">
                  {currentUser?.name || "Admin User"}
                </div>
              </div>
            )}
            {!sidebarCollapsed && (
              <i
                className={`fa-solid fa-chevron-${showProfileDropdown ? "up" : "down"}`}
                style={{ marginLeft: "auto", fontSize: "12px", opacity: 0.6 }}
              ></i>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && !sidebarCollapsed && (
            <div className="sidebar-profile-dropdown">
              <button
                className="sidebar-profile-dropdown-item"
                onClick={() => {
                  setActiveTab("settings");
                  setShowProfileDropdown(false);
                  setSidebarOpen(false);
                }}
              >
                <i className="fa-solid fa-user-gear"></i>
                <span>Profile Settings</span>
              </button>
              <button
                className="sidebar-profile-dropdown-item"
                onClick={() => {
                  setActiveTab("settings");
                  setShowProfileDropdown(false);
                  setSidebarOpen(false);
                }}
              >
                <i className="fa-solid fa-cog"></i>
                <span>Settings</span>
              </button>
              <div className="sidebar-profile-divider"></div>
              <button
                className="sidebar-profile-dropdown-item sidebar-profile-dropdown-item-danger"
                onClick={() => {
                  setShowProfileDropdown(false);
                  onLogout();
                }}
              >
                <i className="fa-solid fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="sidebar-toggle-btn sidebar-item"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={`fa-solid ${sidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}
          ></i>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>

        <button
          className="sidebar-item logout-btn"
          onClick={onLogout}
          title={sidebarCollapsed ? "Logout" : ""}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
