import { useState } from 'react';
import { motion } from 'framer-motion';

const VotingInterface = ({ proposal, onVote, onClose }) => {
  const [vote, setVote] = useState(null);
  const [reason, setReason] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (vote) {
      onVote(proposal.id, vote, reason);
      onClose();
    }
  };
  
  // Calculate percentage of votes for and against
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card"
    >
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Cast Your Vote</h5>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      
      <div className="card-body">
        <h5 className="card-title mb-3">{proposal.title}</h5>
        <p className="card-text mb-4">{proposal.description}</p>
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center small mb-1">
            <span>For: {proposal.votesFor}</span>
            <span>Against: {proposal.votesAgainst}</span>
          </div>
          <div className="progress mb-3" style={{ height: '20px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${forPercentage}%` }} 
              aria-valuenow={forPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {forPercentage > 10 ? `${Math.round(forPercentage)}%` : ''}
            </div>
            <div 
              className="progress-bar bg-danger" 
              role="progressbar" 
              style={{ width: `${againstPercentage}%` }} 
              aria-valuenow={againstPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {againstPercentage > 10 ? `${Math.round(againstPercentage)}%` : ''}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold">Your Vote</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="voteOption" 
                  id="voteFor" 
                  value="for" 
                  onChange={() => setVote('for')}
                  checked={vote === 'for'}
                />
                <label className="form-check-label" htmlFor="voteFor">
                  For
                </label>
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="voteOption" 
                  id="voteAgainst" 
                  value="against" 
                  onChange={() => setVote('against')}
                  checked={vote === 'against'}
                />
                <label className="form-check-label" htmlFor="voteAgainst">
                  Against
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="voteReason" className="form-label fw-bold">Reason (Optional)</label>
            <textarea 
              className="form-control" 
              id="voteReason" 
              rows="3" 
              placeholder="Share your reasoning for this vote..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>
          
          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!vote}
            >
              Submit Vote
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default VotingInterface;