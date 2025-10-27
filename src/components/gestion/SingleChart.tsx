import React, { useRef } from 'react';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';

interface SingleChartProps {
  chartData: any;
  title: string;
  field: string;
  onChartClick: (field: string, value: string) => void;
}

const SingleChart: React.FC<SingleChartProps> = ({ chartData, title, field, onChartClick }) => {
  const chartRef = useRef<ChartJS<"bar">>(null);

  const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (chartRef.current) {
      const elements = getElementAtEvent(chartRef.current, event);
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const value = chartData.labels[elementIndex];
        onChartClick(field, value);
      }
    }
  };

  return (
    <div className="chart-item">
      <h3>{title}</h3>
      <Bar ref={chartRef} data={chartData} onClick={onClick} />
    </div>
  );
};

export default SingleChart;
