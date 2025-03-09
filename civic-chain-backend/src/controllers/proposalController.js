const Proposal = require('../models/Proposal');
const User = require('../models/User');
const blockchainUtils = require('../utils/blockchain');

// @desc    Get all proposals
// @route   GET /api/proposals
// @access  Public
exports.getProposals = async (req, res) => {
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
    query = Proposal.find(JSON.parse(queryStr)).populate({
      path: 'proposer',
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
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Proposal.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const proposals = await query;
    
    // Check results for any active proposals that have passed their deadline
    for (const proposal of proposals) {
      if (proposal.status === 'active' && new Date() > proposal.votingDeadline) {
        await proposal.checkResult();
      }
    }
    
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
      count: proposals.length,
      pagination,
      data: proposals
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Public
exports.getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate({
      path: 'proposer',
      select: 'name email'
    }).populate({
      path: 'voters.user',
      select: 'name email'
    });
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: `Proposal not found with id of ${req.params.id}`
      });
    }
    
    // Check if proposal is active and has passed its deadline
    if (proposal.status === 'active' && new Date() > proposal.votingDeadline) {
      await proposal.checkResult();
    }
    
    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Create new proposal
// @route   POST /api/proposals
// @access  Private
exports.createProposal = async (req, res) => {
  try {
    // Add user to req.body
    req.body.proposer = req.user.id;
    
    const proposal = await Proposal.create(req.body);
    
    // If blockchain is enabled, record the proposal creation
    if (process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'PROPOSAL_CREATED',
        proposalId: proposal._id,
        proposer: req.user.id,
        category: proposal.category,
        votingDeadline: proposal.votingDeadline,
        timestamp: new Date()
      });
      
      // Update proposal with blockchain proposal ID
      proposal.blockchainProposalId = txHash.txHash;
      await proposal.save();
    }
    
    res.status(201).json({
      success: true,
      data: proposal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Update proposal
// @route   PUT /api/proposals/:id
// @access  Private
exports.updateProposal = async (req, res) => {
  try {
    let proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: `Proposal not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is proposal owner or admin
    if (proposal.proposer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this proposal'
      });
    }
    
    // Check if proposal is active
    if (proposal.status !== 'active' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a proposal that is no longer active'
      });
    }
    
    proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    // If status is being updated to 'implemented' and blockchain is enabled
    if (req.body.status === 'implemented' && process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'PROPOSAL_IMPLEMENTED',
        proposalId: proposal._id,
        implementedBy: req.user.id,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Delete proposal
// @route   DELETE /api/proposals/:id
// @access  Private
exports.deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: `Proposal not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is proposal owner or admin
    if (proposal.proposer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this proposal'
      });
    }
    
    // Check if proposal is active
    if (proposal.status !== 'active' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a proposal that is no longer active'
      });
    }
    
    await proposal.deleteOne();
    
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

// @desc    Vote on proposal
// @route   POST /api/proposals/:id/vote
// @access  Private
exports.voteOnProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: `Proposal not found with id of ${req.params.id}`
      });
    }
    
    // Check if proposal is active
    if (proposal.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on a proposal that is not active'
      });
    }
    
    // Check if voting deadline has passed
    if (new Date() > proposal.votingDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Voting deadline has passed'
      });
    }
    
    // Get user's voting power (in a real app, this might be based on score or other factors)
    const user = await User.findById(req.user.id);
    const votingPower = Math.floor(user.currentScore / 100) + 1; // Simple formula: 1 + 1 per 100 points
    
    // Cast vote
    await proposal.castVote(req.user.id, req.body.vote, votingPower);
    
    // If blockchain is enabled, record the vote
    if (process.env.BLOCKCHAIN_ENABLED === 'true') {
      const txHash = await blockchainUtils.recordTransaction({
        type: 'PROPOSAL_VOTE',
        proposalId: proposal._id,
        voter: req.user.id,
        vote: req.body.vote,
        votingPower,
        timestamp: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}; 