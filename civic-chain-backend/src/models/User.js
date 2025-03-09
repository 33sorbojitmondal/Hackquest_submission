const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  location: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 785
  },
  tier: {
    type: String,
    enum: ['Newcomer', 'Active Citizen', 'Model Citizen', 'Exemplary Citizen', 'Community Leader'],
    default: 'Model Citizen'
  },
  availablePoints: {
    type: Number,
    default: 450
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for name (to handle both name and fullName)
UserSchema.virtual('name')
  .get(function() {
    return this.fullName;
  })
  .set(function(value) {
    this.fullName = value;
  });

// Make virtuals show up in JSON
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Virtual field for activities
UserSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Virtual field for rewards
UserSchema.virtual('rewards', {
  ref: 'Reward',
  localField: '_id',
  foreignField: 'claimedBy',
  justOne: false
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  try {
    // Make sure we're using a string for the JWT_SECRET
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
    
    // Make sure we're using a string for JWT_EXPIRES_IN
    const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
    
    // Log the token creation
    console.log(`Creating token for user: ${this._id} with role: ${this.role}`);
    
    // Create the token with explicit string conversion for the secret
    const token = jwt.sign(
      { id: this._id.toString(), role: this.role },
      String(secret),
      { expiresIn: String(expiresIn) }
    );
    
    console.log(`Token created successfully: ${token.substring(0, 10)}...`);
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw error;
  }
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

// Calculate user score (this could be more complex in a real application)
UserSchema.methods.calculateScore = async function () {
  // In a real application, this would calculate based on activities
  // For now, we'll just return the current score
  return this.score;
};

module.exports = mongoose.model('User', UserSchema); 