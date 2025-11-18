/**
 * Iframe URL building and normalization utilities
 */

export function normalizeUrl(url) {
  if (!url) return "";
  return url.replace(/\/+$/, ""); // Remove trailing slashes
}

export function normalizePath(path) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Build iframe src URL with query parameters
 * @param {string} baseUrl - Base URL (e.g., https://example.com)
 * @param {string} path - Path to resource (e.g., /static/invoices/index.html)
 * @param {object} queryParams - Query parameters to append (e.g., { invoice: "INV-001" })
 * @returns {string} Complete iframe src URL
 */
export function buildIframeUrl(baseUrl, path, queryParams = {}) {
  if (!baseUrl) {
    console.warn("buildIframeUrl: baseUrl is empty");
    return "";
  }

  const base = normalizeUrl(baseUrl);
  const normalized = normalizePath(path);
  
  try {
    const url = new URL(`${base}${normalized}`, window.location.href);
    
    // Add query params
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error("buildIframeUrl: Invalid URL", { baseUrl, path, error });
    return "";
  }
}

/**
 * Get origin from a URL string
 * @param {string} url - URL to extract origin from
 * @returns {string} Origin (e.g., https://example.com)
 */
export function getOrigin(url) {
  if (!url) return window.location.origin;
  try {
    return new URL(url, window.location.href).origin;
  } catch {
    return window.location.origin;
  }
}

/**
 * Validate iframe src for security (basic check)
 * @param {string} src - iframe src URL
 * @param {array} allowedOrigins - List of allowed origins (optional)
 * @returns {boolean} Whether src is safe
 */
export function isValidIframeSrc(src, allowedOrigins = []) {
  if (!src) return false;
  
  try {
    const url = new URL(src, window.location.href);
    
    // Only allow http/https protocols
    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }
    
    // If allowedOrigins specified, check against them
    if (allowedOrigins.length > 0) {
      return allowedOrigins.some(origin => url.origin === origin);
    }
    
    return true;
  } catch {
    return false;
  }
}
