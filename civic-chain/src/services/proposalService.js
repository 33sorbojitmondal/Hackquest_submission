import api from './api';

// Get all proposals
const getAllProposals = async (filters = {}) => {
  try {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/proposals?${queryString}` : '/proposals';
    
    return await api.get(endpoint);
  } catch (error) {
    throw error;
  }
};

// Get proposal by ID
const getProposalById = async (proposalId) => {
  try {
    return await api.get(`/proposals/${proposalId}`);
  } catch (error) {
    throw error;
  }
};

// Create a new proposal
const createProposal = async (proposalData) => {
  try {
    return await api.post('/proposals', proposalData);
  } catch (error) {
    throw error;
  }
};

// Update a proposal
const updateProposal = async (proposalId, proposalData) => {
  try {
    return await api.put(`/proposals/${proposalId}`, proposalData);
  } catch (error) {
    throw error;
  }
};

// Delete a proposal
const deleteProposal = async (proposalId) => {
  try {
    return await api.delete(`/proposals/${proposalId}`);
  } catch (error) {
    throw error;
  }
};

// Vote on a proposal
const voteOnProposal = async (proposalId, voteData) => {
  try {
    return await api.post(`/proposals/${proposalId}/vote`, voteData);
  } catch (error) {
    throw error;
  }
};

export default {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  voteOnProposal
};
