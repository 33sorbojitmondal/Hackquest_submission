const express = require('express');
const {
  getRewards,
  getReward,
  createReward,
  updateReward,
  deleteReward,
  claimReward
} = require('../controllers/rewardController');

const { protect, authorize, validateRequest } = require('../middleware/auth');
const { createRewardSchema, updateRewardSchema } = require('../utils/validation');

const router = express.Router();

// Public routes
router.get('/', getRewards);
router.get('/:id', getReward);

// Protected routes
router.post('/:id/claim', protect, claimReward);

// Admin routes
router.post('/', protect, authorize('admin'), validateRequest(createRewardSchema), createReward);
router.put('/:id', protect, authorize('admin'), validateRequest(updateRewardSchema), updateReward);
router.delete('/:id', protect, authorize('admin'), deleteReward);

module.exports = router; 