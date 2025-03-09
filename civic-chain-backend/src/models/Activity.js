const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Community Service', 'Environmental', 'Education', 'Health', 'Governance', 'Innovation'],
    default: 'Community Service'
  },
  points: {
    type: Number,
    required: [true, 'Please provide points value']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'completed'
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String
  },
  evidence: {
    type: String, // URL to image or document
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  blockchainTxHash: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
ActivitySchema.index({ user: 1, date: -1 });
ActivitySchema.index({ category: 1 });
ActivitySchema.index({ status: 1 });

// Middleware to update user score after activity is approved
ActivitySchema.post('save', async function(doc) {
  if (doc.status === 'approved') {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(doc.user);
      
      if (user) {
        user.currentScore += doc.points;
        await user.save();
      }
    } catch (err) {
      console.error('Error updating user score:', err);
    }
  }
});

module.exports = mongoose.model('Activity', ActivitySchema); 