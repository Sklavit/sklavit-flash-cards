# User Guide - Running the Flashcard App

## Overview

This is a Progressive Web App (PWA) that works on any device with a modern web browser. You can run it directly in your browser or install it as a standalone app.

## Quick Start

### Option 1: Run in Browser (Any Device)

1. **Open the app**
   - Navigate to the app URL in your browser
   - Or open `index.html` locally using a web server

2. **Start studying**
   - Click a flashcard to flip it
   - Rate your recall (No idea, Mistakes, Correct, Easy)
   - Continue through your deck

### Option 2: Install as PWA (Recommended)

Installing the app gives you:
- Standalone app icon on your device
- Works offline
- Faster loading
- Full-screen experience
- No browser UI distractions

---

## Platform-Specific Instructions

### iOS (iPhone/iPad)

#### Install as PWA on iOS

1. **Open in Safari**
   - Open the app URL in Safari browser
   - (Other browsers like Chrome don't support PWA installation on iOS)

2. **Add to Home Screen**
   - Tap the **Share** button (square with arrow pointing up)
   - Scroll down and tap **"Add to Home Screen"**
   - Edit the name if desired (default: "Flashcards")
   - Tap **"Add"**

3. **Launch the App**
   - Find the app icon on your home screen
   - Tap to launch in standalone mode
   - Works offline after first launch

#### Tips for iOS
- **Offline Mode**: After first load, works without internet
- **Updates**: Close and reopen the app to get updates
- **Storage**: Uses Safari's localStorage (won't sync between devices)
- **Full Screen**: Swipe up from bottom to exit the app

---

### macOS

#### Option A: Safari (PWA Installation)

1. **Open in Safari**
   - Open the app URL in Safari 17.4+
   - Requires macOS Sonoma (14.4) or later

2. **Install App**
   - Click **File** menu → **"Add to Dock"**
   - Or click the app icon in the address bar → **"Add to Dock"**

3. **Launch from Dock**
   - Find the app in your Dock
   - Click to launch as standalone app

#### Option B: Chrome/Edge (PWA Installation)

1. **Open in Chrome or Edge**
   - Navigate to the app URL

2. **Install App**
   - Look for install icon (⊕) in address bar
   - Or click **⋮** menu → **"Install Flashcards..."**
   - Or **"Apps"** → **"Install this site as an app"**

3. **Launch the App**
   - Find app in Applications folder
   - Or launch from Chrome's app launcher
   - Or add to Dock for quick access

#### Option C: Run Locally with Local Server

For development or offline use:

1. **Start a local web server**
   ```bash
   # Using Python 3
   cd /path/to/sklavit-flash-cards
   python3 -m http.server 8000

   # Or using Node.js npx
   npx serve
   ```

2. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Or `http://localhost:3000` if using npx serve

3. **Install as PWA** (optional)
   - Follow Chrome/Safari installation steps above

#### Tips for macOS
- **Keyboard Shortcuts**:
  - `Space` - Flip card
  - `1-4` - Rate card (if implemented)
- **Offline Mode**: Works after first load
- **Data Storage**: Stored in browser's localStorage
- **Multiple Browsers**: Data doesn't sync between browsers

---

### Android

#### Install as PWA on Android

1. **Open in Chrome**
   - Navigate to the app URL in Chrome

2. **Install App**
   - Tap **⋮** (three dots menu)
   - Select **"Add to Home screen"**
   - Or tap the install banner if it appears
   - Confirm installation

3. **Launch the App**
   - Find app icon on home screen
   - Tap to launch in standalone mode

#### Tips for Android
- **Offline Mode**: Works offline after first load
- **Updates**: Automatic in background
- **Notifications**: Can be enabled for study reminders (if implemented)

---

### Windows

#### Option A: Edge (PWA Installation)

1. **Open in Microsoft Edge**
   - Navigate to the app URL

2. **Install App**
   - Click **Settings and more (...)** → **"Apps"** → **"Install this site as an app"**
   - Or click install icon in address bar

3. **Launch the App**
   - Find in Start menu or Desktop
   - Or pin to taskbar for quick access

#### Option B: Chrome (PWA Installation)

1. **Open in Chrome**
   - Navigate to the app URL

2. **Install App**
   - Click **⋮** menu → **"Install Flashcards..."**
   - Or click install icon (⊕) in address bar

3. **Launch the App**
   - Find in Start menu
   - Or launch from Chrome apps

---

### Linux

#### Install as PWA

1. **Open in Chrome/Chromium**
   - Navigate to the app URL

2. **Install App**
   - Click **⋮** menu → **"Install Flashcards..."**
   - Or click install icon in address bar

3. **Launch the App**
   - Find in application menu
   - Or create desktop shortcut

---

## Troubleshooting

### App Won't Install

**iOS:**
- Must use Safari (not Chrome or other browsers)
- Make sure you're tapping "Add to Home Screen" (not "Add Bookmark")

**macOS Safari:**
- Requires Safari 17.4+ and macOS Sonoma 14.4+
- Update macOS/Safari if option is missing

**Chrome/Edge:**
- Make sure site is served over HTTPS (or localhost)
- Check that manifest.webmanifest is accessible
- Try refreshing the page

### App Won't Work Offline

1. **First Load Required**
   - Must load the app once while online
   - Service worker installs on first visit

2. **Check Service Worker**
   - Open DevTools → Application → Service Workers
   - Verify service worker is active

3. **Clear Cache and Reload**
   - Clear browser cache
   - Reload page while online
   - Try offline again

### Data Not Persisting

1. **localStorage Cleared**
   - Browser may clear data if storage is full
   - Private/Incognito mode doesn't persist data

2. **Different Browser**
   - Data doesn't sync between browsers
   - Each browser has separate storage

3. **Export/Import** (if implemented)
   - Use export feature to backup data
   - Import on new browser/device

### Performance Issues

1. **Clear Browser Cache**
   - Remove old cached files
   - Reload the app

2. **Update Service Worker**
   - Close all tabs with the app
   - Reopen to get latest version

3. **Restart Browser**
   - Close and reopen browser
   - Relaunch the app

---

## Data Management

### Where is My Data Stored?

- **localStorage**: All cards and progress stored in browser's localStorage
- **Offline**: Service worker caches app files for offline use
- **No Cloud Sync**: Data stays on your device (privacy-focused)

### Backup Your Data

**Currently:**
- Data stored only in browser localStorage
- No export feature yet (planned for future)

**Future:**
- Export to JSON
- Import from JSON
- Sync across devices (optional)

### Clear All Data

**To start fresh:**

1. **Browser DevTools Method**
   - Open DevTools (F12)
   - Go to Application → Storage
   - Click "Clear site data"

2. **Browser Settings Method**
   - Go to browser settings
   - Find site settings for the app
   - Clear site data

3. **Uninstall/Reinstall PWA**
   - Uninstall the PWA
   - Reinstall from browser

---

## Tips for Best Experience

### Study Workflow

1. **Install as PWA** for distraction-free studying
2. **Use offline** - no internet required after first load
3. **Review daily** - spaced repetition works best with consistency
4. **Rate honestly** - accurate ratings improve scheduling

### Creating Cards

- Keep questions concise and focused
- Make answers clear and specific
- Use one concept per card
- Review cards regularly

### Using Spaced Repetition

- **No idea (0)**: Card resets to 1-day interval
- **Mistakes (1)**: Card resets to 1-day interval
- **Correct (3)**: Card advances normally
- **Easy (5)**: Card advances faster

---

## Getting Help

### Common Questions

**Q: Can I use this on multiple devices?**
A: Currently data is stored locally. Each device has separate data. Cloud sync is planned for future.

**Q: Does this work offline?**
A: Yes! After first load, works completely offline.

**Q: Can I import my existing flashcards?**
A: Import feature is planned for future releases.

**Q: Is my data private?**
A: Yes - all data stays on your device. No data sent to servers.

### Report Issues

- Check `/planning/` documentation for known issues
- File bugs with detailed reproduction steps
- Include browser version and OS

---

## Next Steps

1. **Install the app** using instructions above
2. **Try the sample cards** to understand the workflow
3. **Create your own cards** (when feature is available)
4. **Study daily** for best results with spaced repetition

For developer documentation, see `/CLAUDE.md` and `/planning/` directory.
