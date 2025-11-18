/**
 * DocumentViewer Component
 * Right panel for displaying document preview matching Document_Module.html
 */

export function DocumentViewer({ selectedInvoice }) {
  if (!selectedInvoice) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <i className="bi bi-file-earmark-text text-gray-400 dark:text-gray-500 text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-2">No Document Selected</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-xs">
            Select an invoice from the table to view its details
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Document Toolbar */}
      <div className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {selectedInvoice.invoiceNumber}.pdf
          </span>
          <span className="text-xs text-gray-500">Page 1 of 1</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker transition-colors">
            <i className="bi bi-zoom-out"></i>
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">100%</span>
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker transition-colors">
            <i className="bi bi-zoom-in"></i>
          </button>
          <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker transition-colors">
            <i className="bi bi-printer mr-1"></i>
            Print
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker transition-colors">
            <i className="bi bi-download mr-1"></i>
            Download
          </button>
        </div>
      </div>

      {/* Document Viewer with Thumbnails */}
      <div className="flex flex-1 overflow-hidden">
        {/* Page Thumbnails */}
        <div className="w-32 bg-gray-200 dark:bg-darker border-r border-gray-300 dark:border-gray-700 overflow-y-auto p-2">
          <div className="bg-white dark:bg-dark border-2 border-gray-700 dark:border-primary rounded mb-2 cursor-pointer">
            <div className="aspect-[8.5/11] bg-white dark:bg-gray-800 flex items-center justify-center p-2">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Page 1</div>
                <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded">
                  <i className="bi bi-file-earmark-text text-gray-400 text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Viewer - Real PDF Embed */}
        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-darker">
          <iframe
            src={`/sample-invoice.pdf#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      </div>
    </>
  );
}

export default DocumentViewer;
