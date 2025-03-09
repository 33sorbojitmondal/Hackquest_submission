import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [userData, setUserData] = useState({
    name: 'Test User',
    score: 120,
    activities: [
      {
        id: 1,
        title: 'Community Cleanup',
        description: 'Cleaned up the local park',
        date: '2023-03-01',
        points: 20
      },
      {
        id: 2,
        title: 'Volunteer at Food Bank',
        description: 'Helped distribute food to those in need',
        date: '2023-02-15',
        points: 30
      },
      {
        id: 3,
        title: 'Tree Planting',
        description: 'Planted trees in the community garden',
        date: '2023-01-20',
        points: 25
      }
    ],
    rewards: [
      {
        id: 1,
        title: 'Free Coffee',
        description: 'One free coffee at Local Cafe',
        claimDate: '2023-02-10',
        pointsCost: 15
      },
      {
        id: 2,
        title: 'Movie Ticket',
        description: 'One free movie ticket at City Cinema',
        claimDate: '2023-01-05',
        pointsCost: 50
      }
    ]
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="loading-spinner">
        Loading...
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <h1>Welcome, {userData.name}!</h1>
      
      {/* User stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>Your Score</h2>
          <p className="stat-value">{userData.score}</p>
          <p className="stat-label">Civic engagement points</p>
        </div>
        
        <div className="stat-card">
          <h2>Activities</h2>
          <p className="stat-value">{userData.activities.length}</p>
          <p className="stat-label">Completed activities</p>
        </div>
        
        <div className="stat-card">
          <h2>Rewards</h2>
          <p className="stat-value">{userData.rewards.length}</p>
          <p className="stat-label">Claimed rewards</p>
        </div>
      </div>
      
      {/* Recent activities */}
      <div className="section">
        <div className="section-header">
          <h2>Recent Activities</h2>
          <Link to="/activities" className="view-all">View All</Link>
        </div>
        
        <div className="cards-container">
          {userData.activities.map((activity) => (
            <div key={activity.id} className="card">
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <div className="card-footer">
                <span>{new Date(activity.date).toLocaleDateString()}</span>
                <span className="points-badge">{activity.points} points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent rewards */}
      <div className="section">
        <div className="section-header">
          <h2>Recent Rewards</h2>
          <Link to="/rewards" className="view-all">View All</Link>
        </div>
        
        <div className="cards-container">
          {userData.rewards.map((reward) => (
            <div key={reward.id} className="card">
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>
              <div className="card-footer">
                <span>Claimed on {new Date(reward.claimDate).toLocaleDateString()}</span>
                <span className="points-badge">{reward.pointsCost} points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 