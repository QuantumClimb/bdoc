/**
 * Error handling and fallback utilities
 */

import { logger } from "./envConfig";

/**
 * Format error message for display
 * @param {Error|string} error - Error object or message
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(error) {
  if (!error) return "An unknown error occurred";
  
  if (typeof error === "string") {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return String(error);
}

/**
 * Check if error is likely due to CORS/CSP
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export function isCorsError(error) {
  const message = formatErrorMessage(error).toLowerCase();
  return (
    message.includes("cors") ||
    message.includes("cross-origin") ||
    message.includes("x-frame-options") ||
    message.includes("csp") ||
    message.includes("content security policy")
  );
}

/**
 * Check if error is a network error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export function isNetworkError(error) {
  const message = formatErrorMessage(error).toLowerCase();
  return (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("http") ||
    message.includes("connection")
  );
}

/**
 * Get user-friendly error message
 * @param {Error|string} error - Error object or message
 * @returns {string} User-friendly message
 */
export function getUserFriendlyErrorMessage(error) {
  const message = formatErrorMessage(error);
  
  if (isCorsError(error)) {
    return "The resource is blocked by security policies (CORS/CSP). The system will try a fallback approach.";
  }
  
  if (isNetworkError(error)) {
    return "Network connection failed. Please check your internet connection.";
  }
  
  if (message.includes("token")) {
    return "Authentication failed. Please try logging in again.";
  }
  
  if (message.includes("404") || message.includes("not found")) {
    return "The requested resource was not found.";
  }
  
  if (message.includes("401") || message.includes("unauthorized")) {
    return "You are not authorized to access this resource.";
  }
  
  if (message.includes("500")) {
    return "Server error. Please try again later.";
  }
  
  return message || "An error occurred";
}

/**
 * Log error with context
 * @param {string} context - Context/location of error (e.g., "DashboardPage.embedDashboard")
 * @param {Error|string} error - Error object or message
 * @param {object} extra - Additional context (optional)
 */
export function logErrorWithContext(context, error, extra = {}) {
  logger.error(`[${context}]`, {
    error: formatErrorMessage(error),
    isCors: isCorsError(error),
    isNetwork: isNetworkError(error),
    ...extra,
  });
}

export default {
  formatErrorMessage,
  isCorsError,
  isNetworkError,
  getUserFriendlyErrorMessage,
  logErrorWithContext,
};
