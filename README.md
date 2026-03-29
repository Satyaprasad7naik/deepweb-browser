# DeepWeb Browser

![CI](https://github.com/Satyaprasad7naik/deepweb-browser/actions/workflows/ci.yml/badge.svg) ![Status](https://img.shields.io/badge/status-actively%20maintained-brightgreen) ![Last Updated](https://img.shields.io/badge/updated-March%202026-blue)

An industry-grade deepweb browser with advanced privacy, security, and anonymous browsing capabilities. Built with Electron + React + TypeScript, featuring Tor integration, VPN support, and AI-powered privacy analysis.

> **Note:** This project is under active development with recent commits and continuous improvements to privacy, security, and user experience.

## 📸 Screenshots

### Main Browser Interface
```
┌─────────────────────────────────────────────────────────┐
│ 🔒 🎭 🧅 • localhost:3000 • Search or enter address     │ Toolbar
├─────────────────────────────────────────────────────────┤
│ 🏠 Deep Web    📑 Dashboard    ⚙️ Settings              │ Navigation
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome to DeepWeb Browser                            │
│                                                         │
│  🧅 TOR        🔐 VPN        🤖 AI Privacy Guard       │
│  [Connected]   [Standby]     [Enabled]                 │
│                                                         │
│  🔒 Privacy First • 🛡️ Secure • 📊 No Tracking        │
│                                                         │
│  Shortcuts:  [Gmail]  [GitHub]  [Reddit]  [Twitter]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**To see the live UI:**
```bash
npm run dev
# Opens browser at http://localhost:5173 with full interface
```

## ✨ Features

### Core Browser
- ⚡ **Fast & Lightweight** — Built on Chromium/Electron for optimal performance
- 🗂️ **Multi-tab Support** — Open, close, reload, and navigate tabs
- ⭐ **Bookmarks & History** — Save favorites and browse history with search
- 🔍 **Smart Address Bar** — URL validation, auto-HTTPS, search fallback to DuckDuckGo

### Privacy & Security
- 🧅 **Tor Network** — Route traffic through SOCKS5 proxy on port 9050
- 🔐 **VPN Integration** — Connect to ProtonVPN, Mullvad, or custom providers
- 🔒 **HTTPS Enforcement** — Automatic HTTP → HTTPS upgrade
- 🛡️ **Tracker Blocking** — Blocks Google Analytics, Facebook Pixel, and more
- 🎭 **Fingerprint Protection** — Consistent User-Agent and header normalization
- 🧹 **URL Sanitization** — Strips UTM and tracking parameters

### 🤖 AI Privacy Guard (Unique Feature!)
- Claude-powered real-time page analysis
- Detects trackers, fingerprinting scripts, and cookies
- Risk levels: 🟢 LOW / 🟡 MEDIUM / 🔴 HIGH
- One-click privacy report in the toolbar

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Electron 28 |
| **UI** | React 18 + TypeScript 5 |
| **Build** | electron-vite + Vite 5 |
| **State** | Redux Toolkit |
| **AI** | Anthropic Claude API |
| **Testing** | Jest + ts-jest |
| **CI/CD** | GitHub Actions |

## Project Structure

```
deepweb-browser/
├── src/
│   ├── main/
│   │   ├── main.ts              # Electron main process + IPC handlers
│   │   └── preload.ts           # Secure IPC bridge (contextBridge)
│   ├── renderer/
│   │   ├── index.html           # Entry HTML
│   │   ├── index.tsx            # React entry point
│   │   ├── App.tsx              # Root component
│   │   ├── components/
│   │   │   ├── TabBar.tsx       # Tab management
│   │   │   ├── AddressBar.tsx   # URL input + validation
│   │   │   ├── ToolBar.tsx      # Navigation toolbar
│   │   │   ├── WebView.tsx      # Web content + new tab page
│   │   │   ├── Sidebar.tsx      # Nav + Tor/VPN status
│   │   │   └── PrivacyBadge.tsx # AI privacy risk indicator
│   │   ├── store/
│   │   │   ├── store.ts
│   │   │   └── slices/settingsSlice.ts
│   │   └── styles/App.css
│   ├── services/
│   │   ├── torService.ts        # Tor process management
│   │   ├── vpnService.ts        # VPN connection lifecycle
│   │   ├── historyService.ts    # Browsing history
│   │   ├── searchService.ts     # Search engine management
│   │   ├── storageService.ts    # File-based storage
│   │   └── aiPrivacyGuard.ts    # Claude-powered analysis
│   └── shared/
│       ├── types.ts             # TypeScript interfaces
│       ├── constants.ts         # IPC channels, configs
│       └── security.ts          # URL validation, HTTPS, sanitization
├── tests/unit/                  # Jest unit tests
├── .github/workflows/ci.yml    # CI/CD pipeline
├── electron.vite.config.ts      # Build configuration
├── jest.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── tsconfig.web.json
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Development

```bash
# Clone
git clone https://github.com/Satyaprasad7naik/deepweb-browser.git
cd deepweb-browser

# Install
npm install

# Run in development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Package for distribution
npm run package:mac    # macOS
npm run package:win    # Windows
npm run package:linux  # Linux
```

### Optional: Enable AI Privacy Guard
```bash
export ANTHROPIC_API_KEY="your-key-here"
npm run dev
```

## Configuration

### config.json
```json
{
  "tor": { "enabled": true, "port": 9050 },
  "vpn": { "enabled": false, "provider": "protonvpn" },
  "security": { "httpsOnly": true, "blockTracking": true },
  "searchEngine": "duckduckgo"
}
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License — see [LICENSE.md](LICENSE.md)

## Roadmap

- [ ] Plugin marketplace
- [ ] Cloud sync across devices
- [ ] Advanced fingerprint spoofing
- [ ] Mobile companion app
- [ ] Built-in encrypted messenger

---

 
**Version**: 1.0.0 | **Status**: Active Development | **Engine**: Chromium via Electron   



Last updated: March 2026 - Active Development
