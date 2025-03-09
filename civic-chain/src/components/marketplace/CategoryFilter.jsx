import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-4">
      <h5 className="mb-3">Categories</h5>
      <div className="d-flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn ${selectedCategory === 'All' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onSelectCategory('All')}
        >
          All
        </motion.button>
        
        {categories.map(category => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;