'use client';

import { useState } from 'react';

const HelpCenter = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'fas fa-rocket',
      content: (
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--admin-text-primary)' }}>Welcome to Admin Dashboard</h3>
          <p style={{ marginBottom: '16px', color: 'var(--admin-text-secondary)', lineHeight: '1.6' }}>
            This admin platform provides comprehensive tools for managing orders, customers, analytics, and more.
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--admin-bg-secondary)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--admin-accent)' }}>1. Dashboard</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                View key metrics, revenue trends, and quick insights
              </p>
            </div>
            <div style={{ padding: '12px', background: 'var(--admin-bg-secondary)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--admin-accent)' }}>2. Orders</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                Manage orders, create new ones, or bulk import via CSV
              </p>
            </div>
            <div style={{ padding: '12px', background: 'var(--admin-bg-secondary)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--admin-accent)' }}>3. Analytics</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                Deep dive into revenue trends and customer insights
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'orders',
      title: 'Managing Orders',
      icon: 'fas fa-shopping-cart',
      content: (
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--admin-text-primary)' }}>Order Management</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Creating Orders</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Click the "Add Order" button or press <kbd style={{ padding: '2px 6px', background: 'var(--admin-bg)', borderRadius: '4px' }}>N</kbd> to create a new order. Fill in all required fields and save.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Bulk Import</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Use the CSV upload feature to import multiple orders at once. Ensure your CSV follows the required format.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Filtering & Search</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Use the filter bar to narrow down orders by date, address, payment status, or search by order ID.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: 'fas fa-chart-line',
      content: (
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--admin-text-primary)' }}>Understanding Analytics</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Revenue Trends</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                View monthly revenue trends over the last 12 months. Hover over chart points for detailed information.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Customer Segmentation</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Customers are automatically categorized: New (&lt;₹2k), Regular (₹2k-₹8k), VIP (₹8k-₹15k), Super VIP (≥₹15k).
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Export Reports</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Generate and download reports in various formats for external analysis.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      title: 'Settings & Customization',
      icon: 'fas fa-cog',
      content: (
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--admin-text-primary)' }}>Customize Your Experience</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Theme</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Switch between Light and Dark themes. Dark theme is optimized for long usage sessions.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Font Size</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Adjust font size to your preference for better readability.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--admin-accent)', marginBottom: '8px' }}>Font Family</h4>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Choose from available font families to personalize your dashboard.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      icon: 'fas fa-keyboard',
      content: (
        <div>
          <h3 style={{ marginBottom: '16px', color: 'var(--admin-text-primary)' }}>Work Faster with Shortcuts</h3>
          <p style={{ marginBottom: '16px', color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Use keyboard shortcuts to navigate and perform actions quickly. Press <kbd style={{ padding: '2px 6px', background: 'var(--admin-bg)', borderRadius: '4px' }}>?</kbd> anytime to view all available shortcuts.
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { key: 'N', desc: 'Create new order' },
              { key: '/', desc: 'Focus search' },
              { key: 'Esc', desc: 'Close modals' },
              { key: 'G + D', desc: 'Go to Dashboard' },
              { key: 'G + O', desc: 'Go to Orders' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <kbd style={{ padding: '4px 8px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', borderRadius: '4px', minWidth: '40px', textAlign: 'center' }}>
                  {item.key}
                </kbd>
                <span style={{ color: 'var(--admin-text-secondary)', fontSize: '14px' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', height: '80vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-question-circle" style={{ marginRight: '12px' }}></i>
            Help Center
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={{ display: 'flex', height: 'calc(80vh - 120px)' }}>
          <div
            style={{
              width: '250px',
              borderRight: '1px solid var(--admin-border)',
              padding: '24px',
              overflowY: 'auto',
              background: 'var(--admin-bg-secondary)',
            }}
          >
            <div style={{ display: 'grid', gap: '8px' }}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '12px 16px',
                    background: activeSection === section.id ? 'var(--admin-accent-light)' : 'transparent',
                    color: activeSection === section.id ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
                    border: activeSection === section.id ? '1px solid var(--admin-accent)' : '1px solid transparent',
                  }}
                >
                  <i className={section.icon} style={{ marginRight: '12px', width: '20px' }}></i>
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {sections.find((s) => s.id === activeSection)?.content}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

