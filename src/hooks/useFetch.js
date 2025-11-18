/**
 * useFetch Hook
 * Generic data fetching with loading/error states and error recovery
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { logger } from "../utils/envConfig";

/**
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {boolean} options.skip - Skip fetch (default: false)
 * @param {object} options.headers - Additional headers
 * @param {boolean} options.credentials - Include credentials (default: "include")
 * @param {number} options.retries - Number of retries on failure (default: 0)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @param {function} options.onSuccess - Success callback: (data) => void
 * @param {function} options.onError - Error callback: (error) => void
 * @returns {object} { data, loading, error, refetch }
 */
export function useFetch(url, options = {}) {
  const {
    skip = false,
    headers = {},
    credentials = "include",
    retries = 0,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip && !!url);
  const [error, setError] = useState(null);
  
  const retriesLeftRef = useRef(retries);
  
  const fetchData = useCallback(async () => {
    if (skip || !url) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      logger.debug("Fetching:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          ...headers,
        },
        credentials,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }
      
      const result = await response.json();
      
      setData(result);
      setError(null);
      retriesLeftRef.current = retries;
      
      logger.debug("Fetch successful:", url);
      
      if (onSuccess) onSuccess(result);
    } catch (err) {
      const message = err.message || String(err);
      
      logger.error("Fetch failed:", { url, error: message, retriesLeft: retriesLeftRef.current });
      
      if (retriesLeftRef.current > 0) {
        retriesLeftRef.current -= 1;
        logger.info(`Retrying in ${retryDelay}ms... (${retriesLeftRef.current} left)`);
        
        setTimeout(fetchData, retryDelay);
      } else {
        setError(message);
        if (onError) onError(err);
      }
    } finally {
      if (retriesLeftRef.current === 0) {
        setLoading(false);
      }
    }
  }, [url, skip, headers, credentials, retries, retryDelay, onSuccess, onError]);
  
  // Fetch on mount
  useEffect(() => {
    retriesLeftRef.current = retries;
    fetchData();
  }, [url, skip, retries, fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useFetch;
