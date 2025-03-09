import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProposalCard from './ProposalCard';
import ProposalDetails from './ProposalDetails';
import VotingInterface from './VotingInterface';
import { daoProposalsData } from '../../data/daoProposalsData.js';

const ProposalsList = () => {
  const [proposals, setProposals] = useState(daoProposalsData);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVotingInterface, setShowVotingInterface] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(proposal => proposal.status === filter);
  
  const handleSelectProposal = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setShowVotingInterface(false);
  };
  
  const handleVoteClick = (proposal) => {
    setShowModal(false);
    setShowVotingInterface(true);
  };
  
  const handleVoteSubmit = (proposalId, voteType, reason) => {
    setProposals(proposals.map(proposal => {
      if (proposal.id === proposalId) {
        return {
          ...proposal,
          votesFor: voteType === 'for' ? proposal.votesFor + 1 : proposal.votesFor,
          votesAgainst: voteType === 'against' ? proposal.votesAgainst + 1 : proposal.votesAgainst,
        };
      }
      return proposal;
    }));
    
    setShowVotingInterface(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Governance Proposals</h4>
        <div className="btn-group">
          <button 
            type="button" 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            type="button" 
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            type="button" 
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="row">
        {filteredProposals.map(proposal => (
          <div key={proposal.id} className="col-md-6 col-lg-4 mb-4">
            <ProposalCard proposal={proposal} onSelect={handleSelectProposal} />
          </div>
        ))}
        
        {filteredProposals.length === 0 && (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No proposals found with the selected filter.</p>
          </div>
        )}
      </div>
      
      {/* Modal for proposal details */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleCloseModal}
          >
            <div onClick={e => e.stopPropagation()}>
              <ProposalDetails 
                proposal={selectedProposal} 
                onClose={handleCloseModal}
                onVote={handleVoteClick}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal for voting interface */}
      <AnimatePresence>
        {showVotingInterface && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleCloseModal}
          >
            <div className="container" onClick={e => e.stopPropagation()}>
              <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                  <VotingInterface 
                    proposal={selectedProposal} 
                    onClose={handleCloseModal}
                    onVote={handleVoteSubmit}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalsList;