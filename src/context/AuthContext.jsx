import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in (token exists)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getCurrentUser();
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        // If token is invalid, log the user out
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  // Register a new user
  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Login a user
  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Logout the current user
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const response = await authService.updateProfile(userData);
      setCurrentUser(response.data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Value object that will be passed to any consumer components
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 