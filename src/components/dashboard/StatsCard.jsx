/**
 * StatsCard Component
 * Displays a statistic with icon, value, label, and trend
 */

export function StatsCard({ icon, label, value, trend, trendLabel }) {
  const isPositive = trend >= 0;
  
  return (
    <div className="bg-white dark:bg-dark rounded-xl p-6 hover:border hover:border-primary transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <i className={`${icon} text-primary text-2xl`}></i>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <i className={`bi ${isPositive ? 'bi-arrow-up' : 'bi-arrow-down'} text-xs`}></i>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        {trendLabel && (
          <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
