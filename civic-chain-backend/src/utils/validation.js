const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().allow('', null),
  bio: Joi.string().max(500).allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().max(50),
  bio: Joi.string().max(500).allow('', null),
  location: Joi.string().allow('', null),
  walletAddress: Joi.string().allow('', null)
});

// Activity validation schemas
const createActivitySchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(500).required(),
  category: Joi.string().valid(
    'Community Service',
    'Environmental',
    'Civic Participation',
    'Education',
    'Health',
    'Other'
  ).required(),
  points: Joi.number().min(0).required(),
  date: Joi.date(),
  location: Joi.string().allow('', null),
  evidence: Joi.string().allow('', null)
});

const updateActivitySchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(500),
  category: Joi.string().valid(
    'Community Service',
    'Environmental',
    'Civic Participation',
    'Education',
    'Health',
    'Other'
  ),
  points: Joi.number().min(0),
  date: Joi.date(),
  location: Joi.string().allow('', null),
  evidence: Joi.string().allow('', null),
  status: Joi.string().valid('pending', 'approved', 'rejected')
});

// Reward validation schemas
const createRewardSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(500).required(),
  pointsCost: Joi.number().min(0).required(),
  category: Joi.string().required(),
  image: Joi.string(),
  available: Joi.boolean(),
  quantity: Joi.number().min(-1),
  expiryDate: Joi.date().allow(null),
  sponsor: Joi.string().allow('', null)
});

const updateRewardSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(500),
  pointsCost: Joi.number().min(0),
  category: Joi.string(),
  image: Joi.string(),
  available: Joi.boolean(),
  quantity: Joi.number().min(-1),
  expiryDate: Joi.date().allow(null),
  sponsor: Joi.string().allow('', null)
});

// Proposal validation schemas
const createProposalSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(2000).required(),
  category: Joi.string().valid(
    'Community Improvement',
    'Governance',
    'Reward System',
    'Technology',
    'Other'
  ).required(),
  votingDeadline: Joi.date().required()
});

const updateProposalSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(2000),
  category: Joi.string().valid(
    'Community Improvement',
    'Governance',
    'Reward System',
    'Technology',
    'Other'
  ),
  status: Joi.string().valid('active', 'passed', 'rejected', 'implemented'),
  votingDeadline: Joi.date(),
  implementationDetails: Joi.string().allow('', null)
});

const voteSchema = Joi.object({
  vote: Joi.string().valid('for', 'against', 'abstain').required()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createActivitySchema,
  updateActivitySchema,
  createRewardSchema,
  updateRewardSchema,
  createProposalSchema,
  updateProposalSchema,
  voteSchema
}; 