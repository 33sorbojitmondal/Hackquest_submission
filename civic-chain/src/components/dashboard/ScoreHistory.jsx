import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart, registerables } from 'chart.js';
import { useUser } from '../../context/UserContext';

Chart.register(...registerables);

const ScoreHistory = () => {
  const { userData } = useUser();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: userData.scoreHistory.map(item => item.month),
          datasets: [
            {
              label: 'Civic Score',
              data: userData.scoreHistory.map(item => item.score),
              borderColor: '#0d6efd',
              backgroundColor: 'rgba(13, 110, 253, 0.1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#0d6efd',
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 14,
              },
              callbacks: {
                label: function(context) {
                  return `Score: ${context.parsed.y}`;
                }
              }
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: false,
              min: Math.min(...userData.scoreHistory.map(item => item.score)) - 20,
              max: Math.max(...userData.scoreHistory.map(item => item.score)) + 20,
              ticks: {
                stepSize: 20,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [userData.scoreHistory]);

  return (
    <motion.div 
      className="card h-100"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        <h5 className="card-title fw-bold mb-4">Score History</h5>
        <div style={{ height: '250px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreHistory;