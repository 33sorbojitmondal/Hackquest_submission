import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// For development/demo purposes, we'll add mock data handling
const useMockData = true;

// Mock data for dashboard
const mockDashboardData = {
  civicScore: 780,
  availablePoints: 250,
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
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 200,
  totalActivities: 24,
  completedActivities: 18,
  pendingActivities: 6,
  impactStats: {
    treesPlanted: 12,
    wasteRecycled: 85,
    volunteerHours: 48,
    peopleHelped: 120,
    eventsAttended: 15
  }
};

// Mock recent activities
const mockRecentActivities = [
  {
    _id: '1',
    title: 'Community Park Cleanup',
    description: 'Helped clean up trash at Central Park',
    category: 'Environmental',
    points: 50,
    status: 'completed',
    date: '2023-07-15',
    image: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    _id: '2',
    title: 'Food Drive Volunteer',
    description: 'Volunteered at the local food bank',
    category: 'Community',
    points: 75,
    status: 'completed',
    date: '2023-07-10',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    _id: '3',
    title: 'Tutoring Session',
    description: 'Tutored high school students in mathematics',
    category: 'Education',
    points: 60,
    status: 'completed',
    date: '2023-07-05',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2322&q=80'
  },
  {
    _id: '4',
    title: 'Tree Planting Initiative',
    description: 'Planted trees in the neighborhood',
    category: 'Environmental',
    points: 80,
    status: 'pending',
    date: '2023-07-20',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2313&q=80'
  },
  {
    _id: '5',
    title: 'Health Awareness Workshop',
    description: 'Organized a health awareness workshop',
    category: 'Health',
    points: 70,
    status: 'pending',
    date: '2023-07-25',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  }
];

// Mock rewards data with rewards based on good behaviors
const mockRewards = [
  {
    _id: '1',
    title: 'Local Coffee Shop Gift Card',
    description: 'Enjoy a free coffee or treat at a participating local coffee shop.',
    category: 'Food & Drink',
    pointsCost: 150,
    provider: 'Community Rewards Program',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Supporting local businesses'
  },
  {
    _id: '2',
    title: 'Movie Theater Tickets',
    description: 'Two tickets to any movie at your local cinema.',
    category: 'Entertainment',
    pointsCost: 300,
    provider: 'CineStar Theaters',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Cultural engagement'
  },
  {
    _id: '3',
    title: 'Public Transportation Pass',
    description: 'One-month unlimited pass for local public transportation.',
    category: 'Transportation',
    pointsCost: 400,
    provider: 'City Transit Authority',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Reducing carbon footprint'
  },
  {
    _id: '4',
    title: 'Local Bookstore Voucher',
    description: '$25 voucher for your favorite local bookstore.',
    category: 'Shopping',
    pointsCost: 250,
    provider: 'Community Bookshop Network',
    image: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Supporting literacy and education'
  },
  {
    _id: '5',
    title: 'Farmers Market Voucher',
    description: '$30 to spend at your local farmers market.',
    category: 'Food & Drink',
    pointsCost: 200,
    provider: 'Local Farmers Association',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Supporting local agriculture'
  },
  {
    _id: '6',
    title: 'Museum Annual Pass',
    description: 'One-year unlimited access to local museums and cultural sites.',
    category: 'Culture',
    pointsCost: 500,
    provider: 'City Cultural Department',
    image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'Limited Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Cultural enrichment and education'
  },
  {
    _id: '7',
    title: 'Fitness Center Day Pass',
    description: 'One-day pass to a premium fitness center in your area.',
    category: 'Health & Fitness',
    pointsCost: 100,
    provider: 'FitLife Centers',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Promoting physical health'
  },
  {
    _id: '8',
    title: 'Plant a Tree in Your Name',
    description: 'We will plant a tree in your name in a local conservation area.',
    category: 'Environmental',
    pointsCost: 120,
    provider: 'Green Earth Initiative',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2313&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Environmental conservation'
  },
  {
    _id: '9',
    title: 'Community Garden Plot',
    description: 'Access to a plot in the community garden for one growing season.',
    category: 'Environmental',
    pointsCost: 350,
    provider: 'Urban Gardening Initiative',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80',
    availability: 'Limited Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Sustainable food production'
  },
  {
    _id: '10',
    title: 'Volunteer Recognition Dinner',
    description: 'Invitation to the annual volunteer recognition dinner hosted by the mayor.',
    category: 'Community',
    pointsCost: 450,
    provider: 'City Hall',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'Limited Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Community leadership'
  },
  {
    _id: '11',
    title: 'Free Workshop or Class',
    description: 'Attend a free workshop or class at the community center.',
    category: 'Education',
    pointsCost: 150,
    provider: 'Community Learning Center',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Lifelong learning'
  },
  {
    _id: '12',
    title: 'Bike Share Membership',
    description: 'One-month membership to the city bike share program.',
    category: 'Transportation',
    pointsCost: 300,
    provider: 'City Bikes',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Sustainable transportation'
  },
  {
    _id: '13',
    title: 'Local Sports Event Tickets',
    description: 'Two tickets to a local sports event of your choice.',
    category: 'Entertainment',
    pointsCost: 250,
    provider: 'City Sports Association',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Supporting local sports'
  },
  {
    _id: '14',
    title: 'Recycling Kit',
    description: 'Home recycling kit with sorting bins and educational materials.',
    category: 'Environmental',
    pointsCost: 180,
    provider: 'Waste Management Department',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'In Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Waste reduction'
  },
  {
    _id: '15',
    title: 'Community Mural Contribution',
    description: 'Add your name or a small design to a community mural project.',
    category: 'Cultural',
    pointsCost: 200,
    provider: 'Public Arts Commission',
    image: 'https://images.unsplash.com/photo-1601196595039-74c770ae3476?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    availability: 'Limited Stock',
    expiryDate: '2023-12-31',
    goodBehavior: 'Public art support'
  }
];

// Mock user redemptions
const mockUserRedemptions = [];

// API service object with methods for each endpoint
const apiService = {
  // Auth endpoints
  auth: {
    register: async (userData) => {
      if (useMockData) {
        return {
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
              }
            }
          }
        };
      }
      return api.post('/auth/register', userData);
    },
    
    login: async (credentials) => {
      if (useMockData) {
        return {
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
              }
            }
          }
        };
      }
      return api.post('/auth/login', credentials);
    },
    
    getCurrentUser: async () => {
      if (useMockData) {
        return {
          data: {
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
            }
          }
        };
      }
      return api.get('/auth/me');
    }
  },
  
  // User endpoints
  users: {
    updateProfile: async (userData) => {
      if (useMockData) {
        return {
          data: {
            ...userData,
            _id: '123456789'
          }
        };
      }
      return api.put('/users/profile', userData);
    },
    
    getLeaderboard: async () => {
      if (useMockData) {
        return {
          data: [
            {
              _id: '123456789',
              fullName: 'John Doe',
              score: 780,
              tier: 'Gold',
              profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            {
              _id: '223456789',
              fullName: 'Jane Smith',
              score: 850,
              tier: 'Gold',
              profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
              _id: '323456789',
              fullName: 'Robert Johnson',
              score: 920,
              tier: 'Platinum',
              profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            {
              _id: '423456789',
              fullName: 'Emily Davis',
              score: 720,
              tier: 'Gold',
              profileImage: 'https://randomuser.me/api/portraits/women/67.jpg'
            },
            {
              _id: '523456789',
              fullName: 'Michael Wilson',
              score: 650,
              tier: 'Silver',
              profileImage: 'https://randomuser.me/api/portraits/men/52.jpg'
            }
          ]
        };
      }
      return api.get('/users/leaderboard');
    }
  },
  
  // Dashboard endpoints
  dashboard: {
    getStats: async () => {
      if (useMockData) {
        return { data: mockDashboardData };
      }
      return api.get('/dashboard/stats');
    },
    
    getRecentActivities: async () => {
      if (useMockData) {
        return { data: mockRecentActivities };
      }
      return api.get('/dashboard/recent-activities');
    }
  },
  
  // Activities endpoints
  activities: {
    getAll: async (filters = {}) => {
      if (useMockData) {
        let filteredActivities = [...mockRecentActivities];
        
        // Apply category filter if provided
        if (filters.category && filters.category !== 'All') {
          filteredActivities = filteredActivities.filter(
            activity => activity.category === filters.category
          );
        }
        
        // Apply status filter if provided
        if (filters.status && filters.status !== 'All') {
          filteredActivities = filteredActivities.filter(
            activity => activity.status === filters.status.toLowerCase()
          );
        }
        
        return { data: filteredActivities };
      }
      return api.get('/activities', { params: filters });
    },
    
    getById: async (id) => {
      if (useMockData) {
        const activity = mockRecentActivities.find(a => a._id === id);
        if (!activity) {
          throw new Error('Activity not found');
        }
        return { data: activity };
      }
      return api.get(`/activities/${id}`);
    },
    
    create: async (activityData) => {
      if (useMockData) {
        const newActivity = {
          _id: Date.now().toString(),
          ...activityData,
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
        mockRecentActivities.unshift(newActivity);
        return { data: newActivity };
      }
      return api.post('/activities', activityData);
    },
    
    update: async (id, activityData) => {
      if (useMockData) {
        const index = mockRecentActivities.findIndex(a => a._id === id);
        if (index === -1) {
          throw new Error('Activity not found');
        }
        const updatedActivity = {
          ...mockRecentActivities[index],
          ...activityData
        };
        mockRecentActivities[index] = updatedActivity;
        return { data: updatedActivity };
      }
      return api.put(`/activities/${id}`, activityData);
    },
    
    delete: async (id) => {
      if (useMockData) {
        const index = mockRecentActivities.findIndex(a => a._id === id);
        if (index === -1) {
          throw new Error('Activity not found');
        }
        mockRecentActivities.splice(index, 1);
        return { data: { success: true } };
      }
      return api.delete(`/activities/${id}`);
    },
    
    // Get good behavior suggestions
    getGoodBehaviorSuggestions: async () => {
      if (useMockData) {
        return {
          data: [
            {
              id: '1',
              title: 'Volunteer at a Local Food Bank',
              description: 'Help sort and distribute food to those in need in your community.',
              category: 'Community',
              estimatedPoints: 75,
              timeCommitment: '3-4 hours',
              impact: 'High'
            },
            {
              id: '2',
              title: 'Organize a Neighborhood Cleanup',
              description: 'Gather neighbors to clean up litter and beautify your neighborhood.',
              category: 'Environmental',
              estimatedPoints: 50,
              timeCommitment: '2-3 hours',
              impact: 'Medium'
            },
            {
              id: '3',
              title: 'Tutor Students in Need',
              description: 'Provide free tutoring to students who need academic support.',
              category: 'Education',
              estimatedPoints: 60,
              timeCommitment: '1-2 hours per week',
              impact: 'High'
            },
            {
              id: '4',
              title: 'Donate Blood',
              description: 'Donate blood to help save lives in your community.',
              category: 'Health',
              estimatedPoints: 70,
              timeCommitment: '1 hour',
              impact: 'High'
            },
            {
              id: '5',
              title: 'Plant Trees in Your Community',
              description: 'Participate in or organize a tree planting event.',
              category: 'Environmental',
              estimatedPoints: 80,
              timeCommitment: '3-4 hours',
              impact: 'High'
            },
            {
              id: '6',
              title: 'Volunteer at a Senior Center',
              description: 'Spend time with seniors, helping with activities or just providing companionship.',
              category: 'Community',
              estimatedPoints: 65,
              timeCommitment: '2-3 hours',
              impact: 'Medium'
            },
            {
              id: '7',
              title: 'Participate in a Charity Run/Walk',
              description: 'Join a charity run or walk to raise funds for a good cause.',
              category: 'Health',
              estimatedPoints: 55,
              timeCommitment: '2-3 hours',
              impact: 'Medium'
            },
            {
              id: '8',
              title: 'Donate Books to a School or Library',
              description: 'Collect and donate books to support literacy in your community.',
              category: 'Education',
              estimatedPoints: 40,
              timeCommitment: '1 hour',
              impact: 'Medium'
            }
          ]
        };
      }
      return api.get('/activities/suggestions');
    }
  },
  
  // Rewards endpoints
  rewards: {
    getAll: async (filters = {}) => {
      if (useMockData) {
        let filteredRewards = [...mockRewards];
        
        // Apply category filter if provided
        if (filters.category && filters.category !== 'All') {
          filteredRewards = filteredRewards.filter(
            reward => reward.category === filters.category
          );
        }
        
        // Apply availability filter if provided
        if (filters.availability) {
          filteredRewards = filteredRewards.filter(
            reward => reward.availability === filters.availability
          );
        }
        
        // Apply behavior filter if provided
        if (filters.goodBehavior) {
          filteredRewards = filteredRewards.filter(
            reward => reward.goodBehavior.toLowerCase().includes(filters.goodBehavior.toLowerCase())
          );
        }
        
        // Apply sorting if provided
        if (filters.sort) {
          if (filters.sort === 'pointsCost') {
            filteredRewards.sort((a, b) => a.pointsCost - b.pointsCost);
          } else if (filters.sort === 'pointsCostDesc') {
            filteredRewards.sort((a, b) => b.pointsCost - a.pointsCost);
          } else if (filters.sort === 'title') {
            filteredRewards.sort((a, b) => a.title.localeCompare(b.title));
          }
        }
        
        return { data: filteredRewards };
      }
      return api.get('/rewards', { params: filters });
    },
    
    getById: async (id) => {
      if (useMockData) {
        const reward = mockRewards.find(r => r._id === id);
        if (!reward) {
          throw new Error('Reward not found');
        }
        return { data: reward };
      }
      return api.get(`/rewards/${id}`);
    },
    
    redeem: async (rewardId) => {
      if (useMockData) {
        const reward = mockRewards.find(r => r._id === rewardId);
        if (!reward) {
          throw new Error('Reward not found');
        }
        
        // Check if user has enough points
        const userResponse = await apiService.auth.getCurrentUser();
        const user = userResponse.data;
        
        if (user.availablePoints < reward.pointsCost) {
          throw new Error('Not enough points to redeem this reward');
        }
        
        // Create redemption record
        const redemption = {
          _id: Date.now().toString(),
          userId: user._id,
          rewardId: reward._id,
          rewardTitle: reward.title,
          pointsCost: reward.pointsCost,
          redeemedAt: new Date().toISOString(),
          status: 'pending'
        };
        
        mockUserRedemptions.push(redemption);
        
        // Update user points
        user.availablePoints -= reward.pointsCost;
        
        return { 
          data: { 
            redemption,
            updatedPoints: user.availablePoints
          } 
        };
      }
      return api.post(`/rewards/${rewardId}/redeem`);
    },
    
    getUserRedemptions: async () => {
      if (useMockData) {
        return { data: mockUserRedemptions };
      }
      return api.get('/rewards/redemptions');
    },
    
    // Get rewards by good behavior
    getByBehavior: async (behavior) => {
      if (useMockData) {
        const filteredRewards = mockRewards.filter(
          reward => reward.goodBehavior.toLowerCase().includes(behavior.toLowerCase())
        );
        return { data: filteredRewards };
      }
      return api.get(`/rewards/behavior/${behavior}`);
    },
    
    // Get recommended rewards based on user's activities
    getRecommended: async () => {
      if (useMockData) {
        // Get user data
        const userResponse = await apiService.auth.getCurrentUser();
        const user = userResponse.data;
        
        // Find the user's most active category
        const categories = Object.keys(user.categoryScores);
        const topCategory = categories.reduce((a, b) => 
          user.categoryScores[a] > user.categoryScores[b] ? a : b
        );
        
        // Filter rewards that match the top category or related behaviors
        let recommendedRewards = [];
        
        switch (topCategory) {
          case 'Environmental':
            recommendedRewards = mockRewards.filter(
              reward => reward.category === 'Environmental' || 
                reward.goodBehavior.toLowerCase().includes('environment') ||
                reward.goodBehavior.toLowerCase().includes('sustainable')
            );
            break;
          case 'Community':
            recommendedRewards = mockRewards.filter(
              reward => reward.category === 'Community' || 
                reward.goodBehavior.toLowerCase().includes('community') ||
                reward.goodBehavior.toLowerCase().includes('local')
            );
            break;
          case 'Education':
            recommendedRewards = mockRewards.filter(
              reward => reward.category === 'Education' || 
                reward.goodBehavior.toLowerCase().includes('education') ||
                reward.goodBehavior.toLowerCase().includes('learning')
            );
            break;
          case 'Health':
            recommendedRewards = mockRewards.filter(
              reward => reward.category === 'Health & Fitness' || 
                reward.goodBehavior.toLowerCase().includes('health') ||
                reward.goodBehavior.toLowerCase().includes('fitness')
            );
            break;
          case 'Cultural':
            recommendedRewards = mockRewards.filter(
              reward => reward.category === 'Culture' || 
                reward.category === 'Entertainment' ||
                reward.goodBehavior.toLowerCase().includes('cultural') ||
                reward.goodBehavior.toLowerCase().includes('art')
            );
            break;
          default:
            // If no clear top category, return a mix of rewards
            recommendedRewards = mockRewards.slice(0, 5);
        }
        
        // Limit to 5 recommendations
        return { data: recommendedRewards.slice(0, 5) };
      }
      return api.get('/rewards/recommended');
    }
  }
};

export default apiService;
