const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
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

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
router.get('/activities', protect, async (req, res) => {
  try {
    // Get activities from database if they exist
    let activities = await Activity.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5);
    
    // If no activities found, return mock data to match UI
    if (activities.length === 0) {
      activities = [
        { 
          _id: '1', 
          title: 'Volunteered at local food bank', 
          date: new Date('2023-06-15'), 
          points: 25 
        },
        { 
          _id: '2', 
          title: 'Participated in community cleanup', 
          date: new Date('2023-06-10'), 
          points: 15 
        }
      ];
    }
    
    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      title: activity.title,
      date: activity.date instanceof Date 
        ? activity.date.toISOString().split('T')[0] 
        : new Date(activity.date).toISOString().split('T')[0],
      points: activity.points
    }));
    
    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
