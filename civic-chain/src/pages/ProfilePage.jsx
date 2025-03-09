import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import activityService from '../services/activityService';
import rewardService from '../services/rewardService';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    bio: ''
  });
  const [activities, setActivities] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        location: currentUser.location || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user's activities
        const activitiesResponse = await activityService.getUserActivityHistory();
        setActivities(activitiesResponse.data || []);
        
        // Fetch user's rewards
        const rewardsResponse = await rewardService.getUserRewardHistory();
        setRewards(rewardsResponse.data || []);
        
        // Fetch user's score
        const scoreResponse = await rewardService.getUserPointBalance();
        setUserScore(scoreResponse.data?.points || 0);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setUpdateLoading(true);
    
    try {
      await updateProfile(formData);
      setUpdateSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading profile data...</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <div className="profile-score">
          <span>Current Score: </span>
          <strong>{userScore}</strong>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="profile-content">
        <div className="profile-details">
          <h2>Personal Information</h2>
          
          {updateSuccess && (
            <div className="success-message">
              {updateSuccess}
            </div>
          )}
          
          {updateError && (
            <div className="error-message">
              {updateError}
            </div>
          )}
          
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <strong>Name:</strong> {currentUser?.name}
              </div>
              <div className="info-item">
                <strong>Email:</strong> {currentUser?.email}
              </div>
              <div className="info-item">
                <strong>Location:</strong> {currentUser?.location || 'Not specified'}
              </div>
              <div className="info-item">
                <strong>Bio:</strong> {currentUser?.bio || 'No bio provided'}
              </div>
              <div className="info-item">
                <strong>Member Since:</strong> {new Date(currentUser?.createdAt).toLocaleDateString()}
              </div>
              
              <button 
                className="btn btn-secondary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-activity">
          <h2>Activity History</h2>
          
          {activities.length === 0 ? (
            <div className="empty-state">
              <p>You haven't participated in any activities yet.</p>
            </div>
          ) : (
            <div className="activity-list">
              {activities.map(activity => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-title">
                    <h3>{activity.title}</h3>
                    <span className="activity-points">{activity.points} points</span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                    <span className="activity-status">{activity.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="profile-rewards">
          <h2>Claimed Rewards</h2>
          
          {rewards.length === 0 ? (
            <div className="empty-state">
              <p>You haven't claimed any rewards yet.</p>
            </div>
          ) : (
            <div className="rewards-list">
              {rewards.map(reward => (
                <div key={reward._id} className="reward-item">
                  <div className="reward-title">
                    <h3>{reward.title}</h3>
                    <span className="reward-points">{reward.pointsCost} points</span>
                  </div>
                  <div className="reward-meta">
                    <span className="reward-date">Claimed on {new Date(reward.claimDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
