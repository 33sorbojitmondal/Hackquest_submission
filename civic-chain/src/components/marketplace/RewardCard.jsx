import { motion } from 'framer-motion';

const RewardCard = ({ reward, onSelect }) => {
  return (
    <motion.div 
      className="card h-100"
      whileHover={{ y: -5 }}
      onClick={() => onSelect(reward)}
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={reward.image} 
        className="card-img-top" 
        alt={reward.title} 
        style={{ height: '160px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{reward.title}</h5>
          <span className="badge bg-primary">{reward.pointsCost} pts</span>
        </div>
        <p className="card-text small text-muted">{reward.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="badge bg-secondary">{reward.category}</span>
          {reward.available ? (
            <span className="badge bg-success">Available</span>
          ) : (
            <span className="badge bg-danger">Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RewardCard;