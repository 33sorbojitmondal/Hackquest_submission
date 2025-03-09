import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const RewardDetails = ({ reward, onClose }) => {
  const { userData } = useUser();
  
  if (!reward) return null;
  
  const canRedeem = userData.points >= reward.pointsCost && reward.available;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="modal-dialog modal-dialog-centered"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{reward.title}</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="text-center mb-4">
            <img 
              src={reward.image} 
              alt={reward.title} 
              className="img-fluid rounded" 
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
          
          <div className="mb-4">
            <h6 className="fw-bold">Description</h6>
            <p>{reward.description}</p>
          </div>
          
          <div className="row mb-4">
            <div className="col-6">
              <h6 className="fw-bold">Category</h6>
              <p>{reward.category}</p>
            </div>
            <div className="col-6">
              <h6 className="fw-bold">Status</h6>
              <p>
                {reward.available ? (
                  <span className="badge bg-success">Available</span>
                ) : (
                  <span className="badge bg-danger">Out of Stock</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="alert alert-primary d-flex align-items-center" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            <div>
              This reward costs <strong>{reward.pointsCost} points</strong>. You currently have <strong>{userData.points} points</strong>.
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
          <button 
            type="button" 
            className="btn btn-primary"
            disabled={!canRedeem}
          >
            {canRedeem ? 'Redeem Reward' : 'Not Enough Points'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RewardDetails;