const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, location, bio } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      location: location || '',
      bio: bio || '',
      score: 785, // Starting with 785 to match the UI
      tier: 'Model Citizen',
      availablePoints: 450
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        location: user.location,
        bio: user.bio,
        score: user.score,
        tier: user.tier,
        availablePoints: user.availablePoints,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      location: user.location,
      bio: user.bio,
      score: user.score,
      tier: user.tier,
      availablePoints: user.availablePoints,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate points to next tier
    let pointsToNextTier = 15; // Default to match UI
    let nextTier = 'Exemplary Citizen';

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      location: user.location,
      bio: user.bio,
      score: user.score,
      tier: user.tier,
      nextTier,
      pointsToNextTier,
      availablePoints: user.availablePoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
