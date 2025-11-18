/**
 * useSupersetConfig Hook
 * Fetches and manages Superset dashboard configuration
 */

import { useEffect, useState, useCallback } from "react";
import { fetchSupersetDashboardConfig } from "../utils/supersetUtils";
import { logger } from "../utils/envConfig";

/**
 * @param {string} apiBase - API base URL (optional)
 * @returns {object} { config, loading, error, refetch }
 */
export function useSupersetConfig(apiBase = null) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchSupersetDashboardConfig(apiBase);
      setConfig(data);
      
      logger.debug("Superset config loaded:", data);
    } catch (err) {
      const message = err.message || String(err);
      setError(message);
      logger.error("useSupersetConfig error:", message);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);
  
  // Fetch on mount
  useEffect(() => {
    fetch();
  }, [fetch]);
  
  return {
    config,
    loading,
    error,
    refetch: fetch,
  };
}

export default useSupersetConfig;
