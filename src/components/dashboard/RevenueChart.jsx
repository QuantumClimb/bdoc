/**
 * RevenueChart Component
 * Line chart showing monthly revenue trend
 */

import Plot from 'react-plotly.js';
import chartConfig from '../../data/chartConfig.json';
import { useTheme } from '../../contexts/ThemeContext';

export function RevenueChart({ data }) {
  const { isDark } = useTheme();
  
  const trace = {
    x: data.map(d => d.month),
    y: data.map(d => d.value),
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      color: '#FBCC5F',
      width: 3,
      shape: 'spline'
    },
    marker: {
      color: '#FBCC5F',
      size: 8,
      line: {
        color: isDark ? '#2B363C' : '#FFFFFF',
        width: 2
      }
    },
    fill: 'tozeroy',
    fillcolor: 'rgba(251, 204, 95, 0.1)',
    hovertemplate: '<b>%{x}</b><br>$%{y:,.0f}<extra></extra>'
  };

  const layout = {
    ...chartConfig.layout,
    paper_bgcolor: isDark ? '#171f2d' : '#FFFFFF',
    plot_bgcolor: isDark ? '#171f2d' : '#F9FAFB',
    title: {
      text: 'Monthly Revenue',
      font: { size: 16, color: isDark ? '#E5E7EB' : '#111827', family: 'Raleway' },
      x: 0.05
    },
    xaxis: {
      title: '',
      gridcolor: isDark ? '#374151' : '#E5E7EB',
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    yaxis: {
      title: 'Revenue ($)',
      gridcolor: isDark ? '#374151' : '#E5E7EB',
      color: isDark ? '#9CA3AF' : '#6B7280',
      tickformat: '$,.0f'
    },
    margin: { l: 80, r: 40, t: 60, b: 60 },
    height: 300
  };

  return (
    <div className="bg-white rounded-xl p-4" style={isDark ? {backgroundColor: '#171f2d'} : {}}>
      <Plot
        data={[trace]}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default RevenueChart;
