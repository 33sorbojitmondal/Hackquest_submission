import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const DAOPage = () => {
  const { currentUser } = useUser();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        const mockProposals = [
          {
            id: 1,
            title: 'Community Garden Project',
            description: 'Create a community garden in the vacant lot on Main Street',
            category: 'Environmental',
            status: 'Active',
            votesFor: 24,
            votesAgainst: 3,
            author: {
              id: '123',
              name: 'Jane Smith'
            },
            createdAt: '2023-06-01',
            endDate: '2023-07-01'
          },
          {
            id: 2,
            title: 'After-School Tutoring Program',
            description: 'Establish a volunteer-run tutoring program for local students',
            category: 'Education',
            status: 'Active',
            votesFor: 18,
            votesAgainst: 2,
            author: {
              id: '456',
              name: 'Michael Johnson'
            },
            createdAt: '2023-06-05',
            endDate: '2023-07-05'
          },
          {
            id: 3,
            title: 'Street Light Improvement',
            description: 'Upgrade street lights in the downtown area for better safety',
            category: 'Infrastructure',
            status: 'Passed',
            votesFor: 32,
            votesAgainst: 5,
            author: {
              id: '789',
              name: 'Sarah Williams'
            },
            createdAt: '2023-05-15',
            endDate: '2023-06-15'
          },
          {
            id: 4,
            title: 'Local Business Support Fund',
            description: 'Create a fund to support small businesses affected by the pandemic',
            category: 'Economic',
            status: 'Implemented',
            votesFor: 45,
            votesAgainst: 8,
            author: {
              id: '101',
              name: 'David Chen'
            },
            createdAt: '2023-04-20',
            endDate: '2023-05-20'
          },
          {
            id: 5,
            title: 'Public Art Installation',
            description: 'Commission local artists to create public art installations',
            category: 'Cultural',
            status: 'Rejected',
            votesFor: 12,
            votesAgainst: 28,
            author: {
              id: '112',
              name: 'Emily Rodriguez'
            },
            createdAt: '2023-05-10',
            endDate: '2023-06-10'
          }
        ];
        
        setProposals(mockProposals);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Failed to load proposals. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProposals();
  }, []);
  
  const categories = ['All', 'Environmental', 'Education', 'Infrastructure', 'Economic', 'Cultural', 'Health', 'Governance'];
  const statuses = ['All', 'Active', 'Passed', 'Rejected', 'Implemented'];
  
  const filteredProposals = proposals.filter(proposal => {
    if (selectedCategory !== 'All' && proposal.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'All' && proposal.status !== selectedStatus) {
      return false;
    }
    return true;
  });
  
  const handleVote = async (proposalId, voteType) => {
    try {
      // In a real app, you would call your API to submit the vote
      alert(`Vote ${voteType} submitted successfully!`);
      
      // Update the local state to reflect the vote
      // This would normally be handled by refetching the proposals from the API
      setProposals(prevProposals => 
        prevProposals.map(proposal => {
          if (proposal.id === proposalId) {
            return {
              ...proposal,
              votesFor: voteType === 'for' ? proposal.votesFor + 1 : proposal.votesFor,
              votesAgainst: voteType === 'against' ? proposal.votesAgainst + 1 : proposal.votesAgainst
            };
          }
          return proposal;
        })
      );
    } catch (err) {
      console.error('Error submitting vote:', err);
      alert('Failed to submit vote. Please try again later.');
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-primary';
      case 'Passed':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      case 'Implemented':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading proposals...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Community DAO</h1>
        <Link to="/proposals/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Create Proposal
        </Link>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Filter Proposals</h5>
              
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">DAO Statistics</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Active Proposals:</span>
                  <span className="fw-medium">{proposals.filter(p => p.status === 'Active').length}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Implemented Proposals:</span>
                  <span className="fw-medium">{proposals.filter(p => p.status === 'Implemented').length}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Total Votes Cast:</span>
                  <span className="fw-medium">
                    {proposals.reduce((sum, p) => sum + p.votesFor + p.votesAgainst, 0)}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Your Voting Power:</span>
                  <span className="fw-medium text-primary">1 vote</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-9">
          {filteredProposals.length > 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="list-group list-group-flush">
                {filteredProposals.map(proposal => (
                  <div key={proposal.id} className="list-group-item p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">
                        <Link to={`/proposals/${proposal.id}`} className="text-decoration-none">
                          {proposal.title}
                        </Link>
                      </h5>
                      <span className={`badge ${getStatusBadgeClass(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </div>
                    
                    <p className="text-muted mb-3">{proposal.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="badge bg-light text-dark me-2">{proposal.category}</span>
                        <small className="text-muted">
                          Proposed by: {proposal.author.name} on {new Date(proposal.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <small className="text-muted">
                        Ends: {new Date(proposal.endDate).toLocaleDateString()}
                      </small>
                    </div>
                    
                    {proposal.status === 'Active' && (
                      <div className="row g-2">
                        <div className="col-12 mb-3">
                          <div className="progress" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}%` }}
                              aria-valuenow={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >
                              {proposal.votesFor} For
                            </div>
                            <div 
                              className="progress-bar bg-danger" 
                              role="progressbar" 
                              style={{ width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}%` }}
                              aria-valuenow={(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >
                              {proposal.votesAgainst} Against
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-6">
                          <button 
                            className="btn btn-success w-100"
                            onClick={() => handleVote(proposal.id, 'for')}
                          >
                            <i className="bi bi-hand-thumbs-up me-2"></i>
                            Vote For
                          </button>
                        </div>
                        
                        <div className="col-6">
                          <button 
                            className="btn btn-danger w-100"
                            onClick={() => handleVote(proposal.id, 'against')}
                          >
                            <i className="bi bi-hand-thumbs-down me-2"></i>
                            Vote Against
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {proposal.status !== 'Active' && (
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="me-3">
                            <i className="bi bi-hand-thumbs-up text-success me-1"></i>
                            {proposal.votesFor} For
                          </span>
                          <span>
                            <i className="bi bi-hand-thumbs-down text-danger me-1"></i>
                            {proposal.votesAgainst} Against
                          </span>
                        </div>
                        <Link to={`/proposals/${proposal.id}`} className="btn btn-outline-primary btn-sm">
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No proposals found matching your filters.</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DAOPage;