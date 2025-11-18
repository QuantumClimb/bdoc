/**
 * Dashboard Template Component
 * Superset dashboard embedding with SDK + fallback to direct iframe
 */

import { useRef, useEffect, useState } from "react";
import { fetchSupersetToken, buildStandaloneDashboardUrl } from "../../utils/supersetUtils";
import { useSupersetConfig } from "../../hooks/useSupersetConfig";
import { useIframeAutoResize } from "../../hooks/useIframeAutoResize";
import Spinner from "../common/Spinner";

export function DashboardTemplate({
  dashboardId = null,
  supersetDomain = null,
  showToolbar = true,
  hideTitle = true,
}) {
  const iframeRef = useRef(null);
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);
  
  const { config, loading: configLoading, error: configError } = useSupersetConfig();
  
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  
  useIframeAutoResize(iframeRef, { minHeight: "600px" });
  
  // Effect: Attempt SDK embed, fallback to iframe
  useEffect(() => {
    if (configLoading || !config) return;
    
    const finalDashboardId = dashboardId || config.dashboardId;
    const finalSupersetDomain = supersetDomain || config.supersetDomain;
    
    if (!finalDashboardId || !finalSupersetDomain) {
      setError("Missing dashboard ID or Superset domain");
      return;
    }
    
    let mounted = true;
    const doEmbed = async () => {
      try {
        setStatus("loading");
        setError(null);
        
        // Try SDK embed first
        const { embedDashboard } = await import("@superset-ui/embedded-sdk");
        
        await embedDashboard({
          id: finalDashboardId,
          supersetDomain: finalSupersetDomain,
          mountPoint: mountRef.current,
          fetchGuestToken: async () => {
            const token = await fetchSupersetToken();
            return token;
          },
          dashboardUiConfig: {
            hideTitle,
            hideChartControls: true,
          },
        });
        
        if (!mounted) return;
        
        setStatus("ready");
        
        // Resize iframe if present
        const iframe = mountRef.current?.querySelector("iframe");
        if (iframe) {
          iframeRef.current = iframe;
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.minHeight = "600px";
          iframe.style.border = "none";
        }
      } catch (err) {
        if (!mounted) return;
        
        console.error("SDK embed failed, trying fallback:", err);
        setError(err.message);
        setStatus("error");
        
        // Try fallback iframe approach
        setTimeout(() => {
          if (!mounted) return;
          
          try {
            mountRef.current.innerHTML = "";
            
            const fallbackUrl = buildStandaloneDashboardUrl(finalSupersetDomain, finalDashboardId);
            
            const iframe = document.createElement("iframe");
            iframe.src = fallbackUrl;
            iframe.className = "dashboard-iframe-fallback";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.minHeight = "600px";
            iframe.style.border = "none";
            iframe.style.margin = "0";
            iframe.style.padding = "0";
            iframe.style.display = "block";
            
            mountRef.current.appendChild(iframe);
            iframeRef.current = iframe;
            
            setStatus("fallback");
            setError(null);
          } catch (fallbackErr) {
            console.error("Fallback iframe injection failed:", fallbackErr);
            setStatus("error");
            setError("Could not load dashboard via SDK or fallback iframe");
          }
        }, 250);
      }
    };
    
    doEmbed();
    
    const cleanup = cleanupRef.current;
    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [config, configLoading, dashboardId, supersetDomain, hideTitle]);
  
  if (configLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <Spinner size="md" message="Loading dashboard..." />
      </div>
    );
  }
  
  if (configError) {
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center px-6">
          <h3 className="text-lg font-semibold text-red-800">Dashboard Load Error</h3>
          <p className="text-sm text-red-700 mt-2">{configError}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={mountRef}
      className="dashboard-host w-full h-96 rounded-lg overflow-hidden shadow-md"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
      }}
    >
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Spinner size="md" message="Embedding dashboard..." />
        </div>
      )}
      
      {status === "error" && (
        <div className="p-4 text-center text-red-600">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      
      {status === "fallback" && (
        <div className="absolute top-2 left-2 z-20 text-xs text-gray-600 bg-yellow-100 px-2 py-1 rounded">
          ⚠️ Using fallback viewer
        </div>
      )}
    </div>
  );
}

export default DashboardTemplate;
