/**
 * Admin service for handling administrative functions
 * These endpoints are restricted to users with admin privileges
 */

import api from './api';

// Get all users (admin only)
const getAllUsers = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// Get user by ID (admin only)
const getUserById = async (userId) => {
  try {
    return await api.get(`/admin/users/${userId}`);
  } catch (error) {
    throw error;
  }
};

// Update user (admin only)
const updateUser = async (userId, userData) => {
  try {
    return await api.put(`/admin/users/${userId}`, userData);
  } catch (error) {
    throw error;
  }
};

// Delete user (admin only)
const deleteUser = async (userId) => {
  try {
    return await api.delete(`/admin/users/${userId}`);
  } catch (error) {
    throw error;
  }
};

// Get system statistics (admin only)
const getSystemStats = async () => {
  try {
    return await api.get('/admin/stats');
  } catch (error) {
    throw error;
  }
};

// Get all activity participations (admin only)
const getAllParticipations = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/participations?${queryString}` : '/admin/participations';
    
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// Get all reward redemptions (admin only)
const getAllRedemptions = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/redemptions?${queryString}` : '/admin/redemptions';
    
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// Create a new admin user (super admin only)
const createAdminUser = async (adminData) => {
  try {
    return await api.post('/admin/users', adminData);
  } catch (error) {
    throw error;
  }
};

// Update system settings (admin only)
const updateSystemSettings = async (settingsData) => {
  try {
    return await api.put('/admin/settings', settingsData);
  } catch (error) {
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSystemStats,
  getAllParticipations,
  getAllRedemptions,
  createAdminUser,
  updateSystemSettings
}; 