import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SingleChart from './SingleChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  data: any[];
  chartConfigs: { title: string; field: string }[];
  onChartClick: (field: string, value: string) => void;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, chartConfigs, onChartClick }) => {
  const processDataForChart = (field: string) => {
    const counts: { [key: string]: number } = {};
    for (const row of data) {
      const value = row[field];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    }

    const pastelColors = [
      '#FFB6C1', '#FFDAB9', '#E6E6FA', '#B0E0E6', '#D8BFD8', '#F0E68C',
      '#98FB98', '#F5DEB3', '#ADD8E6', '#C0C0C0', '#FAFAD2', '#FFE4E1'
    ];

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: `Distribución por ${field}`,
          data: Object.values(counts),
          backgroundColor: pastelColors,
          borderColor: pastelColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="charts-container">
      {chartConfigs.map(config => (
        <SingleChart
          key={config.field}
          chartData={processDataForChart(config.field)}
          title={config.title}
          field={config.field}
          onChartClick={onChartClick}
        />
      ))}
    </div>
  );
};

export default ChartComponent;
