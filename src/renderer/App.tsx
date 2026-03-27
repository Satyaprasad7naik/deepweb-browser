import React, { useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import WebView from './components/WebView';
import ToolBar from './components/ToolBar';
import Sidebar from './components/Sidebar';
import PrivacyBadge from './components/PrivacyBadge';

export interface Tab {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
  favicon?: string;
  isLoading: boolean;
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      url: 'about:blank',
      title: 'New Tab',
      isActive: true,
      isLoading: false,
    },
  ]);
  const [currentTabId, setCurrentTabId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [torStatus, setTorStatus] = useState('disconnected');
  const [vpnStatus, setVpnStatus] = useState('disconnected');

  const currentTab = tabs.find((tab) => tab.id === currentTabId);

  const addTab = useCallback(
    (url: string = 'about:blank') => {
      const newId = Date.now().toString();
      const newTab: Tab = {
        id: newId,
        url,
        title: 'New Tab',
        isActive: false,
        isLoading: false,
      };
      setTabs((prev) => [...prev, newTab]);
      setCurrentTabId(newId);
    },
    []
  );

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== id);
        if (newTabs.length === 0) {
          const freshTab: Tab = {
            id: Date.now().toString(),
            url: 'about:blank',
            title: 'New Tab',
            isActive: true,
            isLoading: false,
          };
          setCurrentTabId(freshTab.id);
          return [freshTab];
        }
        if (id === currentTabId) {
          setCurrentTabId(newTabs[0].id);
        }
        return newTabs;
      });
    },
    [currentTabId]
  );

  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)));
  }, []);

  const navigateTo = useCallback(
    (url: string) => {
      if (currentTab) {
        updateTab(currentTab.id, { url, isLoading: true, title: url });
        // Simulate page load
        setTimeout(() => {
          updateTab(currentTab.id, { isLoading: false });
        }, 1500);
      }
    },
    [currentTab, updateTab]
  );

  const goBack = useCallback(() => {
    // Browser history back — requires webview integration
  }, []);

  const goForward = useCallback(() => {
    // Browser history forward — requires webview integration
  }, []);

  const reload = useCallback(() => {
    if (currentTab) {
      updateTab(currentTab.id, { isLoading: true });
      setTimeout(() => updateTab(currentTab.id, { isLoading: false }), 1000);
    }
  }, [currentTab, updateTab]);

  // Listen for Tor/VPN status changes from main process
  if (typeof window !== 'undefined' && window.electronAPI) {
    window.electronAPI.onTorStatusChange?.((status: string) => setTorStatus(status));
    window.electronAPI.onVpnStatusChange?.((status: string) => setVpnStatus(status));
  }

  return (
    <Provider store={store}>
      <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="app-header">
          <ToolBar
            onBack={goBack}
            onForward={goForward}
            onReload={reload}
            onAddTab={() => addTab()}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            isLoading={currentTab?.isLoading || false}
          />
          <div className="address-bar-wrapper" style={{ display: 'flex', gap: '8px' }}>
            <AddressBar
              url={currentTab?.url || ''}
              onNavigate={navigateTo}
              isLoading={currentTab?.isLoading || false}
            />
            <PrivacyBadge report={null} isAnalyzing={false} />
          </div>
        </div>

        <div className="app-container">
          {sidebarOpen && <Sidebar torStatus={torStatus} vpnStatus={vpnStatus} />}
          <div className="app-main">
            <TabBar
              tabs={tabs}
              activeTabId={currentTabId}
              onTabClick={setCurrentTabId}
              onTabClose={closeTab}
              onNewTab={() => addTab()}
            />
            {currentTab && (
              <WebView
                tab={currentTab}
                onTitleChange={(title) => updateTab(currentTab.id, { title })}
                onLoadingChange={(isLoading) => updateTab(currentTab.id, { isLoading })}
              />
            )}
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
