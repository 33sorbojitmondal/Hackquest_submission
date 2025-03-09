import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const RecentActivities = () => {
  const { userData } = useUser();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      className="card h-100"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        <h5 className="card-title fw-bold mb-4">Recent Activities</h5>
        
        <div className="list-group list-group-flush">
          {userData.activities.map((activity) => (
            <motion.div 
              key={activity.id}
              className="list-group-item list-group-item-action border-0 px-0"
              whileHover={{ backgroundColor: 'rgba(13, 110, 253, 0.05)' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">{activity.activity}</p>
                  <small className="text-muted">{formatDate(activity.date)}</small>
                </div>
                <span className="badge bg-primary rounded-pill">+{activity.points}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {userData.activities.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No recent activities found.</p>
          </div>
        )}
        
        <div className="text-center mt-3">
          <button className="btn btn-outline-primary btn-sm">View All Activities</button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivities;