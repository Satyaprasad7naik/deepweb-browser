import React from 'react';

interface Tab {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
  favicon?: string;
  isLoading: boolean;
}

interface WebViewProps {
  tab: Tab;
  onTitleChange: (title: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

const shortcuts = [
  { icon: '🦆', label: 'DuckDuckGo', url: 'https://duckduckgo.com' },
  { icon: '📖', label: 'Wikipedia', url: 'https://wikipedia.org' },
  { icon: '💻', label: 'GitHub', url: 'https://github.com' },
  { icon: '📰', label: 'Hacker News', url: 'https://news.ycombinator.com' },
];

const WebView: React.FC<WebViewProps> = ({ tab, onTitleChange, onLoadingChange }) => {
  const isBlankPage = tab.url === 'about:blank' || tab.url === '';

  if (isBlankPage) {
    return (
      <div className="webview-container">
        <div className="new-tab-page fade-in">
          <div className="new-tab-logo">DW</div>
          <h2 className="new-tab-title">DeepWeb Browser</h2>
          <p className="new-tab-subtitle">
            Privacy-first browsing with Tor integration, VPN support,
            <br />
            and AI-powered privacy analysis.
          </p>
          <div className="new-tab-shortcuts">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.url}
                className="shortcut-card"
                onClick={() => {
                  onTitleChange(shortcut.label);
                  onLoadingChange(true);
                  // In a real browser, this would navigate the webview
                  setTimeout(() => onLoadingChange(false), 1500);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="shortcut-icon">{shortcut.icon}</div>
                <span className="shortcut-label">{shortcut.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For non-blank pages, show loading or content area
  return (
    <div className="webview-container">
      {tab.isLoading ? (
        <div className="new-tab-page fade-in">
          <div className="address-bar-loading" style={{ width: 32, height: 32 }} />
          <p className="new-tab-subtitle">Loading {tab.url}...</p>
        </div>
      ) : (
        <div className="new-tab-page fade-in">
          <p className="new-tab-subtitle" style={{ fontSize: '14px' }}>
            🌐 Navigated to: <strong>{tab.url}</strong>
          </p>
          <p className="new-tab-subtitle">
            Content rendering requires Electron webview tag or BrowserView.
            <br />
            This UI demonstrates the browser shell architecture.
          </p>
        </div>
      )}
    </div>
  );
};

export default WebView;
