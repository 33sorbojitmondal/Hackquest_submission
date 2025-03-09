const express = require('express');
const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  voteOnProposal
} = require('../controllers/proposalController');

const { protect, authorize, validateRequest } = require('../middleware/auth');
const { createProposalSchema, updateProposalSchema, voteSchema } = require('../utils/validation');

const router = express.Router();

// Public routes
router.get('/', getProposals);
router.get('/:id', getProposal);

// Protected routes
router.post('/', protect, validateRequest(createProposalSchema), createProposal);
router.put('/:id', protect, validateRequest(updateProposalSchema), updateProposal);
router.delete('/:id', protect, deleteProposal);
router.post('/:id/vote', protect, validateRequest(voteSchema), voteOnProposal);

module.exports = router; 