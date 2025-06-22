" ";
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChatChart = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: chartData.type || 'bar',
      data: chartData.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 11
              },
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              family: 'Inter, system-ui, sans-serif',
              size: 12,
              weight: 'bold'
            },
            bodyFont: {
              family: 'Inter, system-ui, sans-serif',
              size: 11
            },
            padding: 10,
            cornerRadius: 6,
            displayColors: true,
            usePointStyle: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 10
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 10
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  const getChartTitle = () => {
    if (!chartData || !chartData.data || !chartData.data.datasets || chartData.data.datasets.length === 0) {
      return "Data Visualization";
    }
    
    const dataset = chartData.data.datasets[0];
    return dataset.label || "Data Visualization";
  };

  return (
    <div className="w-full mt-3 mb-3">
      <div className="p-3 bg-[#F8F9FB] rounded-lg border border-gray-100">
        <div className="mb-2 text-sm font-medium text-gray-700">{getChartTitle()}</div>
        <div className="h-56">
          <canvas ref={chartRef} />
        </div>
        {chartData.type === "pie" || chartData.type === "doughnut" ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {chartData.data.labels.map((label, index) => (
              <div key={index} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: chartData.data.datasets[0].backgroundColor[index] }}
                />
                <span>{label}: {chartData.data.datasets[0].data[index]}%</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatChart; 