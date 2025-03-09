const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a reward title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    pointsCost: {
      type: Number,
      required: [true, 'Please provide points cost'],
      min: [0, 'Points cost cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category']
    },
    image: {
      type: String,
      default: 'default-reward.jpg'
    },
    available: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    expiryDate: {
      type: Date
    },
    sponsor: {
      type: String
    },
    claimedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    claimDates: [{
      type: Date
    }],
    blockchainTokenId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
rewardSchema.index({ category: 1 });
rewardSchema.index({ available: 1 });
rewardSchema.index({ pointsCost: 1 });

// Method to check if reward is available
rewardSchema.methods.isAvailable = function() {
  // Check if reward is marked as available
  if (!this.available) return false;
  
  // Check if reward has expired
  if (this.expiryDate && new Date() > this.expiryDate) return false;
  
  // Check if quantity is limited and has been exhausted
  if (this.quantity !== -1 && this.claimedBy.length >= this.quantity) return false;
  
  return true;
};

// Method to claim reward
rewardSchema.methods.claimByUser = async function(userId) {
  if (!this.isAvailable()) {
    throw new Error('Reward is not available');
  }
  
  // Add user to claimedBy array
  this.claimedBy.push(userId);
  this.claimDates.push(new Date());
  
  // Update quantity if needed
  if (this.quantity !== -1 && this.claimedBy.length >= this.quantity) {
    this.available = false;
  }
  
  return this.save();
};

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward; 