# BdocUI - Getting Started

Welcome to **BdocUI**, a modern scaffolding for invoice management and document viewing applications.

## Quick Start

### 1. Install Dependencies

```bash
cd BdocUI
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend URLs:

```
REACT_APP_BACKEND_URL=https://your-backend.com
REACT_APP_SUPERSET_DOMAIN=https://superset.example.com
```

### 3. Start Development Server

```bash
npm start
```

Opens http://localhost:3000 in your browser.

### 4. Build for Production

```bash
npm run build
```

Outputs optimized build to `build/` folder.

## What's Included

- **Utilities** — Environment config, iframe management, Superset embedding, error handling
- **Hooks** — PostMessage communication, data fetching, auto-resizing
- **Components** — Reusable buttons, cards, modals, spinners, error boundary
- **Templates** — Navbar, Login, Dashboard, Document Viewer, Loading screens (copy & customize)
- **Example Pages** — Login, Dashboard, Invoices showing how templates work
- **Tailwind CSS** — Modern, utility-first styling
- **React Router** — Page routing built in
- **Documentation** — Detailed guides for developers

## File Structure

```
BdocUI/
├── src/
│   ├── utils/               # Reusable utilities
│   ├── hooks/               # Custom React hooks
│   ├── components/
│   │   ├── common/          # Base UI components
│   │   ├── templates/       # Template examples
│   │   └── layout/          # Layout wrappers
│   ├── pages/               # Example pages
│   ├── App.jsx              # Main app
│   └── index.jsx            # Entry point
│
├── public/                  # Static assets
├── docs/                    # Documentation
├── package.json
├── tailwind.config.js       # Tailwind configuration
└── .env.example             # Example env vars
```

## Common Tasks

### Add a New Page

1. Create `src/pages/MyPage.jsx`:

```jsx
export function MyPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Page</h1>
    </div>
  );
}
export default MyPage;
```

2. Add route in `src/App.jsx`:

```jsx
import MyPage from "./pages/MyPage";

// In <Routes>:
<Route path="/mypage" element={<MyPage />} />
```

### Add a New Component

1. Create `src/components/common/MyComponent.jsx`:

```jsx
export function MyComponent({ title, children }) {
  return <div className="p-4 bg-white rounded-lg">{children}</div>;
}
export default MyComponent;
```

2. Import and use in pages:

```jsx
import MyComponent from "../components/common/MyComponent";

<MyComponent title="Example">Content here</MyComponent>
```

### Use Utilities

```javascript
import { ENV, apiUrl, logger } from "../utils/envConfig";
import { buildIframeUrl } from "../utils/iframeUtils";
import { useFetch } from "../hooks/useFetch";

// Access env vars
console.log(ENV.BACKEND_URL);

// Build iframe URL
const src = buildIframeUrl(ENV.BACKEND_URL, "/viewer", { id: "123" });

// Fetch data
const { data, loading, error } = useFetch("/api/data");

// Log
logger.info("App started");
```

### Communicate with Iframe

```jsx
import { usePostMessage } from "../hooks/usePostMessage";

export function MyComponent() {
  const iframeRef = useRef(null);
  const { send, on } = usePostMessage(iframeRef);

  useEffect(() => {
    // Listen for messages from iframe
    on("READY", (data) => {
      console.log("Iframe ready:", data);
    });

    // Send message to iframe
    send("INIT", { userId: 123 });
  }, [send, on]);

  return <iframe ref={iframeRef} src="..." />;
}
```

## Styling with Tailwind

Use Tailwind utility classes in JSX:

```jsx
<div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Click me
</div>
```

Common utilities:

- **Spacing:** `p-4` (padding), `m-2` (margin), `gap-3` (gap between items)
- **Colors:** `bg-blue-600` (background), `text-white` (text color), `border-gray-200` (border)
- **Typography:** `text-2xl` (size), `font-bold` (weight), `uppercase` (transform)
- **Layout:** `flex`, `grid`, `w-full` (width), `h-96` (height)
- **Responsive:** `md:`, `lg:`, `xl:` prefixes for breakpoints
- **States:** `hover:`, `focus:`, `active:` for interaction states
- **Animation:** `animate-spin`, `animate-pulse`, `transition-all`

See [Tailwind documentation](https://tailwindcss.com/docs) for more.

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `REACT_APP_API_BASE` | `/api` | API base path (for proxying) |
| `REACT_APP_BACKEND_URL` | `https://bdoc1-...` | Backend server URL |
| `REACT_APP_VIEWER_ORIGIN` | `https://bdoc1-...` | Origin for iframe postMessage |
| `REACT_APP_VIEWER_PATH` | `/static/invoices/index.html` | Path to invoice viewer |
| `REACT_APP_SUPERSET_DOMAIN` | `` | Superset server domain (optional) |
| `REACT_APP_SUPERSET_TOKEN_URL` | `/api/superset/token` | Token endpoint |
| `REACT_APP_APP_TITLE` | `BDoc Invoice Dashboard` | App title |
| `REACT_APP_LOG_LEVEL` | `info` | Logging level (`debug`, `info`, `warn`, `error`) |

See `.env.example` for all variables.

## Debugging

### Enable Debug Logging

```bash
REACT_APP_LOG_LEVEL=debug npm start
```

Then check browser console for detailed logs.

### React DevTools

Install [React DevTools browser extension](https://react-devtools-tutorial.vercel.app/) to inspect components and state.

### Network Tab

Use browser DevTools Network tab to inspect API calls and iframe network activity.

### PostMessage Console Logging

All postMessage communications are logged in the browser console (check DevTools Console tab).

## Troubleshooting

**Q: Tailwind classes aren't applying**
A: Make sure your component file is in the `src/` folder (covered by `tailwind.config.js` content paths). Restart dev server if needed.

**Q: iframe not loading**
A: Check browser console for CORS errors. Ensure backend URL is correct in `.env.local`. Check iframe `src` is valid.

**Q: Superset dashboard not loading**
A: Check `REACT_APP_SUPERSET_DOMAIN` is set. Look for "X-Frame-Options" header errors in browser console. `DashboardTemplate` should fall back to direct iframe.

**Q: PostMessage not working**
A: Check iframe `sandbox` attribute allows necessary permissions. Ensure iframe and parent have matching `targetOrigin` for security. Check DevTools console for postMessage logs.

**Q: npm install fails**
A: Clear npm cache: `npm cache clean --force`. Delete `node_modules/` and `package-lock.json`, then `npm install` again.

## Next Steps

- Read `docs/ARCHITECTURE.md` for detailed component and utility overview
- Read `docs/ENV_SETUP.md` for environment configuration details
- Read `docs/IFRAME_INTEGRATION_GUIDE.md` for postMessage patterns
- Read `docs/COMPONENT_USAGE.md` for examples of each template
- Customize templates in `src/components/templates/` for your design
- Add your own pages in `src/pages/`

## Need Help?

- Check the documentation in `docs/`
- Look at example pages in `src/pages/`
- Check browser console for error messages and logs
- Review utility JSDoc comments in `src/utils/` and `src/hooks/`

---

**Happy building! 🚀**
