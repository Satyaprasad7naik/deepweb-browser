import React, { useState, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import WebView from './components/WebView';
import ToolBar from './components/ToolBar';
import Sidebar from './components/Sidebar';
import './styles/App.css';

export interface Tab {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
  favicon?: string;
  isLoading: boolean;
}

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{
    id: '1',
    url: 'about:blank',
    title: 'New Tab',
    isActive: true,
    isLoading: false,
  }]);
  const [currentTabId, setCurrentTabId] = useState('1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const currentTab = tabs.find(tab => tab.id === currentTabId);

  const addTab = useCallback((url: string = 'about:blank') => {
    const newId = Date.now().toString();
    const newTab: Tab = {
      id: newId,
      url,
      title: 'New Tab',
      isActive: false,
      isLoading: false,
    };
    setTabs([...tabs, newTab]);
    setCurrentTabId(newId);
  }, [tabs]);

  const closeTab = useCallback((id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    if (newTabs.length === 0) {
      addTab();
    } else {
      setTabs(newTabs);
      if (id === currentTabId) {
        setCurrentTabId(newTabs[0].id);
      }
    }
  }, [tabs, currentTabId, addTab]);

  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs(tabs.map(tab => tab.id === id ? { ...tab, ...updates } : tab));
  }, [tabs]);

  const navigateTo = useCallback((url: string) => {
    if (currentTab) {
      updateTab(currentTab.id, { url, isLoading: true });
    }
  }, [currentTab, updateTab]);

  const goBack = useCallback(() => {
    if (currentTab) {
      // Implement history back
    }
  }, [currentTab]);

  const goForward = useCallback(() => {
    if (currentTab) {
      // Implement history forward
    }
  }, [currentTab]);

  const reload = useCallback(() => {
    if (currentTab) {
      updateTab(currentTab.id, { isLoading: true });
    }
  }, [currentTab, updateTab]);

  return (
    <Provider store={store}>
      <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="app-header">
          <ToolBar 
            onBack={goBack}
            onForward={goForward}
            onReload={reload}
            onAddTab={addTab}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            isLoading={currentTab?.isLoading || false}
          />
          <AddressBar 
            url={currentTab?.url || ''}
            onNavigate={navigateTo}
            isLoading={currentTab?.isLoading || false}
          />
        </div>

        <div className="app-container">
          {sidebarOpen && (
            <Sidebar />
          )}
          <div className="app-main">
            <TabBar 
              tabs={tabs}
              activeTabId={currentTabId}
              onTabClick={setCurrentTabId}
              onTabClose={closeTab}
              onNewTab={addTab}
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
