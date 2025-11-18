# Asset Setup Instructions

This document explains how to copy brand assets (logos, favicon, icons) from the source folders to `BdocUI/public/`.

## Assets to Copy

### From `docaimain/public/`

Copy these files to `BdocUI/public/`:

- **Beeicon.png** — Brand icon/logo (used in navbar, favicon, browser tab)
- **favicon.ico** — Favicon for browser tab (optional, Beeicon.png is primary)
- **logo192.png** — PWA app icon (192x192, for mobile home screen)
- **logo512.png** — PWA app icon (512x512, for app splash screen)

### From `COMPONENTS_PACKAGE/` (if any custom icons exist)

Copy any custom SVG/PNG icon files that should be included in the design refresh.

## How to Copy

### Option 1: Windows File Explorer (GUI)

1. Open `c:\HDD\NeonApps\BDoc\docaimain\public\` in File Explorer
2. Select: `Beeicon.png`, `favicon.ico`, `logo192.png`, `logo512.png`
3. Right-click → Copy
4. Navigate to `c:\HDD\NeonApps\BDoc\BdocUI\public\`
5. Right-click → Paste

### Option 2: PowerShell Command

```powershell
# Copy specific files
Copy-Item 'c:\HDD\NeonApps\BDoc\docaimain\public\Beeicon.png' -Destination 'c:\HDD\NeonApps\BDoc\BdocUI\public\'
Copy-Item 'c:\HDD\NeonApps\BDoc\docaimain\public\favicon.ico' -Destination 'c:\HDD\NeonApps\BDoc\BdocUI\public\'
Copy-Item 'c:\HDD\NeonApps\BDoc\docaimain\public\logo192.png' -Destination 'c:\HDD\NeonApps\BDoc\BdocUI\public\'
Copy-Item 'c:\HDD\NeonApps\BDoc\docaimain\public\logo512.png' -Destination 'c:\HDD\NeonApps\BDoc\BdocUI\public\'
```

## Files Already Created

The following files have been automatically created/updated:

- ✅ `index.html` — Main HTML template (uses %PUBLIC_URL% placeholders)
- ✅ `manifest.json` — PWA manifest (updated to reference Beeicon.png)
- ✅ `robots.txt` — Search engine crawlers config

## Verification

After copying assets, verify they're in place:

```bash
# List files in BdocUI/public/
ls c:\HDD\NeonApps\BDoc\BdocUI\public\

# Should show:
# - Beeicon.png
# - favicon.ico
# - index.html
# - logo192.png
# - logo512.png
# - manifest.json
# - robots.txt
```

## Using Assets in Components

### In JSX/Components

```jsx
// Reference images using public URL
<img src="/Beeicon.png" alt="BDoc Logo" className="w-10 h-10" />

// Or import and use
import logo from '../path/to/logo.png';
<img src={logo} alt="Logo" />
```

### In CSS

```css
.navbar {
  background-image: url('/Beeicon.png');
}
```

### In HTML

```html
<!-- Already configured in public/index.html -->
<link rel="icon" href="%PUBLIC_URL%/Beeicon.png" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/Beeicon.png" />
```

## Customizing Assets

To replace assets:

1. **Favicon**: Replace `favicon.ico` with your favicon
2. **Logo**: Replace `Beeicon.png` (or create new file and update references)
3. **PWA Icons**: Update `logo192.png` and `logo512.png`
4. **Update manifest.json**: If you change filenames or sizes

## Build-Time Processing

When you run `npm run build`, the `%PUBLIC_URL%` placeholder in `index.html` and `manifest.json` is automatically replaced with the correct public path:

- Development: `%PUBLIC_URL%` → `/`
- Production: `%PUBLIC_URL%` → `/` (or your deployment path)

CRA handles this automatically based on `package.json` `"homepage"` field (not set, defaults to `/`).

## Deployment Notes

When deploying to Azure Static Web Apps:

1. The `public/` folder becomes the root of your served content
2. `index.html` is served for all routes (SPA routing)
3. Assets in `public/` are served as-is (e.g., `/Beeicon.png`)
4. Make sure `staticwebapp.config.json` is configured correctly (already done)

---

**Next Steps:**
1. Copy the asset files using one of the methods above
2. Verify files are in `BdocUI/public/`
3. Run `npm start` to test
4. Check browser DevTools to confirm assets load without 404 errors

---

**Last Updated:** November 17, 2025
