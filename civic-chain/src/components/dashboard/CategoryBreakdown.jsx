import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart, registerables } from 'chart.js';
import { useUser } from '../../context/UserContext';

Chart.register(...registerables);

const CategoryBreakdown = () => {
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
        type: 'radar',
        data: {
          labels: userData.scoreCategories.map(category => category.name),
          datasets: [
            {
              label: 'Category Scores',
              data: userData.scoreCategories.map(category => category.score),
              backgroundColor: 'rgba(13, 110, 253, 0.2)',
              borderColor: '#0d6efd',
              borderWidth: 2,
              pointBackgroundColor: userData.scoreCategories.map(category => category.color),
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: userData.scoreCategories.map(category => category.color),
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
              },
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20,
                backdropColor: 'transparent',
              },
            },
          },
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
  }, [userData.scoreCategories]);

  return (
    <motion.div 
      className="card h-100"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        <h5 className="card-title fw-bold mb-4">Category Breakdown</h5>
        <div style={{ height: '250px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="mt-3">
          <div className="row">
            {userData.scoreCategories.map((category, index) => (
              <div key={index} className="col-6 mb-2">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-2" 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: category.color 
                    }}
                  ></div>
                  <span className="small">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryBreakdown;