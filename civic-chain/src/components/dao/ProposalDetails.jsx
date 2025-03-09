import { motion } from 'framer-motion';

const ProposalDetails = ({ proposal, onVote, onClose }) => {
  if (!proposal) return null;
  
  // Calculate percentage of votes for and against
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="modal-dialog modal-dialog-centered modal-lg"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{proposal.title}</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge bg-primary">{proposal.category}</span>
              <span className={`badge ${proposal.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                {proposal.status === 'active' ? 'Active' : 'Completed'}
              </span>
            </div>
            <p className="mb-3">{proposal.description}</p>
            <div className="d-flex justify-content-between small text-muted">
              <span>Proposed by: {proposal.author}</span>
              <span>Created: {formatDate(proposal.dateCreated)}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h6 className="fw-bold mb-2">Voting Status</h6>
            <div className="d-flex justify-content-between align-items-center small mb-1">
              <span>For: {proposal.votesFor} votes ({Math.round(forPercentage)}%)</span>
              <span>Against: {proposal.votesAgainst} votes ({Math.round(againstPercentage)}%)</span>
            </div>
            <div className="progress mb-2" style={{ height: '20px' }}>
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
            // Continuing from where we left off
            <div className="text-center small text-muted">
              Total votes: {totalVotes} • Deadline: {formatDate(proposal.deadline)}
            </div>
          </div>
          
          {proposal.status === 'completed' && proposal.result && (
            <div className={`alert ${proposal.result === 'approved' ? 'alert-success' : 'alert-danger'}`}>
              <strong>Result:</strong> This proposal was {proposal.result}.
            </div>
          )}
          
          <div className="mb-4">
            <h6 className="fw-bold mb-2">Impact Analysis</h6>
            <div className="card bg-light">
              <div className="card-body">
                <p className="card-text">
                  {proposal.category === 'Point System' && 
                    'This proposal will affect how points are allocated in the system, potentially changing the value of certain activities.'}
                  {proposal.category === 'Rewards' && 
                    'This proposal will modify the available rewards, affecting what users can redeem their points for.'}
                  {proposal.category === 'Governance' && 
                    'This proposal will change aspects of the governance structure, affecting how decisions are made in the future.'}
                  {proposal.category === 'Resource Allocation' && 
                    'This proposal will change how resources are distributed within the system.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Close
          </button>
          {proposal.status === 'active' && (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => onVote(proposal)}
            >
              Cast Vote
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalDetails;