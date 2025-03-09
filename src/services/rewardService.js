/**
 * Reward service for handling civic rewards and redemptions
 */

import api from './api';

// Get all available rewards
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

// Redeem a reward
const redeemReward = async (rewardId, redemptionData = {}) => {
  try {
    return await api.post(`/rewards/${rewardId}/redeem`, redemptionData);
  } catch (error) {
    throw error;
  }
};

// Get user's reward history
const getUserRewardHistory = async () => {
  try {
    return await api.get('/rewards/history');
  } catch (error) {
    throw error;
  }
};

// Get user's current point balance
const getUserPointBalance = async () => {
  try {
    return await api.get('/rewards/points');
  } catch (error) {
    throw error;
  }
};

// Process a reward redemption (admin only)
const processRedemption = async (redemptionId, processingData) => {
  try {
    return await api.put(`/rewards/process/${redemptionId}`, processingData);
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
  redeemReward,
  getUserRewardHistory,
  getUserPointBalance,
  processRedemption
}; 