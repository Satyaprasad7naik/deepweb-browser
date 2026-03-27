// ============ Application Constants ============

export const APP_NAME = 'DeepWeb Browser';
export const APP_VERSION = '1.0.0';

// ============ IPC Channels ============

export const IPC_CHANNELS = {
  // App
  GET_APP_VERSION: 'get-app-version',

  // Navigation
  NAVIGATE_TO: 'navigate-to',
  NEW_TAB: 'new-tab',

  // Tor
  TOR_CONNECT: 'tor:connect',
  TOR_DISCONNECT: 'tor:disconnect',
  TOR_GET_STATUS: 'tor:get-status',
  TOR_STATUS_CHANGED: 'tor:status-changed',

  // VPN
  VPN_CONNECT: 'vpn:connect',
  VPN_DISCONNECT: 'vpn:disconnect',
  VPN_GET_STATUS: 'vpn:get-status',
  VPN_GET_IP_INFO: 'vpn:get-ip-info',
  VPN_STATUS_CHANGED: 'vpn:status-changed',

  // History
  HISTORY_ADD: 'history:add',
  HISTORY_GET_ALL: 'history:get-all',
  HISTORY_SEARCH: 'history:search',
  HISTORY_CLEAR: 'history:clear',

  // AI Privacy Guard
  AI_ANALYZE_PRIVACY: 'ai:analyze-privacy',
} as const;

// ============ Default Configuration ============

export const DEFAULT_CONFIG = {
  tor: {
    socksPort: 9050,
    controlPort: 9051,
    connectionTimeout: 30000,
  },
  vpn: {
    defaultProvider: 'protonvpn',
    defaultProtocol: 'openvpn' as const,
  },
  privacy: {
    httpsOnly: true,
    blockTracking: true,
    blockFingerprinting: true,
    dnsOverHttps: true,
  },
  search: {
    defaultEngine: 'duckduckgo',
  },
} as const;

// ============ Search Engines ============

export const SEARCH_ENGINES = {
  duckduckgo: {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    isPrivate: true,
    icon: '🦆',
  },
  startpage: {
    name: 'Startpage',
    url: 'https://www.startpage.com/do/dsearch?query=',
    isPrivate: true,
    icon: '🔒',
  },
  brave: {
    name: 'Brave Search',
    url: 'https://search.brave.com/search?q=',
    isPrivate: true,
    icon: '🦁',
  },
  google: {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    isPrivate: false,
    icon: '🔍',
  },
} as const;

// ============ Known Tracker Domains ============

export const TRACKER_DOMAINS = [
  'google-analytics.com',
  'analytics.google.com',
  'googletagmanager.com',
  'connect.facebook.net',
  'pixel.facebook.com',
  'bat.bing.com',
  'doubleclick.net',
  'ads.yahoo.com',
  'ad.doubleclick.net',
  'hotjar.com',
  'mixpanel.com',
  'segment.com',
  'amplitude.com',
  'optimizely.com',
  'criteo.com',
] as const;
