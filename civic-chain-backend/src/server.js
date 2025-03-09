const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const statsRoutes = require('./routes/statsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize Express app
const app = express();

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(morgan('dev'));

// Debug middleware to log request details
app.use((req, res, next) => {
  if (req.method === 'POST' || req.path.includes('/me')) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    if (req.method === 'POST') {
      console.log('Request Body:', req.body);
    }
  }
  next();
});

// Custom error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON Parse Error:', err);
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON format',
      error: err.message
    });
  }
  next(err);
});

// Test route that doesn't require authentication
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT || 5002,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
      blockchainEnabled: process.env.BLOCKCHAIN_ENABLED || false
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to CivicChain API');
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
const PORT = 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic-chain';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app; 