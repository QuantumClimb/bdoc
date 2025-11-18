# Environment Setup Guide

This guide covers setting up environment variables for **BdocUI**.

## Getting Started

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values (never commit this file)

3. All variables are accessed in code via:

```javascript
import { ENV } from "../utils/envConfig";
console.log(ENV.BACKEND_URL);
```

## Environment Variables Reference

### API Configuration

**`REACT_APP_API_BASE`** (Default: `/api`)
- Base path for API calls (used for proxying in development)
- Example: `/api` or `https://api.example.com`
- Used by: `apiUrl()` helper function

**`REACT_APP_BACKEND_URL`** (Default: `https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net`)
- Main backend server URL
- Example: `https://your-backend.com`
- Used by: Document viewer iframe, invoice API calls

### Invoice Viewer Configuration

**`REACT_APP_VIEWER_ORIGIN`** (Default: Same as `REACT_APP_BACKEND_URL`)
- Origin for iframe postMessage communication (security)
- Must match the iframe src domain
- Example: `https://your-backend.com`
- Used by: `usePostMessage()` hook

**`REACT_APP_VIEWER_PATH`** (Default: `/static/invoices/index.html`)
- Path to invoice viewer HTML on backend
- Example: `/static/invoices/index.html` or `/viewer`
- Used by: `DocumentViewerTemplate` component

### Superset Configuration

**`REACT_APP_SUPERSET_DOMAIN`** (Default: Empty)
- Superset server domain (optional, only if using Superset dashboards)
- Example: `https://superset.example.com`
- Used by: `DashboardTemplate` component

**`REACT_APP_SUPERSET_TOKEN_URL`** (Default: `/api/superset/token`)
- Endpoint to fetch Superset guest tokens
- Example: `/api/superset/token` or `https://api.example.com/superset/token`
- Used by: `fetchSupersetToken()` utility

### App Configuration

**`REACT_APP_APP_TITLE`** (Default: `BDoc Invoice Dashboard`)
- Application title (shown in navbar, browser tab)
- Example: `My Invoice App`
- Used by: `NavbarTemplate`, HTML `<title>`

**`REACT_APP_LOG_LEVEL`** (Default: `info`)
- Logging verbosity level
- Options: `debug`, `info`, `warn`, `error`
- Example: `debug` for development, `error` for production
- Used by: `logger` utility in `envConfig.js`

## Example .env.local Files

### Local Development

```bash
REACT_APP_API_BASE=/api
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_VIEWER_ORIGIN=http://localhost:3001
REACT_APP_VIEWER_PATH=/static/invoices/index.html
REACT_APP_SUPERSET_DOMAIN=http://localhost:8088
REACT_APP_SUPERSET_TOKEN_URL=/api/superset/token
REACT_APP_APP_TITLE=BDoc - Dev
REACT_APP_LOG_LEVEL=debug
```

### Production (Azure)

```bash
REACT_APP_API_BASE=/api
REACT_APP_BACKEND_URL=https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net
REACT_APP_VIEWER_ORIGIN=https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net
REACT_APP_VIEWER_PATH=/static/invoices/index.html
REACT_APP_SUPERSET_DOMAIN=https://superset.company.com
REACT_APP_SUPERSET_TOKEN_URL=/api/superset/token
REACT_APP_APP_TITLE=BDoc Invoice Dashboard
REACT_APP_LOG_LEVEL=info
```

### Staging

```bash
REACT_APP_API_BASE=/api
REACT_APP_BACKEND_URL=https://bdoc-staging.azurewebsites.net
REACT_APP_VIEWER_ORIGIN=https://bdoc-staging.azurewebsites.net
REACT_APP_VIEWER_PATH=/static/invoices/index.html
REACT_APP_SUPERSET_DOMAIN=https://superset-staging.company.com
REACT_APP_SUPERSET_TOKEN_URL=/api/superset/token
REACT_APP_APP_TITLE=BDoc - Staging
REACT_APP_LOG_LEVEL=debug
```

## Accessing Environment Variables in Code

### Using the ENV Object

```javascript
import { ENV, apiUrl, backendUrl } from "../utils/envConfig";

// Direct access
const backend = ENV.BACKEND_URL;
const token = ENV.SUPERSET_TOKEN_URL;

// Using helper functions
const api = apiUrl("/invoices");        // /api/invoices
const viewer = backendUrl("/viewer");   // https://backend.com/viewer

// Check environment
if (ENV.LOG_LEVEL === "debug") {
  console.log("Debug mode enabled");
}
```

### Using the Logger

```javascript
import { logger } from "../utils/envConfig";

logger.debug("Detailed info (only if LOG_LEVEL=debug)");
logger.info("General info");
logger.warn("Warning message");
logger.error("Error message");
```

## Frontend vs Backend URLs

### Frontend URL (REACT_APP_BACKEND_URL)
- Used in React components
- Build-time (set when `npm build` runs)
- Visible in bundle (not secret)
- Example: `https://your-backend.com`

### Backend URL for Secret Keys
- Use `.env` (server-side) in your backend, not here
- Backend secrets never end up in client bundle

## CORS & Proxy Configuration

If your backend is on a different domain, CORS might block requests.

### Option 1: Use `package.json` Proxy
Edit `package.json`:
```json
"proxy": "https://your-backend.com"
```

Then in code:
```javascript
const res = await fetch("/api/invoices"); // Proxied to backend
```

### Option 2: Configure CORS on Backend
Backend should set appropriate CORS headers:
```
Access-Control-Allow-Origin: https://your-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Azure Static Web Apps Configuration

For Azure deployment, set env vars in the Azure portal:

1. Go to your Static Web App in Azure Portal
2. **Settings** → **Configuration**
3. Add variables:

| Name | Value |
|---|---|
| `REACT_APP_BACKEND_URL` | `https://your-backend.com` |
| `REACT_APP_SUPERSET_DOMAIN` | `https://superset.com` |
| etc. | |

These will be injected at build time in the CI/CD pipeline.

## Docker / Container Environment

If running in Docker, set env vars before build:

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
ARG REACT_APP_BACKEND_URL=https://default-backend.com
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build
CMD ["npm", "start"]
```

Run:
```bash
docker build --build-arg REACT_APP_BACKEND_URL=https://backend.com .
```

## Common Issues

**Q: Changes to `.env.local` aren't taking effect**
A: Restart dev server after changing env vars. Dev server reads env vars at startup.

**Q: "Cannot find module" errors for ENV**
A: Make sure you're importing from `src/utils/envConfig.js`, not a typo like `envConfig.ts`.

**Q: iframe not loading (CORS error in console)**
A: Check `REACT_APP_VIEWER_ORIGIN` matches iframe src domain. If different domain, backend needs CORS headers.

**Q: PostMessage failing between parent and iframe**
A: Ensure `REACT_APP_VIEWER_ORIGIN` exactly matches iframe src origin (protocol, domain, port all matter).

## Security Considerations

⚠️ **Do NOT commit `.env.local` to git!**

The `.gitignore` file already excludes it, but make sure:

```
# .gitignore
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**Public vs Secret Variables**

- All `REACT_APP_*` variables are visible in the bundled JavaScript (public)
- Do NOT put secrets (API keys, passwords) in `REACT_APP_*` variables
- Use backend environment variables for secrets
- For authentication tokens, fetch them securely from backend at runtime

---

**Last Updated:** November 17, 2025
