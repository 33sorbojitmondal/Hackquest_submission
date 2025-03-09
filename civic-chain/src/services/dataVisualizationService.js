import api from './api';

// Fetch statistics for dashboard
const getDashboardStats = async () => {
  try {
    return await api.get('/stats/dashboard');
  } catch (error) {
    throw error;
  }
};

// Fetch activity data for charts
const getActivityStats = async (period = 'month') => {
  try {
    return await api.get(`/stats/activities?period=${period}`);
  } catch (error) {
    throw error;
  }
};

// Fetch community map data
const getCommunityMapData = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return await api.get(`/stats/map?${queryParams.toString()}`);
  } catch (error) {
    throw error;
  }
};

// Fetch activity heatmap data
const getActivityHeatmap = async (userId, year = new Date().getFullYear()) => {
  try {
    return await api.get(`/stats/heatmap?userId=${userId}&year=${year}`);
  } catch (error) {
    throw error;
  }
};

// Fetch leaderboard data
const getLeaderboard = async (period = 'month', limit = 10) => {
  try {
    return await api.get(`/stats/leaderboard?period=${period}&limit=${limit}`);
  } catch (error) {
    throw error;
  }
};

// Fetch category distribution data
const getCategoryDistribution = async () => {
  try {
    return await api.get('/stats/categories');
  } catch (error) {
    throw error;
  }
};

// Fetch reward redemption stats
const getRewardStats = async (period = 'month') => {
  try {
    return await api.get(`/stats/rewards?period=${period}`);
  } catch (error) {
    throw error;
  }
};

// Fetch proposal voting stats
const getProposalStats = async () => {
  try {
    return await api.get('/stats/proposals');
  } catch (error) {
    throw error;
  }
};

export default {
  getDashboardStats,
  getActivityStats,
  getCommunityMapData,
  getActivityHeatmap,
  getLeaderboard,
  getCategoryDistribution,
  getRewardStats,
  getProposalStats
}; 