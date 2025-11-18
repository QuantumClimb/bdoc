# BdocUI Implementation Checklist

This checklist guides developers through using BdocUI as a scaffolding template for their own pages and features.

## ✅ Initial Setup

- [ ] Clone/pull the `BdocUI/` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in `REACT_APP_BACKEND_URL`, `REACT_APP_SUPERSET_DOMAIN` (if needed)
- [ ] Run `npm start` and verify login page loads at `http://localhost:3000`
- [ ] Check browser console for any errors or warnings

## ✅ Copy Asset Files

- [ ] Copy `Beeicon.png`, `favicon.ico`, `logo192.png`, `logo512.png` from `docaimain/public/` to `BdocUI/public/`
- [ ] See `ASSET_SETUP.md` for step-by-step instructions
- [ ] Restart dev server to verify favicon appears in browser tab

## ✅ Before Building a New Page

For each new page you build:

1. **Define the page purpose**
   - [ ] What data does it display?
   - [ ] What user actions are needed?
   - [ ] Does it embed an iframe (invoice viewer, Superset dashboard)?

2. **Choose a template to start from**
   - [ ] **Dashboard-like**: Use `DashboardPageExample.jsx` as reference
   - [ ] **Document/List view**: Use `InvoicePageExample.jsx` as reference
   - [ ] **Form/Login**: Use `LoginPageExample.jsx` as reference

3. **Create the page file**
   - [ ] Create `src/pages/MyNewPage.jsx`
   - [ ] Copy boilerplate from reference template
   - [ ] Remove example code, keep structure

4. **Add imports & utilities**
   - [ ] Import components you need from `src/components/common/` or `src/components/templates/`
   - [ ] Import utilities: `ENV`, `apiUrl`, `backendUrl`, `logger` from `src/utils/envConfig.js`
   - [ ] Import custom hooks: `useFetch`, `usePostMessage`, `useSupersetConfig` as needed

5. **Implement page layout**
   - [ ] Use Tailwind classes for styling (avoid custom CSS)
   - [ ] Follow consistent spacing: `p-6` (outer), `gap-4` (between items)
   - [ ] Use `Card` component for content sections
   - [ ] Test responsive layout on mobile (Chrome DevTools)

6. **Implement data fetching**
   - [ ] Use `useFetch()` hook for API calls
   - [ ] Show `Spinner` while loading
   - [ ] Show error message if fetch fails
   - [ ] Handle empty state (no data)

7. **For iframe pages (Dashboard, Documents)**
   - [ ] Use `DashboardTemplate` or `DocumentViewerTemplate`
   - [ ] Pass required props: baseUrl, viewerPath, dashboardId, etc.
   - [ ] Setup postMessage listeners if needed (print, download, etc.)
   - [ ] Test iframe loads without CORS errors

8. **Add routing**
   - [ ] Import page in `src/App.jsx`
   - [ ] Add `<Route path="/mypage" element={<MyNewPage />} />`
   - [ ] Update navbar navigation if needed

9. **Test the page**
   - [ ] [ ] Run `npm start` and navigate to your new page
   - [ ] [ ] Verify layout looks good (desktop and mobile)
   - [ ] [ ] Check browser console for errors
   - [ ] [ ] Test loading/error states
   - [ ] [ ] Test user interactions (form submit, button clicks, etc.)

## ✅ Code Quality Checklist

For each component/page:

- [ ] No custom CSS (use Tailwind instead)
- [ ] All environment URLs use `ENV` object (not hardcoded)
- [ ] Error messages are user-friendly (use `getUserFriendlyErrorMessage()`)
- [ ] Console logs use `logger` (not `console.log()`)
- [ ] Props have JSDoc comments
- [ ] Component has default props where sensible
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] No console errors or warnings
- [ ] Accessibility: buttons/links have labels, colors have contrast

## ✅ Before Committing

- [ ] All pages still load (run `npm start`)
- [ ] No console errors
- [ ] Tested on mobile viewport
- [ ] Updated documentation if adding new patterns
- [ ] Commit message is clear: e.g., "feat: add invoice approval page"

## ✅ For Adding New Utilities

If you create a new utility function:

1. **Place it in `src/utils/`**
   - [ ] New file: `src/utils/myUtility.js`
   - [ ] Add JSDoc comments (param types, return value)
   - [ ] Export named functions (not default)

2. **Example:**
   ```javascript
   /**
    * Format currency for display
    * @param {number} amount - Amount in cents or dollars
    * @param {string} currency - Currency code (default: "USD")
    * @returns {string} Formatted string (e.g., "$1,234.56")
    */
   export function formatCurrency(amount, currency = "USD") {
     // implementation
   }
   ```

3. **Test it**
   - [ ] Create `src/utils/myUtility.test.js` with at least 2 test cases
   - [ ] Run `npm test` to verify tests pass

4. **Document it**
   - [ ] Add example usage in `docs/COMPONENT_USAGE.md`

## ✅ For Adding New Custom Hooks

If you create a new hook:

1. **Place it in `src/hooks/`**
   - [ ] New file: `src/hooks/useMyHook.js`
   - [ ] Add JSDoc comments
   - [ ] Return object with clear property names

2. **Example:**
   ```javascript
   /**
    * Fetch invoice data
    * @param {string} invoiceId - Invoice ID to fetch
    * @param {object} options - Configuration options
    * @returns {object} { data, loading, error, refetch }
    */
   export function useInvoice(invoiceId, options = {}) {
     // implementation
   }
   ```

3. **Test it**
   - [ ] Create test file `src/hooks/useMyHook.test.js`
   - [ ] Test loading, success, and error states

4. **Document it**
   - [ ] Add example in `docs/COMPONENT_USAGE.md` or `docs/ARCHITECTURE.md`

## ✅ For Adding New Template Components

If you create a new template (e.g., `MyPageTemplate`):

1. **Make it flexible**
   - [ ] Accept props for content (headings, buttons, data)
   - [ ] Don't hardcode company names, routes, etc.
   - [ ] Provide sensible defaults

2. **Document with example**
   - [ ] Add JSDoc with all props
   - [ ] Create example usage in `docs/COMPONENT_USAGE.md`
   - [ ] Create example page showing it in action

3. **Style consistently**
   - [ ] Use Tailwind utilities (same as other templates)
   - [ ] Use `Card`, `Button`, `Modal` from `src/components/common/`
   - [ ] Match spacing and color palette

4. **Test it**
   - [ ] Works with example data
   - [ ] Responsive on mobile
   - [ ] Accessible (keyboard navigation, color contrast)

## ✅ Before Publishing / Handing Off

- [ ] All example pages work (Login, Dashboard, Invoices)
- [ ] `npm run build` succeeds without warnings
- [ ] Build output is optimized (check file sizes in `build/` folder)
- [ ] Documentation is complete and up-to-date
- [ ] Environment variables documented in `.env.example`
- [ ] Deployment instructions clear in `docs/`
- [ ] Team has reviewed the code

## Common Mistakes to Avoid

❌ **Don't:**
- Hardcode backend URLs (use `ENV` object)
- Use `console.log()` (use `logger` instead)
- Add `!important` in CSS (use Tailwind specificity)
- Skip error handling (always handle API failures)
- Forget to test on mobile
- Mix custom CSS with Tailwind
- Make iframes without CORS checking

✅ **Do:**
- Use `ENV.BACKEND_URL`, `apiUrl()`, `backendUrl()` helpers
- Use `logger.info()`, `logger.error()`, etc.
- Use Tailwind classes for all styling
- Show spinners during loading, error messages on fail
- Test at 375px, 768px, 1024px breakpoints
- Use only Tailwind for styling (unless absolutely necessary)
- Test CORS headers, use postMessage properly

## Help & Resources

- `README.md` — Quick start guide
- `docs/ARCHITECTURE.md` — Deep dive into structure
- `docs/ENV_SETUP.md` — Environment variable reference
- `docs/COMPONENT_USAGE.md` — Example usage for each component
- Example pages in `src/pages/` — Working implementations
- Tailwind docs: https://tailwindcss.com/docs

---

**Last Updated:** November 17, 2025

**Version:** 1.0
