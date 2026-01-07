import { useEffect, useState, useRef } from "react";

const TopNav = ({
  sidebarOpen,
  setSidebarOpen,
  unreadNotifications,
  currentUser,
  onLogout,
  setActiveTab,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const profileDropdownRef = useRef(null);

  // Global search shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === "Escape" && showSearchModal) {
        setShowSearchModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearchModal]);

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

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("homiebites_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) return;

    // Add to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("homiebites_recent_searches", JSON.stringify(updated));

    // Navigate based on search
    if (query.toLowerCase().includes("order")) {
      setActiveTab("allOrdersData");
    } else if (query.toLowerCase().includes("customer")) {
      setActiveTab("customers");
    } else if (
      query.toLowerCase().includes("payment") ||
      query.toLowerCase().includes("pending")
    ) {
      setActiveTab("pendingAmounts");
    } else if (query.toLowerCase().includes("report")) {
      setActiveTab("reports");
    } else {
      setActiveTab("allOrdersData");
    }

    setShowSearchModal(false);
    setSearchQuery("");
  };

  const quickActions = [
    {
      label: "Add new order",
      icon: "fa-plus",
      action: () => setActiveTab("currentMonthOrders"),
    },
    {
      label: "Generate report",
      icon: "fa-file-alt",
      action: () => setActiveTab("reports"),
    },
    {
      label: "View analytics",
      icon: "fa-chart-line",
      action: () => setActiveTab("analytics"),
    },
    {
      label: "Pending payments",
      icon: "fa-exclamation-triangle",
      action: () => setActiveTab("pendingAmounts"),
    },
  ];

  return (
    <>
      <div className="admin-top-nav">
        <div className="top-nav-left">
          <button
            className="top-nav-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
        <div className="top-nav-right">
          <button
            className="top-nav-search-btn"
            onClick={() => setShowSearchModal(true)}
            title="Search (Ctrl+K)"
          >
            <i className="fa-solid fa-search"></i>
            <span className="top-nav-search-shortcut">Ctrl+K</span>
          </button>
          <button
            className="top-nav-notification-btn"
            onClick={() => setActiveTab("notifications")}
            title="Notifications"
          >
            <i className="fa-solid fa-bell"></i>
            {unreadNotifications > 0 && (
              <span className="top-nav-badge">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="modal-container global-search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="global-search-header">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search everywhere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
                autoFocus
                className="global-search-input"
              />
              <button
                className="modal-close"
                onClick={() => setShowSearchModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="global-search-content">
              {recentSearches.length > 0 && (
                <div className="global-search-section">
                  <h4>Recent Searches</h4>
                  <div className="global-search-list">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        className="global-search-item"
                        onClick={() => handleSearch(search)}
                      >
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="global-search-section">
                <h4>Quick Actions</h4>
                <div className="global-search-list">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      className="global-search-item"
                      onClick={() => {
                        action.action();
                        setShowSearchModal(false);
                      }}
                    >
                      <i className={`fa-solid ${action.icon}`}></i>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
