import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  RadialLinearScale,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Radar, Doughnut } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import apiService from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats from API
        const statsResponse = await apiService.dashboard.getStats();
        setDashboardData(statsResponse.data);
        
        // Fetch recent activities from API
        const activitiesResponse = await apiService.dashboard.getRecentActivities();
        setRecentActivities(activitiesResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    } else {
      setError('User data not available. Please log in again.');
      setLoading(false);
    }
  }, [currentUser]);

  // Prepare chart data
  const prepareLineChartData = () => {
    if (!dashboardData) return null;

    const labels = dashboardData.scoreHistory.map(item => {
      const [year, month] = item.date.split('-');
      return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Civic Score',
          data: dashboardData.scoreHistory.map(item => item.score),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const prepareRadarChartData = () => {
    if (!dashboardData) return null;

    const categories = Object.keys(dashboardData.categoryScores);
    const scores = Object.values(dashboardData.categoryScores);

    return {
      labels: categories,
      datasets: [
        {
          label: 'Category Scores',
          data: scores,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const prepareDoughnutChartData = () => {
    if (!dashboardData) return null;

    return {
      labels: ['Completed', 'Pending'],
      datasets: [
        {
          data: [dashboardData.completedActivities, dashboardData.pendingActivities],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score History'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score'
        }
      }
    }
  };

  const radarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Category Breakdown'
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activities Status'
      }
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Environmental':
        return 'bg-success';
      case 'Community':
        return 'bg-primary';
      case 'Education':
        return 'bg-info';
      case 'Health':
        return 'bg-warning';
      case 'Cultural':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'completed' ? 'bg-success' : 'bg-warning';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <div style={{ width: 180, height: 180, margin: '0 auto' }}>
                    <CircularProgressbar
                      value={dashboardData.civicScore}
                      maxValue={1000}
                      text={`${dashboardData.civicScore}`}
                      styles={buildStyles({
                        textSize: '16px',
                        pathColor: `rgba(75, 192, 192, ${dashboardData.civicScore / 1000})`,
                        textColor: '#333',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                      })}
                    />
                  </div>
                  <h3 className="mt-3 mb-0">Civic Score</h3>
                  <p className="text-muted">Tier: {dashboardData.tier}</p>
                  <div className="d-flex justify-content-center">
                    <span className="badge bg-primary fs-6 px-3 py-2">
                      {dashboardData.availablePoints} Points Available
                    </span>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card h-100 border-0 bg-light">
                        <div className="card-body">
                          <h5 className="card-title">Next Tier Progress</h5>
                          <p className="card-text">
                            You need {dashboardData.pointsToNextTier} more points to reach {dashboardData.nextTier} tier.
                          </p>
                          <div className="progress" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${(dashboardData.civicScore % 1000) / 10}%` }}
                              aria-valuenow={(dashboardData.civicScore % 1000) / 10}
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >
                              {Math.round((dashboardData.civicScore % 1000) / 10)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card h-100 border-0 bg-light">
                        <div className="card-body">
                          <h5 className="card-title">Activity Summary</h5>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total Activities:</span>
                            <span className="fw-bold">{dashboardData.totalActivities}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Completed:</span>
                            <span className="fw-bold text-success">{dashboardData.completedActivities}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Pending:</span>
                            <span className="fw-bold text-warning">{dashboardData.pendingActivities}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h5 className="card-title">Your Impact</h5>
                          <div className="row text-center">
                            <div className="col">
                              <div className="d-flex flex-column align-items-center">
                                <i className="bi bi-tree fs-2 text-success"></i>
                                <span className="fw-bold fs-4">{dashboardData.impactStats.treesPlanted}</span>
                                <span className="text-muted small">Trees Planted</span>
                              </div>
                            </div>
                            <div className="col">
                              <div className="d-flex flex-column align-items-center">
                                <i className="bi bi-recycle fs-2 text-primary"></i>
                                <span className="fw-bold fs-4">{dashboardData.impactStats.wasteRecycled}kg</span>
                                <span className="text-muted small">Waste Recycled</span>
                              </div>
                            </div>
                            <div className="col">
                              <div className="d-flex flex-column align-items-center">
                                <i className="bi bi-clock fs-2 text-info"></i>
                                <span className="fw-bold fs-4">{dashboardData.impactStats.volunteerHours}</span>
                                <span className="text-muted small">Volunteer Hours</span>
                              </div>
                            </div>
                            <div className="col">
                              <div className="d-flex flex-column align-items-center">
                                <i className="bi bi-people fs-2 text-warning"></i>
                                <span className="fw-bold fs-4">{dashboardData.impactStats.peopleHelped}</span>
                                <span className="text-muted small">People Helped</span>
                              </div>
                            </div>
                            <div className="col">
                              <div className="d-flex flex-column align-items-center">
                                <i className="bi bi-calendar-event fs-2 text-danger"></i>
                                <span className="fw-bold fs-4">{dashboardData.impactStats.eventsAttended}</span>
                                <span className="text-muted small">Events Attended</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            Recent Activities
          </button>
        </li>
      </ul>

      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">Score History</h5>
                {prepareLineChartData() && (
                  <Line data={prepareLineChartData()} options={lineChartOptions} />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">Activities Status</h5>
                {prepareDoughnutChartData() && (
                  <Doughnut data={prepareDoughnutChartData()} options={doughnutChartOptions} />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Category Breakdown</h5>
                {prepareRadarChartData() && (
                  <div style={{ maxHeight: '400px' }}>
                    <Radar data={prepareRadarChartData()} options={radarChartOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0">Recent Activities</h5>
                  <Link to="/activities/new" className="btn btn-primary">
                    <i className="bi bi-plus-lg me-2"></i>
                    Log New Activity
                  </Link>
                </div>
                {recentActivities.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 g-4">
                    {recentActivities.map(activity => (
                      <div key={activity._id} className="col">
                        <div className="card h-100 border-0 shadow-sm">
                          {activity.image && (
                            <img 
                              src={activity.image} 
                              className="card-img-top" 
                              alt={activity.title}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title mb-0">{activity.title}</h5>
                              <span className={`badge ${getStatusBadgeClass(activity.status)}`}>
                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                              </span>
                            </div>
                            <p className="card-text text-muted mb-3">{activity.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge ${getCategoryBadgeClass(activity.category)}`}>
                                {activity.category}
                              </span>
                              <span className="text-muted small">
                                {new Date(activity.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="card-footer bg-transparent border-top-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="badge bg-light text-dark">
                                <i className="bi bi-star-fill text-warning me-1"></i>
                                {activity.points} Points
                              </span>
                              <Link to={`/activities/${activity._id}`} className="btn btn-sm btn-outline-primary">
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No activities found.</p>
                    <Link to="/activities/new" className="btn btn-primary">
                      Log Your First Activity
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

