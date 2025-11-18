/**
 * Document Viewer Template Component
 * Iframe-based invoice/document viewer with postMessage communication
 * Ported from COMPONENTS_PACKAGE/NEW/index.html
 */

import { useRef, useEffect, useState } from "react";
import { buildIframeUrl } from "../../utils/iframeUtils";
import { usePostMessage } from "../../hooks/usePostMessage";
import { useIframeAutoResize } from "../../hooks/useIframeAutoResize";
import Spinner from "../common/Spinner";

export function DocumentViewerTemplate({
  documentId = null,
  baseUrl = "",
  viewerPath = "/static/invoices/index.html",
  onDocumentSelected = () => {},
  onError = () => {},
}) {
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");
  
  const { send, on } = usePostMessage(iframeRef, {
    autoSendHandshake: true,
  });
  
  useIframeAutoResize(iframeRef, { minHeight: "480px" });
  
  // Build iframe URL on mount and documentId change
  useEffect(() => {
    try {
      const src = buildIframeUrl(baseUrl, viewerPath, { invoice: documentId });
      setIframeSrc(src);
      setLoading(true);
      setStatus("loading");
    } catch (error) {
      onError(error);
      setStatus("error");
    }
  }, [baseUrl, viewerPath, documentId, onError]);
  
  // Setup postMessage listeners
  useEffect(() => {
    const unsubscribeReady = on("VIEWER_READY", (data) => {
      console.log("Viewer ready:", data);
      setLoading(false);
      setStatus("ready");
    });
    
    const unsubscribeError = on("VIEWER_ERROR", (data) => {
      console.error("Viewer error:", data);
      setStatus("error");
      onError(new Error(data.message || "Viewer error"));
    });
    
    const unsubscribeDocumentSelected = on("DOCUMENT_SELECTED", (data) => {
      console.log("Document selected:", data);
      onDocumentSelected(data);
    });
    
    return () => {
      unsubscribeReady();
      unsubscribeError();
      unsubscribeDocumentSelected();
    };
  }, [on, onDocumentSelected, onError]);
  
  const handlePrint = () => {
    send("VIEWER_CMD", { cmd: "print" });
  };
  
  const handleDownload = () => {
    send("VIEWER_CMD", { cmd: "download" });
  };
  
  if (!iframeSrc) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600">Document viewer not configured</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Document Viewer {status === "loading" && <span className="ml-2 text-gray-500">(Loading...)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            disabled={loading}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            aria-label="Print"
          >
            <span>🖨️ Print</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            aria-label="Download"
          >
            <span>⬇️ Download</span>
          </button>
        </div>
      </div>
      
      {/* Viewer Container */}
      <div className="flex-1 overflow-hidden bg-gray-100 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Spinner size="md" message="Loading document..." />
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title="Document Viewer"
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onLoad={() => {
            console.log("iframe loaded");
          }}
        />
      </div>
    </div>
  );
}

export default DocumentViewerTemplate;
