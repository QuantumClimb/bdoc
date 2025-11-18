/**
 * DashboardPage Component
 * Main dashboard with stats cards and charts
 * Pixel-perfect match to 2-Dashboard.html
 */

import { RevenueChart } from '../components/dashboard/RevenueChart';
import { InvoiceStatusChart } from '../components/dashboard/InvoiceStatusChart';
import { SupplierChart } from '../components/dashboard/SupplierChart';
import { PaymentMethodsChart } from '../components/dashboard/PaymentMethodsChart';
import mockData from '../data/mockData.json';

export function DashboardPage() {
  const { chartData } = mockData;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 -mt-3">
        <h1 className="text-2xl font-semibold text-[#2a363b] dark:text-white">Dashboard</h1>
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <RevenueChart data={chartData.monthlyRevenue} />
      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-3 gap-6 divide-x divide-gray-200 dark:divide-gray-700">
        <div className="pr-6">
          <InvoiceStatusChart data={chartData.invoiceStatus} />
        </div>
        <div className="px-6">
          <SupplierChart data={chartData.topSuppliers} />
        </div>
        <div className="pl-6">
          <PaymentMethodsChart data={chartData.paymentMethods} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
