import React from 'react';

interface Tab {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
  favicon?: string;
  isLoading: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onTabClick, onTabClose, onNewTab }) => {
  return (
    <div className="tab-bar" id="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={() => onTabClick(tab.id)}
          title={tab.title}
        >
          {tab.isLoading && <div className="address-bar-loading" style={{ width: 12, height: 12 }} />}
          <span className="tab-title">{tab.title || 'New Tab'}</span>
          <span
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            role="button"
            tabIndex={0}
          >
            ✕
          </span>
        </button>
      ))}
      <button className="tab-add" onClick={() => onNewTab()} title="New Tab" id="tab-add-btn">
        ＋
      </button>
    </div>
  );
};

export default TabBar;
