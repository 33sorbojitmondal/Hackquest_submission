import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RewardCard from './RewardCard';
import RewardDetails from './RewardDetails';
import CategoryFilter from './CategoryFilter';
import { rewardsData } from '../../data/rewardsData.js';

const RewardsList = () => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  
  // Extract unique categories from rewards data
  const categories = [...new Set(rewardsData.map(reward => reward.category))];
  
  // Filter rewards based on selected category
  const filteredRewards = selectedCategory === 'All'
    ? rewardsData
    : rewardsData.filter(reward => reward.category === selectedCategory);
  
  const handleSelectReward = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />
      
      <div className="row">
        {filteredRewards.map(reward => (
          <div key={reward.id} className="col-md-6 col-lg-4 mb-4">
            <RewardCard reward={reward} onSelect={handleSelectReward} />
          </div>
        ))}
        
        {filteredRewards.length === 0 && (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No rewards found in this category.</p>
          </div>
        )}
      </div>
      
      {/* Modal for reward details */}
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
              <RewardDetails reward={selectedReward} onClose={handleCloseModal} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsList;