/**
 * Activity service for handling civic activities
 */

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

// Create a new activity (admin only)
const createActivity = async (activityData) => {
  try {
    return await api.post('/activities', activityData);
  } catch (error) {
    throw error;
  }
};

// Update an activity (admin only)
const updateActivity = async (activityId, activityData) => {
  try {
    return await api.put(`/activities/${activityId}`, activityData);
  } catch (error) {
    throw error;
  }
};

// Delete an activity (admin only)
const deleteActivity = async (activityId) => {
  try {
    return await api.delete(`/activities/${activityId}`);
  } catch (error) {
    throw error;
  }
};

// Participate in an activity
const participateInActivity = async (activityId, participationData = {}) => {
  try {
    return await api.post(`/activities/${activityId}/participate`, participationData);
  } catch (error) {
    throw error;
  }
};

// Get user's activity history
const getUserActivityHistory = async () => {
  try {
    return await api.get('/activities/history');
  } catch (error) {
    throw error;
  }
};

// Verify a user's participation (admin only)
const verifyParticipation = async (participationId, verificationData) => {
  try {
    return await api.put(`/activities/verify/${participationId}`, verificationData);
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
  participateInActivity,
  getUserActivityHistory,
  verifyParticipation
}; 