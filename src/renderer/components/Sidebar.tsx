import React from 'react';

interface SidebarProps {
  torStatus?: string;
  vpnStatus?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ torStatus = 'disconnected', vpnStatus = 'disconnected' }) => {
  return (
    <aside className="sidebar" id="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">DW</div>
        <div className="sidebar-title">
          <h1>DeepWeb</h1>
          <span>v1.0.0 — Privacy First</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          <button className="sidebar-item active" id="nav-home">
            <span className="sidebar-item-icon">🏠</span>
            Home
          </button>
          <button className="sidebar-item" id="nav-bookmarks">
            <span className="sidebar-item-icon">⭐</span>
            Bookmarks
          </button>
          <button className="sidebar-item" id="nav-history">
            <span className="sidebar-item-icon">🕐</span>
            History
          </button>
          <button className="sidebar-item" id="nav-downloads">
            <span className="sidebar-item-icon">📥</span>
            Downloads
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Privacy</div>
          <button className="sidebar-item" id="nav-tor">
            <span className="sidebar-item-icon">🧅</span>
            Tor Network
          </button>
          <button className="sidebar-item" id="nav-vpn">
            <span className="sidebar-item-icon">🔐</span>
            VPN
          </button>
          <button className="sidebar-item" id="nav-privacy-guard">
            <span className="sidebar-item-icon">🤖</span>
            AI Privacy Guard
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Settings</div>
          <button className="sidebar-item" id="nav-settings">
            <span className="sidebar-item-icon">⚙️</span>
            Settings
          </button>
          <button className="sidebar-item" id="nav-security">
            <span className="sidebar-item-icon">🛡️</span>
            Security
          </button>
        </div>
      </nav>

      {/* Status Panel */}
      <div className="sidebar-status">
        <div className="status-card">
          <div className="status-card-header">
            <span className="status-card-title">🧅 Tor</span>
            <span className={`status-indicator ${torStatus}`} />
          </div>
          <div className="status-card-info">
            {torStatus === 'connected'
              ? 'Routing through Tor • SOCKS5 :9050'
              : torStatus === 'connecting'
              ? 'Establishing circuit...'
              : 'Disconnected'}
          </div>
        </div>

        <div className="status-card">
          <div className="status-card-header">
            <span className="status-card-title">🔐 VPN</span>
            <span className={`status-indicator ${vpnStatus}`} />
          </div>
          <div className="status-card-info">
            {vpnStatus === 'connected'
              ? 'Encrypted tunnel active'
              : vpnStatus === 'connecting'
              ? 'Establishing tunnel...'
              : 'Disconnected'}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
