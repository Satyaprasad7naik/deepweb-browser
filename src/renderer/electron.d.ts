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

export {};
