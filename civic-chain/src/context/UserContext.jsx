import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // For development purposes, we'll use mock data
      // In a real app, you would fetch this from your API
      const mockUser = {
        _id: '123456789',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        location: 'New York, NY',
        bio: 'Passionate about community service and environmental sustainability.',
        score: 780,
        tier: 'Gold',
        role: 'user',
        availablePoints: 250,
        joinedDate: '2023-01-15',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        scoreHistory: [
          { date: '2023-01', score: 100 },
          { date: '2023-02', score: 220 },
          { date: '2023-03', score: 350 },
          { date: '2023-04', score: 480 },
          { date: '2023-05', score: 580 },
          { date: '2023-06', score: 650 },
          { date: '2023-07', score: 780 }
        ],
        categoryScores: {
          Environmental: 250,
          Community: 180,
          Education: 150,
          Health: 120,
          Cultural: 80
        },
        recentActivities: [
          {
            _id: '1',
            title: 'Community Park Cleanup',
            description: 'Helped clean up trash at Central Park',
            category: 'Environmental',
            points: 50,
            status: 'completed',
            date: '2023-07-15'
          },
          {
            _id: '2',
            title: 'Food Drive Volunteer',
            description: 'Volunteered at the local food bank',
            category: 'Community',
            points: 75,
            status: 'completed',
            date: '2023-07-10'
          },
          {
            _id: '3',
            title: 'Tutoring Session',
            description: 'Tutored high school students in mathematics',
            category: 'Education',
            points: 60,
            status: 'completed',
            date: '2023-07-05'
          }
        ]
      };
      
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      console.error('Error checking authentication:', err);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      
      // For development purposes, we'll use mock data
      // In a real app, you would send this to your API
      const mockResponse = {
        data: {
          token: 'mock-jwt-token-for-development',
          user: {
            _id: '123456789',
            fullName: userData.fullName,
            email: userData.email,
            location: userData.location || 'New York, NY',
            bio: userData.bio || 'New user',
            score: 0,
            tier: 'Bronze',
            role: 'user',
            availablePoints: 100,
            joinedDate: new Date().toISOString().split('T')[0],
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            scoreHistory: [
              { date: new Date().toISOString().split('T')[0].substring(0, 7), score: 0 }
            ],
            categoryScores: {
              Environmental: 0,
              Community: 0,
              Education: 0,
              Health: 0,
              Cultural: 0
            },
            recentActivities: []
          }
        }
      };
      
      localStorage.setItem('token', mockResponse.data.token);
      setCurrentUser(mockResponse.data.user);
      setIsAuthenticated(true);
      return mockResponse.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      setError('');
      
      // For development purposes, we'll use mock data
      // In a real app, you would send this to your API
      const mockResponse = {
        data: {
          token: 'mock-jwt-token-for-development',
          user: {
            _id: '123456789',
            fullName: 'John Doe',
            email: credentials.email,
            location: 'New York, NY',
            bio: 'Passionate about community service and environmental sustainability.',
            score: 780,
            tier: 'Gold',
            role: credentials.email.includes('admin') ? 'admin' : 'user',
            availablePoints: 250,
            joinedDate: '2023-01-15',
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            scoreHistory: [
              { date: '2023-01', score: 100 },
              { date: '2023-02', score: 220 },
              { date: '2023-03', score: 350 },
              { date: '2023-04', score: 480 },
              { date: '2023-05', score: 580 },
              { date: '2023-06', score: 650 },
              { date: '2023-07', score: 780 }
            ],
            categoryScores: {
              Environmental: 250,
              Community: 180,
              Education: 150,
              Health: 120,
              Cultural: 80
            },
            recentActivities: [
              {
                _id: '1',
                title: 'Community Park Cleanup',
                description: 'Helped clean up trash at Central Park',
                category: 'Environmental',
                points: 50,
                status: 'completed',
                date: '2023-07-15'
              },
              {
                _id: '2',
                title: 'Food Drive Volunteer',
                description: 'Volunteered at the local food bank',
                category: 'Community',
                points: 75,
                status: 'completed',
                date: '2023-07-10'
              },
              {
                _id: '3',
                title: 'Tutoring Session',
                description: 'Tutored high school students in mathematics',
                category: 'Education',
                points: 60,
                status: 'completed',
                date: '2023-07-05'
              }
            ]
          }
        }
      };
      
      localStorage.setItem('token', mockResponse.data.token);
      setCurrentUser(mockResponse.data.user);
      setIsAuthenticated(true);
      return mockResponse.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      setError('');
      
      // For development purposes, we'll use mock data
      // In a real app, you would send this to your API
      const updatedUser = {
        ...currentUser,
        ...userData
      };
      
      setCurrentUser(updatedUser);
      return { data: updatedUser };
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Profile update failed. Please try again.');
      throw err;
    }
  };

  // Add points to user's account
  const addPoints = async (points, reason) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // In a real app, you would call your API to add points
      // For now, we'll update the local state
      const updatedUser = {
        ...currentUser,
        availablePoints: currentUser.availablePoints + points,
        score: currentUser.score + points,
        recentActivities: [
          {
            _id: Date.now().toString(),
            title: reason,
            description: `Earned ${points} points for ${reason}`,
            category: 'Other',
            points: points,
            status: 'completed',
            date: new Date().toISOString().split('T')[0]
          },
          ...currentUser.recentActivities
        ]
      };
      
      setCurrentUser(updatedUser);
      
      return {
        success: true,
        newBalance: updatedUser.availablePoints,
        newScore: updatedUser.score
      };
    } catch (err) {
      console.error('Error adding points:', err);
      setError(err.message || 'Failed to add points. Please try again.');
      throw err;
    }
  };

  // Deduct points from user's account
  const deductPoints = async (points, reason) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (currentUser.availablePoints < points) {
        throw new Error('Not enough points available');
      }

      // In a real app, you would call your API to deduct points
      // For now, we'll update the local state
      const updatedUser = {
        ...currentUser,
        availablePoints: currentUser.availablePoints - points
      };
      
      setCurrentUser(updatedUser);
      
      return {
        success: true,
        newBalance: updatedUser.availablePoints
      };
    } catch (err) {
      console.error('Error deducting points:', err);
      setError(err.message || 'Failed to deduct points. Please try again.');
      throw err;
    }
  };

  // Get user's point history
  const getPointHistory = async () => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // In a real app, you would call your API to get point history
      // For now, we'll return mock data
      return {
        data: [
          {
            id: '1',
            type: 'earned',
            amount: 50,
            reason: 'Completed activity: Community Park Cleanup',
            date: '2023-07-15'
          },
          {
            id: '2',
            type: 'spent',
            amount: 150,
            reason: 'Redeemed reward: Local Coffee Shop Gift Card',
            date: '2023-07-10'
          },
          {
            id: '3',
            type: 'earned',
            amount: 75,
            reason: 'Completed activity: Food Drive Volunteer',
            date: '2023-07-05'
          },
          {
            id: '4',
            type: 'earned',
            amount: 60,
            reason: 'Completed activity: Tutoring Session',
            date: '2023-06-28'
          },
          {
            id: '5',
            type: 'spent',
            amount: 200,
            reason: 'Redeemed reward: Farmers Market Voucher',
            date: '2023-06-20'
          }
        ]
      };
    } catch (err) {
      console.error('Error getting point history:', err);
      setError(err.message || 'Failed to get point history. Please try again.');
      throw err;
    }
  };

  // Log a new civic activity
  const logActivity = async (activityData) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Calculate points based on activity type
      let pointsEarned = 0;
      switch (activityData.category) {
        case 'Environmental':
          pointsEarned = 50;
          break;
        case 'Community':
          pointsEarned = 75;
          break;
        case 'Education':
          pointsEarned = 60;
          break;
        case 'Health':
          pointsEarned = 70;
          break;
        case 'Cultural':
          pointsEarned = 65;
          break;
        default:
          pointsEarned = 40;
      }

      // Create new activity
      const newActivity = {
        _id: Date.now().toString(),
        title: activityData.title,
        description: activityData.description,
        category: activityData.category,
        points: pointsEarned,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };

      // Update user data
      const updatedUser = {
        ...currentUser,
        recentActivities: [newActivity, ...currentUser.recentActivities]
      };

      setCurrentUser(updatedUser);

      return {
        success: true,
        activity: newActivity
      };
    } catch (err) {
      console.error('Error logging activity:', err);
      setError(err.message || 'Failed to log activity. Please try again.');
      throw err;
    }
  };

  // Approve a pending activity
  const approveActivity = async (activityId) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Find the activity
      const activityIndex = currentUser.recentActivities.findIndex(
        activity => activity._id === activityId
      );

      if (activityIndex === -1) {
        throw new Error('Activity not found');
      }

      const activity = currentUser.recentActivities[activityIndex];
      
      if (activity.status !== 'pending') {
        throw new Error('Activity is not pending approval');
      }

      // Update the activity status
      const updatedActivities = [...currentUser.recentActivities];
      updatedActivities[activityIndex] = {
        ...activity,
        status: 'completed'
      };

      // Update user data with points
      const updatedUser = {
        ...currentUser,
        recentActivities: updatedActivities,
        availablePoints: currentUser.availablePoints + activity.points,
        score: currentUser.score + activity.points
      };

      setCurrentUser(updatedUser);

      return {
        success: true,
        pointsEarned: activity.points,
        newBalance: updatedUser.availablePoints,
        newScore: updatedUser.score
      };
    } catch (err) {
      console.error('Error approving activity:', err);
      setError(err.message || 'Failed to approve activity. Please try again.');
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        addPoints,
        deductPoints,
        getPointHistory,
        logActivity,
        approveActivity,
        setError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;