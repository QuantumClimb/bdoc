/**
 * usePostMessage Hook
 * Handles parent ↔ iframe communication with postMessage API
 */

import { useCallback, useEffect, useRef } from "react";
import { logger } from "../utils/envConfig";
import { getOrigin } from "../utils/iframeUtils";

/**
 * @param {React.Ref} iframeRef - Ref to iframe element
 * @param {object} options - Configuration options
 * @param {function} options.onMessage - Callback when message received: (type, data) => void
 * @param {boolean} options.autoSendHandshake - Send handshake on mount (default: true)
 * @returns {object} { send, on, off }
 */
export function usePostMessage(iframeRef, options = {}) {
  const {
    onMessage,
    autoSendHandshake = true,
  } = options;
  
  const messageListenerRef = useRef(new Map());
  
  /**
   * Send message to iframe
   * @param {string} type - Message type
   * @param {object} payload - Message payload
   */
  const send = useCallback((type, payload = {}) => {
    if (!iframeRef.current?.contentWindow) {
      logger.warn("usePostMessage.send: iframe not ready");
      return;
    }
    
    try {
      const origin = getOrigin(iframeRef.current.src);
      const message = { type, ...payload };
      
      logger.debug("Sending postMessage:", { type, origin });
      iframeRef.current.contentWindow.postMessage(message, origin);
    } catch (error) {
      logger.error("usePostMessage.send failed:", error.message);
    }
  }, [iframeRef]);
  
  /**
   * Listen for messages of a specific type
   * @param {string} type - Message type to listen for
   * @param {function} handler - Handler: (data) => void
   * @returns {function} Unsubscribe function
   */
  const on = useCallback((type, handler) => {
    if (!type || !handler) {
      logger.warn("usePostMessage.on: missing type or handler");
      return () => {};
    }
    
    if (!messageListenerRef.current.has(type)) {
      messageListenerRef.current.set(type, []);
    }
    
    messageListenerRef.current.get(type).push(handler);
    
    return () => {
      const handlers = messageListenerRef.current.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    };
  }, []);
  
  /**
   * Stop listening for a specific type
   * @param {string} type - Message type
   * @param {function} handler - Handler to remove (optional, removes all if omitted)
   */
  const off = useCallback((type, handler) => {
    if (!type) return;
    
    if (handler) {
      const handlers = messageListenerRef.current.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    } else {
      messageListenerRef.current.delete(type);
    }
  }, []);
  
  // Setup global message listener
  useEffect(() => {
    const handleMessage = (event) => {
      const { type, ...data } = event.data || {};
      
      if (!type) return;
      
      logger.debug("Received postMessage:", type);
      
      // Call registered handlers for this type
      const handlers = messageListenerRef.current.get(type);
      if (handlers && handlers.length > 0) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            logger.error("usePostMessage handler error:", error.message);
          }
        });
      }
      
      // Call generic onMessage callback
      if (onMessage) {
        try {
          onMessage(type, data);
        } catch (error) {
          logger.error("usePostMessage onMessage callback error:", error.message);
        }
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    return () => window.removeEventListener("message", handleMessage);
  }, [onMessage]);
  
  // Send handshake on mount
  useEffect(() => {
    if (autoSendHandshake && iframeRef.current?.contentWindow) {
      setTimeout(() => {
        send("HANDSHAKE", { from: "parent", timestamp: Date.now() });
      }, 500);
    }
  }, [send, autoSendHandshake, iframeRef]);
  
  return {
    send,
    on,
    off,
  };
}

export default usePostMessage;
