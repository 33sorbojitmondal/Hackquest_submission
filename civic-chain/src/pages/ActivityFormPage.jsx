import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import activityService from '../services/activityService';

const ActivityFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    points: 0,
    location: '',
    evidence: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingActivity, setFetchingActivity] = useState(isEditMode);
  
  useEffect(() => {
    // If in edit mode, fetch the activity data
    if (isEditMode) {
      const fetchActivity = async () => {
        try {
          const response = await activityService.getActivityById(id);
          const activity = response.data;
          
          setFormData({
            title: activity.title || '',
            description: activity.description || '',
            category: activity.category || '',
            points: activity.points || 0,
            location: activity.location || '',
            evidence: activity.evidence || ''
          });
        } catch (err) {
          console.error('Error fetching activity data:', err);
          setError('Failed to load activity data. Please try again later.');
        } finally {
          setFetchingActivity(false);
        }
      };
      
      fetchActivity();
    }
  }, [isEditMode, id]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isEditMode) {
        await activityService.updateActivity(id, formData);
        navigate(`/activities/${id}`);
      } else {
        const response = await activityService.createActivity(formData);
        navigate(`/activities/${response.data._id}`);
      }
    } catch (err) {
      console.error('Error saving activity:', err);
      setError(err.message || 'Failed to save activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchingActivity) {
    return <div className="loading-spinner">Loading activity data...</div>;
  }
  
  return (
    <div className="form-container">
      <h1>{isEditMode ? 'Edit Activity' : 'Log New Activity'}</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Activity Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Environmental">Environmental</option>
            <option value="Community Service">Community Service</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Cultural">Cultural</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="points">Points (estimated)</label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleChange}
            min="0"
            max="100"
          />
          <small>Points will be reviewed by administrators</small>
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
          <label htmlFor="evidence">Evidence (URL to photo/document)</label>
          <input
            type="url"
            id="evidence"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            placeholder="https://example.com/evidence.jpg"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(isEditMode ? `/activities/${id}` : '/activities')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityFormPage;
