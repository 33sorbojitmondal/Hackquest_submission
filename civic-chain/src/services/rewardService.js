import api from './api';

// Get all rewards
const getAllRewards = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/rewards?${queryString}` : '/rewards';
    
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// Get reward by ID
const getRewardById = async (rewardId) => {
  try {
    return await api.get(`/rewards/${rewardId}`);
  } catch (error) {
    throw error;
  }
};

// Create a new reward (admin only)
const createReward = async (rewardData) => {
  try {
    return await api.post('/rewards', rewardData);
  } catch (error) {
    throw error;
  }
};

// Update a reward (admin only)
const updateReward = async (rewardId, rewardData) => {
  try {
    return await api.put(`/rewards/${rewardId}`, rewardData);
  } catch (error) {
    throw error;
  }
};

// Delete a reward (admin only)
const deleteReward = async (rewardId) => {
  try {
    return await api.delete(`/rewards/${rewardId}`);
  } catch (error) {
    throw error;
  }
};

// Claim a reward
const claimReward = async (rewardId) => {
  try {
    return await api.post(`/rewards/${rewardId}/claim`);
  } catch (error) {
    throw error;
  }
};

// Get user's reward history
const getUserRewardHistory = async () => {
  try {
    return await api.get('/users/rewards');
  } catch (error) {
    throw error;
  }
};

// Get user's current point balance
const getUserPointBalance = async () => {
  try {
    return await api.get('/users/score');
  } catch (error) {
    throw error;
  }
};

export default {
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
  claimReward,
  getUserRewardHistory,
  getUserPointBalance
};
