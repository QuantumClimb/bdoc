/**
 * SupplierChart Component
 * Bar chart showing top suppliers by volume
 */

import Plot from 'react-plotly.js';
import chartConfig from '../../data/chartConfig.json';
import { useTheme } from '../../contexts/ThemeContext';

export function SupplierChart({ data }) {
  const { isDark } = useTheme();
  
  const trace = {
    x: data.map(d => d.count),
    y: data.map(d => d.name),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: data.map((_, i) => chartConfig.layout.colorway[i % chartConfig.layout.colorway.length]),
      line: {
        color: isDark ? '#2B363C' : '#FFFFFF',
        width: 1
      }
    },
    text: data.map(d => d.count),
    textposition: 'outside',
    textfont: {
      size: 11,
      color: isDark ? '#E5E7EB' : '#111827',
      family: 'Raleway'
    },
    hovertemplate: '<b>%{y}</b><br>$%{x:,.0f}<extra></extra>'
  };

  const layout = {
    ...chartConfig.layout,
    paper_bgcolor: isDark ? '#111827' : '#FFFFFF',
    plot_bgcolor: isDark ? '#2B363C' : '#F9FAFB',
    title: {
      text: 'Top Suppliers',
      font: { size: 16, color: isDark ? '#E5E7EB' : '#111827', family: 'Raleway' },
      x: 0.05
    },
    xaxis: {
      title: 'Total Amount ($)',
      gridcolor: isDark ? '#374151' : '#E5E7EB',
      color: isDark ? '#9CA3AF' : '#6B7280',
      tickformat: '$,.0f'
    },
    yaxis: {
      title: '',
      gridcolor: 'rgba(0,0,0,0)',
      color: isDark ? '#9CA3AF' : '#6B7280'
    },
    margin: { l: 140, r: 80, t: 60, b: 60 },
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

export default SupplierChart;
