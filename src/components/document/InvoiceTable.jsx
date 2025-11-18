/**
 * InvoiceTable Component
 * Clean table matching Document_Module.html design
 */

import { useState } from 'react';

export function InvoiceTable({ invoices, onSelectInvoice, selectedInvoice }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRows, setExpandedRows] = useState({});
  const itemsPerPage = 8;

  const toggleRow = (invoiceId, type) => {
    setExpandedRows(prev => ({
      ...prev,
      [invoiceId]: prev[invoiceId] === type ? null : type
    }));
  };

  // Sorting logic
  const sortedInvoices = [...invoices].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'amount') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = sortedInvoices.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Approved: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-darker border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Invoice No
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-800 dark:hover:text-gray-300"
                onClick={() => handleSort('date')}
              >
                Invoice Date
                <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ml-1 text-gray-400`}></i>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Supplier Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Invoice Amount
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark">
            {currentInvoices.map((invoice, index) => (
              <>
                <tr 
                  key={invoice.id}
                  onClick={() => onSelectInvoice(invoice)}
                  className={`hover:bg-gray-50 dark:hover:bg-darker cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-700 ${
                    selectedInvoice?.id === invoice.id ? 'bg-gray-50 dark:bg-darker' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-white font-medium">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {invoice.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {invoice.supplier}
                  </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white text-right font-medium">
                  {Number.parseFloat(invoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          toggleRow(invoice.id, 'info');
                        }}
                        className={`px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark transition-colors ${
                          expandedRows[invoice.id] === 'info' ? 'bg-gray-100 dark:bg-dark' : 'bg-white dark:bg-darker'
                        }`}
                      >
                        +info <i className={`bi bi-chevron-${expandedRows[invoice.id] === 'info' ? 'up' : 'down'} ml-1 transition-transform`}></i>
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          toggleRow(invoice.id, 'aplines');
                        }}
                        className={`px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark transition-colors ${
                          expandedRows[invoice.id] === 'aplines' ? 'bg-gray-100 dark:bg-dark' : 'bg-white dark:bg-darker'
                        }`}
                      >
                        AP_Lines <i className={`bi bi-chevron-${expandedRows[invoice.id] === 'aplines' ? 'up' : 'down'} ml-1 transition-transform`}></i>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
                {expandedRows[invoice.id] === 'info' && (
                  <tr key={`${invoice.id}-info`} className="border-b border-gray-200 dark:border-gray-700">
                    <td colSpan="7" className="px-4 py-4 bg-gray-50 dark:bg-darker">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800 dark:text-white">Invoice Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
                            <span className="ml-2 text-gray-800 dark:text-white font-medium">{invoice.invoiceNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="ml-2 text-gray-800 dark:text-white">{invoice.date}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Supplier:</span>
                            <span className="ml-2 text-gray-800 dark:text-white">{invoice.supplier}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="ml-2 text-gray-800 dark:text-white font-medium">{Number.parseFloat(invoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusBadge(invoice.status)}`}>{invoice.status}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Payment Terms:</span>
                            <span className="ml-2 text-gray-800 dark:text-white">Net 30</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {expandedRows[invoice.id] === 'aplines' && (
                  <tr key={`${invoice.id}-aplines`} className="border-b border-gray-200 dark:border-gray-700">
                    <td colSpan="7" className="px-4 py-4 bg-gray-50 dark:bg-darker">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800 dark:text-white">AP Lines</h4>
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 dark:bg-dark">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">Line #</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-400">Description</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">Unit Price</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-darker divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">1</td>
                              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Professional Services</td>
                              <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">40</td>
                              <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">$150.00</td>
                              <td className="px-3 py-2 text-right text-gray-800 dark:text-white font-medium">$6,000.00</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">2</td>
                              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Software License</td>
                              <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">5</td>
                              <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">$1,200.00</td>
                              <td className="px-3 py-2 text-right text-gray-800 dark:text-white font-medium">$6,000.00</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">3</td>
                              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">Consulting Services</td>
                              <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">20</td>
                              <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">$171.00</td>
                              <td className="px-3 py-2 text-right text-gray-800 dark:text-white font-medium">$3,420.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedInvoices.length)} of {sortedInvoices.length} entries
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker'
            }`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === i + 1
                  ? 'bg-gray-700 dark:bg-gray-600 text-white border-gray-700 dark:border-gray-600'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-darker'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTable;
