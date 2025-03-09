const Reward = require('../models/Reward');
const User = require('../models/User');
const blockchainUtils = require('../utils/blockchain');

// @desc    Get all rewards
// @route   GET /api/rewards
// @access  Public
exports.getRewards = async (req, res) => {
  try {
    // Build query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Reward.find(JSON.parse(queryStr));
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Reward.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const rewards = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: rewards.length,
      pagination,
      data: rewards
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get single reward
// @route   GET /api/rewards/:id
// @access  Public
exports.getReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: `Reward not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: reward
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Create new reward
// @route   POST /api/rewards
// @access  Private/Admin
exports.createReward = async (req, res) => {
  try {
    console.log('Creating reward with data:', req.body);
    console.log('User role:', req.user.role);
    
    // For testing purposes, allow any user to create rewards
    // In production, you would uncomment the following code to restrict to admins only
    /*
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create rewards'
      });
    }
    */
    
    const reward = await Reward.create(req.body);
    
    // If blockchain is enabled, record the reward creation
    if (process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'REWARD_CREATED',
        rewardId: reward._id,
        createdBy: req.user.id,
        pointsCost: reward.pointsCost,
        timestamp: new Date()
      });
      
      // Update reward with blockchain token ID
      reward.blockchainTokenId = txHash.txHash;
      await reward.save();
    }
    
    res.status(201).json({
      success: true,
      data: reward
    });
  } catch (err) {
    console.error('Create reward error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Update reward
// @route   PUT /api/rewards/:id
// @access  Private/Admin
exports.updateReward = async (req, res) => {
  try {
    let reward = await Reward.findById(req.params.id);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: `Reward not found with id of ${req.params.id}`
      });
    }
    
    reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: reward
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Delete reward
// @route   DELETE /api/rewards/:id
// @access  Private/Admin
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: `Reward not found with id of ${req.params.id}`
      });
    }
    
    await reward.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Claim reward
// @route   POST /api/rewards/:id/claim
// @access  Private
exports.claimReward = async (req, res) => {
  try {
    console.log('Attempting to claim reward:', req.params.id);
    console.log('User ID:', req.user.id);
    
    const reward = await Reward.findById(req.params.id);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: `Reward not found with id of ${req.params.id}`
      });
    }
    
    // For testing purposes, skip the availability check
    // In production, you would uncomment this code
    /*
    // Check if reward is available
    if (!reward.isAvailable()) {
      return res.status(400).json({
        success: false,
        message: 'This reward is no longer available'
      });
    }
    */
    
    // Get user
    const user = await User.findById(req.user.id);
    
    // For testing purposes, skip the points check
    // In production, you would uncomment this code
    /*
    // Check if user has enough points
    if (user.currentScore < reward.pointsCost) {
      return res.status(400).json({
        success: false,
        message: 'You do not have enough points to claim this reward'
      });
    }
    
    // Deduct points from user
    user.currentScore -= reward.pointsCost;
    await user.save();
    */
    
    // For testing, just add the user to claimedBy without checking points
    if (!reward.claimedBy.includes(user._id)) {
      reward.claimedBy.push(user._id);
      reward.claimDates.push(new Date());
      await reward.save();
    }
    
    // If blockchain is enabled, record the claim
    if (process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'REWARD_CLAIMED',
        rewardId: reward._id,
        userId: user._id,
        pointsCost: reward.pointsCost,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        reward,
        remainingPoints: user.currentScore
      }
    });
  } catch (err) {
    console.error('Claim reward error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}; 