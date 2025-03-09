const User = require('../models/User');
const blockchainUtils = require('../utils/blockchain');
const jwt = require('jsonwebtoken');

// Helper function to generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('Registration request received');
    
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty or invalid'
      });
    }
    
    const { name, fullName, email, password, location, bio } = req.body;
    
    // Use fullName if provided, otherwise use name
    const userFullName = fullName || name;
    
    // Validate required fields
    if (!userFullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }
    
    console.log('Processing registration for:', { name: userFullName, email });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    console.log('Creating new user');
    
    // Create user with explicit fields only
    user = await User.create({
      fullName: userFullName,
      email,
      password,
      ...(location ? { location } : {}),
      ...(bio ? { bio } : {})
    });

    console.log('User created successfully with ID:', user._id);

    // Generate token directly with jwt
    const token = generateToken(user);
    console.log('Token generated successfully');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        currentScore: user.currentScore,
        location: user.location,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Registration error details:', err);
    console.error('Error stack:', err.stack);
    
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token directly with jwt
    const token = generateToken(user);
    console.log('Login successful, token generated');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        currentScore: user.currentScore,
        location: user.location,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    console.log('Getting current user with ID:', req.user.id);
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Update user details
// @route   PUT /api/users/me
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    // Handle both name and fullName fields
    const { name, fullName, bio, location, walletAddress } = req.body;
    
    const fieldsToUpdate = {
      ...(fullName ? { fullName } : {}),
      ...(name && !fullName ? { fullName: name } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(walletAddress !== undefined ? { walletAddress } : {})
    };

    // Remove empty fields
    Object.keys(fieldsToUpdate).forEach(
      key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get user score
// @route   GET /api/users/score
// @access  Private
exports.getScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate score (in a real app, this might be more complex)
    const score = await user.calculateScore();
    
    // If blockchain is enabled, record the score
    if (process.env.BLOCKCHAIN_ENABLED === 'true') {
      await blockchainUtils.recordTransaction({
        type: 'SCORE_CHECK',
        userId: user._id,
        score,
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        currentScore: score
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get user activities
// @route   GET /api/users/activities
// @access  Private
exports.getUserActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'activities',
      options: { sort: { date: -1 } }
    });

    res.status(200).json({
      success: true,
      count: user.activities.length,
      data: user.activities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get user rewards
// @route   GET /api/users/rewards
// @access  Private
exports.getUserRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'rewards',
      options: { sort: { createdAt: -1 } }
    });

    res.status(200).json({
      success: true,
      count: user.rewards.length,
      data: user.rewards
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Update user to admin role (for testing purposes)
// @route   PUT /api/users/:id/make-admin
// @access  Private
exports.makeAdmin = async (req, res) => {
  try {
    console.log('Attempting to update user role to admin');
    
    const userId = req.params.id;
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update the user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`User ${userId} updated to admin role`);
    
    res.status(200).json({
      success: true,
      message: 'User role updated to admin',
      data: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Make admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}; 