const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Reward = require('../models/Reward');
const Proposal = require('../models/Proposal');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Mock score history data to match UI
    const scoreHistory = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [720, 735, 750, 765, 775, 785]
    };
    
    // Mock category data to match UI
    const categoryBreakdown = {
      labels: ['Community Service', 'Environmental', 'Education', 'Health', 'Governance', 'Innovation'],
      data: [80, 65, 50, 40, 60, 70]
    };
    
    res.json({
      score: user.score,
      maxScore: 1000,
      tier: user.tier,
      nextTier: 'Exemplary Citizen',
      pointsToNextTier: 15,
      availablePoints: user.availablePoints,
      scoreHistory,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get user statistics
// @route   GET /api/stats/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      score: user.score,
      tier: user.tier,
      availablePoints: user.availablePoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get activity statistics
// @route   GET /api/stats/activities
// @access  Private
router.get('/activities', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id });
    
    // Count activities by category
    const categoryCounts = {};
    activities.forEach(activity => {
      if (categoryCounts[activity.category]) {
        categoryCounts[activity.category]++;
      } else {
        categoryCounts[activity.category] = 1;
      }
    });
    
    // Count activities by status
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0
    };
    
    activities.forEach(activity => {
      statusCounts[activity.status]++;
    });
    
    res.json({
      total: activities.length,
      categoryCounts,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get activity statistics for charts
router.get('/activities-chart', protect, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate, labels, format;
    
    // Set time period and format
    if (period === 'week') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });
      format = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      format = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      format = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }
    
    // Get activities by date
    const activitiesByDate = await Activity.aggregate([
      { 
        $match: { 
          user: req.user._id,
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: format,
          count: { $sum: 1 },
          points: { $sum: '$points' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Prepare data for chart
    let activities = [];
    let points = [];
    
    if (period === 'week') {
      // Initialize arrays with zeros
      activities = Array(7).fill(0);
      points = Array(7).fill(0);
      
      activitiesByDate.forEach(item => {
        const date = new Date(item._id);
        const dayIndex = 6 - (now.getDate() - date.getDate());
        if (dayIndex >= 0 && dayIndex < 7) {
          activities[dayIndex] = item.count;
          points[dayIndex] = item.points;
        }
      });
    } else if (period === 'month') {
      // Initialize arrays with zeros
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      activities = Array(daysInMonth).fill(0);
      points = Array(daysInMonth).fill(0);
      
      activitiesByDate.forEach(item => {
        const date = new Date(item._id);
        const dayIndex = date.getDate() - 1;
        activities[dayIndex] = item.count;
        points[dayIndex] = item.points;
      });
    } else if (period === 'year') {
      // Initialize arrays with zeros
      activities = Array(12).fill(0);
      points = Array(12).fill(0);
      
      activitiesByDate.forEach(item => {
        const date = new Date(item._id + '-01'); // Add day to make it a valid date
        const monthIndex = date.getMonth();
        activities[monthIndex] += item.count;
        points[monthIndex] += item.points;
      });
    }
    
    res.json({
      labels,
      activities,
      points
    });
  } catch (err) {
    console.error('Error fetching activity stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get community map data
router.get('/map', protect, async (req, res) => {
  try {
    const { category, timeframe } = req.query;
    
    // Build query
    const query = { 'location.coordinates': { $exists: true, $ne: null } };
    
    if (category) {
      query.category = category;
    }
    
    if (timeframe) {
      const now = new Date();
      let startDate;
      
      if (timeframe === 'week') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      } else if (timeframe === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      } else if (timeframe === 'year') {
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }
    
    // Get activities with location data
    const activities = await Activity.find(query)
      .select('title description category points location createdAt')
      .limit(100);
    
    res.json(activities);
  } catch (err) {
    console.error('Error fetching map data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity heatmap data
router.get('/heatmap', protect, async (req, res) => {
  try {
    const { userId, year = new Date().getFullYear() } = req.query;
    
    // Ensure user can only access their own data unless they're an admin
    const user = await User.findById(req.user._id);
    if (userId !== req.user._id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this data' });
    }
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    // Get activities by date
    const activities = await Activity.aggregate([
      { 
        $match: { 
          user: userId ? userId : req.user._id,
          createdAt: { $gte: startDate, $lte: endDate }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format data for heatmap
    const heatmapData = activities.map(item => ({
      date: item._id,
      count: item.count
    }));
    
    res.json(heatmapData);
  } catch (err) {
    console.error('Error fetching heatmap data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard data
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;
    
    const now = new Date();
    let startDate;
    
    if (period === 'week') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (period === 'all') {
      startDate = new Date(0); // Beginning of time
    }
    
    // Get top users by points
    const leaderboard = await Activity.aggregate([
      { 
        $match: { 
          status: 'approved',
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: '$user',
          points: { $sum: '$points' },
          activities: { $sum: 1 }
        }
      },
      { $sort: { points: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          _id: 1,
          points: 1,
          activities: 1,
          name: { $arrayElemAt: ['$userInfo.name', 0] },
          avatar: { $arrayElemAt: ['$userInfo.avatar', 0] }
        }
      }
    ]);
    
    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category distribution data
router.get('/categories', protect, async (req, res) => {
  try {
    // Get activities by category
    const categories = await Activity.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Format data for chart
    const labels = categories.map(item => item._id);
    const data = categories.map(item => item.count);
    
    res.json({
      labels,
      data
    });
  } catch (err) {
    console.error('Error fetching category data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reward statistics
router.get('/rewards', protect, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const now = new Date();
    let startDate, labels, format;
    
    // Set time period and format
    if (period === 'week') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });
      format = { $dateToString: { format: '%Y-%m-%d', date: '$claimDate' } };
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      format = { $dateToString: { format: '%Y-%m-%d', date: '$claimDate' } };
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      format = { $dateToString: { format: '%Y-%m', date: '$claimDate' } };
    }
    
    // Get rewards by date
    const rewardsByDate = await Reward.aggregate([
      { 
        $match: { 
          claimDate: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: format,
          count: { $sum: 1 },
          points: { $sum: '$pointsCost' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Prepare data for chart
    let rewards = [];
    let points = [];
    
    if (period === 'week') {
      // Initialize arrays with zeros
      rewards = Array(7).fill(0);
      points = Array(7).fill(0);
      
      rewardsByDate.forEach(item => {
        const date = new Date(item._id);
        const dayIndex = 6 - (now.getDate() - date.getDate());
        if (dayIndex >= 0 && dayIndex < 7) {
          rewards[dayIndex] = item.count;
          points[dayIndex] = item.points;
        }
      });
    } else if (period === 'month') {
      // Initialize arrays with zeros
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      rewards = Array(daysInMonth).fill(0);
      points = Array(daysInMonth).fill(0);
      
      rewardsByDate.forEach(item => {
        const date = new Date(item._id);
        const dayIndex = date.getDate() - 1;
        rewards[dayIndex] = item.count;
        points[dayIndex] = item.points;
      });
    } else if (period === 'year') {
      // Initialize arrays with zeros
      rewards = Array(12).fill(0);
      points = Array(12).fill(0);
      
      rewardsByDate.forEach(item => {
        const date = new Date(item._id + '-01'); // Add day to make it a valid date
        const monthIndex = date.getMonth();
        rewards[monthIndex] += item.count;
        points[monthIndex] += item.points;
      });
    }
    
    res.json({
      labels,
      rewards,
      points
    });
  } catch (err) {
    console.error('Error fetching reward stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get proposal statistics
router.get('/proposals', protect, async (req, res) => {
  try {
    // Get proposals by status
    const proposalsByStatus = await Proposal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get proposals by category
    const proposalsByCategory = await Proposal.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Format data for charts
    const statusLabels = proposalsByStatus.map(item => item._id);
    const statusData = proposalsByStatus.map(item => item.count);
    
    const categoryLabels = proposalsByCategory.map(item => item._id);
    const categoryData = proposalsByCategory.map(item => item.count);
    
    res.json({
      status: {
        labels: statusLabels,
        data: statusData
      },
      categories: {
        labels: categoryLabels,
        data: categoryData
      }
    });
  } catch (err) {
    console.error('Error fetching proposal stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 