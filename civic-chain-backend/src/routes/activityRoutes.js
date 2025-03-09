const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ date: -1 });
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Check if activity belongs to user
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this activity' });
    }
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, points, status } = req.body;
    
    // Create activity
    const activity = await Activity.create({
      user: req.user._id,
      title,
      description: description || '',
      category: category || 'Community Service',
      points,
      status: status || 'completed'
    });
    
    // Update user score if activity is completed
    if (activity.status === 'completed') {
      const user = await User.findById(req.user._id);
      user.score += activity.points;
      await user.save();
    }
    
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 