/**
 * useIframeAutoResize Hook
 * Auto-resizes iframe to fill container on load and window resize
 */

import { useEffect } from "react";
import { logger } from "../utils/envConfig";

/**
 * @param {React.Ref} iframeRef - Ref to iframe element
 * @param {object} options - Configuration options
 * @param {string} options.minHeight - Minimum height (default: "300px")
 * @param {object} options.customStyles - Custom inline styles to apply
 * @returns {void}
 */
export function useIframeAutoResize(iframeRef, options = {}) {
  const {
    minHeight = "300px",
    customStyles = {},
  } = options;
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const applyStyles = () => {
      const styles = {
        width: "100%",
        height: "100%",
        minHeight,
        border: "none",
        borderRadius: "0",
        margin: "0",
        padding: "0",
        display: "block",
        ...customStyles,
      };
      
      Object.assign(iframe.style, styles);
      logger.debug("iframe styles applied");
    };
    
    // Apply styles immediately
    applyStyles();
    
    // Reapply on window resize
    const handleResize = () => {
      window.requestAnimationFrame(applyStyles);
    };
    window.addEventListener("resize", handleResize);
    
    // Reapply if iframe content changes (MutationObserver)
    const mutationObserver = new MutationObserver(applyStyles);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mutationObserver.disconnect();
    };
  }, [iframeRef, minHeight, customStyles]);
}

export default useIframeAutoResize;
