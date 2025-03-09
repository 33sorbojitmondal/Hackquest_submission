import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';

const RewardsPage = () => {
  const { currentUser, deductPoints } = useUser();
  const [rewards, setRewards] = useState([]);
  const [recommendedRewards, setRecommendedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('pointsCost');
  const [claimingReward, setClaimingReward] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointHistory, setPointHistory] = useState([]);
  const [showPointHistory, setShowPointHistory] = useState(false);
  const [behaviorSuggestions, setBehaviorSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch rewards from API
        const response = await apiService.rewards.getAll({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          sort: sortBy
        });
        
        setRewards(response.data);
        
        // Fetch recommended rewards
        const recommendedResponse = await apiService.rewards.getRecommended();
        setRecommendedRewards(recommendedResponse.data);
        
        // Fetch behavior suggestions
        const suggestionsResponse = await apiService.activities.getGoodBehaviorSuggestions();
        setBehaviorSuggestions(suggestionsResponse.data);
        
        if (currentUser) {
          setAvailablePoints(currentUser.availablePoints);
          
          // Fetch point history
          const historyResponse = await apiService.rewards.getUserRedemptions();
          setPointHistory(historyResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError('Failed to load rewards. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, selectedCategory, sortBy]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      setClaimingReward(rewardId);
      setClaimSuccess(null);
      
      // Find the reward being redeemed
      const reward = rewards.find(r => r._id === rewardId) || 
                    recommendedRewards.find(r => r._id === rewardId);
      
      if (!reward) {
        throw new Error('Reward not found');
      }
      
      // Check if user has enough points
      if (availablePoints < reward.pointsCost) {
        throw new Error('Not enough points available');
      }
      
      // Deduct points from user's account
      const deductResult = await deductPoints(reward.pointsCost, `Redeemed reward: ${reward.title}`);
      
      // Update available points
      setAvailablePoints(deductResult.newBalance);
      
      // Add to redemption history
      const newRedemption = {
        _id: Date.now().toString(),
        userId: currentUser._id,
        rewardId: reward._id,
        rewardTitle: reward.title,
        pointsCost: reward.pointsCost,
        redeemedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      setPointHistory(prevHistory => [newRedemption, ...prevHistory]);
      
      // Show success message
      setClaimSuccess(`Successfully redeemed ${reward.title} for ${reward.pointsCost} points!`);
      
      setTimeout(() => {
        setClaimSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setError(err.message || 'Failed to redeem reward. Please try again later.');
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setClaimingReward(null);
    }
  };

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(rewards.map(reward => reward.category))];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading rewards...</p>
      </div>
    );
  }

  const renderRewardCard = (reward) => (
    <div key={reward._id} className="col">
      <div className="card h-100 border-0 shadow-sm reward-card">
        {reward.image && (
          <img 
            src={reward.image} 
            className="card-img-top reward-image" 
            alt={reward.title}
          />
        )}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{reward.title}</h5>
            <span className={`reward-availability ${reward.availability === 'In Stock' ? 'in-stock' : reward.availability === 'Limited Stock' ? 'limited' : 'out-of-stock'}`}>
              {reward.availability}
            </span>
          </div>
          <p className="card-text text-muted mb-3">{reward.description}</p>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="reward-category">{reward.category}</span>
            <span className="reward-provider">Provider: {reward.provider}</span>
          </div>
          {reward.goodBehavior && (
            <div className="mb-3">
              <span className="badge bg-light text-dark d-block p-2">
                <i className="bi bi-heart-fill text-danger me-1"></i>
                Good Behavior: {reward.goodBehavior}
              </span>
            </div>
          )}
        </div>
        <div className="card-footer bg-transparent border-top-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="reward-points">
              <i className="bi bi-coin"></i>
              <span>{reward.pointsCost} Points</span>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => handleRedeemReward(reward._id)}
              disabled={claimingReward === reward._id || availablePoints < reward.pointsCost}
            >
              {claimingReward === reward._id ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Redeeming...
                </>
              ) : availablePoints < reward.pointsCost ? (
                'Not Enough Points'
              ) : (
                'Redeem'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4 rewards-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Rewards Marketplace</h1>
        <div className="badge bg-primary fs-5 px-3 py-2">
          <i className="bi bi-coin me-2"></i>
          {availablePoints} Points Available
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {claimSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {claimSuccess}
          <button type="button" className="btn-close" onClick={() => setClaimSuccess(null)}></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm dashboard-card">
            <div className="card-body dashboard-card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Your Points</h5>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowPointHistory(!showPointHistory)}
                >
                  {showPointHistory ? 'Hide History' : 'Show History'}
                </button>
              </div>
              
              {showPointHistory && (
                <div className="mt-3">
                  <h6>Point History</h6>
                  {pointHistory.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm point-history-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pointHistory.map(item => (
                            <tr key={item._id}>
                              <td>{new Date(item.redeemedAt).toLocaleDateString()}</td>
                              <td>{item.rewardTitle}</td>
                              <td className="point-spent">-{item.pointsCost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted small">No point history available.</p>
                  )}
                </div>
              )}
              
              <div className="mt-3">
                <h6>How It Works</h6>
                <div className="how-it-works-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h6 className="mb-0">Complete Activities</h6>
                    <p className="text-muted mb-0 small">Participate in community events and activities</p>
                  </div>
                </div>
                <div className="how-it-works-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h6 className="mb-0">Earn Points</h6>
                    <p className="text-muted mb-0 small">Get points based on your contribution</p>
                  </div>
                </div>
                <div className="how-it-works-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h6 className="mb-0">Redeem Rewards</h6>
                    <p className="text-muted mb-0 small">Use your points for local rewards and perks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm dashboard-card h-100">
            <div className="card-body dashboard-card-body">
              <h5 className="card-title">Filter Rewards</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="categoryFilter" className="form-label">Category</label>
                  <select 
                    id="categoryFilter" 
                    className="form-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="sortBy" className="form-label">Sort By</label>
                  <select 
                    id="sortBy" 
                    className="form-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="pointsCost">Points: Low to High</option>
                    <option value="pointsCostDesc">Points: High to Low</option>
                    <option value="title">Name: A to Z</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <h6>Popular Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <button
                      key={category}
                      className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm dashboard-card">
            <div className="card-body dashboard-card-body">
              <h5 className="card-title">Your Civic Score: {currentUser?.score || 0}</h5>
              <div className="civic-score-progress">
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${((currentUser?.score || 0) % 1000) / 10}%` }}
                  aria-valuenow={((currentUser?.score || 0) % 1000) / 10}
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {Math.round(((currentUser?.score || 0) % 1000) / 10)}%
                </div>
              </div>
              <p className="text-muted">
                Your civic score determines your tier level. Higher tiers unlock exclusive rewards!
              </p>
              <div className="row text-center">
                <div className="col">
                  <div className={`tier-badge ${(currentUser?.score || 0) >= 0 ? 'active' : ''}`}>
                    <i className="bi bi-award fs-2"></i>
                    <p>Bronze</p>
                    <small>0+ points</small>
                  </div>
                </div>
                <div className="col">
                  <div className={`tier-badge ${(currentUser?.score || 0) >= 300 ? 'active' : ''}`}>
                    <i className="bi bi-award fs-2"></i>
                    <p>Silver</p>
                    <small>300+ points</small>
                  </div>
                </div>
                <div className="col">
                  <div className={`tier-badge ${(currentUser?.score || 0) >= 600 ? 'active' : ''}`}>
                    <i className="bi bi-award fs-2"></i>
                    <p>Gold</p>
                    <small>600+ points</small>
                  </div>
                </div>
                <div className="col">
                  <div className={`tier-badge ${(currentUser?.score || 0) >= 1000 ? 'active' : ''}`}>
                    <i className="bi bi-award fs-2"></i>
                    <p>Platinum</p>
                    <small>1000+ points</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm dashboard-card mb-4">
        <div className="card-body dashboard-card-body">
          <h5 className="card-title mb-3">Good Behavior Suggestions</h5>
          <p className="text-muted">Complete these activities to earn points and unlock rewards!</p>
          
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Category</th>
                  <th>Time</th>
                  <th>Points</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {behaviorSuggestions.slice(0, 5).map(suggestion => (
                  <tr key={suggestion.id}>
                    <td>
                      <strong>{suggestion.title}</strong>
                      <p className="text-muted mb-0 small">{suggestion.description}</p>
                    </td>
                    <td>
                      <span className={`badge ${getCategoryBadgeClass(suggestion.category)}`}>
                        {suggestion.category}
                      </span>
                    </td>
                    <td>{suggestion.timeCommitment}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {suggestion.estimatedPoints} pts
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getImpactBadgeClass(suggestion.impact)}`}>
                        {suggestion.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-3">
            <Link to="/activities/new" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Log New Activity
            </Link>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended for You
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Rewards
          </button>
        </li>
      </ul>

      {activeTab === 'recommended' && (
        <>
          <h2 className="mb-3">Recommended Rewards</h2>
          <p className="text-muted mb-4">
            Based on your activity history and interests, we think you'll love these rewards!
          </p>
          
          {recommendedRewards.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
              {recommendedRewards.map(reward => renderRewardCard(reward))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No recommended rewards available yet. Complete more activities to get personalized recommendations!</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'all' && (
        <>
          <h2 className="mb-3">Available Rewards</h2>
          {rewards.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {rewards.map(reward => renderRewardCard(reward))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No rewards found matching your filters.</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setSelectedCategory('All');
                  setSortBy('pointsCost');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to get category badge class
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

// Helper function to get impact badge class
const getImpactBadgeClass = (impact) => {
  switch (impact) {
    case 'High':
      return 'bg-success';
    case 'Medium':
      return 'bg-info';
    case 'Low':
      return 'bg-secondary';
    default:
      return 'bg-secondary';
  }
};

export default RewardsPage;