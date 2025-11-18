# BdocUI - Scaffolding Architecture & Philosophy

## Overview

**BdocUI** is a modern, reusable scaffolding for building invoice management and document viewing applications. It provides:

- **Reusable utilities** — iframe management, Superset embedding, environment config
- **Template components** — Navbar, Login, Dashboard, Document Viewer (ready to customize)
- **Example pages** — working examples of each template in action
- **Tailwind styling** — modern, utility-first CSS for fast UI development
- **Documentation** — detailed guides for developers extending the scaffolding

## Philosophy

1. **Don't change the existing app** — `BdocUI` is a new parallel folder; the production `docaimain/` app remains untouched.
2. **Extract, don't duplicate** — common logic (iframe handling, Superset embedding, env config) is extracted into reusable utilities.
3. **Give it a facelift** — modern Tailwind design replacing Bootstrap for a cleaner, more maintainable codebase.
4. **Make it easy for devs** — templates and examples show the "happy path"; utilities handle complexity.
5. **Document everything** — clear guides for environment setup, component usage, iframe communication, and testing.

## Folder Structure

```
src/
├── utils/                    # Reusable logic and helpers
│   ├── envConfig.js          # Centralized environment variables
│   ├── iframeUtils.js        # iframe URL building, normalization
│   ├── supersetUtils.js      # Superset SDK and API utilities
│   └── errorUtils.js         # Error handling helpers
│
├── hooks/                    # Custom React hooks
│   ├── usePostMessage.js     # Parent ↔ iframe communication
│   ├── useSupersetConfig.js  # Load dashboard config
│   ├── useIframeAutoResize.js # Auto-resize iframe
│   └── useFetch.js           # Generic data fetching
│
├── components/
│   ├── common/               # Base UI components
│   │   ├── Button.jsx        # Reusable button
│   │   ├── Card.jsx          # Reusable card wrapper
│   │   ├── Modal.jsx         # Reusable modal
│   │   ├── Spinner.jsx       # Loading spinner
│   │   └── ErrorBoundary.jsx # Error catching
│   │
│   ├── templates/            # Template components (copy & customize)
│   │   ├── NavbarTemplate.jsx       # Header with user menu
│   │   ├── LoginTemplate.jsx        # Login form
│   │   ├── LoadingScreenTemplate.jsx # Full-page loader
│   │   ├── DocumentViewerTemplate.jsx # iframe doc viewer
│   │   └── DashboardTemplate.jsx    # Superset embed
│   │
│   └── layout/
│       ├── AppLayout.jsx     # Main app layout wrapper
│       └── PageContainer.jsx # Page-level container
│
├── pages/                    # Example pages (copy & customize)
│   ├── LoginPageExample.jsx
│   ├── DashboardPageExample.jsx
│   ├── InvoicePageExample.jsx
│   └── NotFound.jsx
│
├── App.jsx                   # Main app (routing, layout)
├── index.jsx                 # React entry point
└── index.css                 # Global styles (Tailwind)

docs/                         # Documentation
├── ENV_SETUP.md              # Environment variables
├── IFRAME_INTEGRATION_GUIDE.md
├── COMPONENT_USAGE.md
└── SUPERSET_EMBEDDING.md

.env.example                  # Example env vars
```

## Key Utilities

### `envConfig.js`
Centralized environment variable access. Import and use:

```javascript
import { ENV, apiUrl, backendUrl, logger } from '../utils/envConfig';

const api = apiUrl("/invoices");
const backend = backendUrl("/static/viewer.html");
logger.info("App started");
```

### `iframeUtils.js`
Build iframe URLs safely with query parameters:

```javascript
import { buildIframeUrl, getOrigin } from '../utils/iframeUtils';

const src = buildIframeUrl(ENV.BACKEND_URL, ENV.VIEWER_PATH, {
  invoice: "INV-2024-001",
});
```

### `supersetUtils.js`
Fetch tokens and embed Superset dashboards:

```javascript
import { fetchSupersetToken, fetchSupersetDashboardConfig } from '../utils/supersetUtils';

const token = await fetchSupersetToken();
const { dashboardId, supersetDomain } = await fetchSupersetDashboardConfig();
```

### Custom Hooks

**`usePostMessage(iframeRef)`** — Parent ↔ iframe messaging
```javascript
const { send, on, off } = usePostMessage(iframeRef);
send("VIEWER_CMD", { cmd: "print" });
on("DOCUMENT_SELECTED", (data) => console.log(data));
```

**`useSupersetConfig(apiBase)`** — Load dashboard config
```javascript
const { config, loading, error } = useSupersetConfig();
if (config) console.log(config.dashboardId);
```

**`useIframeAutoResize(iframeRef, options)`** — Auto-resize iframe
```javascript
useIframeAutoResize(iframeRef, { minHeight: "600px" });
```

**`useFetch(url, options)`** — Generic data fetching
```javascript
const { data, loading, error } = useFetch("/api/invoices", {
  retries: 2,
  onSuccess: (data) => console.log("Loaded:", data),
});
```

## Template Components

### `NavbarTemplate`
Header with logo, title, and user menu. Copy and customize:

```jsx
<NavbarTemplate
  title="My App"
  user={{ name: "John Doe", avatar: "JD" }}
  onLogout={() => navigate("/login")}
/>
```

### `LoginTemplate`
Login form with email, password, remember-me:

```jsx
<LoginTemplate
  onSubmit={async (email, password) => { /* call API */ }}
  error={error}
  isLoading={loading}
/>
```

### `DocumentViewerTemplate`
Iframe-based document viewer with print/download buttons:

```jsx
<DocumentViewerTemplate
  documentId="INV-2024-001"
  baseUrl={ENV.BACKEND_URL}
  viewerPath={ENV.VIEWER_PATH}
  onDocumentSelected={(id) => console.log("Selected:", id)}
  onError={(err) => console.error(err)}
/>
```

### `DashboardTemplate`
Superset dashboard embed with fallback:

```jsx
<DashboardTemplate
  showToolbar={true}
  hideTitle={false}
/>
```

### `LoadingScreenTemplate`
Full-page loading screen:

```jsx
<LoadingScreenTemplate
  message="Loading dashboard..."
  variant="spinner"
/>
```

## Styling: Tailwind

All components use Tailwind utility classes. To customize:

1. Edit `tailwind.config.js` to add custom colors, spacing, etc.
2. Use Tailwind classes in JSX: `className="px-4 py-2 bg-blue-600 text-white"`
3. Avoid custom CSS unless absolutely necessary
4. Refer to [Tailwind docs](https://tailwindcss.com/docs) for available utilities

## Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
REACT_APP_API_BASE=/api
REACT_APP_BACKEND_URL=https://your-backend.com
REACT_APP_VIEWER_ORIGIN=https://your-backend.com
REACT_APP_VIEWER_PATH=/static/invoices/index.html
REACT_APP_SUPERSET_DOMAIN=https://superset.example.com
```

See `docs/ENV_SETUP.md` for detailed documentation.

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start dev server
npm start
# Opens http://localhost:3000

# Build for production
npm run build
```

## For Developers Extending This Scaffolding

### When Adding a New Page:

1. Create `src/pages/MyPage.jsx`
2. Import templates/components you need
3. Use utilities (ENV, usePostMessage, useFetch, etc.)
4. Add route to `App.jsx`
5. Document the page in `docs/COMPONENT_USAGE.md`

### When Adding a New Component:

1. If it's a base UI primitive → `src/components/common/`
2. If it's a template/example → `src/components/templates/`
3. Export from component file
4. Create example usage in a page or story
5. Document in `docs/COMPONENT_USAGE.md`

### When Modifying Utilities:

1. Keep backward compatibility
2. Add JSDoc comments
3. Update `docs/` if behavior changes
4. Add error logging (use `logger` from envConfig)
5. Test edge cases

### Error Handling Best Practices:

```javascript
import { formatErrorMessage, getUserFriendlyErrorMessage } from '../utils/errorUtils';

try {
  // ... operation
} catch (error) {
  logger.error("Operation failed:", formatErrorMessage(error));
  setError(getUserFriendlyErrorMessage(error));
}
```

### PostMessage Communication Pattern:

```javascript
// Parent (React component)
const { send, on } = usePostMessage(iframeRef);
on("READY", (data) => {
  send("INIT", { userId: 123 });
});

// Iframe (HTML/JS)
window.addEventListener("message", (e) => {
  if (e.data.type === "INIT") {
    console.log("Parent sent:", e.data);
    window.parent.postMessage({ type: "READY" }, "*");
  }
});
```

## Testing

### Unit Tests
```bash
npm test
```

Run tests for utilities and components. Aim for >80% coverage on critical paths (env config, iframe utils, hooks).

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation between pages works
- [ ] Login form submits and updates state
- [ ] Dashboard loads and displays content
- [ ] Document viewer displays iframe
- [ ] PostMessage communication works (check browser console)
- [ ] Responsive layout on mobile (use Chrome DevTools)
- [ ] Errors display gracefully

## Deployment

### Azure Static Web Apps

1. Build the app:
   ```bash
   npm run build
   ```

2. Use existing `staticwebapp.config.json` from `docaimain/`

3. Set env vars in Azure portal for your deployment:
   - `REACT_APP_BACKEND_URL`
   - `REACT_APP_SUPERSET_DOMAIN`
   - etc.

4. Deploy `build/` folder to Azure

See `docs/` for more details.

## FAQ

**Q: Can I use this alongside `docaimain`?**
A: Yes! `BdocUI` is a separate folder. Both can coexist in the same repo.

**Q: How do I customize the Navbar?**
A: Copy `NavbarTemplate` to a new file, modify it, and use it in your pages.

**Q: Can I use Bootstrap instead of Tailwind?**
A: Yes, but you'll need to convert all Tailwind classes. Tailwind is recommended for the facelift.

**Q: How do I debug postMessage communication?**
A: Open browser DevTools console. Messages are logged with `logger.debug()`. Check iframe sandbox permissions if messages don't arrive.

**Q: What if Superset SDK embed fails?**
A: `DashboardTemplate` automatically falls back to a direct iframe. Check browser console for errors.

---

**Last Updated:** November 17, 2025  
**Version:** 1.0
