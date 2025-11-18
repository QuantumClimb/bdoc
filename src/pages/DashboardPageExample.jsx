/**
 * Example Dashboard Page
 * Displays Superset Dashboard via iframe
 */

import DashboardTemplate from "../components/templates/DashboardTemplate";

export function DashboardPageExample() {
  return (
    <div className="w-full h-screen-minus-header">
      <DashboardTemplate showToolbar={true} hideTitle={false} />
    </div>
  );
}
