import api from './api';

// Get all activities
const getAllActivities = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/activities?${queryString}` : '/activities';
    
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// Get activity by ID
const getActivityById = async (activityId) => {
  try {
    return await api.get(`/activities/${activityId}`);
  } catch (error) {
    throw error;
  }
};

// Create a new activity
const createActivity = async (activityData) => {
  try {
    return await api.post('/activities', activityData);
  } catch (error) {
    throw error;
  }
};

// Update an activity
const updateActivity = async (activityId, activityData) => {
  try {
    return await api.put(`/activities/${activityId}`, activityData);
  } catch (error) {
    throw error;
  }
};

// Delete an activity
const deleteActivity = async (activityId) => {
  try {
    return await api.delete(`/activities/${activityId}`);
  } catch (error) {
    throw error;
  }
};

// Get user's activity history
const getUserActivityHistory = async () => {
  try {
    return await api.get('/users/activities');
  } catch (error) {
    throw error;
  }
};

export default {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getUserActivityHistory
};
