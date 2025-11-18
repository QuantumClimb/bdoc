/**
 * DocumentPage Component
 * Invoice list with document viewer and upload functionality
 * Pixel-perfect match to Document_Module.html
 */

import { useState } from 'react';
import { InvoiceTable } from '../components/document/InvoiceTable';
import { DocumentViewer } from '../components/document/DocumentViewer';
import mockData from '../data/mockData.json';

export function DocumentPage({ onUpload }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { invoices } = mockData;

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="h-[calc(100vh-80px)]">
      {/* Page Title */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 -mt-3">
        <h1 className="text-2xl font-semibold text-[#2a363b] dark:text-white">Documents</h1>
      </div>

      <div className="flex h-[calc(100%-70px)]">
        {/* Left Panel - Invoice List (65%) */}
        <div className="w-[65%] border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-dark overflow-auto">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#2a363b] dark:text-white">Invoice List</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darker transition-colors">
                <i className="bi bi-funnel mr-1"></i>
                Filter
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darker transition-colors">
                <i className="bi bi-download mr-1"></i>
                Export
              </button>
            </div>
          </div>
          
          <InvoiceTable 
            invoices={invoices}
            onSelectInvoice={handleSelectInvoice}
            selectedInvoice={selectedInvoice}
          />
        </div>
      </div>

      {/* Right Panel - Document Viewer (35%) */}
      <div className="w-[35%] bg-gray-100 dark:bg-darker flex flex-col">
        <DocumentViewer selectedInvoice={selectedInvoice} />
      </div>
      </div>
    </div>
  );
}

export default DocumentPage;
