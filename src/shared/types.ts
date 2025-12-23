// User and Browser Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoStartVPN: boolean;
  autoConnectTor: boolean;
  defaultSearchEngine: string;
  saveHistory: boolean;
  enableSync: boolean;
  notificationsEnabled: boolean;
  dnsOverHttps: boolean;
  blockTracking: boolean;
  blockScripts: boolean;
}

// Network and Proxy Types
export interface ProxyConfig {
  type: 'socks5' | 'http' | 'https';
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export interface VPNConfig {
  provider: string;
  location: string;
  protocol: 'UDP' | 'TCP';
  isConnected: boolean;
  encryptionLevel: number;
}

// Browser History and Bookmarks
export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
  visitCount: number;
  favicon?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  folderId?: string;
  createdAt: Date;
  modifiedAt: Date;
  tags: string[];
}

// Search and Security
export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  isPrivate: boolean;
  icon?: string;
}

export interface SecurityCertificate {
  domain: string;
  issuer: string;
  expiryDate: Date;
  isValid: boolean;
  publicKeyHash: string;
}

// Download and File Operations
export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  savePath: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}
