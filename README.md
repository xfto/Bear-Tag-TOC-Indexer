# Bear Tag TOC Creator

> Scan. Index. Navigate. — An Electron desktop app that generates a clickable tag index inside [Bear](https://bear.app).

![Version](https://img.shields.io/badge/version-2.0.0-red) ![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey) ![Electron](https://img.shields.io/badge/electron-30-blue) ![React](https://img.shields.io/badge/react-19-61DAFB)

---

## What it does

Bear has no built-in table of contents for tags. This app reads your local Bear SQLite database, extracts every tag, and creates a new Bear note containing a clickable `bear://` deep-link for each one — giving you a navigable tag index in seconds.

Three methods are provided:

- **macOS Shortcut** — Mac-only helper workflow using Shortcuts; the desktop app can also be packaged for Windows and Linux
- **Fish Script** — reads the Bear SQLite database directly via terminal, instant results
- **Manual Mode** — type tags by hand and push them to Bear without running any script

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Desktop | Electron 30 |
| Packaging | electron-builder |

---

## Requirements

- macOS (primary target; Windows/Linux builds available via electron-builder)
- Node.js 18+
- Bear installed, if you want to create notes via `bear://` links
- For the Fish Script method: fish shell, `sqlite3`, Python 3, and Terminal with Full Disk Access enabled in System Settings

---

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/xfto/Bear-Tag-TOC-Indexer.git
cd bear-tag-automator

# 2. Install dependencies
npm install

# 3. Start the dev server (browser, hot-reload)
npm run dev
```

---

## Workflow

```bash
npm run dev            # develop in browser with hot-reload
npm run build          # compile production bundle to dist/
npm run electron       # test the production build in Electron
npm run electron:build # package as .dmg / .exe / .AppImage
```

> Only run `npm run build` when you are ready to test in Electron or ship.  
> The dev server (`npm run dev`) reloads automatically on every file save.

---

## Electron notes

The app runs with `contextIsolation: true` and `nodeIntegration: false` for security. A `preload.js` file bridges any necessary IPC between the renderer and main process.

When loading from `file://` in production, Vite is configured with `base: './'` to ensure all asset paths resolve correctly.

Application icon assets live in `public/`:

- `public/icon.png` — runtime/Linux icon
- `public/icon.icns` — macOS package icon
- `public/icon.ico` — Windows installer icon

macOS shows the packaged icon after running `npm run electron:build`; plain `npm run electron` may still use development/runtime behavior depending on the platform cache.

---

## Distribution

`npm run electron:build` packages desktop builds with electron-builder. On macOS, this configuration can produce:

| Platform | Format |
|---|---|
| macOS | `.dmg` |
| Windows | NSIS installer |
| Linux | `.AppImage` |

Packaged builds are written to `release/`.

---

## Privacy

The Fish Script method reads your Bear database file locally at:

```
~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite
```

No data leaves your machine. Terminal may require **Full Disk Access** in System Settings → Privacy & Security to read this path.

---

## License

MIT

---

*Developed by [Fabio Tosto](mailto:fabio@tosto.se) using Google AI Studio, Claude & VS Code*
