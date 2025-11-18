/**
 * Example Invoice Page
 * - Loads the backend invoice viewer in a single, full-area iframe that blends into the app.
 * - Respects CSS variables for header/footer heights:
 *     --app-header-height (default 72px)
 *     --app-footer-height (default 48px)
 */

import { useMemo, useRef, useEffect } from "react";
import { ENV, logger } from "../utils/envConfig";

export function InvoicePageExample({ invoiceId } = {}) {
  // Get backend URL from env or use default
  const envBackend =
    ENV.REACT_APP_VIEWER_ORIGIN ||
    ENV.REACT_APP_BACKEND_URL;

  const defaultBackend = "https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net";

  const viewerPathEnv = ENV.REACT_APP_VIEWER_PATH;
  const defaultViewerPath = "/static/invoices/index.html";

  // Normalize URLs
  const normalizeBase = (url) => (url ? url.replace(/\/+$/, "") : "");
  const normalizePath = (p) => (p ? (p.startsWith("/") ? p : `/${p}`) : "");

  const backendBase = normalizeBase(envBackend) || normalizeBase(defaultBackend);
  const viewerPath = normalizePath(viewerPathEnv || defaultViewerPath);

  // Build iframe source URL with optional invoice ID
  const iframeSrc = useMemo(() => {
    if (!backendBase) return "";
    const base = `${backendBase}${viewerPath}`;
    if (invoiceId !== undefined && invoiceId !== null && String(invoiceId).trim() !== "") {
      return `${base}?invoice=${encodeURIComponent(String(invoiceId))}`;
    }
    return base;
  }, [backendBase, viewerPath, invoiceId]);

  const iframeRef = useRef(null);

  // Listen for messages from iframe
  useEffect(() => {
    function onMessage(e) {
      // SECURITY: in production, check e.origin against expected backend origin
      const data = e.data || {};
      if (data?.type === "INVOICE_RESPONSE") {
        // example: { type: 'INVOICE_RESPONSE', status: 'ok', cmd: 'save', message: 'Saved' }
        logger.debug("Invoice iframe response:", data);
        // Dispatch custom event for app-wide handling
        window.dispatchEvent(new CustomEvent("app:invoiceResponse", { detail: data }));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Optional onLoad handler for handshake
  const onIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const targetOrigin = new URL(iframe.src, window.location.href).origin;
      iframe.contentWindow.postMessage(
        { type: "INVOICE_CMD", cmd: "handshake", payload: { from: "parent" } },
        targetOrigin
      );
    } catch (err) {
      logger.debug("Iframe onLoad: handshake error", err);
    }
  };

  // Error state if backend not configured
  if (!backendBase) {
    return (
      <div className="flex items-center justify-center screen-minus-header-footer">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Invoice viewer is not configured.</p>
          <p className="text-sm text-gray-500">
            Please set <code className="bg-gray-100 px-2 py-1 rounded">REACT_APP_BACKEND_URL</code> in your environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen-minus-header" role="region" aria-label="Invoices viewer">
      <iframe
        id="invoiceViewerIframe"
        ref={iframeRef}
        title="Invoice viewer"
        src={iframeSrc}
        loading="lazy"
        aria-label="Invoice viewer"
        allow="clipboard-read; clipboard-write; fullscreen"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          background: "transparent",
        }}
        onLoad={onIframeLoad}
      />
    </div>
  );
}
