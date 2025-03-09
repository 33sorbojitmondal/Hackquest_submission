import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import proposalService from '../services/proposalService';

const ProposalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: 0,
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingProposal, setFetchingProposal] = useState(isEditMode);
  
  // Set default end date to 7 days from now
  useEffect(() => {
    if (!isEditMode) {
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 7);
      
      setFormData(prevState => ({
        ...prevState,
        endDate: defaultEndDate.toISOString().split('T')[0]
      }));
    }
  }, [isEditMode]);
  
  useEffect(() => {
    // If in edit mode, fetch the proposal data
    if (isEditMode) {
      const fetchProposal = async () => {
        try {
          const response = await proposalService.getProposalById(id);
          const proposal = response.data;
          
          // Format date for input field (YYYY-MM-DD)
          const endDate = new Date(proposal.endDate).toISOString().split('T')[0];
          
          setFormData({
            title: proposal.title || '',
            description: proposal.description || '',
            category: proposal.category || '',
            budget: proposal.budget || 0,
            endDate: endDate
          });
        } catch (err) {
          console.error('Error fetching proposal data:', err);
          setError('Failed to load proposal data. Please try again later.');
        } finally {
          setFetchingProposal(false);
        }
      };
      
      fetchProposal();
    }
  }, [isEditMode, id]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isEditMode) {
        await proposalService.updateProposal(id, formData);
        navigate(`/proposals/${id}`);
      } else {
        const response = await proposalService.createProposal(formData);
        navigate(`/proposals/${response.data._id}`);
      }
    } catch (err) {
      console.error('Error saving proposal:', err);
      setError(err.message || 'Failed to save proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchingProposal) {
    return <div className="loading-spinner">Loading proposal data...</div>;
  }
  
  return (
    <div className="form-container">
      <h1>{isEditMode ? 'Edit Proposal' : 'Create New Proposal'}</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Proposal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          />
          <small>Describe your proposal in detail, including its purpose, benefits, and implementation plan.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Community">Community</option>
            <option value="Governance">Governance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="budget">Budget (if applicable)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          <small>Estimated budget required for implementation (in USD)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate">Voting End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
          <small>The date when voting on this proposal will end</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(isEditMode ? `/proposals/${id}` : '/proposals')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalFormPage;
