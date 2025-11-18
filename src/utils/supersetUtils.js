/**
 * Superset SDK and API utilities
 */

import { ENV, apiUrl, logger } from "./envConfig";

/**
 * Fetch guest token from backend for Superset embedding
 * @param {string} tokenUrl - Token endpoint (defaults to ENV.SUPERSET_TOKEN_URL)
 * @returns {Promise<string>} Guest token
 */
export async function fetchSupersetToken(tokenUrl = null) {
  try {
    const url = tokenUrl || apiUrl(ENV.SUPERSET_TOKEN_URL);
    logger.debug("Fetching Superset token from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`);
    }
    
    const body = await response.json();
    
    // Try different token field names
    const token = body?.token || body?.access_token || body?.data?.token;
    
    if (!token) {
      throw new Error(`No token in response: ${JSON.stringify(body)}`);
    }
    
    logger.debug("Superset token fetched successfully");
    return token;
  } catch (error) {
    logger.error("Failed to fetch Superset token:", error.message);
    throw error;
  }
}

/**
 * Fetch dashboard configuration from backend
 * @param {string} apiBase - API base URL (defaults to ENV.API_BASE)
 * @returns {Promise<object>} Dashboard config { id, superset_domain }
 */
export async function fetchSupersetDashboardConfig(apiBase = null) {
  try {
    const base = apiBase || ENV.API_BASE;
    const url = `${base}/api/superset/dashboard`;
    logger.debug("Fetching dashboard config from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`);
    }
    
    const data = await response.json();
    
    if (!data?.id) {
      throw new Error("No dashboard id in response");
    }
    
    logger.debug("Dashboard config fetched:", data);
    
    return {
      dashboardId: String(data.id),
      supersetDomain: (data.superset_domain || "").replace(/\/+$/, "") || window.location.origin,
    };
  } catch (error) {
    logger.error("Failed to fetch dashboard config:", error.message);
    throw error;
  }
}

/**
 * Embed Superset dashboard using SDK
 * (This is typically called within a useEffect hook in a component)
 * 
 * @param {object} options - Embed configuration
 * @param {string} options.id - Dashboard ID
 * @param {string} options.supersetDomain - Superset server domain
 * @param {HTMLElement} options.mountPoint - DOM element to mount dashboard
 * @param {function} options.fetchGuestToken - Function to fetch guest token
 * @param {object} options.dashboardUiConfig - UI config (hideTitle, hideChartControls, etc)
 * @returns {Promise<void>}
 */
export async function embedSupersetDashboard(options) {
  const { embedDashboard } = await import("@superset-ui/embedded-sdk");
  
  const {
    id,
    supersetDomain,
    mountPoint,
    fetchGuestToken,
    dashboardUiConfig = {},
  } = options;
  
  logger.debug("Embedding Superset dashboard:", { id, supersetDomain });
  
  return embedDashboard({
    id,
    supersetDomain,
    mountPoint,
    fetchGuestToken,
    dashboardUiConfig: {
      hideTitle: true,
      hideChartControls: true,
      ...dashboardUiConfig,
    },
  });
}

/**
 * Build standalone Superset dashboard URL (fallback)
 * @param {string} supersetDomain - Superset server domain
 * @param {string} dashboardId - Dashboard ID
 * @returns {string} Dashboard URL
 */
export function buildStandaloneDashboardUrl(supersetDomain, dashboardId) {
  if (!supersetDomain || !dashboardId) return "";
  
  const domain = supersetDomain.replace(/\/+$/, "");
  return `${domain}/superset/dashboard/${dashboardId}/?standalone=true`;
}
