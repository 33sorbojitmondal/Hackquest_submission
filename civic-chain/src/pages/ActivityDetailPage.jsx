import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import activityService from '../services/activityService';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await activityService.getActivityById(id);
        setActivity(response.data);
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError('Failed to load activity. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivity();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      await activityService.deleteActivity(id);
      navigate('/activities');
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity. Please try again.');
    }
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading activity...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/activities" className="btn btn-primary">Back to Activities</Link>
      </div>
    );
  }
  
  if (!activity) {
    return (
      <div className="not-found-container">
        <h2>Activity Not Found</h2>
        <p>The activity you're looking for doesn't exist or has been removed.</p>
        <Link to="/activities" className="btn btn-primary">Back to Activities</Link>
      </div>
    );
  }
  
  const isOwner = currentUser && activity.user === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isOwner || isAdmin;
  
  return (
    <div className="activity-detail-container">
      <div className="activity-header">
        <h1>{activity.title}</h1>
        <div className="activity-meta">
          <span className="activity-category">{activity.category}</span>
          <span className="activity-points">{activity.points} points</span>
          <span className="activity-status">{activity.status}</span>
        </div>
      </div>
      
      {activity.image && (
        <div className="activity-image">
          <img src={activity.image} alt={activity.title} />
        </div>
      )}
      
      <div className="activity-content">
        <div className="activity-description">
          <h2>Description</h2>
          <p>{activity.description}</p>
        </div>
        
        <div className="activity-details">
          <div className="detail-item">
            <strong>Location:</strong> {activity.location || 'Not specified'}
          </div>
          <div className="detail-item">
            <strong>Date:</strong> {new Date(activity.createdAt).toLocaleDateString()}
          </div>
          {activity.evidence && (
            <div className="detail-item">
              <strong>Evidence:</strong> 
              <a href={activity.evidence} target="_blank" rel="noopener noreferrer">
                View Evidence
              </a>
            </div>
          )}
        </div>
      </div>
      
      {canEdit && (
        <div className="activity-actions">
          <Link to={`/activities/${id}/edit`} className="btn btn-secondary">
            Edit Activity
          </Link>
          
          {deleteConfirm ? (
            <div className="delete-confirm">
              <p>Are you sure you want to delete this activity?</p>
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
              Delete Activity
            </button>
          )}
        </div>
      )}
      
      <div className="back-link">
        <Link to="/activities">Back to Activities</Link>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
