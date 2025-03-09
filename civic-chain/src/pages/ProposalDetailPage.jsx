import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import proposalService from '../services/proposalService';

const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [voteSuccess, setVoteSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [userVote, setUserVote] = useState(null);
  
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await proposalService.getProposalById(id);
        setProposal(response.data);
        
        // Check if user has already voted
        if (response.data.votes && currentUser) {
          const vote = response.data.votes.find(v => v.user === currentUser.id);
          if (vote) {
            setUserVote(vote.vote);
          }
        }
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError('Failed to load proposal. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposal();
  }, [id, currentUser]);
  
  const handleVote = async (vote) => {
    setVoteLoading(true);
    setVoteError('');
    setVoteSuccess('');
    
    try {
      await proposalService.voteOnProposal(id, { vote });
      
      // Refresh proposal data
      const response = await proposalService.getProposalById(id);
      setProposal(response.data);
      setUserVote(vote);
      
      setVoteSuccess('Your vote has been recorded!');
    } catch (err) {
      console.error('Error voting on proposal:', err);
      setVoteError(err.message || 'Failed to record your vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await proposalService.deleteProposal(id);
      navigate('/proposals');
    } catch (err) {
      console.error('Error deleting proposal:', err);
      setError('Failed to delete proposal. Please try again.');
    }
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading proposal...</div>;
  }
  
  if (error && !proposal) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/proposals" className="btn btn-primary">Back to Proposals</Link>
      </div>
    );
  }
  
  if (!proposal) {
    return (
      <div className="not-found-container">
        <h2>Proposal Not Found</h2>
        <p>The proposal you're looking for doesn't exist or has been removed.</p>
        <Link to="/proposals" className="btn btn-primary">Back to Proposals</Link>
      </div>
    );
  }
  
  const isAuthor = currentUser && proposal.author.id === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isAuthor && proposal.status === 'active';
  const canVote = currentUser && proposal.status === 'active';
  const canDelete = isAuthor || isAdmin;
  
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
  const againstPercentage = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0;
  
  // Calculate time remaining
  const now = new Date();
  const endDate = new Date(proposal.endDate);
  const timeRemaining = endDate > now ? endDate - now : 0;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return (
    <div className="proposal-detail-container">
      <div className="proposal-header">
        <h1>{proposal.title}</h1>
        <div className="proposal-meta">
          <span className={`proposal-status status-${proposal.status.toLowerCase()}`}>
            {proposal.status}
          </span>
          <span className="proposal-category">{proposal.category}</span>
        </div>
      </div>
      
      <div className="proposal-content">
        <div className="proposal-info">
          <div className="info-item">
            <strong>Proposed by:</strong> {proposal.author.name}
          </div>
          <div className="info-item">
            <strong>Created:</strong> {new Date(proposal.createdAt).toLocaleDateString()}
          </div>
          <div className="info-item">
            <strong>Voting Ends:</strong> {new Date(proposal.endDate).toLocaleDateString()}
          </div>
          {proposal.status === 'active' && (
            <div className="info-item time-remaining">
              <strong>Time Remaining:</strong> {daysRemaining} days, {hoursRemaining} hours
            </div>
          )}
          {proposal.budget > 0 && (
            <div className="info-item">
              <strong>Budget:</strong> ${proposal.budget.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className="proposal-description">
          <h2>Description</h2>
          <p>{proposal.description}</p>
        </div>
        
        <div className="proposal-voting">
          <h2>Voting Results</h2>
          
          <div className="vote-bar">
            <div 
              className="vote-for" 
              style={{ width: `${forPercentage}%` }}
            >
              {forPercentage > 10 && `${forPercentage}%`}
            </div>
            <div 
              className="vote-against" 
              style={{ width: `${againstPercentage}%` }}
            >
              {againstPercentage > 10 && `${againstPercentage}%`}
            </div>
          </div>
          
          <div className="vote-counts">
            <div className="vote-for-count">
              <strong>{proposal.votesFor}</strong> votes for
            </div>
            <div className="vote-against-count">
              <strong>{proposal.votesAgainst}</strong> votes against
            </div>
            <div className="vote-total-count">
              <strong>{totalVotes}</strong> total votes
            </div>
          </div>
          
          {voteError && (
            <div className="error-message">
              {voteError}
            </div>
          )}
          
          {voteSuccess && (
            <div className="success-message">
              {voteSuccess}
            </div>
          )}
          
          {canVote ? (
            <div className="voting-actions">
              <h3>Cast Your Vote</h3>
              {userVote !== null ? (
                <div className="user-vote-info">
                  <p>You voted <strong>{userVote ? 'For' : 'Against'}</strong> this proposal.</p>
                  <p>You can change your vote until the voting period ends.</p>
                </div>
              ) : null}
              
              <div className="vote-buttons">
                <button 
                  className={`btn btn-vote-for ${userVote === true ? 'selected' : ''}`}
                  onClick={() => handleVote(true)}
                  disabled={voteLoading}
                >
                  Vote For
                </button>
                <button 
                  className={`btn btn-vote-against ${userVote === false ? 'selected' : ''}`}
                  onClick={() => handleVote(false)}
                  disabled={voteLoading}
                >
                  Vote Against
                </button>
              </div>
            </div>
          ) : !currentUser ? (
            <div className="login-to-vote">
              <p>Please <Link to="/login">login</Link> to vote on this proposal.</p>
            </div>
          ) : proposal.status !== 'active' ? (
            <div className="voting-closed">
              <p>Voting is closed for this proposal.</p>
            </div>
          ) : null}
        </div>
      </div>
      
      {(canEdit || canDelete) && (
        <div className="proposal-actions">
          {canEdit && (
            <Link to={`/proposals/${id}/edit`} className="btn btn-secondary">
              Edit Proposal
            </Link>
          )}
          
          {canDelete && (
            deleteConfirm ? (
              <div className="delete-confirm">
                <p>Are you sure you want to delete this proposal?</p>
                <button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-danger"
                onClick={() => setDeleteConfirm(true)}
              >
                Delete Proposal
              </button>
            )
          )}
        </div>
      )}
      
      <div className="back-link">
        <Link to="/proposals">Back to Proposals</Link>
      </div>
    </div>
  );
};

export default ProposalDetailPage;
