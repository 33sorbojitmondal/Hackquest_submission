const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  getScore,
  getUserActivities,
  getUserRewards,
  makeAdmin
} = require('../controllers/userController');

const { protect, validateRequest } = require('../middleware/auth');
const { registerSchema, loginSchema, updateUserSchema } = require('../utils/validation');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User routes are working correctly'
  });
});

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, validateRequest(updateUserSchema), updateDetails);
router.get('/score', protect, getScore);
router.get('/activities', protect, getUserActivities);
router.get('/rewards', protect, getUserRewards);

// Admin routes (for testing purposes)
router.put('/:id/make-admin', protect, makeAdmin);

module.exports = router; 