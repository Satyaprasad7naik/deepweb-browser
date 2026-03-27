import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // App
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Navigation
  navigateTo: (url: string) => ipcRenderer.invoke('navigate-to', url),

  // Tor
  torConnect: () => ipcRenderer.invoke('tor:connect'),
  torDisconnect: () => ipcRenderer.invoke('tor:disconnect'),
  torGetStatus: () => ipcRenderer.invoke('tor:get-status'),
  onTorStatusChange: (callback: (status: string) => void) => {
    ipcRenderer.on('tor:status-changed', (_event, status) => callback(status));
  },

  // VPN
  vpnConnect: (config: unknown) => ipcRenderer.invoke('vpn:connect', config),
  vpnDisconnect: () => ipcRenderer.invoke('vpn:disconnect'),
  vpnGetStatus: () => ipcRenderer.invoke('vpn:get-status'),
  vpnGetIpInfo: () => ipcRenderer.invoke('vpn:get-ip-info'),
  onVpnStatusChange: (callback: (status: string) => void) => {
    ipcRenderer.on('vpn:status-changed', (_event, status) => callback(status));
  },

  // History
  historyAdd: (entry: { url: string; title: string }) =>
    ipcRenderer.invoke('history:add', entry),
  historyGetAll: () => ipcRenderer.invoke('history:get-all'),
  historySearch: (query: string) => ipcRenderer.invoke('history:search', query),
  historyClear: () => ipcRenderer.invoke('history:clear'),

  // AI Privacy Guard
  analyzePrivacy: (url: string, content: string) =>
    ipcRenderer.invoke('ai:analyze-privacy', url, content),
});

// Type declaration for renderer
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  navigateTo: (url: string) => Promise<void>;
  torConnect: () => Promise<boolean>;
  torDisconnect: () => Promise<void>;
  torGetStatus: () => Promise<string>;
  onTorStatusChange: (callback: (status: string) => void) => void;
  vpnConnect: (config: unknown) => Promise<boolean>;
  vpnDisconnect: () => Promise<void>;
  vpnGetStatus: () => Promise<string>;
  vpnGetIpInfo: () => Promise<{ ip: string; country: string; isp: string }>;
  onVpnStatusChange: (callback: (status: string) => void) => void;
  historyAdd: (entry: { url: string; title: string }) => Promise<void>;
  historyGetAll: () => Promise<Array<{ id: string; url: string; title: string; visitedAt: string }>>;
  historySearch: (query: string) => Promise<Array<{ id: string; url: string; title: string; visitedAt: string }>>;
  historyClear: () => Promise<void>;
  analyzePrivacy: (url: string, content: string) => Promise<unknown>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
