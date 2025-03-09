const Activity = require('../models/Activity');
const User = require('../models/User');
const blockchainUtils = require('../utils/blockchain');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
exports.getActivities = async (req, res) => {
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
    query = Activity.find(JSON.parse(queryStr)).populate({
      path: 'user',
      select: 'name email'
    });
    
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
      query = query.sort('-date');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Activity.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const activities = await query;
    
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
      count: activities.length,
      pagination,
      data: activities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate({
      path: 'user',
      select: 'name email'
    });
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: `Activity not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const activity = await Activity.create(req.body);
    
    // If blockchain is enabled, record the activity
    if (process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'ACTIVITY_CREATED',
        activityId: activity._id,
        userId: req.user.id,
        category: activity.category,
        points: activity.points,
        timestamp: new Date()
      });
      
      // Update activity with blockchain transaction hash
      activity.blockchainTxHash = txHash.txHash;
      await activity.save();
    }
    
    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: `Activity not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is activity owner or admin
    if (activity.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this activity'
      });
    }
    
    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    // If status is being updated to 'approved' and blockchain is enabled
    if (req.body.status === 'approved' && process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'ACTIVITY_APPROVED',
        activityId: activity._id,
        userId: activity.user,
        verifiedBy: req.user.id,
        points: activity.points,
        timestamp: new Date()
      });
      
      // Update activity with blockchain transaction hash
      activity.blockchainTxHash = txHash.txHash;
      await activity.save();
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: `Activity not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is activity owner or admin
    if (activity.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this activity'
      });
    }
    
    await activity.deleteOne();
    
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

// @desc    Verify activity
// @route   PUT /api/activities/:id/verify
// @access  Private/Admin
exports.verifyActivity = async (req, res) => {
  try {
    console.log('Verifying activity:', req.params.id);
    console.log('User role:', req.user.role);
    
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: `Activity not found with id of ${req.params.id}`
      });
    }
    
    // For testing purposes, allow any user to verify activities
    // In production, you would uncomment the following code to restrict to admins only
    /*
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can verify activities'
      });
    }
    */
    
    // Update activity status
    activity.status = req.body.status || 'approved';
    activity.verifiedBy = req.user.id;
    activity.verificationDate = Date.now();
    
    await activity.save();
    
    // If approved and blockchain is enabled
    if (activity.status === 'approved' && process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'ACTIVITY_VERIFIED',
        activityId: activity._id,
        userId: activity.user,
        verifiedBy: req.user.id,
        status: activity.status,
        points: activity.points,
        timestamp: new Date()
      });
      
      // Update activity with blockchain transaction hash
      activity.blockchainTxHash = txHash.txHash;
      await activity.save();
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.error('Verify activity error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}; 