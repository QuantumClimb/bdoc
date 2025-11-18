/**
 * Centralized environment configuration
 * All backend URLs, API endpoints, and feature flags
 */

const normalizeUrl = (url) => (url ? url.replace(/\/+$/, "") : "");

export const ENV = {
  // API Base
  API_BASE: normalizeUrl(process.env.REACT_APP_API_BASE || "/api"),
  
  // Backend URLs
  BACKEND_URL: normalizeUrl(
    process.env.REACT_APP_BACKEND_URL ||
    "https://bdoc1-bccvevakfmfjapdm.centralindia-01.azurewebsites.net"
  ),
  
  // Iframe Viewer
  VIEWER_ORIGIN: normalizeUrl(process.env.REACT_APP_VIEWER_ORIGIN || ""),
  VIEWER_PATH: process.env.REACT_APP_VIEWER_PATH || "/static/invoices/index.html",
  
  // Superset
  SUPERSET_DOMAIN: normalizeUrl(process.env.REACT_APP_SUPERSET_DOMAIN || ""),
  SUPERSET_TOKEN_URL: process.env.REACT_APP_SUPERSET_TOKEN_URL || "/api/superset/token",
  
  // App Config
  APP_TITLE: process.env.REACT_APP_APP_TITLE || "BDoc Invoice Dashboard",
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || "info",
};

/**
 * Helper to build full API URL
 */
export function apiUrl(path) {
  const base = ENV.API_BASE;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * Helper to build backend URL with path
 */
export function backendUrl(path) {
  const base = ENV.BACKEND_URL || ENV.API_BASE;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * Check if environment is development
 */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Check if environment is production
 */
export const isProd = process.env.NODE_ENV === "production";

/**
 * Logger utility respecting log level
 */
const logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = logLevels[ENV.LOG_LEVEL] || logLevels.info;

export const logger = {
  debug: (msg, ...args) => {
    if (currentLevel <= logLevels.debug) console.debug(msg, ...args);
  },
  info: (msg, ...args) => {
    if (currentLevel <= logLevels.info) console.info(msg, ...args);
  },
  warn: (msg, ...args) => {
    if (currentLevel <= logLevels.warn) console.warn(msg, ...args);
  },
  error: (msg, ...args) => {
    if (currentLevel <= logLevels.error) console.error(msg, ...args);
  },
};

export default ENV;
