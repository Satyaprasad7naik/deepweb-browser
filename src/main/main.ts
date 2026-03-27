import { app, BrowserWindow, Menu, ipcMain, session } from 'electron';
import path from 'path';
import { TorService } from '../services/torService';
import { VpnService } from '../services/vpnService';
import { HistoryService } from '../services/historyService';

let mainWindow: BrowserWindow | null = null;
const torService = new TorService();
const vpnService = new VpnService();
const historyService = new HistoryService();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Load the renderer
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Privacy-enhancing web request interceptors
  setupPrivacyInterceptors();
};

const setupPrivacyInterceptors = () => {
  const ses = session.defaultSession;

  // HTTPS enforcement — upgrade HTTP to HTTPS
  ses.webRequest.onBeforeRequest({ urls: ['http://*/*'] }, (details, callback) => {
    if (details.url.startsWith('http://localhost') || details.url.startsWith('http://127.0.0.1')) {
      callback({});
      return;
    }
    const httpsUrl = details.url.replace(/^http:/, 'https:');
    callback({ redirectURL: httpsUrl });
  });

  // Block known trackers
  const trackerDomains = [
    '*://www.google-analytics.com/*',
    '*://analytics.google.com/*',
    '*://www.googletagmanager.com/*',
    '*://connect.facebook.net/*',
    '*://pixel.facebook.com/*',
    '*://bat.bing.com/*',
  ];

  ses.webRequest.onBeforeRequest({ urls: trackerDomains }, (_details, callback) => {
    callback({ cancel: true });
  });

  // Fingerprint protection — modify headers
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    const headers = { ...details.requestHeaders };
    // Remove fingerprinting headers
    delete headers['Accept-Language'];
    headers['Accept-Language'] = 'en-US,en;q=0.9';
    // Consistent User-Agent
    headers['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    callback({ requestHeaders: headers });
  });
};

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const createMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New Tab', accelerator: 'CmdOrCtrl+T', click: () => mainWindow?.webContents.send('new-tab') },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// ============ IPC Handlers ============

// App
ipcMain.handle('get-app-version', () => app.getVersion());

// Tor
ipcMain.handle('tor:connect', async () => {
  const result = await torService.connect();
  mainWindow?.webContents.send('tor:status-changed', torService.getStatus());
  return result;
});

ipcMain.handle('tor:disconnect', async () => {
  await torService.disconnect();
  mainWindow?.webContents.send('tor:status-changed', torService.getStatus());
});

ipcMain.handle('tor:get-status', () => torService.getStatus());

torService.on('statusChange', (status: string) => {
  mainWindow?.webContents.send('tor:status-changed', status);
});

// VPN
ipcMain.handle('vpn:connect', async (_event, config) => {
  const result = await vpnService.connect(config);
  mainWindow?.webContents.send('vpn:status-changed', vpnService.getStatus());
  return result;
});

ipcMain.handle('vpn:disconnect', async () => {
  await vpnService.disconnect();
  mainWindow?.webContents.send('vpn:status-changed', vpnService.getStatus());
});

ipcMain.handle('vpn:get-status', () => vpnService.getStatus());
ipcMain.handle('vpn:get-ip-info', () => vpnService.getIpInfo());

vpnService.on('statusChange', (status: string) => {
  mainWindow?.webContents.send('vpn:status-changed', status);
});

// History
ipcMain.handle('history:add', (_event, entry) => {
  historyService.add(entry.url, entry.title);
});

ipcMain.handle('history:get-all', () => historyService.getAll());
ipcMain.handle('history:search', (_event, query) => historyService.search(query));
ipcMain.handle('history:clear', () => historyService.clear());

// AI Privacy Guard
ipcMain.handle('ai:analyze-privacy', async (_event, url, content) => {
  try {
    const { analyzePagePrivacy } = await import('../services/aiPrivacyGuard');
    return await analyzePagePrivacy(url, content);
  } catch (error) {
    console.error('AI Privacy Guard error:', error);
    return {
      riskLevel: 'UNKNOWN',
      trackers: [],
      warnings: ['AI analysis unavailable — set ANTHROPIC_API_KEY'],
      recommendation: 'Could not analyze page privacy.',
    };
  }
});
