/**
 * Authentication service for handling user registration, login, and session management
 */

import api from './api';

// Store the token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove the token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Register a new user
const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Login a user
const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    if (response.token) {
      setToken(response.token);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout the current user
const logout = () => {
  removeToken();
};

// Get the current user's profile
const getCurrentUser = async () => {
  try {
    return await api.get('/users/me');
  } catch (error) {
    throw error;
  }
};

// Update user profile
const updateProfile = async (userData) => {
  try {
    return await api.put('/users/me', userData);
  } catch (error) {
    throw error;
  }
};

// Request password reset
const requestPasswordReset = async (email) => {
  try {
    return await api.post('/users/reset-password', { email });
  } catch (error) {
    throw error;
  }
};

// Reset password with token
const resetPassword = async (token, newPassword) => {
  try {
    return await api.post('/users/reset-password/confirm', { token, newPassword });
  } catch (error) {
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  isAuthenticated,
  requestPasswordReset,
  resetPassword
}; 