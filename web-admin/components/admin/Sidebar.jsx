import { useState, useEffect, useRef } from "react";
import { adminFeatures } from "./utils/adminConfig.js";

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {

  return (
    <div
      className={`admin-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
      suppressHydrationWarning
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
          { key: "excelViewer", tabKey: "allOrdersData" }, 
          { key: "orders", tabKey: "currentMonthOrders" }, 
          { key: "analytics", tabKey: "analytics" },
          { key: "customers", tabKey: "customers" },
          { key: "reports", tabKey: "reports" },
          { key: "users", tabKey: "pendingAmounts" }, 
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
        <button
          className="sidebar-collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!sidebarCollapsed && <span className="sidebar-collapse-text">Collapse</span>}
          <i className={`fa-solid ${sidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
