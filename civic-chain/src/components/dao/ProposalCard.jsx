import { motion } from 'framer-motion';

const ProposalCard = ({ proposal, onSelect }) => {
  // Calculate percentage of votes for and against
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  
  // Calculate days remaining until deadline
  const daysRemaining = () => {
    if (proposal.status === 'completed') return 'Completed';
    
    const deadline = new Date(proposal.deadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} days remaining` : 'Ending today';
  };

  return (
    <motion.div 
      className="card h-100"
      whileHover={{ y: -5 }}
      onClick={() => onSelect(proposal)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title">{proposal.title}</h5>
          <span className={`badge ${proposal.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
            {proposal.status === 'active' ? 'Active' : 'Completed'}
          </span>
        </div>
        
        <p className="card-text small text-muted mb-3">{proposal.description}</p>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center small mb-1">
            <span>For: {proposal.votesFor}</span>
            <span>Against: {proposal.votesAgainst}</span>
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${forPercentage}%` }} 
              aria-valuenow={forPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
            <div 
              className="progress-bar bg-danger" 
              role="progressbar" 
              style={{ width: `${againstPercentage}%` }} 
              aria-valuenow={againstPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-primary">{proposal.category}</span>
          <small className="text-muted">{daysRemaining()}</small>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalCard;