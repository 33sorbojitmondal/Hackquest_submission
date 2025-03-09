import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import rewardService from '../services/rewardService';

const RewardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const [reward, setReward] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reward details
        const rewardResponse = await rewardService.getRewardById(id);
        setReward(rewardResponse.data);
        
        // Fetch user points
        const pointsResponse = await rewardService.getUserPointBalance();
        setUserPoints(pointsResponse.data?.points || 0);
      } catch (err) {
        console.error('Error fetching reward:', err);
        setError('Failed to load reward. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleClaimReward = async () => {
    setClaimingReward(true);
    setClaimSuccess('');
    setError('');
    
    try {
      await rewardService.claimReward(id);
      
      // Update user points
      const pointsResponse = await rewardService.getUserPointBalance();
      setUserPoints(pointsResponse.data?.points || 0);
      
      // Refresh reward data
      const rewardResponse = await rewardService.getRewardById(id);
      setReward(rewardResponse.data);
      
      // Show success message
      setClaimSuccess('Reward claimed successfully! Check your profile for details.');
    } catch (err) {
      console.error('Error claiming reward:', err);
      setError(err.message || 'Failed to claim reward. Please try again.');
    } finally {
      setClaimingReward(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await rewardService.deleteReward(id);
      navigate('/rewards');
    } catch (err) {
      console.error('Error deleting reward:', err);
      setError('Failed to delete reward. Please try again.');
    }
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading reward details...</div>;
  }
  
  if (error && !reward) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/rewards" className="btn btn-primary">Back to Rewards</Link>
      </div>
    );
  }
  
  if (!reward) {
    return (
      <div className="not-found-container">
        <h2>Reward Not Found</h2>
        <p>The reward you're looking for doesn't exist or has been removed.</p>
        <Link to="/rewards" className="btn btn-primary">Back to Rewards</Link>
      </div>
    );
  }
  
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canClaim = reward.quantity > 0 && userPoints >= reward.pointsCost;
  
  return (
    <div className="reward-detail-container">
      <div className="reward-header">
        <h1>{reward.title}</h1>
        <div className="reward-meta">
          <span className="reward-category">{reward.category}</span>
          <span className="reward-points">{reward.pointsCost} points</span>
        </div>
      </div>
      
      {reward.image && (
        <div className="reward-image">
          <img src={reward.image} alt={reward.title} />
        </div>
      )}
      
      <div className="reward-content">
        <div className="reward-description">
          <h2>Description</h2>
          <p>{reward.description}</p>
        </div>
        
        <div className="reward-details">
          <div className="detail-item">
            <strong>Available Quantity:</strong> {reward.quantity}
          </div>
          <div className="detail-item">
            <strong>Expiration Date:</strong> {reward.expirationDate ? new Date(reward.expirationDate).toLocaleDateString() : 'No expiration'}
          </div>
          {reward.termsAndConditions && (
            <div className="detail-item">
              <strong>Terms and Conditions:</strong>
              <p>{reward.termsAndConditions}</p>
            </div>
          )}
        </div>
        
        <div className="user-points-info">
          <strong>Your Current Points:</strong> {userPoints}
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {claimSuccess && (
          <div className="success-message">
            {claimSuccess}
          </div>
        )}
        
        <div className="reward-actions">
          {reward.quantity <= 0 ? (
            <div className="out-of-stock-message">
              This reward is currently out of stock.
            </div>
          ) : userPoints < reward.pointsCost ? (
            <div className="not-enough-points-message">
              You need {reward.pointsCost - userPoints} more points to claim this reward.
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleClaimReward}
              disabled={claimingReward}
            >
              {claimingReward ? 'Claiming...' : 'Claim Reward'}
            </button>
          )}
        </div>
      </div>
      
      {isAdmin && (
        <div className="admin-actions">
          <Link to={`/admin/rewards/${id}/edit`} className="btn btn-secondary">
            Edit Reward
          </Link>
          
          {deleteConfirm ? (
            <div className="delete-confirm">
              <p>Are you sure you want to delete this reward?</p>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-danger"
              onClick={() => setDeleteConfirm(true)}
            >
              Delete Reward
            </button>
          )}
        </div>
      )}
      
      <div className="back-link">
        <Link to="/rewards">Back to Rewards</Link>
      </div>
    </div>
  );
};

export default RewardDetailPage;
