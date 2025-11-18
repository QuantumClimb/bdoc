/**
 * PaymentMethodsChart Component
 * Donut chart showing payment method distribution
 */

import Plot from 'react-plotly.js';
import chartConfig from '../../data/chartConfig.json';
import { useTheme } from '../../contexts/ThemeContext';

export function PaymentMethodsChart({ data }) {
  const { isDark } = useTheme();
  
  const trace = {
    labels: data.map(d => d.method),
    values: data.map(d => d.percentage),
    type: 'pie',
    marker: {
      colors: data.map(d => d.color),
      line: {
        color: isDark ? '#2B363C' : '#FFFFFF',
        width: 2
      }
    },
    textinfo: 'label+percent',
    textfont: {
      size: 12,
      color: isDark ? '#E5E7EB' : '#111827',
      family: 'Raleway'
    },
    hovertemplate: '<b>%{label}</b><br>%{value}%<extra></extra>',
    hole: 0.5
  };

  const layout = {
    ...chartConfig.layout,
    paper_bgcolor: isDark ? '#171f2d' : '#FFFFFF',
    plot_bgcolor: isDark ? '#171f2d' : '#F9FAFB',
    title: {
      text: 'Payment Methods',
      font: { size: 16, color: isDark ? '#E5E7EB' : '#111827', family: 'Raleway' },
      x: 0.05
    },
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.1,
      font: { size: 11, color: isDark ? '#9CA3AF' : '#6B7280', family: 'Raleway' }
    },
    annotations: [{
      text: 'Payment<br>Mix',
      x: 0.5,
      y: 0.5,
      font: {
        size: 14,
        color: '#FBCC5F',
        family: 'Raleway',
        weight: 'bold'
      },
      showarrow: false
    }],
    margin: { l: 40, r: 40, t: 60, b: 80 },
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

export default PaymentMethodsChart;
