const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a proposal title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Community Improvement',
        'Governance',
        'Reward System',
        'Technology',
        'Other'
      ]
    },
    status: {
      type: String,
      enum: ['active', 'passed', 'rejected', 'implemented'],
      default: 'active'
    },
    votingDeadline: {
      type: Date,
      required: [true, 'Please provide a voting deadline']
    },
    votes: {
      for: {
        type: Number,
        default: 0
      },
      against: {
        type: Number,
        default: 0
      },
      abstain: {
        type: Number,
        default: 0
      }
    },
    voters: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        vote: {
          type: String,
          enum: ['for', 'against', 'abstain']
        },
        votingPower: {
          type: Number,
          default: 1
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    implementationDetails: {
      type: String
    },
    blockchainProposalId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
proposalSchema.index({ status: 1 });
proposalSchema.index({ category: 1 });
proposalSchema.index({ votingDeadline: 1 });

// Method to cast a vote
proposalSchema.methods.castVote = async function(userId, voteType, votingPower = 1) {
  // Check if voting deadline has passed
  if (new Date() > this.votingDeadline) {
    throw new Error('Voting deadline has passed');
  }
  
  // Check if user has already voted
  const existingVoteIndex = this.voters.findIndex(
    voter => voter.user.toString() === userId.toString()
  );
  
  if (existingVoteIndex !== -1) {
    // User has already voted, update their vote
    const oldVote = this.voters[existingVoteIndex].vote;
    const oldPower = this.voters[existingVoteIndex].votingPower;
    
    // Remove old vote count
    this.votes[oldVote] -= oldPower;
    
    // Update vote
    this.voters[existingVoteIndex].vote = voteType;
    this.voters[existingVoteIndex].votingPower = votingPower;
    this.voters[existingVoteIndex].timestamp = new Date();
  } else {
    // New vote
    this.voters.push({
      user: userId,
      vote: voteType,
      votingPower,
      timestamp: new Date()
    });
  }
  
  // Update vote count
  this.votes[voteType] += votingPower;
  
  return this.save();
};

// Method to check if proposal has passed
proposalSchema.methods.checkResult = async function() {
  // Only check if proposal is active and deadline has passed
  if (this.status !== 'active' || new Date() <= this.votingDeadline) {
    return this.status;
  }
  
  // Calculate total votes
  const totalVotes = this.votes.for + this.votes.against + this.votes.abstain;
  
  // Simple majority rule (can be more complex in real implementation)
  if (totalVotes > 0 && this.votes.for > this.votes.against) {
    this.status = 'passed';
  } else {
    this.status = 'rejected';
  }
  
  return this.save();
};

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal; 