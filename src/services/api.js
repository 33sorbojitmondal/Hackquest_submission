/**
 * Base API service for making HTTP requests to the backend
 */

// API base URL - change this to your production URL when deploying
const API_BASE_URL = 'http://localhost:5002/api';

// Helper function to get the auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If the response includes a message, use it for the error
    const errorMessage = data.message || 'Something went wrong';
    throw new Error(errorMessage);
  }
  
  return data;
};

// Base API request function with authentication
const apiRequest = async (endpoint, options = {}) => {
  // Set up headers with authentication if token exists
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  
  // Merge options with headers
  const requestOptions = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Convenience methods for different HTTP methods
const api = {
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'GET' });
  },
  
  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
  }
};

export default api; 