import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PriceData } from '../types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceChartProps {
  data: PriceData[];
  itemName: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, itemName }) => {
  const chartData = {
    labels: data.map(d => format(new Date(d.timestamp * 1000), 'MMM dd HH:mm')),
    datasets: [
      {
        label: 'High Price',
        data: data.map(d => d.avgHighPrice),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
        pointRadius: 1,
      },
      {
        label: 'Low Price',
        data: data.map(d => d.avgLowPrice),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        pointRadius: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${itemName} Price History`,
        font: {
          size: 16,
          weight: 'bold',
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxTicksLimit: 10
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (GP)'
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString() + ' GP';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="h-96 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};